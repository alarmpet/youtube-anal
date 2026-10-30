import React, { useState, useRef, useEffect } from 'react';
import { 
  Search, Play, Square, RefreshCw, Terminal, Eye, Sparkles, Filter, 
  CheckCircle2, AlertTriangle, ArrowRight, Clock, Zap, Bot, Flame
} from './Icons';
import type { ScoutStatus, LogMessage, ProjectData } from '../types';

interface ScoutLiveViewProps {
  status: ScoutStatus;
  logs: LogMessage[];
  currentScreenUrl: string | null;
  onStartScout: (keyword: string, maxVideos: number, filters: any, useCdp: boolean) => void;
  onAbortScout: () => void;
  currentProject: ProjectData | null;
  onGoToBoard: () => void;
}

export const ScoutLiveView: React.FC<ScoutLiveViewProps> = ({
  status,
  logs,
  currentScreenUrl,
  onStartScout,
  onAbortScout,
  currentProject,
  onGoToBoard
}) => {
  const [keyword, setKeyword] = useState('');
  const [maxVideos, setMaxVideos] = useState(5);
  const [filterOutlier, setFilterOutlier] = useState(true);
  const [filterRecent, setFilterRecent] = useState(true);
  const [useCdp, setUseCdp] = useState(false);
  const terminalRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (terminalRef.current) {
      terminalRef.current.scrollTop = terminalRef.current.scrollHeight;
    }
  }, [logs]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!keyword.trim() || status.is_running) return;
    onStartScout(keyword.trim(), maxVideos, { filterOutlier, filterRecent }, useCdp);
  };

  const quickKeywords = [
    "유튜브 알고리즘 떡상", "AI 영상 자동화", "노코드 웹앱 만들기", "부업 현실 후기", "직장인 재테크"
  ];

  const getStageBadge = (stage: string) => {
    switch (stage) {
      case 'initializing':
        return <span className="px-2 py-0.5 rounded text-xs bg-blue-500/20 text-blue-400 border border-blue-500/30">초기화 중</span>;
      case 'search_autocomplete':
        return <span className="px-2 py-0.5 rounded text-xs bg-amber-500/20 text-amber-400 border border-amber-500/30">자동완성 수집</span>;
      case 'serp_capture':
        return <span className="px-2 py-0.5 rounded text-xs bg-purple-500/20 text-purple-400 border border-purple-500/30">SERP 캡처</span>;
      case 'video_inspection':
        return <span className="px-2 py-0.5 rounded text-xs bg-rose-500/20 text-rose-400 border border-rose-500/30">영상 해부 순회</span>;
      case 'finished':
      case 'completed':
        return <span className="px-2 py-0.5 rounded text-xs bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">수집 완료</span>;
      case 'aborted':
        return <span className="px-2 py-0.5 rounded text-xs bg-red-500/20 text-red-400 border border-red-500/30">중단됨</span>;
      default:
        return <span className="px-2 py-0.5 rounded text-xs bg-slate-700 text-slate-300">대기 중</span>;
    }
  };

  return (
    <div className="space-y-6">
      {/* Search & Controller Card */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-80 h-80 bg-red-600/5 rounded-full blur-3xl pointer-events-none" />

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="flex flex-col lg:flex-row gap-3 items-stretch lg:items-center">
            {/* Input */}
            <div className="relative flex-1">
              <Search className="w-5 h-5 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                value={keyword}
                onChange={(e) => setKeyword(e.target.value)}
                placeholder="해부할 유튜브 주제 키워드를 입력하세요 (예: AI 쇼츠 만들기, 1인 창업 꿀팁)"
                disabled={status.is_running}
                className="w-full pl-11 pr-4 py-3 bg-slate-950 border border-slate-800 rounded-xl text-slate-100 placeholder-slate-500 focus:outline-none focus:border-red-500 focus:ring-1 focus:ring-red-500 transition-all text-sm font-medium"
              />
            </div>

            {/* Target Video Count Selector */}
            <div className="flex items-center space-x-2 bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs font-medium text-slate-300">
              <span>수집 영상:</span>
              <select
                value={maxVideos}
                onChange={(e) => setMaxVideos(Number(e.target.value))}
                disabled={status.is_running}
                className="bg-slate-900 text-white rounded px-2 py-1 border border-slate-700 focus:outline-none"
              >
                <option value={3}>3개 (빠른 스카우트)</option>
                <option value={5}>5개 (정밀 심층 분석)</option>
              </select>
            </div>

            {/* Action Button */}
            {!status.is_running ? (
              <button
                type="submit"
                disabled={!keyword.trim()}
                className="flex items-center justify-center space-x-2 px-6 py-3 bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-500 hover:to-rose-500 disabled:opacity-50 text-white font-semibold rounded-xl shadow-lg shadow-red-600/25 transition-all text-sm cursor-pointer whitespace-nowrap"
              >
                <Zap className="w-4 h-4" />
                <span>에이전트 출격 (Scout Start)</span>
              </button>
            ) : (
              <button
                type="button"
                onClick={onAbortScout}
                className="flex items-center justify-center space-x-2 px-6 py-3 bg-red-950/80 hover:bg-red-900 text-red-300 border border-red-800 font-semibold rounded-xl transition-all text-sm cursor-pointer whitespace-nowrap"
              >
                <Square className="w-4 h-4 fill-current" />
                <span>작업 중단 (Abort)</span>
              </button>
            )}
          </div>

          {/* Filters & Options */}
          <div className="flex flex-wrap items-center justify-between gap-3 pt-2 border-t border-slate-800/80 text-xs">
            <div className="flex flex-wrap items-center gap-4 text-slate-300">
              <span className="flex items-center text-slate-400 font-medium">
                <Filter className="w-3.5 h-3.5 mr-1" /> 필터 옵션:
              </span>
              <label className="flex items-center space-x-1.5 cursor-pointer hover:text-white">
                <input
                  type="checkbox"
                  checked={filterOutlier}
                  onChange={(e) => setFilterOutlier(e.target.checked)}
                  disabled={status.is_running}
                  className="rounded bg-slate-950 border-slate-700 text-red-600 focus:ring-0"
                />
                <span>조회수/구독자 비율 높은 아웃라이어 우선</span>
              </label>

              <label className="flex items-center space-x-1.5 cursor-pointer hover:text-white">
                <input
                  type="checkbox"
                  checked={filterRecent}
                  onChange={(e) => setFilterRecent(e.target.checked)}
                  disabled={status.is_running}
                  className="rounded bg-slate-950 border-slate-700 text-red-600 focus:ring-0"
                />
                <span>최근 1개월 트렌드 우선</span>
              </label>

              <label className="flex items-center space-x-1.5 cursor-pointer hover:text-white">
                <input
                  type="checkbox"
                  checked={useCdp}
                  onChange={(e) => setUseCdp(e.target.checked)}
                  disabled={status.is_running}
                  className="rounded bg-slate-950 border-slate-700 text-red-600 focus:ring-0"
                />
                <span>CDP Port 9222 세션 동기화</span>
              </label>
            </div>

            {/* Quick Keyword Pills */}
            <div className="flex items-center space-x-1.5 text-slate-400">
              <span className="text-slate-500 hidden sm:inline">추천:</span>
              {quickKeywords.slice(0, 3).map((kw) => (
                <button
                  key={kw}
                  type="button"
                  onClick={() => setKeyword(kw)}
                  disabled={status.is_running}
                  className="px-2 py-0.5 rounded-md bg-slate-800/70 hover:bg-slate-700 hover:text-slate-200 transition-colors text-slate-400"
                >
                  {kw}
                </button>
              ))}
            </div>
          </div>
        </form>

        {/* Progress Bar & Stage Indicator */}
        {status.is_running && (
          <div className="mt-4 pt-4 border-t border-slate-800 space-y-2 animate-fadeIn">
            <div className="flex items-center justify-between text-xs font-medium">
              <div className="flex items-center space-x-2">
                <span className="w-2 h-2 rounded-full bg-red-500 animate-ping" />
                <span className="text-slate-200">{status.message}</span>
                {getStageBadge(status.stage)}
              </div>
              <span className="text-red-400 font-bold">{status.progress}%</span>
            </div>
            <div className="w-full h-1.5 bg-slate-950 rounded-full overflow-hidden">
              <div 
                className="h-full bg-gradient-to-r from-red-600 via-rose-500 to-amber-500 rounded-full transition-all duration-300"
                style={{ width: `${status.progress}%` }}
              />
            </div>
          </div>
        )}
      </div>

      {/* Main Dual Grid: Left Live Screen / Right Terminal Log */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left: Live Screen Viewport (7 cols) */}
        <div className="lg:col-span-7 bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden flex flex-col shadow-xl">
          <div className="px-4 py-3 bg-slate-950/80 border-b border-slate-800 flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <div className="flex space-x-1.5">
                <span className="w-3 h-3 rounded-full bg-red-500/80" />
                <span className="w-3 h-3 rounded-full bg-amber-500/80" />
                <span className="w-3 h-3 rounded-full bg-emerald-500/80" />
              </div>
              <span className="text-xs font-semibold text-slate-300 ml-2 flex items-center">
                <Eye className="w-3.5 h-3.5 mr-1.5 text-red-400" />
                Ego-Browser 실시간 화면 관제
              </span>
            </div>

            <div className="flex items-center space-x-2 text-xs">
              {status.is_running ? (
                <span className="flex items-center text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 mr-1 animate-pulse" />
                  인간형 딜레이 작동 중 (0.8s~2.0s)
                </span>
              ) : (
                <span className="text-slate-500">대기 화면</span>
              )}
            </div>
          </div>

          {/* Screen Content Viewport */}
          <div className="relative flex-1 min-h-[360px] sm:min-h-[420px] bg-slate-950 flex items-center justify-center p-3">
            {currentScreenUrl ? (
              <div className="relative w-full h-full flex items-center justify-center group">
                <img
                  src={currentScreenUrl}
                  alt="Ego-Browser live viewport"
                  className="max-h-[460px] w-auto max-w-full rounded-lg object-contain shadow-2xl border border-slate-800"
                />
                <div className="absolute bottom-4 left-4 bg-slate-950/85 backdrop-blur-md px-3 py-1.5 rounded-lg border border-slate-800 text-xs text-slate-300 flex items-center space-x-2">
                  <Bot className="w-4 h-4 text-red-400" />
                  <span>{status.message || "스카우트 진행 중"}</span>
                </div>
              </div>
            ) : (
              <div className="text-center p-8 space-y-3">
                <div className="w-16 h-16 rounded-2xl bg-slate-900 border border-slate-800 flex items-center justify-center mx-auto text-slate-600">
                  <Bot className="w-8 h-8" />
                </div>
                <h4 className="text-sm font-semibold text-slate-300">
                  {status.is_running ? "브라우저 화면을 수신하고 있습니다..." : "에이전트가 대기 상태입니다."}
                </h4>
                <p className="text-xs text-slate-500 max-w-sm mx-auto">
                  상단에 키워드를 입력하고 '에이전트 출격'을 누르면 사람처럼 검색창 타이핑, 자동완성 추출, 썸네일 캡처, 대본 추출 작업이 실시간 스트리밍됩니다.
                </p>
              </div>
            )}
          </div>

          {/* Quick jump to board if project is ready */}
          {currentProject && !status.is_running && (
            <div className="p-3 bg-slate-950 border-t border-slate-800 flex items-center justify-between">
              <span className="text-xs text-slate-400">
                수집 완료된 키워드: <strong className="text-slate-200">'{currentProject.keyword}'</strong> ({currentProject.videos.length}편 영상)
              </span>
              <button
                onClick={onGoToBoard}
                className="flex items-center space-x-1.5 px-3 py-1 rounded-lg bg-red-600 hover:bg-red-500 text-white text-xs font-medium transition-colors"
              >
                <span>경쟁작 보드로 이동</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          )}
        </div>

        {/* Right: Real-time Terminal Log (5 cols) */}
        <div className="lg:col-span-5 bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden flex flex-col shadow-xl">
          <div className="px-4 py-3 bg-slate-950/80 border-b border-slate-800 flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Terminal className="w-4 h-4 text-emerald-400" />
              <span className="text-xs font-semibold text-slate-300">에이전트 작업 로그 (Agent Log)</span>
            </div>
            <span className="text-xs text-slate-500 font-mono">{logs.length} events</span>
          </div>

          {/* Scrollable Log Terminal */}
          <div 
            ref={terminalRef}
            className="flex-1 p-4 bg-slate-950 font-mono text-xs overflow-y-auto space-y-2.5 max-h-[460px] min-h-[360px]"
          >
            {logs.length === 0 ? (
              <div className="text-slate-600 text-center py-12">
                &gt; 로그 대기 중... 스카우트 시작 시 에이전트의 모든 조작이 실시간 기록됩니다.
              </div>
            ) : (
              logs.map((log) => {
                let badgeClass = "bg-slate-800 text-slate-300";
                if (log.level === 'action') badgeClass = "bg-amber-500/20 text-amber-300 border border-amber-500/30";
                if (log.level === 'success') badgeClass = "bg-emerald-500/20 text-emerald-300 border border-emerald-500/30";
                if (log.level === 'warning') badgeClass = "bg-red-500/20 text-red-300 border border-red-500/30";

                return (
                  <div key={log.id} className="leading-relaxed hover:bg-slate-900/50 p-1 rounded transition-colors">
                    <div className="flex items-center space-x-2 text-[10px] text-slate-500 mb-0.5">
                      <span>{log.timestamp.slice(11, 19)}</span>
                      <span className={`px-1.5 py-0.2 rounded text-[9px] uppercase font-bold ${badgeClass}`}>
                        {log.level}
                      </span>
                    </div>
                    <div className="text-slate-300 text-xs pl-2 border-l border-slate-800">
                      {log.message}
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>
      </div>

      {/* Autocomplete tags preview */}
      {currentProject?.autocomplete && currentProject.autocomplete.length > 0 && (
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 shadow-md">
          <div className="flex items-center space-x-2 mb-2 text-xs font-semibold text-slate-400">
            <Sparkles className="w-3.5 h-3.5 text-amber-400" />
            <span>수집된 유튜브 실시간 자동완성 키워드 10선:</span>
          </div>
          <div className="flex flex-wrap gap-2">
            {currentProject.autocomplete.map((item, idx) => (
              <span
                key={idx}
                className="px-2.5 py-1 rounded-lg bg-slate-950 text-slate-300 border border-slate-800 text-xs font-medium"
              >
                #{idx + 1} {item}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* NEW: Viral Mystery Radar for Channel 'WhyJjin' */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-xl space-y-3">
        <div className="flex items-center justify-between pb-2 border-b border-slate-800">
          <div className="flex items-center space-x-2">
            <Flame className="w-4 h-4 text-red-500 fill-current" />
            <h4 className="text-xs font-bold text-white uppercase tracking-wider">
              '이왜찐' 맞춤형 떡상 실화 미스터리 레이더 (Viral Topic Radar)
            </h4>
          </div>
          <span className="text-[11px] text-slate-400">
            원클릭으로 검증된 100만 떡상 카테고리를 자동 분석합니다.
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 text-xs">
          {/* Card 1 */}
          <button
            type="button"
            onClick={() => {
              setKeyword("화성 탐사선 미스터리 실화");
              onStartScout("화성 탐사선 미스터리 실화", 5, { filterOutlier, filterRecent }, useCdp);
            }}
            disabled={status.is_running}
            className="p-3 rounded-xl bg-slate-950 border border-slate-800 hover:border-amber-500/50 text-left transition-all group"
          >
            <div className="flex items-center justify-between mb-1">
              <span className="font-bold text-amber-400 flex items-center">
                🚀 과학/우주 미스터리
              </span>
              <span className="text-[10px] text-slate-500">100만 뷰</span>
            </div>
            <p className="text-[11px] text-slate-300 group-hover:text-white line-clamp-2">
              "단 1초의 실수로 4천억 우주선 폭발한 레전드 실화"
            </p>
          </button>

          {/* Card 2 */}
          <button
            type="button"
            onClick={() => {
              setKeyword("동물 기적 실화");
              onStartScout("동물 기적 실화", 5, { filterOutlier, filterRecent }, useCdp);
            }}
            disabled={status.is_running}
            className="p-3 rounded-xl bg-slate-950 border border-slate-800 hover:border-emerald-500/50 text-left transition-all group"
          >
            <div className="flex items-center justify-between mb-1">
              <span className="font-bold text-emerald-400 flex items-center">
                🐾 동물 기적 실화 (4.2% 반응)
              </span>
              <span className="text-[10px] text-emerald-400/80 font-bold">인기 최고</span>
            </div>
            <p className="text-[11px] text-slate-300 group-hover:text-white line-clamp-2">
              "주인 죽은 줄 모르고 10년 기다린 역대급 충견 하치코"
            </p>
          </button>

          {/* Card 3 */}
          <button
            type="button"
            onClick={() => {
              setKeyword("황당 범죄 사건 실화");
              onStartScout("황당 범죄 사건 실화", 5, { filterOutlier, filterRecent }, useCdp);
            }}
            disabled={status.is_running}
            className="p-3 rounded-xl bg-slate-950 border border-slate-800 hover:border-purple-500/50 text-left transition-all group"
          >
            <div className="flex items-center justify-between mb-1">
              <span className="font-bold text-purple-400 flex items-center">
                💰 황당 사건사고 실화
              </span>
              <span className="text-[10px] text-slate-500">충격 반전</span>
            </div>
            <p className="text-[11px] text-slate-300 group-hover:text-white line-clamp-2">
              "올림픽 마라톤 차 타고 1등 들어왔다가 실격된 선수"
            </p>
          </button>

          {/* Card 4 */}
          <button
            type="button"
            onClick={() => {
              setKeyword("세계 미제 사건 미스터리 실화");
              onStartScout("세계 미제 사건 미스터리 실화", 5, { filterOutlier, filterRecent }, useCdp);
            }}
            disabled={status.is_running}
            className="p-3 rounded-xl bg-slate-950 border border-slate-800 hover:border-red-500/50 text-left transition-all group"
          >
            <div className="flex items-center justify-between mb-1">
              <span className="font-bold text-rose-400 flex items-center">
                🕵️ 세계 미제 미스터리
              </span>
              <span className="text-[10px] text-slate-500">미스터리</span>
            </div>
            <p className="text-[11px] text-slate-300 group-hover:text-white line-clamp-2">
              "눈 덮인 산에서 흔적도 없이 사라진 9명의 탐사대원"
            </p>
          </button>
        </div>
      </div>
    </div>
  );
};
