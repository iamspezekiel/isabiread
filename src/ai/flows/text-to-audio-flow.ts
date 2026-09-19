
'use server';
/**
 * @fileOverview Converts a text string to high-quality audio using an AI TTS service.
 *
 * - textToAudio - A function that handles the text to audio conversion process.
 * - TextToAudioInput - The input type for the textToAudio function.
 * - TextToAudioOutput - The return type for the textToAudio function.
 */

import {ai, ttsModel, ttsRequiresWavConversion} from '@/ai/genkit';
import {z} from 'genkit';
import wav from 'wav';

const TextToAudioInputSchema = z.object({
  text: z.string().describe('The text to be converted to audio.'),
  voice: z.string().describe('The selected voice for the text-to-speech conversion.'),
});
export type TextToAudioInput = z.infer<typeof TextToAudioInputSchema>;

const TextToAudioOutputSchema = z.object({
  audioDataUri: z.string().describe('The converted audio data as a data URI.'),
});
export type TextToAudioOutput = z.infer<typeof TextToAudioOutputSchema>;

export async function textToAudio(input: TextToAudioInput): Promise<TextToAudioOutput> {
  return textToAudioFlow(input);
}

async function toWav(
  pcmData: Buffer,
  channels = 1,
  sampleRate = 24000
): Promise<string> {
  return new Promise((resolve, reject) => {
    const writer = new wav.Writer({
      channels: channels,
      sampleRate: sampleRate,
      bitDepth: 16,
    });

    const chunks: Buffer[] = [];
    writer.on('data', (chunk) => {
      chunks.push(chunk);
    });
    writer.on('end', () => {
      resolve(Buffer.concat(chunks).toString('base64'));
    });
    writer.on('error', (err) => {
      reject(err);
    });
    
    writer.write(pcmData);
    writer.end();
  });
}

const textToAudioFlow = ai.defineFlow(
  {
    name: 'textToAudioFlow',
    inputSchema: TextToAudioInputSchema,
    outputSchema: TextToAudioOutputSchema,
  },
  async input => {
    let { text, voice } = input;

    if (!text || text.trim().length === 0) {
      throw new Error("The provided text is empty.");
    }
    
    // The TTS model has a limit of around 5000 characters.
    if (text.length > 5000) {
      text = text.substring(0, 5000);
    }
    
    const generateConfig: any = {
      model: ttsModel,
      prompt: text,
      config: {
        responseModalities: ['AUDIO'],
      },
    };
    
    if (ttsRequiresWavConversion) {
      // Google-specific speech configuration
      generateConfig.config.speechConfig = {
        voiceConfig: {
          prebuiltVoiceConfig: { voiceName: voice || 'Algenib' },
        },
      };
    } else {
      // OpenAI-specific speech configuration
      generateConfig.config.voice = voice || 'alloy';
    }

    const { media } = await ai.generate(generateConfig);
    
    if (!media) {
      throw new Error('no media returned');
    }
    
    let audioDataUri: string;

    if (ttsRequiresWavConversion) {
      // Google returns raw PCM data that needs to be converted to a WAV data URI
      const audioBuffer = Buffer.from(
        media.url.substring(media.url.indexOf(',') + 1),
        'base64'
      );
      audioDataUri = 'data:audio/wav;base64,' + (await toWav(audioBuffer));
    } else {
      // OpenAI returns a complete audio file data URI
      audioDataUri = media.url;
    }

    return {
      audioDataUri: audioDataUri,
    };
  }
);
