
import React, { useState, useEffect } from 'react';
import { ImageData } from '../types';

interface ImageUploaderProps {
  onImagesChange: (images: ImageData[]) => void;
  maxImages?: number;
}

export const ImageUploader: React.FC<ImageUploaderProps> = ({ onImagesChange, maxImages = 5 }) => {
  const [images, setImages] = useState<ImageData[]>([]);
  const [previews, setPreviews] = useState<string[]>([]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;

    const fileArray = Array.from(files);
    const remainingSlots = maxImages - images.length;
    const filesToProcess = fileArray.slice(0, remainingSlots);

    if (filesToProcess.length === 0 && fileArray.length > 0) {
      alert(`Limite de ${maxImages} imagens atingido.`);
      return;
    }

    filesToProcess.forEach(file => {
      const reader = new FileReader();
      reader.onloadend = () => {
        const result = reader.result as string;
        const base64String = result.split(',')[1];
        
        const newImageData: ImageData = {
          base64: base64String,
          mimeType: file.type,
          name: file.name
        };

        setImages(prev => {
          const updated = [...prev, newImageData];
          return updated;
        });
        setPreviews(prev => [...prev, result]);
      };
      reader.readAsDataURL(file);
    });
  };

  const removeImage = (index: number) => {
    setImages(prev => {
      const updated = prev.filter((_, i) => i !== index);
      return updated;
    });
    setPreviews(prev => prev.filter((_, i) => i !== index));
  };

  useEffect(() => {
    onImagesChange(images);
  }, [images, onImagesChange]);

  return (
    <div className="w-full space-y-4">
      <div className={`relative border-2 border-dashed border-gray-700 rounded-2xl transition-all hover:border-purple-500/50 hover:bg-purple-500/5 ${previews.length === 0 ? 'py-12 px-6' : 'p-4'}`}>
        <input
          type="file"
          accept="image/*"
          multiple
          onChange={handleFileChange}
          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
          disabled={images.length >= maxImages}
        />
        
        {previews.length === 0 ? (
          <div className="flex flex-col items-center justify-center text-center">
            <div className="w-16 h-16 bg-gray-800 rounded-full flex items-center justify-center mb-4">
              <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            </div>
            <p className="text-gray-300 font-medium">Clique ou arraste para enviar imagens (Máx. {maxImages})</p>
            <p className="text-gray-500 text-sm mt-1">A primeira imagem será a base do vídeo</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3">
            {previews.map((src, i) => (
              <div key={i} className="relative aspect-square rounded-xl overflow-hidden shadow-xl border border-gray-700 group">
                <img src={src} alt={`Preview ${i}`} className="w-full h-full object-cover" />
                <div className={`absolute top-0 left-0 w-full p-1 text-[8px] font-bold uppercase text-center ${i === 0 ? 'bg-purple-600/90' : 'bg-black/60'}`}>
                  {i === 0 ? 'Base do Vídeo' : `Referência ${i}`}
                </div>
                <button
                  onClick={(e) => {
                    e.preventDefault();
                    removeImage(i);
                  }}
                  className="absolute bottom-1 right-1 bg-red-600/80 hover:bg-red-600 p-1.5 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity z-20"
                >
                  <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                  </svg>
                </button>
              </div>
            ))}
            {images.length < maxImages && (
              <div className="relative aspect-square rounded-xl border-2 border-dashed border-gray-700 flex items-center justify-center hover:border-purple-500/50 transition-colors">
                <svg className="w-6 h-6 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
              </div>
            )}
          </div>
        )}
      </div>
      {images.length > 0 && (
        <div className="flex justify-between items-center px-1">
          <p className="text-xs text-gray-500">{images.length} de {maxImages} imagens selecionadas</p>
          <button 
            onClick={() => { setImages([]); setPreviews([]); }}
            className="text-xs text-red-400 hover:text-red-300 font-medium transition-colors"
          >
            Limpar tudo
          </button>
        </div>
      )}
    </div>
  );
};
