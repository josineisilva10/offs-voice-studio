
'use server';
/**
 * @fileOverview Flow to generate a PIX payment charge using Abacate Pay API.
 *
 * - generatePayment - A function that handles the payment generation process.
 * - GeneratePaymentInput - The input type for the generatePayment function.
 * - GeneratePaymentOutput - The return type for the generatePayment function.
 */

import { ai } from '@/ai/genkit';
import { z } from 'zod';

const GeneratePaymentInputSchema = z.object({
  amount: z.number().describe('The payment amount in cents.'),
  customer: z.object({
    name: z.string(),
    email: z.string().email(),
    cpf: z.string(),
  }),
  description: z.string().optional(),
});
export type GeneratePaymentInput = z.infer<typeof GeneratePaymentInputSchema>;

const GeneratePaymentOutputSchema = z.object({
  chargeId: z.string().describe('The unique ID for the charge from the payment provider.'),
  qrCodeUrl: z.string().url().describe('The URL of the QR code image to be displayed.'),
  qrCodeText: z.string().describe('The text string for the PIX "Copia e Cola".'),
});
export type GeneratePaymentOutput = z.infer<typeof GeneratePaymentOutputSchema>;

// This is the main function that the frontend will call.
export async function generatePayment(input: GeneratePaymentInput): Promise<GeneratePaymentOutput> {
  return generatePaymentFlow(input);
}


// This is the Genkit flow that orchestrates the payment generation.
const generatePaymentFlow = ai.defineFlow(
  {
    name: 'generatePaymentFlow',
    inputSchema: GeneratePaymentInputSchema,
    outputSchema: GeneratePaymentOutputSchema,
  },
  async (input) => {
    const apiKey = process.env.ABACATE_PAY_API_KEY;

    if (!apiKey) {
      throw new Error('ABACATE_PAY_API_KEY environment variable is not set.');
    }

    // IMPORTANT: The URL below is a placeholder. You need to replace it
    // with the actual Abacate Pay API endpoint for creating PIX charges.
    const abacatePayApiUrl = 'https://api.abacatepay.com/v1/pix/charge';

    const response = await fetch(abacatePayApiUrl, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'X-Api-Key': apiKey, // Common practice for API key authentication
        },
        body: JSON.stringify({
            customer: {
                name: input.customer.name,
                email: input.customer.email,
                tax_id: input.customer.cpf, // APIs often use 'tax_id' for CPF/CNPJ
            },
            items: [
              {
                description: input.description ?? 'Pedido de Locução',
                amount: input.amount, // Amount in cents
                quantity: 1,
              }
            ],
            // Add other required parameters by Abacate Pay API here
        }),
    });

    if (!response.ok) {
        const errorBody = await response.text();
        console.error('Abacate Pay API error:', errorBody);
        throw new Error(`Failed to create payment charge: ${response.statusText}`);
    }

    const responseData = await response.json();

    // IMPORTANT: The field names below (`id`, `qr_code_image_url`, `qr_code_text`)
    // are placeholders. You need to inspect the actual response from the
    // Abacate Pay API and adjust these to match the real data.
    const chargeId = responseData.id; 
    const qrCodeUrl = responseData.qr_code_image_url;
    const qrCodeText = responseData.qr_code_text;

    if (!chargeId || !qrCodeUrl || !qrCodeText) {
        console.error('Abacate Pay API response is missing required fields:', responseData);
        throw new Error('Invalid response from payment provider.');
    }

    return {
      chargeId,
      qrCodeUrl,
      qrCodeText,
    };
  }
);
