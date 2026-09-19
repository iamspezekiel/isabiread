'use server';

import pdf from 'pdf-parse';

/**
 * Extracts text from a PDF provided as a data URI.
 * @param pdfDataUri The PDF data URI.
 * @returns The extracted text content of the PDF.
 */
export async function pdfToTextService(pdfDataUri: string): Promise<string> {
  if (!pdfDataUri.startsWith('data:application/pdf;base64,')) {
    throw new Error('Invalid PDF data URI format.');
  }

  // Extract the Base64 part of the data URI
  const base64String = pdfDataUri.split(',')[1];
  if (!base64String) {
    throw new Error('Could not find Base64 data in URI.');
  }
  
  // Decode the Base64 string to a Buffer
  const pdfBuffer = Buffer.from(base64String, 'base64');
  
  // Parse the PDF buffer
  const data = await pdf(pdfBuffer);
  
  return data.text;
}
