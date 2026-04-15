import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/mongodb';
import { Visitor } from '@/models/Visitor';
import { Event } from '@/models/Event';
import { nanoid } from 'nanoid';
import { generateQRCodeBase64 } from '@/lib/qrcode';
import { sendPassEmail } from '@/lib/resend';

export async function POST(req: NextRequest) {
  try {
    await connectDB();
    const { name, email, phone, company, designation, passType, eventSlug, eventId, eventName } = await req.json();

    if (!name || !email || (!eventSlug && !eventId)) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    // Generate unique Pass ID
    const passId = `PN-${nanoid(8).toUpperCase()}`;

    // Create the visitor record
    const visitor = await Visitor.create({
      passId,
      name,
      email: email.toLowerCase().trim(),
      phone,
      company,
      designation,
      passType: passType || 'Visitor',
      eventName: eventName || 'Registration',
      eventId: eventId || null,
      status: 'pending'
    });

    // Generate QR Code
    const verificationUrl = `${process.env.NEXT_PUBLIC_APP_URL || ''}/pass/${passId}`;
    const qrCodeBase64 = await generateQRCodeBase64(verificationUrl);

    // Send Email (Non-blocking ideally, but we'll wait for confirmation)
    try {
      await sendPassEmail({
        to: visitor.email,
        visitorName: visitor.name,
        passId: visitor.passId,
        passType: visitor.passType,
        eventName: visitor.eventName,
        eventDate: 'See Ticket', // Replace with real event date if eventId exists
        eventVenue: 'Venue',     // Replace with real venue
        qrCodeBase64
      });
    } catch (emailError) {
      console.error("Email send failed:", emailError);
      // We don't fail the registration if email fails, but we log it
    }

    return NextResponse.json({
      success: true,
      visitor: {
        ...visitor.toObject(),
        qrCode: qrCodeBase64
      }
    });

  } catch (error: any) {
    console.error('Registration API Error:', error);
    return NextResponse.json({ error: error.message || 'Internal server error' }, { status: 500 });
  }
}
