export const MAX_FILE_SIZE_BYTES = 25 * 1024 * 1024;

export const MAX_FILE_NAME_LENGTH = 255;

export const ALLOWED_MIME_TYPES = [
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document', // .docx
  'application/msword', // .doc
  'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet', // .xlsx
  'application/vnd.ms-excel', // .xls
  'application/vnd.openxmlformats-officedocument.presentationml.presentation', // .pptx
  'application/vnd.ms-powerpoint', // .ppt
  'application/pdf', // .pdf
  'application/x-pdf', // .pdf (alternate signature)
  'image/png',
  'image/jpeg',
  'image/tiff',
  'image/bmp',
  'image/gif',
  'text/html',
];

export function isValidMimeType(mimeType: string): boolean {
  return ALLOWED_MIME_TYPES.includes(mimeType);
}

export function isPdfMimeType(mimeType: string): boolean {
  return mimeType === 'application/pdf' || mimeType === 'application/x-pdf';
}

/**
 * Validates a base64 payload and returns its decoded byte length.
 * Throws when the input is not valid base64.
 */
export function validateBase64Payload(dataUriOrBase64: string): number {
  const isDataUri = dataUriOrBase64.startsWith('data:');
  const base64 = isDataUri ? dataUriOrBase64.split(',')[1] : dataUriOrBase64;
  if (!base64) {
    throw new Error('File payload is missing its base64 data.');
  }
  if (!/^[A-Za-z0-9+/]+={0,2}$/.test(base64) || base64.length % 4 !== 0) {
    throw new Error('File payload is not valid base64.');
  }
  const byteLength = Math.floor((base64.length * 3) / 4) - (base64.endsWith('==') ? 2 : base64.endsWith('=') ? 1 : 0);
  if (byteLength > MAX_FILE_SIZE_BYTES) {
    throw new Error(`File exceeds the ${MAX_FILE_SIZE_BYTES / 1024 / 1024}MB size limit.`);
  }
  return byteLength;
}

export function validateFileName(fileName: string): void {
  if (!fileName || fileName.replace(/\s/g, '').length === 0) {
    throw new Error('File name is missing.');
  }
  if (fileName.length > MAX_FILE_NAME_LENGTH) {
    throw new Error('File name is too long.');
  }
  if (/[\x00-\x1F]/.test(fileName)) {
    throw new Error('File name contains invalid characters.');
  }
}

export function toValidatedError(error: unknown): Error {
  return error instanceof Error ? error : new Error('An unknown error occurred');
}