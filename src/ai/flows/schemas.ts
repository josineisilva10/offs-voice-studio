import { z } from 'zod';

/**
 * @fileOverview Schemas e tipos para os fluxos de IA.
 */

export const GenerateScriptInputSchema = z.object({
  prompt: z.string().describe('As informações fornecidas pelo usuário para guiar a geração do texto.'),
});
export type GenerateScriptInput = z.infer<typeof GenerateScriptInputSchema>;

export const GenerateScriptOutputSchema = z.object({
  script: z.string().describe('O roteiro gerado pela IA.'),
});
export type GenerateScriptOutput = z.infer<typeof GenerateScriptOutputSchema>;
