# Ego-Browser 기반 유튜브 경쟁작 해부 & 기획 스튜디오

사용자가 특정 주제(키워드)를 입력하면 `ego-browser`가 사람처럼 유튜브를 돌아다니며 떡상한 경쟁 영상들의 썸네일, 제목, 타임스탬프 대본, 고정/인기 댓글을 싹 긁어오고, 이를 분석해 필승 기획안(새 제목, 썸네일 프롬프트, 벤치마킹 대본)을 자동 생성하는 올인원 스튜디오 앱입니다.

---

## 🛠️ 기술 스택 및 아키텍처

- **Frontend:** React (TypeScript), Tailwind CSS, Vite (통합 단일 포트 서빙 및 독립 Dev 모드 지원)
- **Backend:** Python FastAPI + WebSocket (브라우저 실시간 관제 및 상태/화면 스트리밍)
- **Browser Agent:** `ego-browser` (인간형 랜덤 딜레이 0.8~2.0초, 자동완성/SERP/대본/댓글 수집)
- **AI Engine:** Multimodal LLM (Google Gemini API / OpenAI GPT-4o / 내장 지능형 분석 엔진)
- **Storage:** `./workspace/references/{keyword}/` 로컬 자동 저장소

```text
d:\youtube-anal\
├── backend/
│   ├── main.py                # FastAPI 서버 및 WebSocket 엔드포인트
│   ├── ego_runner.py          # ego-browser 제어 및 시나리오 실행기
│   ├── llm_analyzer.py        # 멀티모달 LLM 프롬프트 호출기
│   └── requirements.txt       # 백엔드 의존성
├── frontend/                  # React + Tailwind SPA 대시보드
│   ├── src/
│   │   ├── components/        # 4대 핵심 화면 컴포넌트
│   │   └── types.ts           # 타입 선언
│   └── dist/                  # 프로덕션 빌드 완료본
├── workspace/
│   └── references/            # 키워드별 수집 데이터 자동 저장소
│       └── {keyword}/
│           ├── autocomplete.txt       # 자동완성 추천 검색어 10선
│           ├── serp_thumbnails.png    # 검색 결과 썸네일 캡처
│           ├── videos_summary.json    # 상위 영상 메타데이터
│           ├── video_1_script.txt     # 타임스탬프 대본 전문
│           ├── video_1_comments.txt   # 베스트 댓글 15선
│           ├── video_1_hook_frames.png# 초반 15초(0s, 5s, 15s) 키프레임
│           └── result_plan.json       # AI 기획안 JSON
├── run.py                     # 원클릭 서버 실행기 (웹 브라우저 자동 오픈)
└── start.bat                  # 윈도우 원클릭 배치 파일
```

---

## 🚀 빠른 시작 (Quick Start)

### 1. 단일 명령어로 즉시 실행
```powershell
python run.py
```
또는 `start.bat`을 더블 클릭합니다.
실행 후 기본 브라우저에서 `http://localhost:8000`이 자동으로 열립니다.

### 2. 프론트엔드 개발 모드 (선택 사항)
```powershell
cd frontend
npm run dev
```
`http://localhost:5173`으로 접속 시 프록시를 통해 백엔드(8000)와 실시간 연동됩니다.

---

## 🖥️ 4대 핵심 화면 구성

1. **키워드 스카우터 & 라이브 에이전트 뷰 (Scout & Live View)**
   - 주제 키워드 입력 및 필터 옵션 (최근 1개월, 조회수 아웃라이어 우선, 3~5개 선별).
   - 좌측에 `ego-browser` 실시간 뷰포트 화면 및 작업 상태 스트리밍.
   - 우측에 0.8~2.0초 인간형 딜레이 타이핑, 스크롤, 대본 추출 과정이 기록되는 실시간 터미널 로그.

2. **경쟁작 썸네일 & 후킹 비교 보드 (Reference Board)**
   - 상위 5개 경쟁 영상의 썸네일, 제목, 조회수, 발행일, 초반 30초 대본(Hook)을 그리드로 한눈에 비교.
   - 초반 15초(0s, 5s, 15s) 키프레임 3분할 뷰 제공.
   - 클릭 한 번으로 타임스탬프 대본 전문(`video_{n}_script.txt`) 및 베스트 댓글 15선(`video_{n}_comments.txt`) 열람.

3. **대본 구조 해부 & 리믹스 생성기 (Script Deconstructor & Studio)**
   - **경쟁작 공식 해부:** 공통 썸네일 패턴, 15초 후킹 승리 공식, 시청자 반응 및 미해결 빈틈 도출.
   - **신규 영상 필승 기획안:**
     - 자동완성 키워드 결합형, 호기심 극대화형, 반전 후킹형 3대 바이럴 제목.
     - 카운터 썸네일 문구(4단어 이내), 비주얼 구도/색감 지시, AI 영문 이미지 프롬프트(Midjourney/Flux/DALL-E).
     - Hook -> Problem -> Solution -> Climax -> CTA 대본 및 화면 연출 타임라인.
   - 원클릭 마크다운 복사 및 `result_plan.json` 다운로드 지원.

4. **내 채널 진단 탭 (Channel Doctor - 서브 모드)**
   - YouTube Studio 시청 지속 시간 CSV 또는 그래프 스크린샷 기반 진단.
   - 0~30초 Hook 급락 구간, 중반부 시각적 피로 구간, 엔딩 작별 신호 이탈을 감지하고 알고리즘 처방전 제시.

---

## ⚙️ 설정 (Settings)

우측 상단 톱니바퀴 아이콘을 클릭하여:
- **Google Gemini API Key** 또는 **OpenAI API Key**를 등록할 수 있습니다. (미입력 시에도 수집된 실제 대본/댓글을 기반으로 정밀한 내장 AI 합성 엔진이 작동합니다.)
- **Chrome CDP Port 9222:** 크롬을 `--remote-debugging-port=9222` 옵션으로 실행 시 기존 로그인 세션을 유지한 채 Ego-Browser와 연동 가능합니다.
