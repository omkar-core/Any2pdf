'use server';

import { analyzeFile } from "@/ai/flows/analyze-file";

export async function convertFile(fileDataUri: string, fileName: string, fileType: string, targetFormat: string) {
  try {
    const analysis = await analyzeFile({ fileDataUri, fileName, fileType });
    console.log('File analysis:', analysis);

    const webhookUrl = 'https://nickjamerstudio.app.n8n.cloud/webhook/Any2PDF';
    
    // The n8n webhook might expect the file data without the data URI prefix.
    const base64Data = fileDataUri.split(',')[1];

    const payload = {
      analysis,
      file: {
        name: fileName,
        type: fileType,
        data: base64Data, // Sending only the base64 part
      },
      action: 'convert',
      targetFormat: targetFormat
    };

    const response = await fetch(webhookUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Webhook response error:', errorText);
      throw new Error(`Webhook failed with status: ${response.status}`);
    }

    const result = await response.json();

    if (result.convertedFile && result.convertedFile.data) {
        // Reconstruct the data URI for the client
        const convertedDataUri = `data:${result.convertedFile.type || 'application/pdf'};base64,${result.convertedFile.data}`;
        return { success: true, url: convertedDataUri };
    } else {
        console.error('Unexpected response structure from webhook:', result);
        throw new Error('Invalid response from conversion service.');
    }
  } catch (error) {
    console.error('Error during file conversion:', error);
    const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred';
    return { success: false, error: errorMessage };
  }
}

// A generic action to handle other PDF tools
export async function processPdfAction(files: { data: string, name: string, type: string }[], action: string, options?: Record<string, any>) {
  try {
    const webhookUrl = 'https://nickjamerstudio.app.n8n.cloud/webhook/Any2PDF';

    const response = await fetch(webhookUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        files: files.map(file => ({
          name: file.name,
          type: file.type,
          data: file.data.split(',')[1], // Sending only the base64 part
        })),
        action,
        options,
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Webhook response error:', errorText);
      throw new Error(`Webhook failed with status: ${response.status}`);
    }

    const result = await response.json();
    
    if (result.processedFile && result.processedFile.data) {
        const processedDataUri = `data:${result.processedFile.type || 'application/pdf'};base64,${result.processedFile.data}`;
        return { success: true, url: processedDataUri, fileName: result.processedFile.name || 'processed.pdf' };
    } else {
        console.error('Unexpected response structure from webhook:', result);
        throw new Error('Invalid response from processing service.');
    }

  } catch (error) {
    console.error(`Error during ${action} action:`, error);
    const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred';
    return { success: false, error: errorMessage };
  }
}
