
import React from 'react';

interface GenerationOverlayProps {
  message: string;
}

export const GenerationOverlay: React.FC<GenerationOverlayProps> = ({ message }) => {
  return (
    <div className="fixed inset-0 z-50 bg-[#0f111a]/95 backdrop-blur-md flex flex-col items-center justify-center p-8 text-center">
      <div className="relative w-24 h-24 mb-8">
        <div className="absolute inset-0 border-4 border-purple-500/20 rounded-full"></div>
        <div className="absolute inset-0 border-4 border-t-purple-500 rounded-full animate-spin"></div>
        <div className="absolute inset-4 bg-gradient-to-tr from-purple-600 to-pink-500 rounded-full animate-pulse"></div>
      </div>
      
      <h2 className="text-3xl font-bold text-white mb-2">A Mágica está acontecendo...</h2>
      <p className="text-purple-400 font-medium text-lg animate-pulse">{message}</p>
      
      <div className="mt-12 max-w-md">
        <div className="h-1.5 w-64 bg-gray-800 rounded-full overflow-hidden mx-auto mb-4">
          <div className="h-full bg-gradient-to-r from-purple-600 to-pink-500 animate-[loading_20s_linear_infinite]"></div>
        </div>
        <p className="text-gray-500 text-sm">
          A geração de vídeo por IA é um processo complexo e pode levar alguns minutos. <br/>Não feche esta aba.
        </p>
      </div>

      <style>{`
        @keyframes loading {
          0% { width: 0%; }
          100% { width: 100%; }
        }
      `}</style>
    </div>
  );
};
