
import React from 'react';
import { VideoResult } from '../types';

interface VideoPreviewProps {
  video: VideoResult;
}

export const VideoPreview: React.FC<VideoPreviewProps> = ({ video }) => {
  return (
    <div className="bg-[#161925] rounded-3xl overflow-hidden border border-gray-800 shadow-2xl">
      <div className="aspect-video bg-black relative flex items-center justify-center">
        <video 
          src={video.url} 
          controls 
          autoPlay 
          loop
          className="w-full h-full object-contain"
        />
      </div>
      <div className="p-6">
        <h3 className="text-gray-400 text-xs font-bold uppercase tracking-widest mb-2">Prompt Utilizado</h3>
        <p className="text-white text-lg leading-relaxed italic">"{video.prompt}"</p>
        
        <div className="mt-6 flex flex-wrap gap-4">
          <a 
            href={video.url} 
            download="tutorial-ai.mp4"
            className="flex-1 min-w-[200px] bg-purple-600 hover:bg-purple-500 text-white py-3 px-6 rounded-xl font-bold text-center transition-all flex items-center justify-center gap-2"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
            </svg>
            Baixar Tutorial MP4
          </a>
        </div>
      </div>
    </div>
  );
};
