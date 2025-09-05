'use server';

/**
 * @fileOverview A flow for analyzing files before conversion.
 *
 * - analyzeFile - A function that analyzes a file's content and metadata.
 * - AnalyzeFileInput - The input type for the analyzeFile function.
 * - AnalyzeFileOutput - The return type for the analyzeFile function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const AnalyzeFileInputSchema = z.object({
  fileDataUri: z
    .string()
    .describe(
      "The file content, as a data URI that must include a MIME type and use Base64 encoding. Expected format: 'data:<mimetype>;base64,<encoded_data>'."
    ),
  fileName: z.string().describe("The name of the file."),
  fileType: z.string().describe("The MIME type of the file."),
});
export type AnalyzeFileInput = z.infer<typeof AnalyzeFileInputSchema>;

const AnalyzeFileOutputSchema = z.object({
  isSafe: z.boolean().describe('Whether the file is deemed safe for processing.'),
  fileSummary: z.string().describe('A brief summary of the file content.'),
  recommendedAction: z.string().describe("Recommended action, e.g., 'Convert to PDF'."),
});
export type AnalyzeFileOutput = z.infer<typeof AnalyzeFileOutputSchema>;

export async function analyzeFile(input: AnalyzeFileInput): Promise<AnalyzeFileOutput> {
  return analyzeFileFlow(input);
}

const prompt = ai.definePrompt({
  name: 'analyzeFilePrompt',
  input: {schema: AnalyzeFileInputSchema},
  output: {schema: AnalyzeFileOutputSchema},
  prompt: `You are a file analysis expert. Analyze the following file and provide a security assessment and summary.

  File Name: {{{fileName}}}
  File Type: {{{fileType}}}

  Based on the file type and name, determine if it's likely safe. For images and standard documents, assume it is safe.
  Provide a brief, one-sentence summary of what the file likely contains based on its name and type.
  Recommend the action 'Convert to PDF'.

  File Content (for context):
  {{media url=fileDataUri}}`,
});

const analyzeFileFlow = ai.defineFlow(
  {
    name: 'analyzeFileFlow',
    inputSchema: AnalyzeFileInputSchema,
    outputSchema: AnalyzeFileOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
