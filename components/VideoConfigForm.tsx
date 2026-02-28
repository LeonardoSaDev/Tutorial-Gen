
import React, { useState } from 'react';
import { GenerationConfig, AspectRatio, Resolution } from '../types';

interface VideoConfigFormProps {
  onGenerate: (config: GenerationConfig) => void;
  isDisabled: boolean;
}

export const VideoConfigForm: React.FC<VideoConfigFormProps> = ({ onGenerate, isDisabled }) => {
  const [prompt, setPrompt] = useState('');
  const [aspectRatio, setAspectRatio] = useState<AspectRatio>('16:9');
  const [resolution, setResolution] = useState<Resolution>('720p');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!prompt.trim()) return;
    onGenerate({ prompt, aspectRatio, resolution });
  };

  return (
    <form onSubmit={handleSubmit} className="bg-[#161925] p-6 rounded-2xl border border-gray-800 shadow-xl space-y-6">
      <div className="space-y-2">
        <label className="text-sm font-semibold text-gray-400 uppercase tracking-wider">Descrição do Vídeo</label>
        <textarea
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          placeholder="Ex: Uma câmera fazendo um slow pan lateral revelando um cenário futurista a partir desta imagem, estilo cinematográfico de ficção científica..."
          className="w-full h-32 bg-gray-900 border border-gray-700 rounded-xl p-4 text-white focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none transition-all resize-none"
          disabled={isDisabled}
        />
        <p className="text-[10px] text-gray-500 italic">Dica: Seja específico sobre o movimento da câmera e estilo.</p>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <label className="text-sm font-semibold text-gray-400 uppercase tracking-wider">Formato</label>
          <div className="flex bg-gray-900 p-1 rounded-lg border border-gray-700">
            {(['16:9', '9:16'] as AspectRatio[]).map((ratio) => (
              <button
                key={ratio}
                type="button"
                onClick={() => setAspectRatio(ratio)}
                disabled={isDisabled}
                className={`flex-1 py-2 rounded-md text-sm font-medium transition-all ${aspectRatio === ratio ? 'bg-purple-600 text-white shadow-lg' : 'text-gray-400 hover:text-white'}`}
              >
                {ratio === '16:9' ? 'Horizontal (16:9)' : 'Vertical (9:16)'}
              </button>
            ))}
          </div>
        </div>
        <div className="space-y-2">
          <label className="text-sm font-semibold text-gray-400 uppercase tracking-wider">Qualidade</label>
          <div className="flex bg-gray-900 p-1 rounded-lg border border-gray-700">
            {(['720p', '1080p'] as Resolution[]).map((res) => (
              <button
                key={res}
                type="button"
                onClick={() => setResolution(res)}
                disabled={isDisabled}
                className={`flex-1 py-2 rounded-md text-sm font-medium transition-all ${resolution === res ? 'bg-purple-600 text-white shadow-lg' : 'text-gray-400 hover:text-white'}`}
              >
                {res}
              </button>
            ))}
          </div>
        </div>
      </div>

      <button
        type="submit"
        disabled={isDisabled || !prompt.trim()}
        className="w-full py-4 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 disabled:opacity-50 disabled:cursor-not-allowed rounded-xl font-bold text-lg shadow-xl shadow-purple-500/20 transition-all active:scale-[0.98] flex items-center justify-center gap-2"
      >
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
        </svg>
        Gerar Vídeo Tutorial
      </button>
    </form>
  );
};
