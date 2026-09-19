
'use server';
/**
 * @fileOverview Converts text to audio with multiple speakers.
 *
 * - multiSpeakerTextToAudio - A function that handles the multi-speaker text-to-audio conversion.
 * - MultiSpeakerTextToAudioInput - The input type for the function.
 * - MultiSpeakerTextToAudioOutput - The return type for the function.
 */

import {ai, ttsModel, ttsRequiresWavConversion} from '@/ai/genkit';
import {z} from 'genkit';
import wav from 'wav';

const MultiSpeakerTextToAudioInputSchema = z.object({
  text: z.string().describe('The text to be converted to audio, potentially with multiple speakers.'),
  voices: z.array(z.string()).describe('An array of selected voice IDs for the speakers.'),
});
export type MultiSpeakerTextToAudioInput = z.infer<typeof MultiSpeakerTextToAudioInputSchema>;

const MultiSpeakerTextToAudioOutputSchema = z.object({
  audioDataUri: z.string().describe('The converted audio data as a data URI.'),
  formattedText: z.string().describe('The text formatted with speaker tags.'),
});
export type MultiSpeakerTextToAudioOutput = z.infer<typeof MultiSpeakerTextToAudioOutputSchema>;

export async function multiSpeakerTextToAudio(input: MultiSpeakerTextToAudioInput): Promise<MultiSpeakerTextToAudioOutput> {
  return multiSpeakerTextToAudioFlow(input);
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

const taggingPrompt = ai.definePrompt({
    name: 'multiSpeakerTaggingPrompt',
    prompt: `You are an expert at analyzing text to identify different speakers. 
Your task is to reformat the following text by tagging each part with a speaker label (Speaker1, Speaker2, etc.).
Do not change the text itself, only add the speaker tags.
There are {{voiceCount}} available voices.
Analyze the dialogue, context, and any cues to determine when the speaker changes.

Example:
Original Text:
"Hello," said Mark.
"Hi there," replied Susan.

Reformatted Text:
Speaker1: "Hello," said Mark.
Speaker2: "Hi there," replied Susan.

Now, process the following text:
{{{text}}}
`,
    input: {
        schema: z.object({
            text: z.string(),
            voiceCount: z.number(),
        })
    }
});


const multiSpeakerTextToAudioFlow = ai.defineFlow(
  {
    name: 'multiSpeakerTextToAudioFlow',
    inputSchema: MultiSpeakerTextToAudioInputSchema,
    outputSchema: MultiSpeakerTextToAudioOutputSchema,
  },
  async input => {
    let { text, voices } = input;

    if (!text || text.trim().length === 0) {
      throw new Error("The provided text is empty.");
    }
    if (voices.length === 0) {
        throw new Error("At least one voice must be selected.");
    }
    
    // Step 1: Tag the text with speakers
    const taggingResult = await taggingPrompt({ text, voiceCount: voices.length });
    const formattedText = taggingResult.output!;

    // The TTS model has a limit of around 5000 characters.
    if (formattedText.length > 5000) {
      text = formattedText.substring(0, 5000);
    } else {
      text = formattedText;
    }
    
    const generateConfig: any = {
      model: ttsModel,
      prompt: text,
      config: {
        responseModalities: ['AUDIO'],
      },
    };
    
    // Multi-speaker configuration
    if (ttsRequiresWavConversion) {
        generateConfig.config.speechConfig = {
            multiSpeakerVoiceConfig: {
                speakerVoiceConfigs: voices.map((voiceId, index) => ({
                    speaker: `Speaker${index + 1}`,
                    voiceConfig: {
                        prebuiltVoiceConfig: { voiceName: voiceId },
                    },
                })),
            },
        };
    } else {
        throw new Error("Multi-speaker conversion is not supported for this TTS provider.");
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
      audioDataUri = media.url;
    }

    return {
      audioDataUri: audioDataUri,
      formattedText: text,
    };
  }
);
