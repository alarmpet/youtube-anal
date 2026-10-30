import React, { useState, useEffect, useRef } from 'react';
import { Header } from './components/Header';
import { ScoutLiveView } from './components/ScoutLiveView';
import { ReferenceBoard } from './components/ReferenceBoard';
import { ScriptDeconstructor } from './components/ScriptDeconstructor';
import { ChannelDoctor } from './components/ChannelDoctor';
import { VideoDetailModal } from './components/VideoDetailModal';
import { SettingsModal } from './components/SettingsModal';
import type { 
  ScoutStatus, LogMessage, ProjectData, ProjectSummary, VideoItem 
} from './types';

export function App() {
  const [activeTab, setActiveTab] = useState<string>('scout');
  const [activeKeyword, setActiveKeyword] = useState<string>('');
  const [projects, setProjects] = useState<ProjectSummary[]>([]);
  const [currentProject, setCurrentProject] = useState<ProjectData | null>(null);
  
  const [scoutStatus, setScoutStatus] = useState<ScoutStatus>({
    is_running: false,
    keyword: '',
    stage: 'idle',
    progress: 0,
    message: '대기 중입니다.',
    current_video: 0,
    total_videos: 0,
    latest_screen: null
  });

  const [logs, setLogs] = useState<LogMessage[]>([]);
  const [currentScreenUrl, setCurrentScreenUrl] = useState<string | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState<boolean>(false);

  // Modal States
  const [selectedVideo, setSelectedVideo] = useState<VideoItem | null>(null);
  const [videoModalTab, setVideoModalTab] = useState<'script' | 'comments'>('script');
  const [isSettingsOpen, setIsSettingsOpen] = useState<boolean>(false);

  const wsRef = useRef<WebSocket | null>(null);

  // Fetch Projects List
  const fetchProjects = async () => {
    try {
      const resp = await fetch('/api/projects');
      if (resp.ok) {
        const data = await resp.json();
        setProjects(data.projects || []);
        if (!activeKeyword && data.projects?.length > 0) {
          loadProjectDetails(data.projects[0].keyword);
        }
      }
    } catch (e) {
      console.warn("Failed to fetch projects list:", e);
    }
  };

  // Load specific project details
  const loadProjectDetails = async (keyword: string) => {
    try {
      const resp = await fetch(`/api/projects/${encodeURIComponent(keyword)}`);
      if (resp.ok) {
        const data: ProjectData = await resp.json();
        setCurrentProject(data);
        setActiveKeyword(keyword);
        if (data.serp_image_url) {
          setCurrentScreenUrl(data.serp_image_url);
        }
      }
    } catch (e) {
      console.warn("Failed to load project details:", e);
    }
  };

  useEffect(() => {
    fetchProjects();
  }, []);

  // Setup WebSocket connection
  useEffect(() => {
    const protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
    const wsUrl = `${protocol}//${window.location.host}/ws`;

    let ws: WebSocket;
    let reconnectTimer: any;

    const connectWs = () => {
      ws = new WebSocket(wsUrl);
      wsRef.current = ws;

      ws.onopen = () => {
        console.log("Connected to Scout Server WebSocket");
      };

      ws.onmessage = (event) => {
        try {
          const msg = JSON.parse(event.data);
          if (msg.type === 'log') {
            setLogs((prev) => [
              ...prev,
              {
                id: Math.random().toString(36).substring(2, 9),
                timestamp: msg.timestamp || new Date().toISOString(),
                level: msg.level || 'info',
                message: msg.message || '',
                step: msg.step
              }
            ]);
          } else if (msg.type === 'screen') {
            if (msg.screen_url) {
              setCurrentScreenUrl(msg.screen_url);
            }
          } else if (msg.type === 'status') {
            setScoutStatus((prev) => ({
              ...prev,
              ...msg
            }));
          } else if (msg.type === 'complete') {
            fetchProjects();
            if (msg.targetDir) {
              const kw = msg.targetDir.split(/[\\/]/).pop();
              if (kw) loadProjectDetails(kw);
            }
          } else if (msg.type === 'analysis_complete') {
            if (msg.keyword === activeKeyword && msg.plan) {
              setCurrentProject((prev) => prev ? { ...prev, result_plan: msg.plan } : prev);
            }
          }
        } catch (e) {
          console.error("Error parsing WebSocket message:", e);
        }
      };

      ws.onclose = () => {
        console.log("WebSocket disconnected. Reconnecting in 3s...");
        reconnectTimer = setTimeout(connectWs, 3000);
      };

      ws.onerror = (err) => {
        console.warn("WebSocket error:", err);
        ws.close();
      };
    };

    connectWs();

    return () => {
      if (ws) ws.close();
      if (reconnectTimer) clearTimeout(reconnectTimer);
    };
  }, [activeKeyword]);

  // Actions
  const handleStartScout = async (keyword: string, maxVideos: number, filters: any, useCdp: boolean) => {
    setLogs([]);
    setActiveKeyword(keyword);
    setScoutStatus((prev) => ({
      ...prev,
      is_running: true,
      keyword,
      stage: 'starting',
      progress: 5,
      message: `'${keyword}' 스카우트 에이전트 시작 중...`
    }));

    try {
      const resp = await fetch('/api/scout/start', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          keyword,
          max_videos: maxVideos,
          filter_options: filters,
          use_cdp: useCdp
        })
      });

      if (!resp.ok) {
        const err = await resp.json();
        alert(err.detail || "스카우트 시작에 실패했습니다.");
        setScoutStatus((prev) => ({ ...prev, is_running: false }));
      }
    } catch (e) {
      alert("서버 연결 실패. 백엔드가 실행 중인지 확인해 주세요.");
      setScoutStatus((prev) => ({ ...prev, is_running: false }));
    }
  };

  const handleAbortScout = async () => {
    try {
      await fetch('/api/scout/abort', { method: 'POST' });
    } catch (e) {
      console.error(e);
    }
  };

  const handleAnalyze = async (keyword: string, formatType: 'shorts' | 'longform' = 'shorts') => {
    setIsAnalyzing(true);
    try {
      const resp = await fetch('/api/analyze/start', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ keyword, format_type: formatType })
      });
      if (resp.ok) {
        const data = await resp.json();
        if (data.plan) {
          setCurrentProject((prev) => prev ? { ...prev, result_plan: data.plan } : prev);
        }
      } else {
        const err = await resp.json();
        alert(err.detail || "분석 생성 실패");
      }
    } catch (e) {
      alert("서버 통신 오류");
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleOpenVideoModal = (video: VideoItem, initialTab: 'script' | 'comments') => {
    setSelectedVideo(video);
    setVideoModalTab(initialTab);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans">
      {/* Header */}
      <Header
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        activeKeyword={activeKeyword}
        projects={projects}
        onSelectProject={(kw) => loadProjectDetails(kw)}
        onOpenSettings={() => setIsSettingsOpen(true)}
        isScouting={scoutStatus.is_running}
      />

      {/* Main Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {activeTab === 'scout' && (
          <ScoutLiveView
            status={scoutStatus}
            logs={logs}
            currentScreenUrl={currentScreenUrl}
            onStartScout={handleStartScout}
            onAbortScout={handleAbortScout}
            currentProject={currentProject}
            onGoToBoard={() => setActiveTab('reference')}
          />
        )}

        {activeTab === 'reference' && (
          <ReferenceBoard
            project={currentProject}
            onOpenVideoModal={handleOpenVideoModal}
            onGoToRemix={() => setActiveTab('remix')}
          />
        )}

        {activeTab === 'remix' && (
          <ScriptDeconstructor
            project={currentProject}
            onAnalyze={handleAnalyze}
            isAnalyzing={isAnalyzing}
          />
        )}

        {activeTab === 'doctor' && (
          <ChannelDoctor />
        )}
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-900 bg-slate-950/80 py-4 text-center text-xs text-slate-500">
        Ego-Browser 기반 유튜브 경쟁작 해부 &amp; 기획 스튜디오 • FastAPI + React + Multimodal LLM
      </footer>

      {/* Modals */}
      <VideoDetailModal
        video={selectedVideo}
        initialTab={videoModalTab}
        onClose={() => setSelectedVideo(null)}
      />

      <SettingsModal
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
      />
    </div>
  );
}

export default App;
