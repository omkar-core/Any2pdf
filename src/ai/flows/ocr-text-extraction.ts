'use server';

/**
 * @fileOverview A flow for extracting text from images using OCR.
 *
 * - ocrTextExtraction - A function that handles the OCR text extraction process.
 * - OCRTextExtractionInput - The input type for the ocrTextExtraction function.
 * - OCRTextExtractionOutput - The return type for the ocrTextExtraction function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const OCRTextExtractionInputSchema = z.object({
  photoDataUri: z
    .string()
    .describe(
      "A photo of a document, as a data URI that must include a MIME type and use Base64 encoding. Expected format: 'data:<mimetype>;base64,<encoded_data>'."
    ),
});
export type OCRTextExtractionInput = z.infer<typeof OCRTextExtractionInputSchema>;

const OCRTextExtractionOutputSchema = z.object({
  extractedText: z.string().describe('The extracted text from the image.'),
});
export type OCRTextExtractionOutput = z.infer<typeof OCRTextExtractionOutputSchema>;

export async function ocrTextExtraction(input: OCRTextExtractionInput): Promise<OCRTextExtractionOutput> {
  return ocrTextExtractionFlow(input);
}

const prompt = ai.definePrompt({
  name: 'ocrTextExtractionPrompt',
  input: {schema: OCRTextExtractionInputSchema},
  output: {schema: OCRTextExtractionOutputSchema},
  prompt: `You are an OCR expert.

  Extract the text from the following image.  Output only the extracted text.

  Image: {{media url=photoDataUri}}`,
});

const ocrTextExtractionFlow = ai.defineFlow(
  {
    name: 'ocrTextExtractionFlow',
    inputSchema: OCRTextExtractionInputSchema,
    outputSchema: OCRTextExtractionOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
