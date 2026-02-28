
import React, { useState } from 'react';
import { Header } from './components/Header';
import { ImageUploader } from './components/ImageUploader';
import { VideoConfigForm } from './components/VideoConfigForm';
import { TutorialPlayer } from './components/TutorialPlayer';
import { GenerationOverlay } from './components/GenerationOverlay';
import { ImageData, GenerationConfig, TutorialResult } from './types';
import { generateTutorial } from './services/geminiService';

const App: React.FC = () => {
  const [images, setImages] = useState<ImageData[]>([]);
  const [isGenerating, setIsGenerating] = useState(false);
  const [statusMessage, setStatusMessage] = useState('');
  const [result, setResult] = useState<TutorialResult | null>(null);

  const handleGenerate = async (config: GenerationConfig) => {
    if (images.length === 0) {
      alert('Por favor, adicione pelo menos uma imagem.');
      return;
    }

    setIsGenerating(true);
    setResult(null);
    setStatusMessage('Analisando imagens e gerando roteiro de voz...');

    try {
      const tutorial = await generateTutorial(images, config);
      setResult(tutorial);
    } catch (error: any) {
      console.error(error);
      alert(`Erro na geração: ${error.message || 'Erro desconhecido'}`);
    } finally {
      setIsGenerating(false);
    }
  };

  const resetApp = () => {
    setResult(null);
    setImages([]);
  };

  return (
    <div className="min-h-screen bg-[#0f111a] flex flex-col">
      <Header />
      
      <main className="flex-1 container mx-auto px-4 py-8 max-w-4xl">
        <div className="grid grid-cols-1 gap-8">
          
          <section className={`${result ? 'hidden' : 'block'}`}>
            <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
              <span className="bg-purple-600 w-8 h-8 rounded-full flex items-center justify-center text-sm">1</span>
              Suas Imagens (Máx. 5)
            </h2>
            <ImageUploader onImagesChange={setImages} maxImages={5} />
          </section>

          <section className={`${result ? 'hidden' : 'block'}`}>
            <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
              <span className="bg-purple-600 w-8 h-8 rounded-full flex items-center justify-center text-sm">2</span>
              Instruções do Tutorial
            </h2>
            <VideoConfigForm onGenerate={handleGenerate} isDisabled={images.length === 0 || isGenerating} />
          </section>

          {result && (
            <section className="animate-fade-in">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold">Tutorial com Narração Ativa</h2>
                <button onClick={resetApp} className="px-4 py-2 bg-gray-800 hover:bg-gray-700 rounded-lg transition-colors text-sm">
                  Criar Outro
                </button>
              </div>
              <TutorialPlayer tutorial={result} />
            </section>
          )}
        </div>
      </main>

      {isGenerating && <GenerationOverlay message={statusMessage} />}

      <footer className="py-6 text-center text-gray-500 text-sm border-t border-gray-800 mt-8">
        Powered by Gemini Free Tier (TTS + Image + Flash)
      </footer>
    </div>
  );
};

export default App;
