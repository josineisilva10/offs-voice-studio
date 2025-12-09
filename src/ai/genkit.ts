
'use server';
import {genkit, Ai} from 'genkit';
import {googleAI} from '@genkit-ai/google-genai';

let ai: Ai;

if (!ai) {
  ai = genkit({
    plugins: [googleAI()],
    logLevel: 'debug',
    enableTracingAndMetrics: true,
  });
}

export {ai};
