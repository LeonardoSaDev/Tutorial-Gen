
import { GoogleGenAI, Type, Modality } from "@google/genai";
import { ImageData, GenerationConfig, TutorialStep, TutorialResult } from "../types";

export const generateTutorial = async (
  images: ImageData[],
  config: GenerationConfig
): Promise<TutorialResult> => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

  // 1. Planejar o tutorial com base em TODAS as imagens enviadas
  const imageParts = images.map(img => ({
    inlineData: { data: img.base64, mimeType: img.mimeType }
  }));

  const plannerResponse = await ai.models.generateContent({
    model: "gemini-3-flash-preview",
    contents: {
      parts: [
        ...imageParts,
        { text: `Analise estas ${images.length} imagens e crie um tutorial de até 4 passos baseado nesta solicitação: "${config.prompt}". 
                 Para cada passo, forneça um título e uma narração em texto. 
                 Responda apenas em JSON.` }
      ]
    },
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          steps: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                title: { type: Type.STRING },
                narration: { type: Type.STRING, description: "Texto que será lido pela voz da IA" }
              },
              required: ["title", "narration"]
            }
          }
        },
        required: ["steps"]
      }
    }
  });

  const tutorialPlan = JSON.parse(plannerResponse.text);
  const planSteps = tutorialPlan.steps;

  // 2. Gerar Visual e Áudio para cada passo
  const generatedSteps = await Promise.all(planSteps.map(async (step: any, index: number) => {
    try {
      // Usamos a imagem correspondente ao índice ou a primeira como base
      const baseImg = images[index % images.length];

      // Geração de Imagem Editada/Contextualizada
      const imageGenPromise = ai.models.generateContent({
        model: "gemini-2.5-flash-image",
        contents: {
          parts: [
            { inlineData: { data: baseImg.base64, mimeType: baseImg.mimeType } },
            { text: `Modifique ou adapte esta imagem para ilustrar o passo: ${step.title}. Proporção ${config.aspectRatio}.` }
          ]
        },
        config: { imageConfig: { aspectRatio: config.aspectRatio } }
      });

      // Geração de Voz (TTS)
      const voiceGenPromise = ai.models.generateContent({
        model: "gemini-2.5-flash-preview-tts",
        contents: [{ parts: [{ text: `Diga de forma instrutiva: ${step.narration}` }] }],
        config: {
          responseModalities: [Modality.AUDIO],
          speechConfig: {
            voiceConfig: { prebuiltVoiceConfig: { voiceName: 'Kore' } }
          }
        }
      });

      const [imgRes, voiceRes] = await Promise.all([imageGenPromise, voiceGenPromise]);

      let imageBase64 = `data:image/png;base64,${baseImg.base64}`;
      for (const part of imgRes.candidates[0].content.parts) {
        if (part.inlineData) imageBase64 = `data:image/png;base64,${part.inlineData.data}`;
      }

      const audioBase64 = voiceRes.candidates?.[0]?.content?.parts?.[0]?.inlineData?.data;

      return {
        title: step.title,
        description: step.narration,
        imageBase64,
        audioBase64
      };
    } catch (e) {
      console.error(`Erro no passo ${index}:`, e);
      return {
        title: step.title,
        description: step.narration,
        imageBase64: `data:image/png;base64,${images[0].base64}`
      };
    }
  }));

  return {
    steps: generatedSteps,
    mainPrompt: config.prompt
  };
};
