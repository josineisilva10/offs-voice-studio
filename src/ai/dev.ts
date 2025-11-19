import { config } from 'dotenv';
config();

import '@/ai/flows/summarize-text-to-voice-prompt.ts';
import '@/ai/flows/generate-voice-from-text.ts';
import '@/ai/flows/generate-text-from-prompt.ts';