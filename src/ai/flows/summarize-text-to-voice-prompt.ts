'use server';

/**
 * @fileOverview Summarizes a block of text into a prompt suitable for voice generation.
 *
 * - summarizeTextToVoicePrompt - A function that summarizes text into a voice generation prompt.
 * - SummarizeTextToVoicePromptInput - The input type for the summarizeTextToVoicePrompt function.
 * - SummarizeTextToVoicePromptOutput - The return type for the summarizeTextToVoicePrompt function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const SummarizeTextToVoicePromptInputSchema = z.object({
  text: z.string().describe('The text to summarize for voice generation.'),
});

export type SummarizeTextToVoicePromptInput = z.infer<
  typeof SummarizeTextToVoicePromptInputSchema
>;

const SummarizeTextToVoicePromptOutputSchema = z.object({
  prompt: z.string().describe('The summarized prompt suitable for voice generation.'),
});

export type SummarizeTextToVoicePromptOutput = z.infer<
  typeof SummarizeTextToVoicePromptOutputSchema
>;

export async function summarizeTextToVoicePrompt(
  input: SummarizeTextToVoicePromptInput
): Promise<SummarizeTextToVoicePromptOutput> {
  return summarizeTextToVoicePromptFlow(input);
}

const summarizeTextToVoicePromptPrompt = ai.definePrompt({
  name: 'summarizeTextToVoicePromptPrompt',
  input: {schema: SummarizeTextToVoicePromptInputSchema},
  output: {schema: SummarizeTextToVoicePromptOutputSchema},
  prompt: `Summarize the following text into a concise and clear prompt suitable for generating a voiceover. Focus on the key points and ensure the prompt is easily understandable for a text-to-speech model. 

Text: {{{text}}}`,
});

const summarizeTextToVoicePromptFlow = ai.defineFlow(
  {
    name: 'summarizeTextToVoicePromptFlow',
    inputSchema: SummarizeTextToVoicePromptInputSchema,
    outputSchema: SummarizeTextToVoicePromptOutputSchema,
  },
  async input => {
    const {output} = await summarizeTextToVoicePromptPrompt(input);
    return output!;
  }
);
