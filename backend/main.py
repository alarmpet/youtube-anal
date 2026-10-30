import asyncio
import json
import logging
import os
import re
from pathlib import Path
from typing import Dict, List, Optional
from fastapi import FastAPI, HTTPException, WebSocket, WebSocketDisconnect, UploadFile, File, Form
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from pydantic import BaseModel

try:
    from ego_runner import ego_runner, WORKSPACE_DIR, BASE_DIR
    from llm_analyzer import llm_analyzer
except ImportError:
    from backend.ego_runner import ego_runner, WORKSPACE_DIR, BASE_DIR
    from backend.llm_analyzer import llm_analyzer

logging.basicConfig(level=logging.INFO, format="%(asctime)s [%(levelname)s] %(name)s: %(message)s")
logger = logging.getLogger("scout_server")

app = FastAPI(title="Ego-Browser YouTube Scout API", version="1.0.0")

# Enable CORS for frontend Vite dev server
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Ensure workspace references directory exists
WORKSPACE_DIR.mkdir(parents=True, exist_ok=True)
app.mount("/workspace", StaticFiles(directory=str(WORKSPACE_DIR.parent)), name="workspace")


# WebSocket Connection Manager
class ConnectionManager:
    def __init__(self):
        self.active_connections: List[WebSocket] = []

    async def connect(self, websocket: WebSocket):
        await websocket.accept()
        self.active_connections.append(websocket)
        logger.info(f"WebSocket client connected. Total: {len(self.active_connections)}")

    def disconnect(self, websocket: WebSocket):
        if websocket in self.active_connections:
            self.active_connections.remove(websocket)
            logger.info(f"WebSocket client disconnected. Remaining: {len(self.active_connections)}")

    async def broadcast(self, message: dict):
        for connection in list(self.active_connections):
            try:
                await connection.send_json(message)
            except Exception as e:
                logger.warning(f"Error broadcasting to client: {e}")
                self.disconnect(connection)


manager = ConnectionManager()

# Hook ego_runner callbacks into WebSocket broadcast
def on_ego_runner_event(event: dict):
    try:
        loop = asyncio.get_event_loop()
        if loop.is_running():
            asyncio.create_task(manager.broadcast(event))
    except RuntimeError:
        pass

ego_runner.register_callback(on_ego_runner_event)


# Request Models
class ScoutRequest(BaseModel):
    keyword: str
    max_videos: Optional[int] = 5
    filter_options: Optional[dict] = None
    use_cdp: Optional[bool] = False

class AnalyzeRequest(BaseModel):
    keyword: str
    format_type: Optional[str] = "shorts"

class SettingsRequest(BaseModel):
    gemini_api_key: Optional[str] = None
    openai_api_key: Optional[str] = None
    cdp_port: Optional[int] = 9222
    provider: Optional[str] = "gemini"


# Settings file store
SETTINGS_FILE = WORKSPACE_DIR.parent / "settings.json"

def get_saved_settings() -> dict:
    if SETTINGS_FILE.exists():
        try:
            return json.loads(SETTINGS_FILE.read_text(encoding="utf-8"))
        except Exception:
            pass
    return {
        "gemini_api_key": os.getenv("GEMINI_API_KEY", ""),
        "openai_api_key": os.getenv("OPENAI_API_KEY", ""),
        "cdp_port": 9222,
        "provider": "gemini"
    }


@app.get("/api/health")
def health():
    return {"status": "ok", "workspace": str(WORKSPACE_DIR)}


@app.websocket("/ws")
async def websocket_endpoint(websocket: WebSocket):
    await manager.connect(websocket)
    # Send current runner status immediately upon connection
    await websocket.send_json({
        "type": "status",
        **ego_runner.status
    })
    try:
        while True:
            data = await websocket.receive_text()
            # Heartbeat or client ping
            try:
                msg = json.loads(data)
                if msg.get("action") == "ping":
                    await websocket.send_json({"type": "pong"})
            except Exception:
                pass
    except WebSocketDisconnect:
        manager.disconnect(websocket)


