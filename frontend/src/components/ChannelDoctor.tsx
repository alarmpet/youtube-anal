import React, { useState } from 'react';
import { 
  Activity, FileSpreadsheet, ImageIcon, CheckCircle2, 
  AlertTriangle, ShieldAlert, ArrowRight, Sparkles, TrendingDown, Eye,
  Clock, Flame, Copy, Check, Zap, Play, MessageSquare
} from './Icons';
import type { ChannelDiagnosis } from '../types';

export const ChannelDoctor: React.FC = () => {
  const [csvFile, setCsvFile] = useState<File | null>(null);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [isDiagnosing, setIsDiagnosing] = useState(false);
  const [diagnosis, setDiagnosis] = useState<ChannelDiagnosis | null>(null);

  // 1:1 Hook Comparison Selector for '이왜찐' channel
  const [selectedMyVideoIndex, setSelectedMyVideoIndex] = useState<number>(0);
  const [copiedRewrite, setCopiedRewrite] = useState(false);

  const myVideos = [
    {
      title: "화성 기후 궤도선, 단위 하나 때문에 사라졌다",
      duration: "46초",
      views: "1,014회",
      likes: "5개 (0.49%)",
      bottleneck: "초반 5초 백과사전식 설명으로 스와이프 이탈률 48%",
      originalHook: "화성 기후 궤도선은 1999년 9월, 단위 하나가 어긋나 화성 도착 직후 신호가 끊긴 NASA 탐사선입니다...",
      rewrittenHook: "단 1초의 오타 때문에 NASA의 4,000억 원짜리 우주선이 공중분해 됐다는 사실, 알고 계셨나요? 상위 1% 과학자 수백 명이 왜 이걸 몰랐을까요?",
      prescription: "첫 1.5초 이내 '4,000억 증발' 금액 수치와 폭발 CG를 선제 노출하고, 27초 무한 루프 엔딩을 적용할 것."
    },
    {
      title: "고양이 역장 타마는 어떻게 문 닫을 뻔한 역을 살렸을까",
      duration: "48초",
      views: "988회",
      likes: "42개 (4.25% 🔥 최고 반응)",
      bottleneck: "반응률(4.25%)은 압도적이나 48초 길이로 인해 완독률(APV)이 72%에 정체됨",
      originalHook: "고양이 역장 타마는 파산 위기에 처한 시골 간이역을 구한 기적의 고양이 이야기입니다...",
      rewrittenHook: "빚더미에 앉아 폐쇄 직전이던 기차역에 '길고양이' 한 마리가 취임하자마자 벌어진 충격적인 일!",
      prescription: "스토리 길이를 30초로 압축하고 감동적인 BGM 템포를 1.2배속 올려 루프 완독률 110%를 달성할 것."
    },
    {
      title: "1904년 올림픽 마라톤 1등은 차를 타고 왔다",
      duration: "49초",
      views: "1,033회",
      likes: "10개 (0.96%)",
      bottleneck: "호기심을 유발하는 소재이나 텍스트 오버레이 대비가 약함",
      originalHook: "1904년 세인트루이스 올림픽 마라톤 경주에서 프레드 로츠 선수는 결승선을 1등으로 통과했습니다...",
      rewrittenHook: "올림픽 마라톤에서 금메달을 목에 걸었다가 10분 만에 영구 제명당한 선수의 기상천외한 변명!",
      prescription: "선수가 차에 타고 있는 실제 빈티지 흑백 사진을 1초에 풀스크린으로 띄우고 'BANNED' 도장 연출."
    },
    {
      title: "보이텍은 왜 군번 253번을 받았을까",
      duration: "69초",
      views: "1,104회",
      likes: "29개 (2.62%)",
      bottleneck: "69초는 쇼츠로서 지나치게 긺. 30초 지점 이탈률 급증",
      originalHook: "2차 세계대전 당시 폴란드 군대에는 정식 군번 253번을 받은 진짜 곰이 있었습니다...",
      rewrittenHook: "계급은 하사, 군번은 253번. 담배와 맥주를 마시며 포탄을 날랐던 실존 군인의 정체!",
      prescription: "1부/2부로 분할하거나 33초 이내로 군더더기를 전부 쳐내고 포탄 나르는 실제 사진 3장 집중 활용."
    }
  ];

  const currentVid = myVideos[selectedMyVideoIndex];

  const handleCopyRewrite = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedRewrite(true);
    setTimeout(() => setCopiedRewrite(false), 2000);
  };

  const handleSimulatedDiagnosis = () => {
    setIsDiagnosing(true);
    setTimeout(() => {
      setDiagnosis({
        retention_health_score: 68,
        critical_dropoffs: [
          {
            time_stamp: "00:00 - 00:03 (초반 3초 스와이프 구간)",
            drop_percentage: "42% 스와이프 이탈 (위험)",
            issue_type: "Hook Delay (서론 장황 및 질문 부재)",
            diagnosis: "백과사전식 서두('~은 1999년의 사건입니다')로 시작하여 첫 1.5초 이내 엄지손가락을 멈추지 못했습니다.",
            prescription: "인트로 100% 삭제, '금액/결과/충격적 숫자'를 첫 1초에 직접 박는 결과 우선형 후킹 적용"
          },
          {
            time_stamp: "00:20 - 00:35 (중반부 완독 정체)",
            drop_percentage: "28% 완독률 하락 (주의)",
            issue_type: "Duration Fatigue (쇼츠 길이 50초 초과 부담)",
            diagnosis: "신규 채널의 50초 쇼츠는 완독률(APV)이 70%대에 머물러 알고리즘 2차 추천 대상에서 제외됩니다.",
            prescription: "영상 길이를 25초~33초로 압축하고, 첫 문장과 끝 문장이 연결되는 '무한 루프 엔딩'으로 APV 120% 유도"
          },
          {
            time_stamp: "엔딩 5초 (인터랙션 부족)",
            drop_percentage: "좋아요율 0.4%~1.0% 부진",
            issue_type: "Comment / Like Trigger 부재",
            diagnosis: "시청 후 '좋아요'나 댓글을 달아야 할 감정적/토론적 트리거 질문이 엔딩에 없었습니다.",
            prescription: "'여러분이라면 어떻게 하셨을까요?'와 같은 시청자 논쟁형 질문 자막 추가"
          }
        ],
        ctr_vs_retention_quadrant: {
          status: "1,000 Views Algorithmic Sandbox (1차 테스트 정체)",
          benchmark_comparison: "100만 바이럴 쇼츠 대비 초반 1.5초 시청 유지율 18%p 열세, 완독률 25%p 부족",
          action_items: [
            "첫 1.5초에 '금액/수치/결과'를 옐로우 볼드로 박아 스와이프를 75% 이상 방어할 것",
            "영상 길이를 48~69초에서 27~33초로 압축하여 루프 재생 유도",
            "스튜디오의 경쟁작 분석 탭에서 추출한 100만 떡상작의 3초 후킹 템플릿을 그대로 복제 적용할 것"
          ]
        }
      });
      setIsDiagnosing(false);
    }, 1000);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-slate-900 border border-slate-800 p-5 rounded-2xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shadow-xl">
        <div>
          <div className="flex items-center space-x-2">
            <span className="px-2.5 py-0.5 rounded-full bg-red-500/20 text-red-400 border border-red-500/30 text-xs font-semibold">
              채널 닥터 (Channel Doctor)
            </span>
            <h2 className="text-lg font-bold text-white">
              내 채널 '이왜찐' 1,000회 박스권 탈출 클리닉
            </h2>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            현재 업로드된 쇼츠 8편의 알고리즘 정체 원인을 진단하고, 100만 바이럴 후킹으로 1:1 리라이팅 처방합니다.
          </p>
        </div>

        <button
          onClick={handleSimulatedDiagnosis}
          disabled={isDiagnosing}
          className="flex items-center space-x-2 px-5 py-2.5 bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-500 hover:to-rose-500 disabled:opacity-50 text-white font-semibold rounded-xl text-xs sm:text-sm shadow-lg shadow-red-600/20 transition-all cursor-pointer whitespace-nowrap"
        >
          <Sparkles className="w-4 h-4" />
          <span>{isDiagnosing ? "알고리즘 정밀 진단 중..." : "전체 채널 알고리즘 진단"}</span>
        </button>
      </div>

      {/* NEW KILLER FEATURE: 1:1 Hook Rewriting Arena for My Videos */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-slate-800">
          <div className="flex items-center space-x-2">
            <Zap className="w-5 h-5 text-amber-400 fill-current" />
            <h3 className="text-sm font-bold text-white uppercase tracking-wider">
              내 영상 vs 100만 떡상 공식: 1:1 후킹 리라이팅 처방전
            </h3>
          </div>
          <span className="text-xs text-slate-400">
            진단할 내 쇼츠 영상을 선택하세요:
          </span>
        </div>

        {/* Video Selector Tabs */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
          {myVideos.map((v, idx) => (
            <button
              key={idx}
              onClick={() => setSelectedMyVideoIndex(idx)}
              className={`p-2.5 rounded-xl text-left border text-xs transition-all ${
                selectedMyVideoIndex === idx
                  ? 'bg-red-600/20 border-red-500 text-white shadow-lg'
                  : 'bg-slate-950 border-slate-800 text-slate-400 hover:border-slate-700'
              }`}
            >
              <span className="block font-bold truncate text-[11px] mb-1">
                #{idx + 1} {v.title.slice(0, 18)}...
              </span>
              <div className="flex items-center justify-between text-[10px] text-slate-500">
                <span>{v.duration}</span>
                <span className="text-amber-400 font-semibold">{v.views}</span>
              </div>
            </button>
          ))}
        </div>

        {/* 1:1 Comparison Card */}
        <div className="bg-slate-950 rounded-2xl p-5 border border-slate-800 space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-slate-900 text-xs">
            <div>
              <span className="text-slate-500 text-[11px] block">진단 대상 영상:</span>
              <strong className="text-white text-sm">{currentVid.title}</strong>
            </div>
            <div className="flex items-center space-x-3 text-[11px]">
              <span className="text-slate-400">길이: <strong className="text-white">{currentVid.duration}</strong></span>
              <span className="text-slate-400">조회수: <strong className="text-amber-400">{currentVid.views}</strong></span>
              <span className="text-slate-400">좋아요: <strong className="text-emerald-400">{currentVid.likes}</strong></span>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
            {/* Left: Original Hook (Weakness) */}
            <div className="bg-slate-900 p-4 rounded-xl border border-red-500/30 space-y-2">
              <div className="flex items-center justify-between">
                <span className="font-bold text-red-400 flex items-center text-xs">
                  <AlertTriangle className="w-3.5 h-3.5 mr-1" />
                  기존 대본 (1,000회 정체 원인)
                </span>
                <span className="text-[10px] text-red-400/80 bg-red-500/10 px-2 py-0.5 rounded">
                  {currentVid.bottleneck}
                </span>
              </div>
              <p className="text-slate-300 leading-relaxed italic bg-slate-950 p-3 rounded-lg border border-slate-800/80">
                "{currentVid.originalHook}"
              </p>
            </div>

            {/* Right: AI Rewritten Viral Hook (Solution) */}
            <div className="bg-gradient-to-b from-emerald-950/40 to-slate-900 p-4 rounded-xl border border-emerald-500/50 space-y-2 shadow-lg">
              <div className="flex items-center justify-between">
                <span className="font-bold text-emerald-400 flex items-center text-xs">
                  <Sparkles className="w-3.5 h-3.5 mr-1" />
                  100만 바이럴 리라이팅 후킹 (Swiped-away 80% 방어)
                </span>
                <button
                  onClick={() => handleCopyRewrite(currentVid.rewrittenHook)}
                  className="flex items-center space-x-1 px-2.5 py-1 rounded bg-emerald-600 hover:bg-emerald-500 text-white text-[11px] font-semibold transition-colors"
                >
                  {copiedRewrite ? <Check className="w-3 h-3 text-white" /> : <Copy className="w-3 h-3 text-white" />}
                  <span>{copiedRewrite ? "복사됨" : "후킹 복사"}</span>
                </button>
              </div>
              <p className="text-slate-100 leading-relaxed font-bold bg-slate-950 p-3 rounded-lg border border-emerald-500/30 text-sm">
                "{currentVid.rewrittenHook}"
              </p>
              <div className="text-[11px] text-emerald-300/90 pt-1 flex items-start space-x-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 flex-shrink-0 mt-0.5" />
                <span><strong>핵심 처방:</strong> {currentVid.prescription}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Diagnosis Results */}
      {diagnosis && (
        <div className="space-y-6 animate-fadeIn">
          {/* Top Score Banner */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex items-center space-x-4">
              <div className="relative w-20 h-20 rounded-2xl bg-slate-950 border border-slate-800 flex items-center justify-center flex-shrink-0">
                <span className="text-2xl font-black text-amber-400">{diagnosis.retention_health_score}</span>
                <span className="text-[10px] text-slate-500 absolute bottom-2">/ 100</span>
              </div>
              <div>
                <div className="flex items-center space-x-2">
                  <span className="text-xs font-bold px-2 py-0.5 rounded bg-amber-500/20 text-amber-300 border border-amber-500/30">
                    주의 요망
                  </span>
                  <h3 className="text-base font-bold text-white">
                    {diagnosis.ctr_vs_retention_quadrant.status}
                  </h3>
                </div>
                <p className="text-xs text-slate-400 mt-1">
                  {diagnosis.ctr_vs_retention_quadrant.benchmark_comparison}
                </p>
              </div>
            </div>

            <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 text-xs max-w-md w-full">
              <span className="font-bold text-slate-300 block mb-1">핵심 개선 목표:</span>
              <ul className="text-slate-400 space-y-1 list-disc pl-4 text-[11px]">
                {diagnosis.ctr_vs_retention_quadrant.action_items.map((it, idx) => (
                  <li key={idx}>{it}</li>
                ))}
              </ul>
            </div>
          </div>

          {/* Critical Dropoffs List */}
          <div className="space-y-4">
            <div className="flex items-center space-x-2 text-sm font-bold text-white">
              <TrendingDown className="w-4 h-4 text-red-500" />
              <span>유지율 급락 구간 심층 해부 &amp; 긴급 처방전</span>
            </div>

            <div className="grid grid-cols-1 gap-4">
              {diagnosis.critical_dropoffs.map((item, idx) => (
                <div
                  key={idx}
                  className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-lg space-y-3"
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-2 border-b border-slate-800">
                    <div className="flex items-center space-x-2">
                      <span className="px-2 py-0.5 rounded bg-red-600/20 text-red-400 font-mono text-xs font-bold border border-red-500/30">
                        {item.time_stamp}
                      </span>
                      <span className="text-xs font-bold text-white">
                        {item.issue_type}
                      </span>
                    </div>
                    <span className="text-xs font-bold text-amber-400">
                      {item.drop_percentage}
                    </span>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                    {/* Diagnosis */}
                    <div className="bg-slate-950 p-3.5 rounded-xl border border-slate-800/80 space-y-1">
                      <span className="font-bold text-slate-400 flex items-center text-red-400">
                        <ShieldAlert className="w-3.5 h-3.5 mr-1" />
                        원인 진단 (Diagnosis)
                      </span>
                      <p className="text-slate-300 leading-relaxed">
                        {item.diagnosis}
                      </p>
                    </div>

                    {/* Prescription */}
                    <div className="bg-slate-950 p-3.5 rounded-xl border border-slate-800/80 space-y-1">
                      <span className="font-bold text-slate-400 flex items-center text-emerald-400">
                        <CheckCircle2 className="w-3.5 h-3.5 mr-1" />
                        솔루션 처방전 (Prescription)
                      </span>
                      <p className="text-slate-200 leading-relaxed font-medium">
                        {item.prescription}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* 2026 YouTube Algorithm Physics & Survival Mechanics */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-slate-800">
          <div className="flex items-center space-x-2">
            <Sparkles className="w-5 h-5 text-amber-400" />
            <h3 className="text-sm font-bold text-white uppercase tracking-wider">
              2026 유튜브 알고리즘 물리학 &amp; 4대 생존 법칙 (Algorithm Physics)
            </h3>
          </div>
          <span className="text-xs text-slate-400 font-mono">Shorts &amp; Long-form Recommendation Rules</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 text-xs">
          {/* Rule 1: VVSA */}
          <div className="bg-slate-950 p-4 rounded-xl border border-red-500/30 space-y-2">
            <div className="flex items-center justify-between">
              <span className="font-bold text-red-400 flex items-center">
                <Flame className="w-4 h-4 mr-1 fill-current" />
                1. VVSA 75%의 벽
              </span>
              <span className="text-[10px] text-red-400 font-mono font-bold">1차 관문</span>
            </div>
            <p className="text-slate-300 leading-relaxed">
              시청자 100명 중 <strong>75명 이상이 스와이프를 넘기지 않아야</strong> 알고리즘이 10만 회 2차 풀로 추천을 확장합니다.
            </p>
            <div className="bg-slate-900 p-2.5 rounded-lg text-[11px] text-slate-400 border border-slate-800">
              ⚡ <strong>해법:</strong> 로고/채널명 인트로 100% 삭제, 1초 이내 충격 숫자 앵커링 노출.
            </div>
          </div>

          {/* Rule 2: APV */}
          <div className="bg-slate-950 p-4 rounded-xl border border-amber-500/30 space-y-2">
            <div className="flex items-center justify-between">
              <span className="font-bold text-amber-400 flex items-center">
                <Zap className="w-4 h-4 mr-1 fill-current" />
                2. APV 115% 루프 법칙
              </span>
              <span className="text-[10px] text-amber-400 font-mono font-bold">폭발 조건</span>
            </div>
            <p className="text-slate-300 leading-relaxed">
              30초 이하 쇼츠는 <strong>완독률이 100%를 초과하여 2회 반복 재생</strong>되어야 알고리즘 메가 바이럴 트리거가 발동합니다.
            </p>
            <div className="bg-slate-900 p-2.5 rounded-lg text-[11px] text-slate-400 border border-slate-800">
              ⚡ <strong>해법:</strong> 끝 문장이 첫 문장으로 물 흐르듯 연결되는 무한 루프 브릿지 장착.
            </div>
          </div>

          {/* Rule 3: Comments Weight */}
          <div className="bg-slate-950 p-4 rounded-xl border border-emerald-500/30 space-y-2">
            <div className="flex items-center justify-between">
              <span className="font-bold text-emerald-400 flex items-center">
                <MessageSquare className="w-4 h-4 mr-1" />
                3. 댓글 3.5배 가중치
              </span>
              <span className="text-[10px] text-emerald-400 font-mono font-bold">상호작용</span>
            </div>
            <p className="text-slate-300 leading-relaxed">
              알고리즘 점수에서 <strong>댓글 1개는 좋아요 3.5배, 공유 1회는 좋아요 5배</strong>의 체류 가중치를 갖습니다.
            </p>
            <div className="bg-slate-900 p-2.5 rounded-lg text-[11px] text-slate-400 border border-slate-800">
              ⚡ <strong>해법:</strong> 찬반이 극명하게 갈리는 딜레마형 토론 질문을 첫 댓글에 상단 고정.
            </div>
          </div>

          {/* Rule 4: SEO & Evergreen Indexing */}
          <div className="bg-slate-950 p-4 rounded-xl border border-blue-500/30 space-y-2">
            <div className="flex items-center justify-between">
              <span className="font-bold text-blue-400 flex items-center">
                <Eye className="w-4 h-4 mr-1" />
                4. SEO 영구 색인
              </span>
              <span className="text-[10px] text-blue-400 font-mono font-bold">에버그린</span>
            </div>
            <p className="text-slate-300 leading-relaxed">
              설명란 상단 2줄과 타임라인 챕터는 <strong>구글 비디오 캐러셀 검색</strong>에 직접 색인되어 지속 유입을 생성합니다.
            </p>
            <div className="bg-slate-900 p-2.5 rounded-lg text-[11px] text-slate-400 border border-slate-800">
              ⚡ <strong>해법:</strong> 500자 태그 상자 복사 + 검색 의도 키워드 챕터 배치.
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
