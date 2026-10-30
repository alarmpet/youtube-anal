import React, { useState, useEffect } from 'react';
import { X, Key, Shield, Check, Globe } from './Icons';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const SettingsModal: React.FC<SettingsModalProps> = ({ isOpen, onClose }) => {
  const [geminiKey, setGeminiKey] = useState('');
  const [openaiKey, setOpenaiKey] = useState('');
  const [cdpPort, setCdpPort] = useState(9222);
  const [provider, setProvider] = useState('gemini');
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    if (isOpen) {
      fetch('/api/settings')
        .then((r) => r.json())
        .then((data) => {
          setGeminiKey(data.gemini_api_key || '');
          setOpenaiKey(data.openai_api_key || '');
          setCdpPort(data.cdp_port || 9222);
          setProvider(data.provider || 'gemini');
        })
        .catch(() => {});
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await fetch('/api/settings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          gemini_api_key: geminiKey,
          openai_api_key: openaiKey,
          cdp_port: Number(cdpPort),
          provider
        })
      });
      setSaved(true);
      setTimeout(() => {
        setSaved(false);
        onClose();
      }, 1000);
    } catch (e) {
      alert("설정 저장 실패");
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fadeIn">
      <div 
        className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-md p-6 shadow-2xl relative"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between pb-3 border-b border-slate-800 mb-4">
          <div className="flex items-center space-x-2">
            <Key className="w-5 h-5 text-red-500" />
            <h3 className="text-base font-bold text-white">시스템 설정 (Settings)</h3>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg bg-slate-800 text-slate-400 hover:text-white transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <form onSubmit={handleSave} className="space-y-4 text-xs">
          {/* Provider Selector */}
          <div>
            <label className="block text-slate-300 font-bold mb-1.5">
              기획안 생성 LLM 엔진:
            </label>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => setProvider('gemini')}
                className={`py-2 px-3 rounded-lg border text-center font-medium transition-colors ${
                  provider === 'gemini'
                    ? 'bg-red-600/20 border-red-500 text-red-300'
                    : 'bg-slate-950 border-slate-800 text-slate-400'
                }`}
              >
                Google Gemini API
              </button>
              <button
                type="button"
                onClick={() => setProvider('openai')}
                className={`py-2 px-3 rounded-lg border text-center font-medium transition-colors ${
                  provider === 'openai'
                    ? 'bg-red-600/20 border-red-500 text-red-300'
                    : 'bg-slate-950 border-slate-800 text-slate-400'
                }`}
              >
                OpenAI GPT-4o
              </button>
            </div>
          </div>

          {/* Gemini Key */}
          {provider === 'gemini' && (
            <div>
              <label className="block text-slate-300 font-semibold mb-1">
                Google Gemini API Key:
              </label>
              <input
                type="password"
                value={geminiKey}
                onChange={(e) => setGeminiKey(e.target.value)}
                placeholder="AIzaSy... (미입력 시 내장 AI 합성 엔진이 작동합니다)"
                className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-slate-100 placeholder-slate-600 focus:outline-none focus:border-red-500"
              />
            </div>
          )}

          {/* OpenAI Key */}
          {provider === 'openai' && (
            <div>
              <label className="block text-slate-300 font-semibold mb-1">
                OpenAI API Key:
              </label>
              <input
                type="password"
                value={openaiKey}
                onChange={(e) => setOpenaiKey(e.target.value)}
                placeholder="sk-... (미입력 시 내장 AI 합성 엔진이 작동합니다)"
                className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-slate-100 placeholder-slate-600 focus:outline-none focus:border-red-500"
              />
            </div>
          )}

          {/* CDP Port */}
          <div>
            <label className="block text-slate-300 font-semibold mb-1">
              Chrome CDP Remote Debugging Port:
            </label>
            <input
              type="number"
              value={cdpPort}
              onChange={(e) => setCdpPort(Number(e.target.value))}
              className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-slate-100 placeholder-slate-600 focus:outline-none focus:border-red-500 font-mono"
            />
            <p className="text-[11px] text-slate-500 mt-1">
              * 기본값: 9222. (크롬 실행 시 <code>--remote-debugging-port=9222</code> 옵션 연동 지원)
            </p>
          </div>

          <div className="pt-2">
            <button
              type="submit"
              className="w-full py-2.5 bg-red-600 hover:bg-red-500 text-white font-semibold rounded-xl transition-colors flex items-center justify-center space-x-1.5 shadow-lg shadow-red-600/20"
            >
              {saved ? (
                <>
                  <Check className="w-4 h-4 text-emerald-400" />
                  <span>저장 완료!</span>
                </>
              ) : (
                <span>설정 저장하기</span>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
