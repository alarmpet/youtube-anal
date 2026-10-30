import React from 'react';
import { Compass, LayoutGrid, FileText, Activity, Settings, Play, CheckCircle2, AlertCircle } from './Icons';
import type { ProjectSummary } from '../types';

interface HeaderProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  activeKeyword: string;
  projects: ProjectSummary[];
  onSelectProject: (keyword: string) => void;
  onOpenSettings: () => void;
  isScouting: boolean;
}

export const Header: React.FC<HeaderProps> = ({
  activeTab,
  setActiveTab,
  activeKeyword,
  projects,
  onSelectProject,
  onOpenSettings,
  isScouting
}) => {
  return (
    <header className="bg-slate-900 border-b border-slate-800 sticky top-0 z-40 backdrop-blur-md bg-opacity-95">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo & App Title */}
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-red-600 via-rose-500 to-amber-500 flex items-center justify-center shadow-lg shadow-red-500/20">
              <svg className="w-5 h-5 text-white fill-current" viewBox="0 0 24 24">
                <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.5 12 3.5 12 3.5s-7.505 0-9.377.55a3.016 3.016 0 0 0-2.122 2.136C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.55 9.376.55 9.376.55s7.505 0 9.377-.55a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
              </svg>
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <span className="text-lg font-black tracking-tight text-white">EGO SCOUT</span>
                <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-red-500/20 text-red-400 border border-red-500/30">
                  AI STUDIO
                </span>
                {isScouting && (
                  <span className="flex items-center text-xs font-medium text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded-full border border-amber-500/30 animate-pulse">
                    <span className="w-1.5 h-1.5 rounded-full bg-amber-400 mr-1.5 animate-ping" />
                    Agent Active
                  </span>
                )}
              </div>
              <p className="text-xs text-slate-400 hidden sm:block">
                Ego-Browser 유튜브 경쟁작 해부 &amp; 필승 기획 스튜디오
              </p>
            </div>
          </div>

          {/* Navigation Tabs */}
          <nav className="flex space-x-1 sm:space-x-2 bg-slate-950/60 p-1 rounded-xl border border-slate-800">
            <button
              onClick={() => setActiveTab('scout')}
              className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs sm:text-sm font-medium transition-all ${
                activeTab === 'scout'
                  ? 'bg-red-600 text-white shadow-md shadow-red-600/30'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
              }`}
            >
              <Compass className="w-4 h-4" />
              <span>1. 스카우터 &amp; 라이브</span>
            </button>

            <button
              onClick={() => setActiveTab('reference')}
              className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs sm:text-sm font-medium transition-all ${
                activeTab === 'reference'
                  ? 'bg-red-600 text-white shadow-md shadow-red-600/30'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
              }`}
            >
              <LayoutGrid className="w-4 h-4" />
              <span>2. 경쟁작 보드</span>
            </button>

            <button
              onClick={() => setActiveTab('remix')}
              className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs sm:text-sm font-medium transition-all ${
                activeTab === 'remix'
                  ? 'bg-red-600 text-white shadow-md shadow-red-600/30'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
              }`}
            >
              <FileText className="w-4 h-4" />
              <span>3. 기획 리믹스</span>
            </button>

            <button
              onClick={() => setActiveTab('doctor')}
              className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs sm:text-sm font-medium transition-all ${
                activeTab === 'doctor'
                  ? 'bg-red-600 text-white shadow-md shadow-red-600/30'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
              }`}
            >
              <Activity className="w-4 h-4" />
              <span>4. 채널 닥터</span>
            </button>
          </nav>

          {/* Project History Switcher & Settings */}
          <div className="flex items-center space-x-3">
            {projects.length > 0 && (
              <div className="relative hidden md:block">
                <select
                  value={activeKeyword}
                  onChange={(e) => onSelectProject(e.target.value)}
                  className="bg-slate-800 text-slate-200 text-xs rounded-lg px-2.5 py-1.5 border border-slate-700 focus:outline-none focus:border-red-500 max-w-[150px] truncate"
                >
                  <option value="" disabled>분석 보관함</option>
                  {projects.map((p) => (
                    <option key={p.keyword} value={p.keyword}>
                      📁 {p.keyword} ({p.video_count}편)
                    </option>
                  ))}
                </select>
              </div>
            )}

            <button
              onClick={onOpenSettings}
              className="p-2 rounded-lg bg-slate-800 text-slate-300 hover:text-white hover:bg-slate-700 transition-colors border border-slate-700"
              title="설정 (API Key & CDP)"
            >
              <Settings className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};
