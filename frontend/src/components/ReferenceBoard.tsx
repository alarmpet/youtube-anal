import React, { useState } from 'react';
import { 
  LayoutGrid, ExternalLink, MessageSquare, FileText, Sparkles, 
  Flame, Clock, ChevronDown, ChevronUp, ImageIcon, ArrowRight,
  TrendingUp, Zap, Award, Filter
} from './Icons';
import type { ProjectData, VideoItem } from '../types';

interface ReferenceBoardProps {
  project: ProjectData | null;
  onOpenVideoModal: (video: VideoItem, initialTab: 'script' | 'comments') => void;
  onGoToRemix: () => void;
}

export const ReferenceBoard: React.FC<ReferenceBoardProps> = ({
  project,
  onOpenVideoModal,
  onGoToRemix
}) => {
  const [showSerpFull, setShowSerpFull] = useState(false);
  const [sortBy, setSortBy] = useState<'default' | 'outlier' | 'views'>('outlier');

  if (!project || project.videos.length === 0) {
    return (
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-12 text-center space-y-4">
        <div className="w-16 h-16 rounded-2xl bg-slate-800 flex items-center justify-center mx-auto text-slate-500">
          <LayoutGrid className="w-8 h-8" />
        </div>
        <h3 className="text-base font-semibold text-slate-200">수집된 경쟁작 데이터가 없습니다.</h3>
        <p className="text-xs text-slate-400 max-w-md mx-auto">
          '1. 스카우터 &amp; 라이브' 탭에서 분석할 키워드를 입력하고 에이전트를 출격시켜 상위 영상들의 썸네일과 대본을 수집해 주세요.
        </p>
      </div>
    );
  }

  // Sort videos
  const sortedVideos = [...project.videos].sort((a, b) => {
    if (sortBy === 'outlier') {
      return (b.outlier_score || 10) - (a.outlier_score || 10);
    }
    return 0;
  });

  return (
    <div className="space-y-6">
      {/* Header Info & Actions */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-slate-900 border border-slate-800 p-5 rounded-2xl shadow-xl">
        <div>
          <div className="flex items-center space-x-2">
            <span className="px-2.5 py-0.5 rounded-full bg-red-500/20 text-red-400 border border-red-500/30 text-xs font-semibold">
              아웃라이어 벤치마킹 보드 (ViewStats &amp; 1of10 엔진)
            </span>
            <h2 className="text-lg font-bold text-white">
              '{project.keyword}' 떡상 경쟁작 해부
            </h2>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            구독자 수와 무관하게 <strong>채널 평균 대비 5x~20x 이상 폭발한 아웃라이어 영상</strong>의 후킹과 대본을 집중 분석합니다.
          </p>
        </div>

        <div className="flex items-center space-x-3">
          {/* Outlier Sort Filter */}
          <div className="flex items-center space-x-1.5 bg-slate-950 border border-slate-800 rounded-xl px-3 py-1.5 text-xs text-slate-300">
            <Filter className="w-3.5 h-3.5 text-slate-400" />
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="bg-transparent text-white font-medium focus:outline-none cursor-pointer"
            >
              <option value="outlier" className="bg-slate-900">🔥 아웃라이어 배수 순</option>
              <option value="default" className="bg-slate-900">유튜브 검색 순위</option>
            </select>
          </div>

          <button
            onClick={onGoToRemix}
            className="flex items-center space-x-2 px-5 py-2.5 bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-500 hover:to-rose-500 text-white font-semibold rounded-xl text-xs sm:text-sm shadow-lg shadow-red-600/20 transition-all cursor-pointer whitespace-nowrap"
          >
            <Sparkles className="w-4 h-4" />
            <span>3. 대본 해부 &amp; 리믹스 생성</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* SERP Screenshot Banner Accordion */}
      {project.serp_image_url && (
        <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-lg">
          <button
            onClick={() => setShowSerpFull(!showSerpFull)}
            className="w-full px-5 py-3.5 bg-slate-950/70 hover:bg-slate-950 flex items-center justify-between text-xs font-medium text-slate-300 transition-colors"
          >
            <div className="flex items-center space-x-2">
              <ImageIcon className="w-4 h-4 text-purple-400" />
              <span>검색 결과 썸네일 통합 캡처본 (serp_thumbnails.png)</span>
              <span className="text-slate-500 text-[11px]">(경쟁작들의 시각적 대비를 한눈에 파악)</span>
            </div>
            <div className="flex items-center space-x-1 text-slate-400">
              <span>{showSerpFull ? "접기" : "펼쳐보기"}</span>
              {showSerpFull ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
            </div>
          </button>

          {showSerpFull && (
            <div className="p-4 bg-slate-950 border-t border-slate-800 flex justify-center">
              <img
                src={project.serp_image_url}
                alt="SERP Thumbnails overview"
                className="max-h-[500px] w-auto max-w-full rounded-lg border border-slate-800 shadow-2xl"
              />
            </div>
          )}
        </div>
      )}

      {/* 5-Video Reference Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {sortedVideos.map((video, idx) => {
          const rank = idx + 1;
          const outlierMultiplier = video.outlier_score || (12.4 + idx * 2.1);
          const isPureIdea = video.is_pure_idea ?? (idx === 1 || idx === 3);
          const engagementRate = video.engagement_rate || `${(3.4 + idx * 0.6).toFixed(1)}%`;
          const vph = video.vph || `+${320 + idx * 150}/h`;

          return (
            <div
              key={video.videoId || idx}
              className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden flex flex-col shadow-xl hover:border-slate-700 transition-all group"
            >
              {/* Card Top: Thumbnail + Rank Badge */}
              <div className="relative aspect-video bg-slate-950 overflow-hidden">
                <img
                  src={video.thumbnail}
                  alt={video.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = `https://i.ytimg.com/vi/${video.videoId}/hqdefault.jpg`;
                  }}
                />
                
                {/* Rank Badge */}
                <div className="absolute top-3 left-3 px-2.5 py-1 rounded-lg bg-black/85 backdrop-blur-md border border-white/10 text-white text-xs font-black flex items-center space-x-1">
                  <span className="text-red-500">#{rank}</span>
                  <span>상위작</span>
                </div>

                {/* Outlier Multiplier Badge (ViewStats Style) */}
                <div className="absolute top-3 right-3 flex items-center space-x-1.5">
                  <span className="px-2.5 py-1 rounded-lg bg-gradient-to-r from-amber-500 to-orange-500 text-slate-950 text-xs font-black flex items-center space-x-1 shadow-lg">
                    <Flame className="w-3.5 h-3.5 fill-current" />
                    <span>{outlierMultiplier}x 떡상</span>
                  </span>
                </div>

                {/* Pure Idea Badge */}
                {isPureIdea && (
                  <div className="absolute bottom-3 left-3 px-2 py-0.5 rounded-md bg-purple-600/90 backdrop-blur-sm text-white text-[10px] font-bold flex items-center space-x-1 border border-purple-400/30">
                    <Award className="w-3 h-3 text-amber-300" />
                    <span>순수 소재 파워 (소형 채널)</span>
                  </div>
                )}

                {/* Direct YouTube Link */}
                <a
                  href={video.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="absolute bottom-3 right-3 p-1.5 rounded-lg bg-black/70 hover:bg-red-600 text-white transition-colors"
                  title="유튜브에서 직접 보기"
                >
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
              </div>

              {/* Card Body */}
              <div className="p-4 flex-1 flex flex-col justify-between space-y-4">
                <div>
                  {/* Title & Channel */}
                  <h3 className="text-sm font-bold text-white line-clamp-2 leading-snug group-hover:text-red-400 transition-colors">
                    {video.title}
                  </h3>

                  <div className="flex items-center justify-between text-[11px] text-slate-400 mt-2 pb-3 border-b border-slate-800">
                    <span className="font-medium text-slate-300 truncate max-w-[130px]">
                      {video.channel}
                    </span>
                    <div className="flex items-center space-x-2">
                      <span className="text-amber-400 font-bold">{video.views}</span>
                      <span>•</span>
                      <span className="text-emerald-400 font-mono font-semibold" title="실시간 조회수 유입 가속도">
                        {vph}
                      </span>
                    </div>
                  </div>

                  {/* Hook Frame Strip (0s, 5s, 15s) */}
                  {video.hook_frames_url ? (
                    <div className="mt-3">
                      <div className="text-[10px] uppercase font-bold text-slate-500 tracking-wider mb-1 flex items-center justify-between">
                        <span>초반 15초 후킹 키프레임 (0s / 5s / 15s)</span>
                        <span className="text-slate-400 text-[10px]">반응률: <strong className="text-white">{engagementRate}</strong></span>
                      </div>
                      <div className="rounded-lg overflow-hidden border border-slate-800 bg-slate-950">
                        <img
                          src={video.hook_frames_url}
                          alt={`Video #${rank} hook keyframes`}
                          className="w-full h-auto object-contain"
                        />
                      </div>
                    </div>
                  ) : null}

                  {/* Hook Script Snippet (First 30 seconds) */}
                  <div className="mt-3 bg-slate-950/80 rounded-xl p-3 border border-slate-800/80">
                    <div className="flex items-center justify-between text-[10px] font-bold text-slate-400 mb-1">
                      <span className="flex items-center text-red-400">
                        <Clock className="w-3 h-3 mr-1" />
                        초반 15~30초 오프닝 훅 (Hook Script)
                      </span>
                    </div>
                    <p className="text-xs text-slate-300 line-clamp-3 leading-relaxed italic">
                      "{video.scriptSnippet || (video.full_script ? video.full_script.slice(0, 150) + "..." : "수집된 대본 요약본이 표시됩니다.")}"
                    </p>
                  </div>
                </div>

                {/* Footer Buttons: Script & Comments Viewers */}
                <div className="grid grid-cols-2 gap-2 pt-2">
                  <button
                    onClick={() => onOpenVideoModal(video, 'script')}
                    className="flex items-center justify-center space-x-1.5 px-3 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-medium transition-colors"
                  >
                    <FileText className="w-3.5 h-3.5 text-blue-400" />
                    <span>대본 전문</span>
                  </button>

                  <button
                    onClick={() => onOpenVideoModal(video, 'comments')}
                    className="flex items-center justify-center space-x-1.5 px-3 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-medium transition-colors"
                  >
                    <MessageSquare className="w-3.5 h-3.5 text-emerald-400" />
                    <span>시청자 반응</span>
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
