
import React from 'react';

export const Header: React.FC = () => {
  return (
    <header className="py-8 px-6 border-b border-gray-800 bg-[#161925]">
      <div className="container mx-auto flex flex-col md:flex-row justify-between items-center gap-4">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 bg-gradient-to-tr from-purple-600 to-pink-500 rounded-xl flex items-center justify-center shadow-lg shadow-purple-500/20">
            <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
            </svg>
          </div>
          <div>
            <h1 className="text-2xl font-bold tracking-tight">TutorialGen <span className="text-purple-500">AI</span></h1>
            <p className="text-xs text-gray-400 font-medium">Crie vídeos cinematográficos em segundos</p>
          </div>
        </div>
        <div className="flex gap-4">
          <div className="px-3 py-1 rounded-full bg-purple-900/30 border border-purple-500/30 text-[10px] text-purple-300 font-bold uppercase tracking-wider">
            Gemini Veo Enabled
          </div>
        </div>
      </div>
    </header>
  );
};
