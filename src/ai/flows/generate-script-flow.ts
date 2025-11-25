'use server';
/**
 * @fileOverview Flow para gerar roteiros de locução com IA.
 *
 * - generateScript - Função que lida com a geração do roteiro.
 * - GenerateScriptInputSchema - O tipo de entrada para a função.
 * - GenerateScriptOutputSchema - O tipo de retorno para a função.
 */

import { ai } from '@/ai/genkit';
import { z } from 'zod';

export const GenerateScriptInputSchema = z.object({
  prompt: z.string().describe('As informações fornecidas pelo usuário para guiar a geração do texto.'),
});
export type GenerateScriptInput = z.infer<typeof GenerateScriptInputSchema>;

export const GenerateScriptOutputSchema = z.object({
  script: z.string().describe('O roteiro gerado pela IA.'),
});
export type GenerateScriptOutput = z.infer<typeof GenerateScriptOutputSchema>;


const generateScriptFlow = ai.defineFlow(
  {
    name: 'generateScriptFlow',
    inputSchema: GenerateScriptInputSchema,
    outputSchema: GenerateScriptOutputSchema,
  },
  async (input) => {

    const llmResponse = await ai.generate({
      prompt: `Você é um redator especialista em criar textos para comerciais e vinhetas de rádio e TV.
      Sua tarefa é criar um roteiro curto e impactante para uma locução com base nas informações a seguir.
      
      Informações do cliente:
      ---
      ${input.prompt}
      ---
      
      Gere um texto que seja claro, direto e apropriado para uma locução de aproximadamente 30 a 60 segundos.
      A resposta deve conter apenas o texto do roteiro, sem nenhum comentário ou formatação adicional.`,
      model: 'googleai/gemini-1.5-flash-latest',
      output: {
        format: 'text'
      },
      config: {
        temperature: 0.8,
      }
    });

    return {
      script: llmResponse.text,
    };
  }
);


export async function generateScript(input: GenerateScriptInput): Promise<GenerateScriptOutput> {
    return generateScriptFlow(input);
}
