import {genkit} from 'genkit';
import {googleAI} from '@genkit-ai/googleai';

// GOOGLE_API_KEY (or GEMINI_API_KEY) is read from the environment at request
// time by the googleAI plugin. Missing keys surface as a per-request error
// instead of crashing the module at load time.
export const ai = genkit({
  plugins: [googleAI()],
});

export const textModel = 'googleai/gemini-3.6-flash';
export const ttsModel = 'googleai/gemini-3.1-flash-tts-preview';
export const ttsRequiresWavConversion = true; // Google TTS returns raw PCM data
