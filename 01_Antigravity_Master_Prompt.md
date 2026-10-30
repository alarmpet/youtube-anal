# Project: Ego-Browser 기반 유튜브 경쟁작 해부 & 기획 스튜디오

## 1. 앱 개요
사용자가 특정 주제(키워드)를 입력하면 `ego-browser`가 사람처럼 유튜브를 돌아다니며 떡상한 경쟁 영상들의 썸네일, 제목, 타임스탬프 대본, 고정/인기 댓글을 싹 긁어오고, 이를 분석해 필승 기획안(새 제목, 썸네일 프롬프트, 벤치마킹 대본)을 자동 생성하는 앱.

## 2. 기술 스택
- Frontend: React (TypeScript), Tailwind CSS, Lucide Icons
- Backend: Python FastAPI + WebSocket (브라우저 실시간 관제 및 상태 스트리밍)
- Browser Agent: `ego-browser` (CDP 포트 9222 연결, 인간형 랜덤 딜레이 및 스크롤/캡처)
- Storage: `./workspace/references/{keyword}/` 하위 폴더에 캡처 이미지 및 대본 자동 저장
- AI Engine: Multimodal LLM (비전 썸네일 분석 + 대본 구조 해부, JSON 출력)

## 3. 핵심 화면 구성
1) **키워드 스카우터 & 라이브 에이전트 뷰 (Scout & Live View)**
   - 주제 키워드 입력창 및 필터 옵션 (최근 1개월, 조회수/구독자 비율 높은 아웃라이어 우선).
   - 좌측에 `ego-browser` 실시간 화면 및 작업 로그 표시.
2) **경쟁작 썸네일 & 후킹 비교 보드 (Reference Board)**
   - 수집된 상위 5개 경쟁 영상의 썸네일 고화질 캡처, 제목, 조회수, 초반 30초 대본(Hook)을 그리드로 한눈에 비교.
3) **대본 구조 해부 & 리믹스 생성기 (Script Deconstructor)**
   - 경쟁작들의 대본 타임라인(도입-전개-절정-결말) 공통 패턴 추출.
   - 댓글창에서 시청자들이 가장 열광한 포인트와 궁금해하는 미해결 질문을 반영해 새로운 대본과 화면 연출 프롬프트 자동 생성.
4) **내 채널 진단 탭 (Channel Doctor - 서브 모드)**
   - 내 스튜디오 CSV 및 유지율 급락 구간 캡처 기반 문제점 진단.