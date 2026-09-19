
'use server';
/**
 * @fileOverview Converts a PDF file to high-quality audio using an AI TTS service.
 *
 * - pdfToAudio - A function that handles the PDF to audio conversion process.
 * - PdfToAudioInput - The input type for the pdfToAudio function.
 * - PdfToAudioOutput - The return type for the pdfToAudio function.
 */

import {ai, ttsModel, ttsRequiresWavConversion} from '@/ai/genkit';
import {z} from 'genkit';
import wav from 'wav';
import { pdfToTextService } from '@/services/pdf-service';
import { insertDynamicPauses } from './dynamic-pause-insertion';
import { summarizeText } from './summarize-text-flow';

const PdfToAudioInputSchema = z.object({
  pdfDataUri: z
    .string()
    .describe(
      'The PDF file data as a data URI that must include a MIME type and use Base64 encoding. Expected format: \'data:<mimetype>;base64,<encoded_data>\'.' 
    ),
  voice: z.string().describe('The selected voice for the text-to-speech conversion.'),
});
export type PdfToAudioInput = z.infer<typeof PdfToAudioInputSchema>;

const PdfToAudioOutputSchema = z.object({
  audioDataUri: z.string().describe('The converted WAV audio data as a data URI.'),
  summary: z.string().describe('A summary of the PDF content.'),
});
export type PdfToAudioOutput = z.infer<typeof PdfToAudioOutputSchema>;

export async function pdfToAudio(input: PdfToAudioInput): Promise<PdfToAudioOutput> {
  return pdfToAudioFlow(input);
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

/**
 * Splits text into chunks that stay within the TTS model's character limit,
 * breaking on word boundaries so no words are cut in half.
 */
function chunkText(text: string, maxChunkLength = 4500): string[] {
  const chunks: string[] = [];
  let remaining = text.trim();

  while (remaining.length > maxChunkLength) {
    // Try to break at a sentence boundary first, then a word boundary.
    const slice = remaining.substring(0, maxChunkLength);
    const sentenceBreak = slice.lastIndexOf('. ');
    const spaceBreak = slice.lastIndexOf(' ');
    const breakAt = Math.max(sentenceBreak + 1, spaceBreak, 1);

    chunks.push(remaining.substring(0, breakAt).trim());
    remaining = remaining.substring(breakAt).trim();
  }

  if (remaining.length > 0) {
    chunks.push(remaining);
  }

  return chunks.length > 0 ? chunks : [''];
}


const pdfToAudioFlow = ai.defineFlow(
  {
    name: 'pdfToAudioFlow',
    inputSchema: PdfToAudioInputSchema,
    outputSchema: PdfToAudioOutputSchema,
  },
  async input => {
    let pdfText = await pdfToTextService(input.pdfDataUri);
    
    if (!pdfText || pdfText.trim().length === 0) {
      throw new Error("The provided PDF does not contain any text to convert.");
    }

    // Split the full document into TTS-safe chunks instead of silently
    // truncating to the model's context limit. Each chunk gets its own
    // pause insertion + speech synthesis, and the raw audio is stitched
    // together into a single WAV file.
    const textChunks = chunkText(pdfText);

    // Summarize the beginning of the document (the same text that will be read).
    const { summary } = await summarizeText({ text: textChunks[0] });
    
    const generateConfig = (prompt: string): any => {
      const config: any = {
        model: ttsModel,
        prompt,
        config: {
          responseModalities: ['AUDIO'],
        },
      };

      if (ttsRequiresWavConversion) {
        // Google-specific speech configuration
        config.config.speechConfig = {
          voiceConfig: {
            prebuiltVoiceConfig: { voiceName: input.voice || 'Algenib' },
          },
        };
      } else {
        // OpenAI-specific speech configuration (uses a default voice)
        config.config.voice = input.voice || 'alloy';
      }

      return config;
    };

    const pcmChunks: Buffer[] = [];
    for (const chunk of textChunks) {
      let modifiedText = chunk;

      // Defensive check: If pause insertion returns empty text, fall back to the
      // original to prevent sending an empty prompt to the TTS service.
      if (chunk.trim().length > 0) {
        const pauseResult = await insertDynamicPauses({ text: chunk });
        if (pauseResult.modifiedText && pauseResult.modifiedText.trim().length > 0) {
          modifiedText = pauseResult.modifiedText;
        } else {
          console.warn("Pause insertion resulted in empty text. Falling back to original text.");
        }
      }

      const { media } = await ai.generate(generateConfig(modifiedText));

      if (!media) {
        throw new Error('no media returned');
      }

      if (ttsRequiresWavConversion) {
        // Google returns raw PCM data; collect it for the final WAV conversion.
        const audioBuffer = Buffer.from(
          media.url.substring(media.url.indexOf(',') + 1),
          'base64'
        );
        pcmChunks.push(audioBuffer);
      } else {
        // OpenAI returns a complete audio file data URI (e.g., MP3 or other formats).
        // Multiple files would need to be concatenated by the client.
        return {
          audioDataUri: media.url,
          summary: summary,
        };
      }
    }

    const audioDataUri = 'data:audio/wav;base64,' + (await toWav(Buffer.concat(pcmChunks)));

    return {
      audioDataUri: audioDataUri,
      summary: summary,
    };
  }
);
