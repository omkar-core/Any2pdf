'use server';

/**
 * @fileOverview This file defines a Genkit flow that suggests alternative tools for file conversion if the primary API fails.
 *
 * - suggestAlternativeConversionTool - A function that takes file information and suggests alternative conversion tools.
 * - SuggestAlternativeConversionToolInput - The input type for the suggestAlternativeConversionTool function.
 * - SuggestAlternativeConversionToolOutput - The return type for the suggestAlternativeConversionTool function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const SuggestAlternativeConversionToolInputSchema = z.object({
  fileName: z.string().describe('The name of the file to be converted.'),
  fileType: z.string().describe('The type of the file (e.g., docx, xlsx, png).'),
  conversionError: z.string().describe('The error message from the failed conversion attempt.'),
});
export type SuggestAlternativeConversionToolInput = z.infer<typeof SuggestAlternativeConversionToolInputSchema>;

const SuggestAlternativeConversionToolOutputSchema = z.object({
  suggestedTools: z.array(z.string()).describe('An array of suggested alternative tools for file conversion.'),
  reasoning: z.string().describe('The reasoning behind the tool suggestions.'),
});
export type SuggestAlternativeConversionToolOutput = z.infer<typeof SuggestAlternativeConversionToolOutputSchema>;

export async function suggestAlternativeConversionTool(input: SuggestAlternativeConversionToolInput): Promise<SuggestAlternativeConversionToolOutput> {
  return suggestAlternativeConversionToolFlow(input);
}

const prompt = ai.definePrompt({
  name: 'suggestAlternativeConversionToolPrompt',
  input: {schema: SuggestAlternativeConversionToolInputSchema},
  output: {schema: SuggestAlternativeConversionToolOutputSchema},
  prompt: `The primary file conversion API failed with the following error: {{{conversionError}}}. The user is trying to convert a file named {{{fileName}}} of type {{{fileType}}}.

  Suggest alternative tools that the user can use to convert the file to PDF. Provide a brief reasoning for each suggested tool.

  Format your output as a JSON object with 'suggestedTools' (an array of tool names) and 'reasoning' (a string explaining the suggestions).`,
});

const suggestAlternativeConversionToolFlow = ai.defineFlow(
  {
    name: 'suggestAlternativeConversionToolFlow',
    inputSchema: SuggestAlternativeConversionToolInputSchema,
    outputSchema: SuggestAlternativeConversionToolOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
