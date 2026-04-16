import QRCode from 'qrcode'

interface QRData {
  passId: string
  name: string
  event: string
  type: string
}

// Returns base64 PNG data URL — embed directly in email/PDF
export async function generateQRCodeBase64(payload: string): Promise<string> {
  const dataUrl = await QRCode.toDataURL(payload, {
    errorCorrectionLevel: 'M',
    type: 'image/png',
    width: 300,
    margin: 2,
    color: {
      dark: '#0a1628',
      light: '#ffffff',
    },
  })
  return dataUrl
}

// Returns Buffer — for saving to Cloudinary
export async function generateQRCodeBuffer(payload: string): Promise<Buffer> {
  const buffer = await QRCode.toBuffer(payload, {
    errorCorrectionLevel: 'M',
    type: 'png',
    width: 400,
    margin: 2,
  })
  return buffer
}
