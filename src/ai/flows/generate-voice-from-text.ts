'use server';

/**
 * @fileOverview A text-to-speech AI agent.
 *
 * - generateVoiceFromText - A function that handles the text-to-speech conversion.
 * - GenerateVoiceFromTextInput - The input type for the generateVoiceFromText function.
 * - GenerateVoiceFromTextOutput - The return type for the generateVoiceFromText function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';
import wav from 'wav';

const GenerateVoiceFromTextInputSchema = z.object({
  text: z.string().describe('The text to convert to speech.'),
  voiceName: z.string().optional().describe('The name of the voice to use.  If not provided, a default voice will be used.'),
});
export type GenerateVoiceFromTextInput = z.infer<typeof GenerateVoiceFromTextInputSchema>;

const GenerateVoiceFromTextOutputSchema = z.object({
  audioDataUri: z.string().describe('The generated audio data as a data URI in WAV format.'),
});
export type GenerateVoiceFromTextOutput = z.infer<typeof GenerateVoiceFromTextOutputSchema>;

export async function generateVoiceFromText(input: GenerateVoiceFromTextInput): Promise<GenerateVoiceFromTextOutput> {
  return generateVoiceFromTextFlow(input);
}

async function toWav(
  pcmData: Buffer,
  channels = 1,
  rate = 24000,
  sampleWidth = 2
): Promise<string> {
  return new Promise((resolve, reject) => {
    const writer = new wav.Writer({
      channels,
      sampleRate: rate,
      bitDepth: sampleWidth * 8,
    });

    let bufs = [] as any[];
    writer.on('error', reject);
    writer.on('data', function (d) {
      bufs.push(d);
    });
    writer.on('end', function () {
      resolve(Buffer.concat(bufs).toString('base64'));
    });

    writer.write(pcmData);
    writer.end();
  });
}

const generateVoiceFromTextFlow = ai.defineFlow(
  {
    name: 'generateVoiceFromTextFlow',
    inputSchema: GenerateVoiceFromTextInputSchema,
    outputSchema: GenerateVoiceFromTextOutputSchema,
  },
  async input => {
    const { media } = await ai.generate({
      model: 'googleai/gemini-2.5-flash-preview-tts',
      config: {
        responseModalities: ['AUDIO'],
        speechConfig: {
          voiceConfig: {
            prebuiltVoiceConfig: { voiceName: input.voiceName || 'Algenib' },
          },
        },
      },
      prompt: input.text,
    });
    if (!media) {
      throw new Error('no media returned');
    }
    const audioBuffer = Buffer.from(
      media.url.substring(media.url.indexOf(',') + 1),
      'base64'
    );
    return {
      audioDataUri: 'data:audio/wav;base64,' + (await toWav(audioBuffer)),
    };
  }
);
