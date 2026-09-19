'use server';

import Stripe from 'stripe';
import { analyzeFile } from "@/ai/flows/analyze-file";
import { ocrTextExtraction } from "@/ai/flows/ocr-text-extraction";
import { suggestAlternativeConversionTool } from "@/ai/flows/suggest-alternative-conversion-tool";
import {
  isValidMimeType,
  isPdfMimeType,
  validateBase64Payload,
  validateFileName,
  toValidatedError,
} from "@/lib/validation";

const WEBHOOK_URL =
  process.env.N8N_WEBHOOK_URL || 'https://nickjamerstudio.app.n8n.cloud/webhook/Any2PDF';

export async function convertFile(fileDataUri: string, fileName: string, fileType: string, targetFormat: string) {
  try {
    validateFileName(fileName);
    if (!isValidMimeType(fileType)) {
      throw new Error(`File type "${fileType}" is not supported.`);
    }
    validateBase64Payload(fileDataUri);

    const analysis = await analyzeFile({ fileDataUri, fileName, fileType });
    console.log('File analysis:', analysis);

    const webhookUrl = WEBHOOK_URL;
    
    // The n8n webhook might expect the file data without the data URI prefix.
    const base64Data = fileDataUri.split(',')[1];

    let ocrText: string | undefined;
    // If the source is an image, attempt OCR first so the generated PDF text is selectable.
    if (fileType.startsWith('image/')) {
      try {
        const ocrResult = await ocrTextExtraction({ photoDataUri: fileDataUri });
        ocrText = ocrResult.extractedText;
      } catch (ocrError) {
        console.warn('OCR extraction failed (continuing without text):', ocrError);
      }
    }

    const payload = {
      analysis,
      ocrText,
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
    const errorMessage = toValidatedError(error).message;

    // Ask the LLM to recommend alternative conversion tools when the primary path fails.
    try {
      const suggestion = await suggestAlternativeConversionTool({
        fileName,
        fileType,
        conversionError: errorMessage,
      });
      return { success: false, error: errorMessage, suggestions: suggestion.suggestedTools, reasoning: suggestion.reasoning };
    } catch (suggestionError) {
      console.warn('Could not generate alternative tool suggestions:', suggestionError);
    }

    return { success: false, error: errorMessage };
  }
}

// A generic action to handle other PDF tools
export async function processPdfAction(files: { data: string, name: string, type: string }[], action: string, options?: Record<string, string>) {
  try {
    if (!Array.isArray(files) || files.length === 0) {
      throw new Error('No files provided.');
    }
    if (files.length > 10) {
      throw new Error('You can only process up to 10 files at a time.');
    }
    for (const file of files) {
      validateFileName(file.name);
      if (!isPdfMimeType(file.type)) {
        throw new Error(`"${file.name}" is not a PDF file.`);
      }
      validateBase64Payload(file.data);
    }

    const webhookUrl = WEBHOOK_URL;

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
    const errorMessage = toValidatedError(error).message;
    return { success: false, error: errorMessage };
  }
}

// Starts a Stripe checkout session for the Pro subscription.
// Returns a checkout URL the client redirects to. No-ops when Stripe is unconfigured.
export async function createCheckoutSession() {
  const secretKey = process.env.STRIPE_SECRET_KEY;
  const priceId = process.env.STRIPE_PRICE_ID;
  if (!secretKey || !priceId) {
    return { success: false, error: 'Stripe is not configured. Set STRIPE_SECRET_KEY and STRIPE_PRICE_ID.' };
  }

  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:9002';

  try {
    const stripe = new Stripe(secretKey);
    const session = await stripe.checkout.sessions.create({
      mode: 'subscription',
      payment_method_types: ['card'],
      line_items: [{ price: priceId, quantity: 1 }],
      success_url: `${baseUrl}/?checkout=success`,
      cancel_url: `${baseUrl}/#pricing`,
    });

    if (!session.url) {
      return { success: false, error: 'Stripe did not return a checkout URL.' };
    }
    return { success: true, url: session.url };
  } catch (error) {
    console.error('Error creating Stripe checkout session:', error);
    const errorMessage = toValidatedError(error).message;
    return { success: false, error: `Could not start checkout: ${errorMessage}` };
  }
}
