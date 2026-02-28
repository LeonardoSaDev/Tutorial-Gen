
import React, { useState, useEffect, useRef } from 'react';
import { TutorialResult } from '../types';

interface TutorialPlayerProps {
  tutorial: TutorialResult;
}

// Utilitários de áudio para PCM 16-bit 24kHz
function decodeBase64(base64: string) {
  const binaryString = atob(base64);
  const bytes = new Uint8Array(binaryString.length);
  for (let i = 0; i < binaryString.length; i++) {
    bytes[i] = binaryString.charCodeAt(i);
  }
  return bytes;
}

async function decodeAudioData(data: Uint8Array, ctx: AudioContext): Promise<AudioBuffer> {
  const dataInt16 = new Int16Array(data.buffer);
  const buffer = ctx.createBuffer(1, dataInt16.length, 24000);
  const channelData = buffer.getChannelData(0);
  for (let i = 0; i < dataInt16.length; i++) {
    channelData[i] = dataInt16[i] / 32768.0;
  }
  return buffer;
}

export const TutorialPlayer: React.FC<TutorialPlayerProps> = ({ tutorial }) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const audioContextRef = useRef<AudioContext | null>(null);
  const currentSourceRef = useRef<AudioBufferSourceNode | null>(null);
  const [progress, setProgress] = useState(0);

  const playStepAudio = async (index: number) => {
    if (!tutorial.steps[index].audioBase64) return;

    if (!audioContextRef.current) {
      audioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)();
    }

    if (currentSourceRef.current) {
      currentSourceRef.current.stop();
    }

    const audioBytes = decodeBase64(tutorial.steps[index].audioBase64!);
    const buffer = await decodeAudioData(audioBytes, audioContextRef.current);
    
    const source = audioContextRef.current.createBufferSource();
    source.buffer = buffer;
    source.connect(audioContextRef.current.destination);
    
    source.onended = () => {
      if (index < tutorial.steps.length - 1) {
        setCurrentStep(index + 1);
      } else {
        setIsPlaying(false);
      }
    };

    source.start(0);
    currentSourceRef.current = source;
  };

  useEffect(() => {
    if (isPlaying) {
      playStepAudio(currentStep);
    } else {
      if (currentSourceRef.current) {
        currentSourceRef.current.stop();
      }
    }
    return () => currentSourceRef.current?.stop();
  }, [currentStep, isPlaying]);

  const handleToggle = () => {
    if (!isPlaying && audioContextRef.current?.state === 'suspended') {
      audioContextRef.current.resume();
    }
    setIsPlaying(!isPlaying);
  };

  return (
    <div className="bg-[#161925] rounded-3xl overflow-hidden border border-gray-800 shadow-2xl">
      <div className="relative aspect-video bg-black overflow-hidden group">
        {tutorial.steps.map((step, index) => (
          <div 
            key={index}
            className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${index === currentStep ? 'opacity-100' : 'opacity-0'}`}
          >
            {step.imageBase64 && (
              <img src={step.imageBase64} alt={step.title} className="w-full h-full object-cover" />
            )}
            <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent" />
            
            <div className="absolute bottom-12 left-8 right-8 animate-fade-up">
              <span className="bg-purple-600 text-[10px] font-bold px-2 py-1 rounded mb-3 inline-block uppercase tracking-widest flex items-center gap-2 w-fit">
                <svg className="w-3 h-3 animate-pulse" fill="currentColor" viewBox="0 0 24 24"><path d="M12 14c1.66 0 3-1.34 3-3V5c0-1.66-1.34-3-3-3S9 3.34 9 5v6c0 1.66 1.34 3 3 3z"/></svg>
                Narração Ativa - Passo {index + 1}
              </span>
              <h3 className="text-4xl font-extrabold mb-3 tracking-tight">{step.title}</h3>
              <p className="text-gray-300 text-xl max-w-2xl leading-relaxed font-medium">{step.description}</p>
            </div>
          </div>
        ))}

        {/* Playback Control */}
        <div className="absolute inset-0 flex items-center justify-center bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity">
          <button 
            onClick={handleToggle}
            className="w-24 h-24 bg-purple-600/90 backdrop-blur-md rounded-full flex items-center justify-center hover:bg-purple-500 transition-all transform hover:scale-110 shadow-2xl"
          >
            {isPlaying ? (
              <svg className="w-10 h-10 text-white" fill="currentColor" viewBox="0 0 24 24"><path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z"/></svg>
            ) : (
              <svg className="w-10 h-10 text-white ml-2" fill="currentColor" viewBox="0 0 24 24"><path d="M8 5v14l11-7z"/></svg>
            )}
          </button>
        </div>

        {/* Step Indicator */}
        <div className="absolute top-6 right-6 flex gap-1">
          {tutorial.steps.map((_, index) => (
            <div 
              key={index} 
              className={`h-1.5 w-8 rounded-full transition-all duration-500 ${index === currentStep ? 'bg-purple-500 w-12' : 'bg-white/20'}`}
            />
          ))}
        </div>
      </div>

      <div className="p-6 bg-gray-900/50 flex justify-between items-center border-t border-gray-800">
        <div className="flex items-center gap-4">
          <div className="flex -space-x-2">
            {tutorial.steps.map((step, i) => (
              <div 
                key={i} 
                onClick={() => { setCurrentStep(i); setIsPlaying(true); }}
                className={`w-10 h-10 rounded-lg border-2 overflow-hidden cursor-pointer transition-all ${i === currentStep ? 'border-purple-500 scale-110 z-10' : 'border-gray-700 opacity-50'}`}
              >
                <img src={step.imageBase64} className="w-full h-full object-cover" />
              </div>
            ))}
          </div>
          <p className="text-sm font-bold text-gray-400">Clique na miniatura para pular</p>
        </div>
        
        <button 
          onClick={() => { setCurrentStep(0); setIsPlaying(true); }}
          className="px-6 py-2 bg-gray-800 hover:bg-gray-700 rounded-full text-xs font-bold transition-all uppercase tracking-widest"
        >
          Reiniciar Tudo
        </button>
      </div>
    </div>
  );
};
