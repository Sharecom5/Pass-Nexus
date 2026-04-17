import { NextRequest, NextResponse } from 'next/server';
import { Event } from '@/models/Event';
import { getServerSession } from "next-auth/next";
import { connectDB } from '@/lib/mongodb';
import { authOptions } from '@/lib/auth';

export async function GET(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions) as any;

    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const organizerId = session.user.id;

    await connectDB();

    const events = await Event.find({ organizerId }).sort({ createdAt: -1 });

    return NextResponse.json({ success: true, events });
  } catch (error: any) {
    console.error('List events error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions) as any;

    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const organizerId = session.user.id;

    const { name, slug, date, venue, description, passSettings, endDate, checkinPin } = await req.json();

    if (!name || !slug || !date || !venue) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    await connectDB();

    // ─── Plan Event Limit ──────────────────────────────────────────────
    const organizer = await Organizer.findById(organizerId).select('plan');
    const plan = (organizer?.plan ?? 'free') as PlanId;
    const limits = getPlanLimits(plan);
    const eventCount = await Event.countDocuments({ organizerId });

    if (!isWithinLimit(eventCount, limits.eventLimit)) {
      return NextResponse.json({
        error: 'EVENT_LIMIT_REACHED',
        message: `Your ${limits.name} plan allows up to ${limits.eventLimit} event(s). Please upgrade to create more.`,
      }, { status: 402 });
    }
    // ─────────────────────────────────────────────────────────────────────


    const existing = await Event.findOne({ slug });
    if (existing) {
      return NextResponse.json({ error: 'Slug already in use. Please choose a different one.' }, { status: 400 });
    }

    const newEvent = await Event.create({
      organizerId,
      name,
      slug: slug.toLowerCase().replace(/\s+/g, '-'),
      date,
      endDate,
      venue,
      description,
      checkinPin: checkinPin || '1234',
      registrationOpen: true,
      passTypes: ['Visitor', 'VIP', 'Speaker'],
      passSettings: passSettings || {
        showName: true,
        showDesignation: true,
        showPhone: false,
        showCompany: true
      }
    });

    return NextResponse.json({ success: true, event: newEvent });
  } catch (error: any) {
    console.error('Create event error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