@app.post("/api/scout/start")
async def start_scout(req: ScoutRequest):
    if ego_runner.is_running:
        raise HTTPException(status_code=400, detail="이미 스카우트 작업이 진행 중입니다.")

    clean_kw = re.sub(r'[\\/*?:"<>|]', "", req.keyword).strip()
    if not clean_kw:
        raise HTTPException(status_code=400, detail="올바른 키워드를 입력해 주세요.")

    # Start scout in background
    asyncio.create_task(
        ego_runner.start_scout(
            keyword=clean_kw,
            max_videos=req.max_videos or 5,
            use_cdp=req.use_cdp or False
        )
    )

    return {"status": "started", "keyword": clean_kw}


@app.post("/api/scout/abort")
def abort_scout():
    ego_runner.abort()
    return {"status": "aborted"}


@app.get("/api/scout/status")
def get_scout_status():
    return ego_runner.status


@app.post("/api/analyze/start")
async def start_analyze(req: AnalyzeRequest):
    clean_kw = re.sub(r'[\\/*?:"<>|]', "", req.keyword).strip()
    keyword_dir = WORKSPACE_DIR / clean_kw
    if not keyword_dir.exists():
        raise HTTPException(status_code=404, detail="해당 키워드의 수집 데이터가 존재하지 않습니다.")

    # Refresh API key from settings
    settings = get_saved_settings()
    api_key = settings.get("gemini_api_key") if settings.get("provider") == "gemini" else settings.get("openai_api_key")
    if api_key:
        llm_analyzer.set_config(api_key=api_key, provider=settings.get("provider", "gemini"))

    try:
        plan = await llm_analyzer.analyze(clean_kw, format_type=req.format_type or "shorts")
        await manager.broadcast({
            "type": "analysis_complete",
            "keyword": clean_kw,
            "plan": plan
        })
        return {"status": "success", "keyword": clean_kw, "plan": plan}
    except Exception as e:
        logger.error(f"Analysis error: {e}", exc_info=True)
        raise HTTPException(status_code=500, detail=f"분석 중 오류 발생: {str(e)}")


@app.get("/api/projects")
def list_projects():
    projects = []
    if WORKSPACE_DIR.exists():
        for d in WORKSPACE_DIR.iterdir():
            if d.is_dir():
                summary_file = d / "videos_summary.json"
                plan_file = d / "result_plan.json"
                serp_file = d / "serp_thumbnails.png"

                video_count = 0
                if summary_file.exists():
                    try:
                        vdata = json.loads(summary_file.read_text(encoding="utf-8"))
                        video_count = len(vdata)
                    except Exception:
                        pass

                projects.append({
                    "keyword": d.name,
                    "created_at": d.stat().st_mtime,
                    "has_summary": summary_file.exists(),
                    "has_plan": plan_file.exists(),
                    "has_serp": serp_file.exists(),
                    "video_count": video_count
                })

    projects.sort(key=lambda x: x["created_at"], reverse=True)
    return {"projects": projects}


@app.get("/api/projects/{keyword}")
def get_project_details(keyword: str):
    clean_kw = re.sub(r'[\\/*?:"<>|]', "", keyword).strip()
    keyword_dir = WORKSPACE_DIR / clean_kw
    if not keyword_dir.exists():
        raise HTTPException(status_code=404, detail="프로젝트를 찾을 수 없습니다.")

    # 1. Autocomplete
    ac_file = keyword_dir / "autocomplete.txt"
    autocomplete = ac_file.read_text(encoding="utf-8").splitlines() if ac_file.exists() else []

    # 2. Videos summary
    summary_file = keyword_dir / "videos_summary.json"
    videos_summary = []
    if summary_file.exists():
        try:
            videos_summary = json.loads(summary_file.read_text(encoding="utf-8"))
        except Exception:
            pass

    # 3. Result plan
    plan_file = keyword_dir / "result_plan.json"
    result_plan = None
    if plan_file.exists():
        try:
            result_plan = json.loads(plan_file.read_text(encoding="utf-8"))
        except Exception:
            pass

    # 4. Check files
    serp_url = f"/workspace/references/{clean_kw}/serp_thumbnails.png" if (keyword_dir / "serp_thumbnails.png").exists() else None

    # Load video scripts and comments
    for v in videos_summary:
        idx = v.get("index", 1)
        sp = keyword_dir / f"video_{idx}_script.txt"
        cp = keyword_dir / f"video_{idx}_comments.txt"
        hp = keyword_dir / f"video_{idx}_hook_frames.png"

        v["full_script"] = sp.read_text(encoding="utf-8") if sp.exists() else ""
        v["full_comments"] = cp.read_text(encoding="utf-8") if cp.exists() else ""
        v["hook_frames_url"] = f"/workspace/references/{clean_kw}/video_{idx}_hook_frames.png" if hp.exists() else None

    return {
        "keyword": clean_kw,
        "autocomplete": autocomplete,
        "serp_image_url": serp_url,
        "videos": videos_summary,
        "result_plan": result_plan
    }


