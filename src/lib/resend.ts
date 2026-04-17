import { Resend } from 'resend'

const resend = new Resend(process.env.RESEND_API_KEY || 're_hwhUP15w_Ly5BuNgP1rWycTg3cYaEgxR4')

interface PassEmailData {
  to: string
  visitorName: string
  passId: string
  passType: string
  eventName: string
  eventDate: string
  eventVenue: string
  qrCodeBase64: string   // base64 data URL
  passImageUrl?: string
  passPdfUrl?: string
}

export async function sendPassEmail(data: PassEmailData): Promise<boolean> {
  const {
    to, visitorName, passId, passType,
    eventName, eventDate, eventVenue,
    qrCodeBase64, passImageUrl, passPdfUrl
  } = data

  const passTypeColors: Record<string, string> = {
    VIP:       '#D97706',
    Speaker:   '#1D4ED8',
    Visitor:   '#374151',
    Press:     '#7C3AED',
    Exhibitor: '#065F46',
  }
  const badgeColor = passTypeColors[passType] || '#374151'

  const html = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Your Event Pass</title>
</head>
<body style="margin:0;padding:0;background:#f4f4f5;font-family:'Segoe UI',Arial,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#f4f4f5;padding:32px 0;">
    <tr><td align="center">
      <table width="560" cellpadding="0" cellspacing="0" style="background:#ffffff;border-radius:16px;overflow:hidden;box-shadow:0 4px 24px rgba(0,0,0,0.08);">

        <!-- Header -->
        <tr>
          <td style="background:linear-gradient(135deg,#0a1628 0%,#1a2f52 100%);padding:32px 40px;text-align:center;">
            <p style="margin:0;font-size:13px;color:#85B7EB;letter-spacing:0.2em;text-transform:uppercase;font-weight:700;">PassNexus Verified</p>
            <h1 style="margin:8px 0 0;font-size:28px;color:#ffffff;font-weight:700;letter-spacing:-0.5px;">${eventName}</h1>
            <p style="margin:8px 0 0;font-size:14px;color:#85B7EB;">${eventDate} &nbsp;|&nbsp; ${eventVenue}</p>
          </td>
        </tr>

        <!-- Greeting -->
        <tr>
          <td style="padding:32px 40px 0;">
            <p style="margin:0;font-size:16px;color:#111827;">Hello <strong>${visitorName}</strong>,</p>
            <p style="margin:12px 0 0;font-size:14px;color:#6B7280;line-height:1.6;">
              Your registration for <strong>${eventName}</strong> is confirmed. Your entry pass is ready below.
              Please show this QR code at the entrance gate.
            </p>
          </td>
        </tr>

        <!-- Pass Card -->
        <tr>
          <td style="padding:24px 40px;">
            <table width="100%" cellpadding="0" cellspacing="0"
              style="background:linear-gradient(135deg,#0a1628 0%,#1a2f52 100%);border-radius:12px;overflow:hidden;">
              <tr>
                <td style="height:4px;background:linear-gradient(90deg,#185FA5,#378ADD,#5DCAA5);"></td>
              </tr>
              <tr>
                <td style="padding:24px;">
                  <table width="100%" cellpadding="0" cellspacing="0">
                    <tr>
                      <td>
                        <span style="background:${badgeColor};color:#ffffff;font-size:10px;font-weight:700;
                          padding:4px 12px;border-radius:20px;letter-spacing:0.1em;">${passType.toUpperCase()}</span>
                        <p style="margin:12px 0 2px;font-size:22px;color:#ffffff;font-weight:700;">${visitorName}</p>
                        <p style="margin:0;font-size:13px;color:#85B7EB;">${eventName}</p>
                      </td>
                      <td align="right" valign="top">
                        <img src="${qrCodeBase64}" width="100" height="100"
                          style="border-radius:8px;background:#fff;padding:4px;" alt="QR Code" />
                      </td>
                    </tr>
                    <tr>
                      <td colspan="2" style="padding-top:16px;border-top:1px solid rgba(255,255,255,0.1);">
                        <p style="margin:0;font-size:9px;color:#378ADD;text-transform:uppercase;letter-spacing:0.1em;">Pass ID</p>
                        <p style="margin:4px 0 0;font-size:12px;color:#B5D4F4;font-family:monospace;">${passId}</p>
                      </td>
                    </tr>
                  </table>
                </td>
              </tr>
            </table>
          </td>
        </tr>

        <!-- Info -->
        <tr>
          <td style="padding:0 40px 24px;">
            <table width="100%" cellpadding="0" cellspacing="0"
              style="background:#F9FAFB;border-radius:10px;border:1px solid #E5E7EB;">
              <tr>
                <td style="padding:16px 20px;">
                  <table width="100%" cellpadding="0" cellspacing="0">
                    <tr>
                      <td width="50%" style="padding:6px 0;">
                        <p style="margin:0;font-size:10px;color:#9CA3AF;text-transform:uppercase;letter-spacing:0.08em;">Event</p>
                        <p style="margin:4px 0 0;font-size:13px;color:#111827;font-weight:600;">${eventName}</p>
                      </td>
                      <td width="50%" style="padding:6px 0;">
                        <p style="margin:0;font-size:10px;color:#9CA3AF;text-transform:uppercase;letter-spacing:0.08em;">Date</p>
                        <p style="margin:4px 0 0;font-size:13px;color:#111827;font-weight:600;">${eventDate}</p>
                      </td>
                    </tr>
                    <tr>
                      <td colspan="2" style="padding:6px 0 0;">
                        <p style="margin:0;font-size:10px;color:#9CA3AF;text-transform:uppercase;letter-spacing:0.08em;">Venue</p>
                        <p style="margin:4px 0 0;font-size:13px;color:#111827;font-weight:600;">${eventVenue}</p>
                      </td>
                    </tr>
                  </table>
                </td>
              </tr>
            </table>
          </td>
        </tr>

        <!-- Download Buttons -->
        <tr>
          <td style="padding:0 40px 32px;text-align:center;">
            ${passPdfUrl ? `
            <a href="${passPdfUrl}" style="display:inline-block;background:#185FA5;color:#ffffff;
              text-decoration:none;padding:12px 28px;border-radius:8px;font-size:14px;
              font-weight:600;margin-right:12px;">Download PDF Pass</a>
            ` : ''}
            <a href="${process.env.NEXT_PUBLIC_APP_URL}/pass/recover"
              style="display:inline-block;background:#F3F4F6;color:#374151;text-decoration:none;
              padding:12px 28px;border-radius:8px;font-size:14px;font-weight:600;">View My Pass</a>
          </td>
        </tr>

        <!-- Forgot pass tip -->
        <tr>
          <td style="padding:0 40px 24px;">
            <div style="background:#EFF6FF;border-left:3px solid #3B82F6;padding:14px 16px;border-radius:0 8px 8px 0;">
              <p style="margin:0;font-size:13px;color:#1E40AF;font-weight:600;">Forgot your pass at the venue?</p>
              <p style="margin:6px 0 0;font-size:12px;color:#3B82F6;line-height:1.5;">
                Scan any PassNexus QR code at the entrance gate or visit
                <a href="${process.env.NEXT_PUBLIC_APP_URL}/pass/recover" style="color:#1D4ED8;">Registration Desk</a>
                to recover your pass instantly.
              </p>
            </div>
          </td>
        </tr>

        <!-- Footer -->
        <tr>
          <td style="background:#F9FAFB;padding:20px 40px;text-align:center;border-top:1px solid #E5E7EB;">
            <p style="margin:0;font-size:11px;color:#9CA3AF;font-weight:bold;letter-spacing:0.05em;">
              Powered by PassNexus Protocol<br>
              Secure &bull; Fast &bull; Reliable
            </p>
          </td>
        </tr>

      </table>
    </td></tr>
  </table>
</body>
</html>`

  try {
    await resend.emails.send({
      from: `${process.env.RESEND_FROM_NAME || 'PassNexus'} <${process.env.RESEND_FROM_EMAIL || 'hello@passnexus.in'}>`,
      to: [to],
      subject: `Your Entry Pass — ${eventName}`,
      html,
    })
    return true
  } catch (err) {
    console.error('Resend error:', err)
    return false
  }
}

// ─── OTP Email ───────────────────────────────────────────────────
export async function sendOTPEmail(
  to: string,
  otp: string,
  visitorName: string
): Promise<boolean> {
  const html = `
<!DOCTYPE html>
<html>
<body style="margin:0;padding:0;background:#f4f4f5;font-family:'Segoe UI',Arial,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#f4f4f5;padding:32px 0;">
    <tr><td align="center">
      <table width="480" cellpadding="0" cellspacing="0"
        style="background:#ffffff;border-radius:16px;overflow:hidden;box-shadow:0 4px 24px rgba(0,0,0,0.08);">
        <tr>
          <td style="background:#0a1628;padding:28px 40px;text-align:center;">
            <h1 style="margin:0;font-size:22px;color:#ffffff;font-weight:700;">Pass Recovery</h1>
            <p style="margin:8px 0 0;font-size:13px;color:#85B7EB;">Use the code below to access your pass</p>
          </td>
        </tr>
        <tr>
          <td style="padding:40px;text-align:center;">
            <p style="margin:0 0 24px;font-size:15px;color:#374151;">Hello <strong>${visitorName}</strong>,</p>
            <div style="background:#F0FDF4;border:2px solid #86EFAC;border-radius:12px;padding:28px;margin:0 auto;display:inline-block;">
              <p style="margin:0 0 8px;font-size:12px;color:#15803D;text-transform:uppercase;letter-spacing:0.1em;font-weight:600;">Your OTP Code</p>
              <p style="margin:0;font-size:48px;font-weight:800;color:#166534;letter-spacing:12px;font-family:monospace;">${otp}</p>
            </div>
            <p style="margin:20px 0 0;font-size:13px;color:#6B7280;">This code expires in <strong>10 minutes</strong>.</p>
            <p style="margin:8px 0 0;font-size:12px;color:#9CA3AF;">If you didn't request this, ignore this email.</p>
          </td>
        </tr>
      </table>
    </td></tr>
  </table>
</body>
</html>`

  try {
    await resend.emails.send({
      from: `${process.env.RESEND_FROM_NAME || 'PassNexus'} <${process.env.RESEND_FROM_EMAIL || 'hello@passnexus.in'}>`,
      to: [to],
      subject: `Your OTP: ${otp} — Pass Recovery`,
      html,
    })
    return true
  } catch (err) {
    console.error('OTP email error:', err)
    return false
  }
}

// ─── Organizer Welcome Email ─────────────────────────────────────
export async function sendWelcomeEmail(to: string, name: string): Promise<boolean> {
  const html = `
<!DOCTYPE html>
<html>
<body style="margin:0;padding:0;background:#f4f4f5;font-family:'Segoe UI',Arial,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#f4f4f5;padding:32px 0;">
    <tr><td align="center">
      <table width="560" cellpadding="0" cellspacing="0" style="background:#ffffff;border-radius:16px;overflow:hidden;box-shadow:0 4px 24px rgba(0,0,0,0.08);">
        <tr>
          <td style="background:#0a1628;padding:32px 40px;text-align:center;">
             <h1 style="margin:0;font-size:24px;color:#ffffff;font-weight:700;">Welcome to PassNexus</h1>
             <p style="margin:8px 0 0;font-size:14px;color:#85B7EB;">Your Event Management Command Center</p>
          </td>
        </tr>
        <tr>
          <td style="padding:40px;">
            <p style="margin:0;font-size:16px;color:#111827;">Hello <strong>${name}</strong>,</p>
            <p style="margin:16px 0 0;font-size:14px;color:#4B5563;line-height:1.6;">
              Thank you for signing up with PassNexus! We're excited to help you manage your events more efficiently.
              Your account is now active and you can start creating events, generating digital passes, and managing registrations immediately.
            </p>
            <div style="margin:32px 0;text-align:center;">
              <a href="${process.env.NEXT_PUBLIC_APP_URL}/admin/login" style="background:#1D4ED8;color:#ffffff;text-decoration:none;padding:12px 32px;border-radius:8px;font-weight:600;font-size:14px;">Go to Dashboard</a>
            </div>
          </td>
        </tr>
      </table>
    </td></tr>
  </table>
</body>
</html>`

  try {
    await resend.emails.send({
      from: `${process.env.RESEND_FROM_NAME || 'PassNexus'} <${process.env.RESEND_FROM_EMAIL || 'hello@passnexus.in'}>`,
      to: [to],
      subject: `Welcome to PassNexus! — Account Confirmed`,
      html,
    })
    return true
  } catch (err) {
    console.error('Welcome email error:', err)
    return false
  }
}

/**
 * Send an alert to the admin when a new plan is purchased
 */
export async function sendPlanUpgradeNotification(
  organizerEmail: string,
  planId: string,
  amount: number
): Promise<boolean> {
  const html = `
<!DOCTYPE html>
<html>
<body style="margin:0;padding:0;background:#f4f4f5;font-family:sans-serif;">
  <div style="max-width:600px;margin:40px auto;background:#ffffff;border-radius:24px;overflow:hidden;box-shadow:0 10px 40px rgba(0,0,0,0.1);border:1px solid #e2e8f0;">
    <div style="background:#0a1628;padding:40px;text-align:center;">
       <h1 style="margin:0;font-size:32px;color:#ffffff;font-weight:900;">NEW SALE! 🚀</h1>
       <p style="margin:10px 0 0;font-size:16px;color:#85B7EB;">A new plan upgrade just happened</p>
    </div>
    <div style="padding:40px;">
       <div style="background:#F0FDF4;border:2px solid #86EFAC;color:#166534;padding:24px;border-radius:16px;text-align:center;margin-bottom:32px;">
          <p style="margin:0;font-size:12px;font-weight:900;text-transform:uppercase;letter-spacing:0.1em;opacity:0.7;">Revenue Collected</p>
          <p style="margin:4px 0 0;font-size:48px;font-weight:900;">₹${amount.toLocaleString()}</p>
       </div>
       <table width="100%" style="border-collapse:collapse;">
          <tr>
            <td style="padding:12px 0;border-bottom:1px solid #f1f5f9;color:#64748b;font-weight:bold;font-size:12px;text-transform:uppercase;">Plan Tier</td>
            <td style="padding:12px 0;border-bottom:1px solid #f1f5f9;text-align:right;font-weight:900;color:#0f172a;text-transform:uppercase;">${planId}</td>
          </tr>
          <tr>
            <td style="padding:12px 0;border-bottom:1px solid #f1f5f9;color:#64748b;font-weight:bold;font-size:12px;text-transform:uppercase;">Organizer</td>
            <td style="padding:12px 0;border-bottom:1px solid #f1f5f9;text-align:right;font-weight:bold;color:#1d4ed8;">${organizerEmail}</td>
          </tr>
          <tr>
            <td style="padding:12px 0;color:#64748b;font-weight:bold;font-size:12px;text-transform:uppercase;">Status</td>
            <td style="padding:12px 0;text-align:right;font-weight:900;color:#059669;">CONFIRMED ✅</td>
          </tr>
       </table>
    </div>
  </div>
</body>
</html>`

  try {
    await resend.emails.send({
      from: `PassNexus Sales <hello@passnexus.in>`,
      to: ['hello@passnexus.in'],
      subject: `📈 NEW SALE: ${planId.toUpperCase()} Plan — ₹${amount}`,
      html,
    })
    return true
  } catch (err) {
    console.error('Plan notification error:', err)
    return false
  }
}

/**
 * Send a Thank You / Receipt email to the organizer after a plan upgrade
 */
export async function sendThankYouForUpgradeEmail(
  toEmail: string,
  organizerName: string,
  planName: string,
  amount: number
): Promise<boolean> {
  const html = `
<!DOCTYPE html>
<html>
<body style="margin:0;padding:0;background:#f4f4f5;font-family:'Segoe UI',Arial,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#f4f4f5;padding:32px 0;">
    <tr><td align="center">
      <table width="560" cellpadding="0" cellspacing="0" style="background:#ffffff;border-radius:16px;overflow:hidden;box-shadow:0 4px 24px rgba(0,0,0,0.08);">
        <tr>
           <td style="background:#0a1628;padding:32px 40px;text-align:center;">
             <h1 style="margin:0;font-size:24px;color:#ffffff;font-weight:700;">Upgrade Successful! 🎉</h1>
             <p style="margin:8px 0 0;font-size:14px;color:#85B7EB;">Thank you for upgrading PassNexus</p>
           </td>
        </tr>
        <tr>
          <td style="padding:40px;">
             <p style="margin:0 0 16px;font-size:16px;color:#111827;">Hello <strong>${organizerName}</strong>,</p>
             <p style="margin:0 0 24px;font-size:14px;color:#4B5563;line-height:1.6;">
                Your PassNexus workspace has been successfully upgraded to the <strong>${planName.toUpperCase()}</strong> plan. 
                Your new limits and premium features have been unlocked immediately!
             </p>

             <div style="background:#F0FDF4;border:2px solid #86EFAC;color:#166534;padding:24px;border-radius:16px;text-align:center;margin-bottom:32px;">
                <p style="margin:0;font-size:12px;font-weight:900;text-transform:uppercase;letter-spacing:0.1em;opacity:0.7;">Total Paid</p>
                <p style="margin:4px 0 0;font-size:40px;font-weight:900;">₹${amount.toLocaleString()}</p>
             </div>

             <div style="text-align:center;margin-top:24px;">
               <a href="${process.env.NEXT_PUBLIC_APP_URL}/admin/dashboard" style="display:inline-block;background:#1D4ED8;color:#ffffff;text-decoration:none;padding:12px 32px;border-radius:8px;font-weight:600;font-size:14px;">Go to Dashboard</a>
             </div>
          </td>
        </tr>
        <tr>
          <td style="background:#F9FAFB;padding:20px 40px;text-align:center;border-top:1px solid #E5E7EB;">
             <p style="margin:0;font-size:11px;color:#9CA3AF;font-weight:bold;letter-spacing:0.05em;">
                Powered by PassNexus Protocol
             </p>
          </td>
        </tr>
      </table>
    </td></tr>
  </table>
</body>
</html>`

  try {
    await resend.emails.send({
      from: `PassNexus <hello@passnexus.in>`,
      to: [toEmail],
      subject: `Thank You! Your account is now on the ${planName.toUpperCase()} Plan 🚀`,
      html,
    })
    return true
  } catch (err) {
    console.error('Upgrade Thank You email error:', err)
    return false
  }
}
