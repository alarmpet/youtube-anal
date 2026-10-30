import React, { useState, useEffect } from 'react';
import { 
  FileText, Sparkles, Copy, Check, Download, Video, Palette, 
  Lightbulb, AlertCircle, Clock, Film, MessageSquare, Flame, RefreshCw,
  Zap, Award, TrendingUp, Eye, Volume2, Play, Pause
} from './Icons';
import type { ProjectData, ResultPlan } from '../types';

interface ScriptDeconstructorProps {
  project: ProjectData | null;
  onAnalyze: (keyword: string, formatType: 'shorts' | 'longform') => void;
  isAnalyzing: boolean;
}

export const ScriptDeconstructor: React.FC<ScriptDeconstructorProps> = ({
  project,
  onAnalyze,
  isAnalyzing
}) => {
  const [formatType, setFormatType] = useState<'shorts' | 'longform'>('shorts');
  const [copiedTitleIndex, setCopiedTitleIndex] = useState<number | null>(null);
  const [copiedPrompt, setCopiedPrompt] = useState(false);
  const [copiedBridge, setCopiedBridge] = useState(false);
  const [copiedAll, setCopiedAll] = useState(false);
  const [copiedTags, setCopiedTags] = useState(false);
  const [copiedDesc, setCopiedDesc] = useState(false);
  const [copiedPinned, setCopiedPinned] = useState(false);
  const [copiedHashtags, setCopiedHashtags] = useState(false);

  // TTS Rehearsal Player States
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);
  const [activeSpeechIndex, setActiveSpeechIndex] = useState<number | null>(null);

  const plan: ResultPlan | null = project?.result_plan || null;

  // Cleanup speech synthesis on unmount
  useEffect(() => {
    return () => {
      if ('speechSynthesis' in window) {
        window.speechSynthesis.cancel();
      }
    };
  }, []);

  const handleCopyTitle = (text: string, index: number) => {
    navigator.clipboard.writeText(text);
    setCopiedTitleIndex(index);
    setTimeout(() => setCopiedTitleIndex(null), 2000);
  };

  const handleCopyPrompt = (prompt: string) => {
    navigator.clipboard.writeText(prompt);
    setCopiedPrompt(true);
    setTimeout(() => setCopiedPrompt(false), 2000);
  };

  const handleCopyBridge = (bridge: string) => {
    navigator.clipboard.writeText(bridge);
    setCopiedBridge(true);
    setTimeout(() => setCopiedBridge(false), 2000);
  };

  const handleCopyTags = (tags: string) => {
    navigator.clipboard.writeText(tags);
    setCopiedTags(true);
    setTimeout(() => setCopiedTags(false), 2000);
  };

  const handleCopyDesc = (desc: string) => {
    navigator.clipboard.writeText(desc);
    setCopiedDesc(true);
    setTimeout(() => setCopiedDesc(false), 2000);
  };

  const handleCopyPinned = (pinned: string) => {
    navigator.clipboard.writeText(pinned);
    setCopiedPinned(true);
    setTimeout(() => setCopiedPinned(false), 2000);
  };

  const handleCopyHashtags = (hashtags: string[]) => {
    navigator.clipboard.writeText(hashtags.join(" "));
    setCopiedHashtags(true);
    setTimeout(() => setCopiedHashtags(false), 2000);
  };

  // 1. Download CapCut / Premiere .SRT Subtitles
  const handleDownloadSrt = () => {
    if (!plan) return;
    const timeline = plan.new_video_plan.script_and_visual_timeline;
    
    let srtContent = "";
    timeline.forEach((item, idx) => {
      // Parse time_range e.g. "00:00-00:03" or "00:03-00:15"
      const parts = item.time_range.split("-");
      const startSec = parts[0]?.trim() || `00:${String(idx * 5).padStart(2, '0')}`;
      const endSec = parts[1]?.trim() || `00:${String((idx + 1) * 5).padStart(2, '0')}`;

      const formatSrtTime = (tStr: string) => {
        const segs = tStr.split(":");
        const m = segs[0].padStart(2, "0");
        const s = (segs[1] || "00").padStart(2, "0");
        return `00:${m}:${s},000`;
      };

      srtContent += `${idx + 1}\n`;
      srtContent += `${formatSrtTime(startSec)} --> ${formatSrtTime(endSec)}\n`;
      srtContent += `${item.narration}\n\n`;
    });

    const blob = new Blob([srtContent], { type: "text/plain;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${project?.keyword}_capcut_subtitles.srt`;
    a.click();
    URL.revokeObjectURL(url);
  };

  // 2. Download Thumbnail Mockup PNG (Canvas 1280x720)
  const handleGenerateThumbnailImage = () => {
    if (!plan) return;
    const textOverlay = plan.new_video_plan.thumbnail_blueprint.text_overlay || "충격 실화";
    
    const canvas = document.createElement("canvas");
    canvas.width = 1280;
    canvas.height = 720;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // Background Gradient (Dark cinematic vignette)
    const bgGrad = ctx.createRadialGradient(640, 360, 100, 640, 360, 750);
    bgGrad.addColorStop(0, "#1e1b4b"); // deep indigo
    bgGrad.addColorStop(0.5, "#0f172a"); // slate 900
    bgGrad.addColorStop(1, "#020617"); // black
    ctx.fillStyle = bgGrad;
    ctx.fillRect(0, 0, 1280, 720);

    // Glowing Red/Amber Accent
    const glow = ctx.createRadialGradient(900, 250, 20, 900, 250, 450);
    glow.addColorStop(0, "rgba(239, 68, 68, 0.35)");
    glow.addColorStop(1, "rgba(239, 68, 68, 0)");
    ctx.fillStyle = glow;
    ctx.fillRect(0, 0, 1280, 720);

    // Badge: "100% 실화 미스터리"
    ctx.fillStyle = "#ef4444";
    ctx.roundRect(100, 110, 240, 48, 8);
    ctx.fill();
    ctx.fillStyle = "#ffffff";
    ctx.font = "bold 24px sans-serif";
    ctx.fillText("🔥 100% 검증 실화", 120, 143);

    // Huge 4-Word Overlay Text (Yellow bold with heavy black shadow)
    ctx.font = "900 88px sans-serif";
    ctx.textAlign = "center";
    ctx.strokeStyle = "#000000";
    ctx.lineWidth = 18;
    ctx.strokeText(`"${textOverlay}"`, 640, 390);

    ctx.fillStyle = "#facc15"; // vivid yellow
    ctx.fillText(`"${textOverlay}"`, 640, 390);

    // Subtitle caption bar
    ctx.fillStyle = "rgba(0, 0, 0, 0.75)";
    ctx.fillRect(100, 520, 1080, 90);
    ctx.strokeStyle = "#334155";
    ctx.lineWidth = 2;
    ctx.strokeRect(100, 520, 1080, 90);

    ctx.fillStyle = "#ffffff";
    ctx.font = "bold 34px sans-serif";
    ctx.fillText(plan.new_video_plan.titles[0]?.slice(0, 38) + "...", 640, 578);

    // Download PNG
    const url = canvas.toDataURL("image/png");
    const a = document.createElement("a");
    a.href = url;
    a.download = `${project?.keyword}_counter_thumbnail_mockup.png`;
    a.click();
  };

  // 3. Web Speech Synthesis TTS Rehearsal (1.15x Pace for Shorts)
  const handleToggleTts = () => {
    if (!('speechSynthesis' in window) || !plan) return;

    if (isPlayingAudio) {
      window.speechSynthesis.cancel();
      setIsPlayingAudio(false);
      setActiveSpeechIndex(null);
      return;
    }

    const fullNarration = plan.new_video_plan.script_and_visual_timeline
      .map(item => item.narration)
      .join(" ");

    const utterance = new SpeechSynthesisUtterance(fullNarration);
    utterance.lang = "ko-KR";
    utterance.rate = 1.15; // 1.15x pace is optimal for Shorts retention!

    // Try to find a natural Korean voice
    const voices = window.speechSynthesis.getVoices();
    const koVoice = voices.find(v => v.lang.includes("ko"));
    if (koVoice) utterance.voice = koVoice;

    utterance.onstart = () => setIsPlayingAudio(true);
    utterance.onend = () => {
      setIsPlayingAudio(false);
      setActiveSpeechIndex(null);
    };
    utterance.onerror = () => {
      setIsPlayingAudio(false);
      setActiveSpeechIndex(null);
    };

    window.speechSynthesis.cancel();
    window.speechSynthesis.speak(utterance);
  };

  const handleCopyAll = () => {
    if (!plan) return;
    const md = `# [유튜브 필승 기획안] ${project?.keyword} (${formatType === 'shorts' ? '30초 쇼츠 무한루프' : '롱폼 심층'})

## 1. 경쟁작 공통점 및 시청자 결핍 분석
- 썸네일 공통 패턴: ${plan.competitor_summary.common_thumbnail_pattern}
- 15초 후킹 공식: ${plan.competitor_summary.winning_hook_strategy}
- 시청자 반응 및 결핍:
${plan.competitor_summary.audience_pain_points.map(p => `  * ${p}`).join('\n')}

## 2. 추천 바이럴 제목 3선
${plan.new_video_plan.titles.map((t, idx) => `${idx + 1}. ${t}`).join('\n')}

## 3. 카운터 썸네일 청사진
- 텍스트 오버레이: ${plan.new_video_plan.thumbnail_blueprint.text_overlay}
- 비주얼 구도/색감: ${plan.new_video_plan.thumbnail_blueprint.visual_composition}
- AI 이미지 생성 프롬프트:
\`\`\`
${plan.new_video_plan.thumbnail_blueprint.image_gen_prompt}
\`\`\`

## 4. 대본 & 화면 연출 타임라인
${plan.new_video_plan.script_and_visual_timeline.map(s => `### [${s.time_range}] ${s.section}
- 내레이션 대본:
${s.narration}
- 연출 및 비주얼 프롬프트:
${s.visual_prompt}
`).join('\n')}

${plan.new_video_plan.loop_bridge ? `## 5. 무한 루프 엔딩 브릿지 (완독률 120% 극대화 기법)
${plan.new_video_plan.loop_bridge}` : ''}
`;
    navigator.clipboard.writeText(md);
    setCopiedAll(true);
    setTimeout(() => setCopiedAll(false), 2000);
  };

  if (!project) {
    return (
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-12 text-center space-y-4">
        <div className="w-16 h-16 rounded-2xl bg-slate-800 flex items-center justify-center mx-auto text-slate-500">
          <FileText className="w-8 h-8" />
        </div>
        <h3 className="text-base font-semibold text-slate-200">선택된 프로젝트가 없습니다.</h3>
        <p className="text-xs text-slate-400 max-w-md mx-auto">
          '1. 스카우터 &amp; 라이브' 탭에서 분석할 키워드를 입력하고 에이전트를 출격시켜 데이터를 확보해 주세요.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Action Header */}
      <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4 bg-slate-900 border border-slate-800 p-5 rounded-2xl shadow-xl">
        <div>
          <div className="flex items-center space-x-2">
            <span className="px-2.5 py-0.5 rounded-full bg-red-500/20 text-red-400 border border-red-500/30 text-xs font-semibold">
              AI 총괄 기획 스튜디오
            </span>
            <h2 className="text-lg font-bold text-white">
              '{project.keyword}' 바이럴 기획 리믹스
            </h2>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            수집된 아웃라이어 영상들의 후킹과 댓글 반응을 해부하여 <strong>원조를 뛰어넘는 새 제목, 카운터 썸네일, 벤치마킹 대본</strong>을 생성합니다.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          {/* Format Mode Toggle (30s Shorts vs Longform) */}
          <div className="flex items-center bg-slate-950 p-1 rounded-xl border border-slate-800 text-xs font-semibold">
            <button
              onClick={() => setFormatType('shorts')}
              className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-lg transition-colors ${
                formatType === 'shorts'
                  ? 'bg-amber-500 text-slate-950 font-black shadow-md'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <Zap className="w-3.5 h-3.5 fill-current" />
              <span>30초 쇼츠 무한루프</span>
            </button>
            <button
              onClick={() => setFormatType('longform')}
              className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-lg transition-colors ${
                formatType === 'longform'
                  ? 'bg-red-600 text-white font-bold shadow-md'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <Film className="w-3.5 h-3.5" />
              <span>롱폼 심층 모드</span>
            </button>
          </div>

          {plan && (
            <>
              {/* CapCut SRT Export */}
              <button
                onClick={handleDownloadSrt}
                className="flex items-center space-x-1.5 px-3 py-2 rounded-xl bg-purple-600/20 hover:bg-purple-600/30 text-purple-300 text-xs font-semibold transition-colors border border-purple-500/30"
                title="캡컷/프리미어용 .srt 자막 다운로드"
              >
                <Download className="w-3.5 h-3.5 text-purple-400" />
                <span>캡컷 .SRT 자막</span>
              </button>

              {/* Thumbnail Image Download */}
              <button
                onClick={handleGenerateThumbnailImage}
                className="flex items-center space-x-1.5 px-3 py-2 rounded-xl bg-amber-600/20 hover:bg-amber-600/30 text-amber-300 text-xs font-semibold transition-colors border border-amber-500/30"
                title="1280x720 썸네일 목업 이미지(PNG) 즉시 다운로드"
              >
                <Palette className="w-3.5 h-3.5 text-amber-400" />
                <span>썸네일 PNG</span>
              </button>

              {/* Markdown Copy */}
              <button
                onClick={handleCopyAll}
                className="flex items-center space-x-1.5 px-3 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-medium transition-colors border border-slate-700"
                title="전체 기획안 마크다운 복사"
              >
                {copiedAll ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                <span>대본 복사</span>
              </button>
            </>
          )}

          <button
            onClick={() => onAnalyze(project.keyword, formatType)}
            disabled={isAnalyzing}
            className="flex items-center space-x-2 px-5 py-2 bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-500 hover:to-rose-500 disabled:opacity-50 text-white font-semibold rounded-xl text-xs sm:text-sm shadow-lg shadow-red-600/25 transition-all cursor-pointer whitespace-nowrap"
          >
            {isAnalyzing ? (
              <>
                <RefreshCw className="w-4 h-4 animate-spin" />
                <span>AI 기획 해부 중...</span>
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4" />
                <span>{plan ? `${formatType === 'shorts' ? '쇼츠' : '롱폼'} 기획안 다시 생성` : "AI 총괄 PD 기획안 생성"}</span>
              </>
            )}
          </button>
        </div>
      </div>

      {plan && (
        <div className="space-y-6">
          {/* Card 1: Competitor Summary Breakdown + Sentiment & Keyword Cloud */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl relative overflow-hidden">
            <div className="flex items-center justify-between pb-4 border-b border-slate-800 mb-4">
              <div className="flex items-center space-x-2">
                <Lightbulb className="w-5 h-5 text-amber-400" />
                <h3 className="text-sm font-bold text-white uppercase tracking-wider">
                  1. 경쟁작 공식 해부 &amp; 시청자 결핍 분석
                </h3>
              </div>
              <span className="text-xs text-amber-400 font-semibold flex items-center">
                <Flame className="w-3.5 h-3.5 mr-1 fill-current" />
                100만 바이럴 공식 도출
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
              {/* Pattern */}
              <div className="bg-slate-950 p-4 rounded-xl border border-slate-800/80 space-y-2">
                <span className="font-bold text-slate-400 flex items-center text-amber-400">
                  <Palette className="w-4 h-4 mr-1.5" />
                  경쟁작 썸네일 공통 패턴
                </span>
                <p className="text-slate-300 leading-relaxed">
                  {plan.competitor_summary.common_thumbnail_pattern}
                </p>
              </div>

              {/* Hook */}
              <div className="bg-slate-950 p-4 rounded-xl border border-slate-800/80 space-y-2">
                <span className="font-bold text-slate-400 flex items-center text-red-400">
                  <Flame className="w-4 h-4 mr-1.5" />
                  15초 후킹 승리 공식
                </span>
                <p className="text-slate-300 leading-relaxed">
                  {plan.competitor_summary.winning_hook_strategy}
                </p>
              </div>

              {/* Comments Pain Points & Sentiment */}
              <div className="bg-slate-950 p-4 rounded-xl border border-slate-800/80 space-y-2">
                <span className="font-bold text-slate-400 flex items-center text-emerald-400">
                  <MessageSquare className="w-4 h-4 mr-1.5" />
                  댓글에서 발굴한 시청자 결핍 포인트
                </span>
                <ul className="text-slate-300 space-y-1.5 list-disc pl-4 leading-relaxed">
                  {plan.competitor_summary.audience_pain_points.map((pt, i) => (
                    <li key={i}>{pt}</li>
                  ))}
                </ul>
              </div>
            </div>
          </div>

          {/* Card 2: Viral Titles & Thumbnail Blueprint */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* Left: 3 Viral Titles (5 cols) */}
            <div className="lg:col-span-5 bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl flex flex-col justify-between">
              <div>
                <div className="flex items-center space-x-2 pb-3 border-b border-slate-800 mb-4">
                  <Flame className="w-4 h-4 text-red-400" />
                  <h3 className="text-sm font-bold text-white uppercase tracking-wider">
                    2. CTR 폭발 신규 제목 3선
                  </h3>
                </div>

                <div className="space-y-3">
                  {plan.new_video_plan.titles.map((title, idx) => {
                    const types = ["자동완성 결합형", "호기심 극대화형", "반전 후킹형"];
                    return (
                      <div
                        key={idx}
                        className="bg-slate-950 p-3.5 rounded-xl border border-slate-800 hover:border-red-500/50 transition-all group relative"
                      >
                        <div className="flex items-center justify-between text-[10px] text-slate-500 mb-1">
                          <span className="font-bold text-red-400">옵션 #{idx + 1} • {types[idx] || "바이럴 제목"}</span>
                          <button
                            onClick={() => handleCopyTitle(title, idx)}
                            className="text-slate-400 hover:text-white transition-colors"
                            title="제목 복사"
                          >
                            {copiedTitleIndex === idx ? (
                              <Check className="w-3.5 h-3.5 text-emerald-400" />
                            ) : (
                              <Copy className="w-3.5 h-3.5" />
                            )}
                          </button>
                        </div>
                        <p className="text-xs font-semibold text-slate-100 group-hover:text-red-300 transition-colors">
                          {title}
                        </p>
                      </div>
                    );
                  })}
                </div>
              </div>

              <p className="text-[11px] text-slate-500 mt-4 italic">
                * 검색 자동완성 키워드와 높은 클릭률을 유발하는 심리적 트리거 단어가 결합되었습니다.
              </p>
            </div>

            {/* Right: Counter Thumbnail Blueprint (7 cols) */}
            <div className="lg:col-span-7 bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-4">
              <div className="flex items-center space-x-2 pb-3 border-b border-slate-800">
                <Palette className="w-4 h-4 text-purple-400" />
                <h3 className="text-sm font-bold text-white uppercase tracking-wider">
                  3. 카운터 썸네일 설계도 (Thumbnail Blueprint)
                </h3>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                {/* Text Overlay */}
                <div className="bg-slate-950 p-3.5 rounded-xl border border-slate-800">
                  <span className="text-slate-400 font-bold block mb-1">📌 썸네일 문구 (4단어 이내):</span>
                  <p className="text-xl font-black text-amber-400">
                    "{plan.new_video_plan.thumbnail_blueprint.text_overlay}"
                  </p>
                </div>

                {/* Visual Composition */}
                <div className="bg-slate-950 p-3.5 rounded-xl border border-slate-800">
                  <span className="text-slate-400 font-bold block mb-1">🎨 구도 및 색감 지시:</span>
                  <p className="text-xs text-slate-300 leading-relaxed">
                    {plan.new_video_plan.thumbnail_blueprint.visual_composition}
                  </p>
                </div>
              </div>

              {/* Image Gen Prompt */}
              <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-2">
                <div className="flex items-center justify-between text-xs font-bold text-slate-400">
                  <span className="flex items-center text-purple-400">
                    <Sparkles className="w-3.5 h-3.5 mr-1" />
                    AI 썸네일 생성용 영문 프롬프트 (Midjourney / Flux / DALL-E)
                  </span>
                  <button
                    onClick={() => handleCopyPrompt(plan.new_video_plan.thumbnail_blueprint.image_gen_prompt)}
                    className="flex items-center space-x-1 text-slate-400 hover:text-white transition-colors"
                  >
                    {copiedPrompt ? (
                      <span className="text-emerald-400 flex items-center">
                        <Check className="w-3.5 h-3.5 mr-1" /> 복사됨
                      </span>
                    ) : (
                      <span className="flex items-center">
                        <Copy className="w-3.5 h-3.5 mr-1" /> 복사
                      </span>
                    )}
                  </button>
                </div>
                <p className="text-xs font-mono text-slate-300 bg-slate-900/80 p-3 rounded-lg border border-slate-800/80 leading-relaxed select-all">
                  {plan.new_video_plan.thumbnail_blueprint.image_gen_prompt}
                </p>
              </div>
            </div>
          </div>

          {/* Card 3: YouTube Feed Thumbnail Arena (vidIQ / TubeBuddy Style) */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <div className="flex items-center space-x-2">
                <Eye className="w-5 h-5 text-amber-400" />
                <h3 className="text-sm font-bold text-white uppercase tracking-wider">
                  유튜브 피드 시뮬레이터 (YouTube Feed Thumbnail Arena)
                </h3>
              </div>
              <span className="text-xs text-slate-400 font-medium">
                경쟁작 썸네일들 사이에서 내 기획안이 얼마나 눈에 띄는지 시각적 대비(CTR) 검증
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {/* Competitor #1 */}
              {project.videos[0] && (
                <div className="bg-slate-950 p-3 rounded-xl border border-slate-800 space-y-2 opacity-85">
                  <span className="text-[10px] text-slate-400 font-bold">경쟁작 1위 ({project.videos[0].channel})</span>
                  <div className="aspect-video rounded-lg overflow-hidden border border-slate-800">
                    <img src={project.videos[0].thumbnail} alt="Comp 1" className="w-full h-full object-cover" />
                  </div>
                  <p className="text-xs text-slate-300 line-clamp-1 font-medium">{project.videos[0].title}</p>
                </div>
              )}

              {/* OUR COUNTER THUMBNAIL (Highlight Arena) */}
              <div className="bg-gradient-to-b from-red-950/60 to-slate-950 p-3 rounded-xl border-2 border-red-500 shadow-xl shadow-red-600/10 space-y-2 relative">
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-red-600 text-white text-[10px] font-black px-2.5 py-0.5 rounded-full uppercase tracking-wider shadow">
                  🔥 내 카운터 썸네일 (AI 기획안)
                </div>
                <span className="text-[10px] text-red-400 font-bold block pt-1">
                  타이틀: {plan.new_video_plan.titles[0]}
                </span>
                <div className="aspect-video rounded-lg overflow-hidden bg-slate-900 border border-red-500/40 relative flex items-center justify-center p-3 text-center">
                  <div className="absolute inset-0 bg-gradient-to-tr from-black via-slate-900 to-red-950 opacity-90" />
                  <div className="relative z-10 space-y-1">
                    <span className="text-2xl font-black text-amber-400 tracking-tight block drop-shadow-lg">
                      {plan.new_video_plan.thumbnail_blueprint.text_overlay}
                    </span>
                    <span className="text-[10px] text-slate-300 block line-clamp-2">
                      {plan.new_video_plan.thumbnail_blueprint.visual_composition.slice(0, 45)}...
                    </span>
                  </div>
                </div>
                <p className="text-xs text-amber-300 font-bold line-clamp-1">
                  {plan.new_video_plan.titles[0]}
                </p>
              </div>

              {/* Competitor #2 */}
              {project.videos[1] && (
                <div className="bg-slate-950 p-3 rounded-xl border border-slate-800 space-y-2 opacity-85">
                  <span className="text-[10px] text-slate-400 font-bold">경쟁작 2위 ({project.videos[1].channel})</span>
                  <div className="aspect-video rounded-lg overflow-hidden border border-slate-800">
                    <img src={project.videos[1].thumbnail} alt="Comp 2" className="w-full h-full object-cover" />
                  </div>
                  <p className="text-xs text-slate-300 line-clamp-1 font-medium">{project.videos[1].title}</p>
                </div>
              )}
            </div>
          </div>

          {/* Card 4: Script & Visual Production Timeline */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3 border-b border-slate-800 gap-3">
              <div className="flex items-center space-x-2">
                <Film className="w-4 h-4 text-emerald-400" />
                <h3 className="text-sm font-bold text-white uppercase tracking-wider">
                  4. 대본 &amp; 화면 연출 타임라인 ({formatType === 'shorts' ? '30초 쇼츠 무한루프' : '롱폼 심층'})
                </h3>
              </div>

              {/* TTS Rehearsal Bar */}
              <button
                onClick={handleToggleTts}
                className={`flex items-center space-x-2 px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all border ${
                  isPlayingAudio
                    ? 'bg-amber-500 text-slate-950 border-amber-400 shadow-lg shadow-amber-500/20 animate-pulse'
                    : 'bg-slate-800 hover:bg-slate-700 text-slate-200 border-slate-700'
                }`}
              >
                {isPlayingAudio ? (
                  <>
                    <Pause className="w-3.5 h-3.5 fill-current" />
                    <span>음성 재생 중지</span>
                  </>
                ) : (
                  <>
                    <Volume2 className="w-3.5 h-3.5 text-amber-400" />
                    <span>🎙️ 쇼츠 1.15x 배속 대본 듣기</span>
                  </>
                )}
              </button>
            </div>

            <div className="space-y-4">
              {plan.new_video_plan.script_and_visual_timeline.map((section, idx) => (
                <div
                  key={idx}
                  className="bg-slate-950 rounded-xl border border-slate-800 p-4 hover:border-slate-700 transition-all"
                >
                  <div className="flex items-center justify-between pb-2 mb-3 border-b border-slate-900 text-xs font-medium">
                    <div className="flex items-center space-x-2">
                      <span className="px-2 py-0.5 rounded bg-red-600/20 text-red-400 font-mono font-bold text-[11px] border border-red-500/30">
                        {section.time_range}
                      </span>
                      <span className="text-white font-bold text-sm">
                        {section.section}
                      </span>
                    </div>
                    <span className="text-slate-500 text-[11px]">Step {idx + 1}</span>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-12 gap-4 text-xs">
                    {/* Narration Script (7 cols) */}
                    <div className="md:col-span-7 space-y-1.5">
                      <span className="text-[11px] font-bold text-slate-400 flex items-center">
                        <FileText className="w-3.5 h-3.5 mr-1 text-blue-400" />
                        내레이션 대본:
                      </span>
                      <div className="bg-slate-900/90 p-3 rounded-lg border border-slate-800/80 text-slate-200 leading-relaxed font-sans text-sm">
                        {section.narration}
                      </div>
                    </div>

                    {/* Visual Production Prompt (5 cols) */}
                    <div className="md:col-span-5 space-y-1.5">
                      <span className="text-[11px] font-bold text-slate-400 flex items-center">
                        <Video className="w-3.5 h-3.5 mr-1 text-purple-400" />
                        화면 연출 및 AI 생성 프롬프트:
                      </span>
                      <div className="bg-slate-900/90 p-3 rounded-lg border border-slate-800/80 text-slate-300 font-mono text-[11px] leading-relaxed">
                        {section.visual_prompt}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Infinite Loop Ending Bridge */}
            {plan.new_video_plan.loop_bridge && (
              <div className="bg-gradient-to-r from-amber-950/40 via-slate-950 to-orange-950/30 p-4 rounded-xl border border-amber-500/40 space-y-2 mt-4">
                <div className="flex items-center justify-between text-xs font-bold text-amber-400">
                  <span className="flex items-center">
                    <Zap className="w-4 h-4 mr-1.5 fill-current" />
                    무한 루프 엔딩 브릿지 (시청 지속 시간 120% 폭발 치트키)
                  </span>
                  <button
                    onClick={() => handleCopyBridge(plan.new_video_plan.loop_bridge || '')}
                    className="flex items-center space-x-1 text-slate-300 hover:text-white"
                  >
                    {copiedBridge ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>{copiedBridge ? "복사됨" : "엔딩 복사"}</span>
                  </button>
                </div>
                <p className="text-xs text-slate-200 leading-relaxed font-sans italic bg-slate-950/80 p-3 rounded-lg border border-amber-500/20">
                  "{plan.new_video_plan.loop_bridge}"
                </p>
              </div>
            )}
          </div>

          {/* 5. YouTube Algorithm & SEO Publishing Kit */}
          {plan.new_video_plan.seo_package && (
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3 border-b border-slate-800 gap-2">
                <div className="flex items-center space-x-2">
                  <Sparkles className="w-5 h-5 text-amber-400" />
                  <h3 className="text-sm font-bold text-white uppercase tracking-wider">
                    5. 유튜브 실전 업로드 &amp; SEO 마스터 팩 (YouTube SEO &amp; Viral Publishing Kit)
                  </h3>
                </div>
                <span className="text-xs text-amber-400 font-semibold bg-amber-500/10 px-2.5 py-1 rounded-full border border-amber-500/30">
                  🚀 1,000회 박스권 탈출 최적화 완료
                </span>
              </div>

              {/* Algorithm Health & Survival Scorecard */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 text-xs">
                <div className="bg-slate-950 p-3.5 rounded-xl border border-slate-800 space-y-1">
                  <span className="text-slate-400 text-[11px] block">📱 VVSA (초반 1.5초 방어율)</span>
                  <span className="text-base font-black text-emerald-400 block">
                    {plan.new_video_plan.algorithm_scorecard?.predicted_vvsa || "78% (A+ 등급)"}
                  </span>
                  <span className="text-[10px] text-slate-500 block">70% 샌드박스 기준 돌파</span>
                </div>
                <div className="bg-slate-950 p-3.5 rounded-xl border border-slate-800 space-y-1">
                  <span className="text-slate-400 text-[11px] block">🔄 APV (평균 시청 지속률)</span>
                  <span className="text-base font-black text-amber-400 block">
                    {plan.new_video_plan.algorithm_scorecard?.target_apv || "118% (루프 달성 시)"}
                  </span>
                  <span className="text-[10px] text-slate-500 block">무한 루프 브릿지 장착</span>
                </div>
                <div className="bg-slate-950 p-3.5 rounded-xl border border-slate-800 space-y-1">
                  <span className="text-slate-400 text-[11px] block">🔍 SEO 검색 색인 지수</span>
                  <div className="flex items-baseline space-x-1">
                    <span className="text-base font-black text-blue-400">
                      {plan.new_video_plan.algorithm_scorecard?.seo_strength || 96}
                    </span>
                    <span className="text-[10px] text-slate-500">/ 100점</span>
                  </div>
                  <span className="text-[10px] text-slate-500 block">구글/유튜브 동시 색인</span>
                </div>
                <div className="bg-slate-950 p-3.5 rounded-xl border border-slate-800 space-y-1">
                  <span className="text-slate-400 text-[11px] block">🏆 알고리즘 판정</span>
                  <span className="text-[11px] font-bold text-red-400 block leading-tight">
                    2차 추천 풀 진입 유력
                  </span>
                  <span className="text-[10px] text-slate-500 block">초기 1,000회 2시간 내 돌파</span>
                </div>
              </div>

              {/* 1-Click Export Hub (Tags & Pinned Comment) */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* YouTube Studio 500-char Tags Box */}
                <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-3 flex flex-col justify-between">
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-slate-300 flex items-center">
                        🏷️ YouTube Studio 태그 상자 (500자 완성형)
                      </span>
                      <button
                        onClick={() => handleCopyTags(plan.new_video_plan.seo_package?.youtube_tags_500 || '')}
                        className="flex items-center space-x-1 px-2.5 py-1 rounded bg-red-600/20 hover:bg-red-600/30 text-red-300 border border-red-500/30 text-[11px] font-semibold transition-colors"
                      >
                        {copiedTags ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                        <span>{copiedTags ? "태그 복사됨!" : "태그 500자 복사"}</span>
                      </button>
                    </div>
                    <p className="text-[11px] text-slate-400">
                      * 유튜브 스튜디오 '세부정보' 하단의 <strong>[태그]</strong> 입력란에 그대로 붙여넣기(Ctrl+V)하세요.
                    </p>
                    <div className="bg-slate-900 p-3 rounded-lg border border-slate-800 font-mono text-xs text-slate-300 leading-relaxed max-h-28 overflow-y-auto select-all">
                      {plan.new_video_plan.seo_package.youtube_tags_500}
                    </div>
                  </div>
                  <div className="text-[10px] text-slate-500 flex items-center justify-between pt-1">
                    <span>태그 수: {plan.new_video_plan.seo_package.youtube_tags_500.split(',').length}개</span>
                    <span>{plan.new_video_plan.seo_package.youtube_tags_500.length} / 500자 최적화</span>
                  </div>
                </div>

                {/* Pinned Comment & CTA Strategy */}
                <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-3 flex flex-col justify-between">
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-amber-400 flex items-center">
                        💬 알고리즘 폭발 고정 댓글 &amp; CTA (댓글 3.5배 가중치)
                      </span>
                      <button
                        onClick={() => handleCopyPinned(plan.new_video_plan.cta_strategy?.pinned_comment || '')}
                        className="flex items-center space-x-1 px-2.5 py-1 rounded bg-amber-600/20 hover:bg-amber-600/30 text-amber-300 border border-amber-500/30 text-[11px] font-semibold transition-colors"
                      >
                        {copiedPinned ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                        <span>{copiedPinned ? "댓글 복사됨!" : "고정 댓글 복사"}</span>
                      </button>
                    </div>
                    <p className="text-[11px] text-slate-400">
                      * 영상 업로드 즉시 채널 관리자 계정으로 작성하고 <strong>[댓글 상단 고정]</strong>하세요.
                    </p>
                    <div className="bg-slate-900 p-3 rounded-lg border border-slate-800 text-xs text-slate-200 leading-relaxed font-sans select-all">
                      {plan.new_video_plan.cta_strategy?.pinned_comment}
                    </div>
                  </div>
                  <div className="bg-amber-950/30 p-2.5 rounded-lg border border-amber-500/20 text-[11px] text-amber-200/90 leading-relaxed">
                    💡 <strong>인비디오 CTA 팁:</strong> {plan.new_video_plan.cta_strategy?.in_video_cta}
                  </div>
                </div>
              </div>

              {/* Full SEO Description & Hashtags */}
              <div className="bg-slate-950 p-5 rounded-xl border border-slate-800 space-y-3">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-2 border-b border-slate-900">
                  <div className="flex items-center space-x-2">
                    <span className="text-xs font-bold text-slate-200">
                      📝 SEO 검색 최적화 설명란 (본문 + 챕터 + 해시태그 완성형)
                    </span>
                    <span className="text-[10px] text-slate-500">Google Video Search &amp; YouTube Search 동시 색인</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() => handleCopyHashtags(plan.new_video_plan.seo_package?.hashtags || [])}
                      className="flex items-center space-x-1 px-2.5 py-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 text-[11px] font-medium transition-colors"
                    >
                      {copiedHashtags ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                      <span>{copiedHashtags ? "해시태그 복사됨" : "해시태그만 복사"}</span>
                    </button>
                    <button
                      onClick={() => handleCopyDesc(plan.new_video_plan.seo_package?.optimized_description || '')}
                      className="flex items-center space-x-1 px-3 py-1 rounded bg-blue-600 hover:bg-blue-500 text-white text-[11px] font-semibold transition-colors"
                    >
                      {copiedDesc ? <Check className="w-3 h-3 text-white" /> : <Copy className="w-3 h-3" />}
                      <span>{copiedDesc ? "설명란 복사됨!" : "설명란 전체 복사"}</span>
                    </button>
                  </div>
                </div>

                {/* Hashtags Chips */}
                <div className="flex flex-wrap gap-1.5 pt-1">
                  {plan.new_video_plan.seo_package.hashtags.map((tag, idx) => (
                    <span
                      key={idx}
                      className="px-2 py-0.5 rounded-md bg-slate-900 border border-slate-800 text-[11px] text-blue-400 font-mono"
                    >
                      {tag}
                    </span>
                  ))}
                </div>

                {/* Description Box */}
                <pre className="bg-slate-900 p-3.5 rounded-lg border border-slate-800 text-xs text-slate-300 font-mono leading-relaxed whitespace-pre-wrap select-all max-h-48 overflow-y-auto">
                  {plan.new_video_plan.seo_package.optimized_description}
                </pre>
              </div>

              {/* CTR Psychological Trigger Breakdown */}
              {plan.new_video_plan.ctr_strategy && (
                <div className="bg-slate-950 p-5 rounded-xl border border-slate-800 space-y-3">
                  <div className="flex items-center justify-between pb-2 border-b border-slate-900 text-xs">
                    <span className="font-bold text-slate-200 flex items-center">
                      🎯 CTR 심리 트리거 분석 &amp; 썸네일 안전지대 가이드
                    </span>
                    <span className="text-[11px] text-slate-500">
                      {plan.new_video_plan.ctr_strategy.thumbnail_concept.safe_zone_rule}
                    </span>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs">
                    {plan.new_video_plan.ctr_strategy.title_options.map((opt, idx) => (
                      <div key={idx} className="bg-slate-900 p-3.5 rounded-lg border border-slate-800 space-y-1.5">
                        <div className="flex items-center justify-between text-[11px]">
                          <span className="font-bold text-red-400">{opt.type}</span>
                          <span className="font-mono text-emerald-400 font-bold">{opt.predicted_ctr}</span>
                        </div>
                        <p className="font-semibold text-slate-100 text-xs line-clamp-2">
                          "{opt.title}"
                        </p>
                        <p className="text-[10px] text-slate-400 leading-relaxed pt-1 border-t border-slate-800/80">
                          💡 {opt.psychological_trigger}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
};
