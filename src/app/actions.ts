'use server';

import { analyzeFile } from "@/ai/flows/analyze-file";

export async function convertFile(fileDataUri: string, fileName: string, fileType: string) {
  try {
    // Optional: Analyze the file using Genkit
    const analysis = await analyzeFile({ fileDataUri, fileName, fileType });
    console.log('File analysis:', analysis);

    const webhookUrl = 'https://nickjamerstudio.app.n8n.cloud/webhook/Any2PDF';

    // n8n expects a specific JSON structure.
    // The file content is sent as a data URI.
    const response = await fetch(webhookUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        // Pass both analysis and file data to the webhook
        analysis,
        file: {
          name: fileName,
          type: fileType,
          data: fileDataUri,
        },
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Webhook response error:', errorText);
      throw new Error(`Webhook failed with status: ${response.status}`);
    }

    const result = await response.json();

    // Assuming n8n returns a JSON with a `convertedFile` object containing `data` (base64) and `type`
    if (result.convertedFile && result.convertedFile.data) {
        const pdfDataUri = `data:${result.convertedFile.type || 'application/pdf'};base64,${result.convertedFile.data}`;
        return { success: true, url: pdfDataUri };
    } else {
        // Handle cases where the expected data is not in the response
        console.error('Unexpected response structure from webhook:', result);
        throw new Error('Invalid response from conversion service.');
    }
  } catch (error) {
    console.error('Error during file conversion:', error);
    const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred';
    return { success: false, error: errorMessage };
  }
}
