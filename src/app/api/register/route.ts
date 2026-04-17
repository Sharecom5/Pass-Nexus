import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/mongodb';
import { Event } from '@/models/Event';
import { Visitor } from '@/models/Visitor';
import { Organizer } from '@/models/Organizer';
import { sendPassEmail } from '@/lib/resend';
import { getPlanLimits, isWithinLimit, PlanId } from '@/lib/plans';
import QRCode from 'qrcode';
import crypto from 'crypto';

export async function POST(req: NextRequest) {
  try {
    const { name, email, phone, company, address, designation, passType, eventSlug, registrationSource } = await req.json();

    if (!name || !email || !eventSlug) {
      return NextResponse.json({ error: 'Missing required fields (name, email, eventSlug)' }, { status: 400 });
    }

    await connectDB();

    // Find the event
    let event = await Event.findOne({ slug: eventSlug });

    if (!event && eventSlug === 'demo-event') {
      event = await Event.create({ name: 'Demo Event', slug: 'demo-event', venue: 'Virtual/Local Venue', date: '2026-12-31' });
    }

    if (!event) {
      return NextResponse.json({ error: 'Event not found.' }, { status: 404 });
    }

    // ─── Plan Limit Gate ──────────────────────────────────────────────────
    if (event.organizerId) {
      const organizer = await Organizer.findById(event.organizerId).select('plan');
      const plan = (organizer?.plan ?? 'free') as PlanId;
      const limits = getPlanLimits(plan);

      // Count total passes across all organizer's events
      const allEventIds = (await Event.find({ organizerId: event.organizerId }).select('_id')).map((e: any) => e._id);
      const totalPasses = await Visitor.countDocuments({ eventId: { $in: allEventIds } });

      if (!isWithinLimit(totalPasses, limits.passLimit)) {
        return NextResponse.json({
          error: 'PLAN_LIMIT_REACHED',
          message: `This event has reached its pass limit (${limits.passLimit} passes on the ${limits.name} plan). The organizer needs to upgrade.`,
          totalPasses,
          limit: limits.passLimit,
          plan,
        }, { status: 402 });
      }
    }
    // ─────────────────────────────────────────────────────────────────────

    // Check if already registered for this event
    const existing = await Visitor.findOne({ email: email.toLowerCase(), eventId: event._id });
    if (existing) {
      return NextResponse.json({ success: true, message: 'Already registered', passId: existing.passId, qrCodeUrl: existing.qrCodeUrl });
    }

    // Generate unique passId
    let passId = "";
    let isUnique = false;
    const prefix = (event.name || "EVT").substring(0, 3).toUpperCase();
    while (!isUnique) {
      const uniquePart = crypto.randomBytes(3).toString('hex').toUpperCase();
      passId = `${prefix}-${uniquePart}`;
      const existingPass = await Visitor.findOne({ passId });
      if (!existingPass) isUnique = true;
    }

    // Generate QR code with full verification URL
    const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://www.andinnovatech.com';
    const verificationUrl = `${baseUrl}/pass/verify/${passId}`;
    const qrCodeDataUri = await QRCode.toDataURL(verificationUrl);

    const newVisitor = new Visitor({
      passId, name, email: email.toLowerCase(), phone, company, address, designation,
      passType: passType || 'Visitor',
      registrationSource: registrationSource || 'public',
      status: 'registered',
      qrCodeUrl: qrCodeDataUri,
      eventId: event._id,
      eventName: event.name,
      eventDate: event.date,
      eventVenue: event.venue,
    });
    await newVisitor.save();

    // Send pass email
    try {
      await sendPassEmail({
        to: email.toLowerCase(),
        visitorName: name,
        passId,
        passType: passType || 'Visitor',
        eventName: event.name,
        eventDate: event.date,
        eventVenue: event.venue,
        qrCodeBase64: qrCodeDataUri
      });
    } catch (emailErr) {
      console.error('Failed to send pass email:', emailErr);
    }

    return NextResponse.json({ success: true, passId, qrCodeUrl: qrCodeDataUri, message: 'Registration successful' });

  } catch (error: any) {
    console.error('Registration error:', error.message);
    return NextResponse.json({ error: 'Internal Server Error', details: error.message }, { status: 500 });
  }
}
