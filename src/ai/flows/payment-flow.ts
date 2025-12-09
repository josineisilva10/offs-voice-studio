
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
    cellphone: z.string().optional(),
  }),
  description: z.string().optional(),
  orderId: z.string().describe('The internal order ID of the system.'),
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

    const abacatePayApiUrl = 'https://api.abacatepay.com/v1/pixQrCode/create';

    const response = await fetch(abacatePayApiUrl, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${apiKey}`,
        },
        body: JSON.stringify({
            amount: input.amount,
            description: input.description ?? 'Pedido de Locução',
            customer: {
                name: input.customer.name,
                email: input.customer.email,
                taxId: input.customer.cpf,
                cellphone: input.customer.cellphone,
            },
            metadata: {
              externalId: input.orderId,
            }
        }),
    });

    if (!response.ok) {
        const errorBody = await response.text();
        console.error('Abacate Pay API error:', errorBody);
        throw new Error(`Failed to create payment charge: ${response.statusText}`);
    }

    const responseData = await response.json();
    
    // Correctly parse the response from the AbacatePay API based on user feedback
    const chargeId = responseData.data?.id; 
    const qrCodeUrl = responseData.data?.brCodeBase64;
    const qrCodeText = responseData.data?.brCode;

    if (!chargeId || !qrCodeUrl || !qrCodeText) {
        console.error('Abacate Pay API response is missing required fields:', responseData);
        throw new Error('Invalid response from payment provider. Expected data.id, data.brCodeBase64, and data.brCode.');
    }

    return {
      chargeId,
      qrCodeUrl,
      qrCodeText,
    };
  }
);