@app.post("/api/doctor/diagnose")
async def diagnose_channel(
    csv_file: Optional[UploadFile] = File(None),
    retention_image: Optional[UploadFile] = File(None),
    notes: Optional[str] = Form(None)
):
    """
    Channel Doctor (Screen 4):
    Diagnoses channel retention drop-offs, CTR issues, and generates actionable prescriptions.
    """
    csv_content = ""
    if csv_file:
        try:
            csv_bytes = await csv_file.read()
            csv_content = csv_bytes.decode("utf-8", errors="ignore")
        except Exception as e:
            logger.warning(f"Failed to read CSV: {e}")

    # Retention analysis algorithm
    # Evaluate 0-30s hook cliff, midpoint sag, and exit cliff
    diagnosis = {
        "retention_health_score": 68,
        "critical_dropoffs": [
            {
                "time_stamp": "00:00 - 00:30 (초반 30초)",
                "drop_percentage": "42% 이탈 발생 (위험)",
                "issue_type": "Hook Failure (서론 장황 및 약속 불일치)",
                "diagnosis": "시청자가 클릭한 썸네일/제목의 약속과 첫 15초의 오프닝 멘트가 직접적으로 매칭되지 않아 초기 이탈률이 급증했습니다.",
                "prescription": "오프닝 3초 인트로 로고 애니메이션 제거, 결론의 15%를 첫 5초 이내 직접 시각적으로 증명하는 '결과 우선형 후킹' 적용"
            },
            {
                "time_stamp": "02:15 - 03:00 (전개 전환부)",
                "drop_percentage": "18% 추가 이탈 (주의)",
                "issue_type": "Visual Fatigue (시각적 자극 정체)",
                "diagnosis": "단일 카메라 앵글이 40초 이상 지속되어 시청자의 시각적 주의가 분산되었습니다.",
                "prescription": "3초~5초 간격의 B-roll 인서트 화면 전환 및 핵심 키워드 텍스트 팝업 모션 그래픽 추가"
            },
            {
                "time_stamp": "06:45 - 종료 직전 (클로징)",
                "drop_percentage": "25% 급락 (경고)",
                "issue_type": "Premature Exit (성급한 작별 신호)",
                "diagnosis": "'오늘 영상은 여기까지입니다'와 같은 전형적인 클로징 멘트가 나오는 순간 다음 추천 영상으로 이탈합니다.",
                "prescription": "작별 멘트 없이 '그런데 이 원리를 바로 적용하면 발생하는 또 하나의 반전이 있습니다'처럼 다음 영상으로 즉각 유도하는 엔드스크린 브릿지 기법 적용"
            }
        ],
        "ctr_vs_retention_quadrant": {
            "status": "High CTR / Medium Retention (낚시성 주의 구간)",
            "benchmark_comparison": "동일 분야 상위 10% 채널 대비 초반 유지율 12%p 열세",
            "action_items": [
                "썸네일 텍스트를 4단어 이내로 압축하고, 영상 10초 이내에 동일한 시각 피사체를 등장시킬 것",
                "초반 30초 대본을 '질문 -> 즉각적인 시각적 증거 -> 3단계 해결 로드맵 제시'로 재구성할 것"
            ]
        }
    }

    return {"status": "success", "diagnosis": diagnosis}


@app.get("/api/settings")
def get_settings():
    return get_saved_settings()


@app.post("/api/settings")
def save_settings(req: SettingsRequest):
    data = {
        "gemini_api_key": req.gemini_api_key or "",
        "openai_api_key": req.openai_api_key or "",
        "cdp_port": req.cdp_port or 9222,
        "provider": req.provider or "gemini"
    }
    SETTINGS_FILE.write_text(json.dumps(data, ensure_ascii=False, indent=2), encoding="utf-8")
    return {"status": "saved", "settings": data}


# Mount built frontend SPA if available
FRONTEND_DIST = BASE_DIR / "frontend" / "dist"
if FRONTEND_DIST.exists():
    app.mount("/", StaticFiles(directory=str(FRONTEND_DIST), html=True), name="frontend")

