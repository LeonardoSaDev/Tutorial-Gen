<div align="center">
  <h1>TutorialGen AI</h1>
  <p>Gere vídeos tutoriais com narração a partir de imagens, usando Google Gemini.</p>
</div>

## Visão Geral
- Envie até 5 imagens e descreva o vídeo desejado.
- O app planeja um tutorial de até 4 passos, gera uma imagem para cada passo, sintetiza voz e apresenta tudo em um player interativo.
- Construído com React + Vite + TypeScript, Tailwind via CDN e SDK @google/genai.

## Tecnologias
- React 19, Vite 6, TypeScript
- Tailwind CSS via CDN
- Google Gemini (@google/genai)
  - Planejamento: gemini-3-flash-preview
  - Imagem: gemini-2.5-flash-image
  - Voz (TTS): gemini-2.5-flash-preview-tts

## Pré-requisitos
- Node.js instalado
- Chave de API do Google Gemini

## Configuração da Chave
O projeto injeta a chave de API em tempo de build via Vite (define). Crie um arquivo `.env.local` na raiz do projeto com:

```
GEMINI_API_KEY=SEU_TOKEN_AQUI
```

Obs.: Em produção, recomenda-se usar um backend/proxy para não expor a chave no cliente.

## Executar Localmente
1. Instalar dependências:
   ```
   npm install
   ```
2. Definir a chave `GEMINI_API_KEY` em `.env.local`:
   ```
   GEMINI_API_KEY=SEU_TOKEN_AQUI
   ```
3. Rodar o servidor de desenvolvimento:
   ```
   npm run dev
   ```
4. Acesse em: http://localhost:3000

## Scripts
- `npm run dev` — desenvolvimento
- `npm run build` — build de produção
- `npm run preview` — pré-visualização do build

## Como Usar
1. Na seção “Suas Imagens”, envie até 5 imagens (a primeira é a base do vídeo).
2. Em “Instruções do Tutorial”, escreva o prompt, escolha formato (16:9 ou 9:16) e qualidade (720p ou 1080p).
3. Clique em “Gerar Vídeo Tutorial”.
4. No player:
   - Play/Pause sobre o vídeo
   - Clique nas miniaturas para pular entre passos
   - “Reiniciar Tudo” volta ao primeiro passo

## Principais Arquivos
- App: [App.tsx](file:///c:/AppServ/www/tutorialGen/Tutorial%20Gen/App.tsx)
- Serviço de IA: [geminiService.ts](file:///c:/AppServ/www/tutorialGen/Tutorial%20Gen/services/geminiService.ts)
- Componentes:
  - Uploader: [ImageUploader.tsx](file:///c:/AppServ/www/tutorialGen/Tutorial%20Gen/components/ImageUploader.tsx)
  - Formulário: [VideoConfigForm.tsx](file:///c:/AppServ/www/tutorialGen/Tutorial%20Gen/components/VideoConfigForm.tsx)
  - Player: [TutorialPlayer.tsx](file:///c:/AppServ/www/tutorialGen/Tutorial%20Gen/components/TutorialPlayer.tsx)
  - Overlay: [GenerationOverlay.tsx](file:///c:/AppServ/www/tutorialGen/Tutorial%20Gen/components/GenerationOverlay.tsx)

## Detalhes de Implementação
- A chave é lida em tempo de build pelo Vite: veja [vite.config.ts](file:///c:/AppServ/www/tutorialGen/Tutorial%20Gen/vite.config.ts).
- O serviço de geração usa `@google/genai` e compõe três etapas:
  - Planejamento em JSON dos passos com base nas imagens e no prompt.
  - Geração de imagem por passo com razão de aspecto definida.
  - TTS com voz predefinida, retornando áudio PCM em base64.
- Decodificação de áudio PCM e reprodução são feitas no navegador via Web Audio API.

## Limitações e Avisos
- Dependendo da sua cota e plano, chamadas aos modelos Gemini podem ter latência.
- O TTS retorna áudio bruto (PCM 24kHz); a reprodução é gerenciada diretamente no cliente.
- Para produção, proteja sua chave usando um backend e aplique políticas de segurança.
