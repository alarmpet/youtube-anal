import React, { useState } from 'react';
import { X, FileText, MessageSquare, Copy, Check, ExternalLink } from './Icons';
import type { VideoItem } from '../types';

interface VideoDetailModalProps {
  video: VideoItem | null;
  initialTab?: 'script' | 'comments';
  onClose: () => void;
}

export const VideoDetailModal: React.FC<VideoDetailModalProps> = ({
  video,
  initialTab = 'script',
  onClose
}) => {
  const [activeTab, setActiveTab] = useState<'script' | 'comments'>(initialTab);
  const [copied, setCopied] = useState(false);

  if (!video) return null;

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fadeIn">
      <div 
        className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-3xl max-h-[85vh] flex flex-col shadow-2xl overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="px-6 py-4 bg-slate-950 border-b border-slate-800 flex items-start justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center space-x-2">
              <span className="px-2 py-0.5 rounded bg-red-600/20 text-red-400 font-bold text-xs border border-red-500/30">
                #{video.index || 1} 영상 세부 분석
              </span>
              <span className="text-xs text-slate-400">{video.channel}</span>
            </div>
            <h3 className="text-base font-bold text-white line-clamp-1">
              {video.title}
            </h3>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg bg-slate-800 text-slate-400 hover:text-white hover:bg-slate-700 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Switcher & Copy Action */}
        <div className="px-6 py-2.5 bg-slate-900 border-b border-slate-800 flex items-center justify-between">
          <div className="flex space-x-2">
            <button
              onClick={() => setActiveTab('script')}
              className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
                activeTab === 'script'
                  ? 'bg-blue-600 text-white'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800'
              }`}
            >
              <FileText className="w-3.5 h-3.5" />
              <span>타임스탬프 대본 전문</span>
            </button>

            <button
              onClick={() => setActiveTab('comments')}
              className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
                activeTab === 'comments'
                  ? 'bg-emerald-600 text-white'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800'
              }`}
            >
              <MessageSquare className="w-3.5 h-3.5" />
              <span>베스트 댓글 반응</span>
            </button>
          </div>

          <div className="flex items-center space-x-2">
            <a
              href={video.url}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center space-x-1 text-xs text-slate-400 hover:text-red-400 transition-colors"
            >
              <span>유튜브</span>
              <ExternalLink className="w-3 h-3" />
            </a>

            <button
              onClick={() => handleCopy(activeTab === 'script' ? (video.full_script || "") : (video.full_comments || ""))}
              className="flex items-center space-x-1 px-2.5 py-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs transition-colors"
            >
              {copied ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
              <span>{copied ? "복사됨" : "텍스트 복사"}</span>
            </button>
          </div>
        </div>

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto flex-1 font-mono text-xs leading-relaxed bg-slate-950">
          {activeTab === 'script' ? (
            <div className="space-y-2 text-slate-200 whitespace-pre-wrap">
              {video.full_script || (
                <div className="text-slate-500 py-8 text-center font-sans">
                  추출된 대본 전문이 없거나 요약 모드입니다.<br />
                  {video.scriptSnippet}
                </div>
              )}
            </div>
          ) : (
            <div className="space-y-3 text-slate-200 whitespace-pre-wrap">
              {video.full_comments || (
                <div className="text-slate-500 py-8 text-center font-sans">
                  수집된 댓글 목록이 없습니다.
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
