
import { config } from 'dotenv';
config();

import '@/ai/flows/pdf-to-audio-flow.ts';
import '@/ai/flows/dynamic-pause-insertion.ts';
import '@/ai/flows/summarize-text-flow.ts';
import '@/ai/flows/text-to-audio-flow.ts';
import '@/ai/flows/multi-speaker-flow.ts';
import '@/ai/flows/voice-lab-flow.ts';

