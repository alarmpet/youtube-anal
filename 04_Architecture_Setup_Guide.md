# Ego-Browser 연동 및 폴더 구조 가이드

## 1. 로컬 폴더 구조
```text
youtube-scout-app/
├── backend/
│   ├── main.py                # FastAPI 서버 및 WebSocket 엔드포인트
│   ├── ego_Runner.py          # ego-browser 제어 및 시나리오 실행기
│   └── llm_analyzer.py        # 멀티모달 LLM 프롬프트 호출기
├── frontend/                  # React + Tailwind 대시보드
└── workspace/
    └── references/            # 키워드별 수집 데이터 자동 저장소
        └── {keyword}/
            ├── serp_thumbnails.png
            ├── autocomplete.txt
            ├── video_1_script.txt
            └── result_plan.json
```

## 2. 핵심 구현 팁
- **CDP 세션 연결:** 크롬 실행 시 `--remote-debugging-port=9222` 옵션을 주어 기존 로그인 세션과 쿠키를 그대로 유지한 채 `ego-browser`를 연결합니다.
- **Vision + Text 하이브리드 클릭:** 유튜브 UI 변경에 깨지지 않도록 CSS Selector 대신 화면 내 `"더보기"`, `"스크립트 표시"` 텍스트나 아이콘 좌표를 기반으로 클릭하도록 구현합니다.