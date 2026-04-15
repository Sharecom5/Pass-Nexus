import QRCode from 'qrcode';

/**
 * Generates a Base64 Data URL for a given string (usually a verification URL)
 */
export async function generateQRCodeBase64(text: string): Promise<string> {
  try {
    const options: QRCode.QRCodeToDataURLOptions = {
      margin: 1,
      width: 400,
      color: {
        dark: '#0f172a',  // slate-900 for premium high-contrast
        light: '#ffffff'
      },
      errorCorrectionLevel: 'H'
    };
    
    return await QRCode.toDataURL(text, options);
  } catch (err) {
    console.error('QR Generation Error:', err);
    throw new Error('Could not generate QR code');
  }
}
