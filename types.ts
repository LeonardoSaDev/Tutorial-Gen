
export interface ImageData {
  base64: string;
  mimeType: string;
  name: string;
}

export interface TutorialStep {
  title: string;
  description: string;
  imageBase64?: string;
  audioBase64?: string; // Áudio em base64 (PCM)
}

export interface TutorialResult {
  steps: TutorialStep[];
  mainPrompt: string;
}

export type AspectRatio = '16:9' | '9:16';
export type Resolution = '720p' | '1080p';

export interface GenerationConfig {
  aspectRatio: AspectRatio;
  prompt: string;
  resolution: Resolution;
}

export interface VideoResult {
  url: string;
  prompt: string;
}
