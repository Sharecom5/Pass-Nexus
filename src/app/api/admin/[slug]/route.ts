import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/mongodb';
import { Visitor } from '@/models/Visitor';
import { Event } from '@/models/Event';
import { Organizer } from '@/models/Organizer';
import { PLANS } from '@/lib/plans';

export async function GET(req: NextRequest, props: { params: Promise<{ slug: string }> }) {
  try {
    const { slug } = await props.params;
    await connectDB();

    // Verify event and get organizer info
    const event = await Event.findOne({ slug }).populate('organizerId');
    if (!event) {
      return NextResponse.json({ error: 'Event not found' }, { status: 404 });
    }

    const organizer = event.organizerId as any;
    const planId = organizer?.plan || 'free';
    const plan = (PLANS as any)[planId] || PLANS.free;
    const passLimit = plan.passLimit;

    // Fetch all attendees for this event
    const attendees = await Visitor.find({ eventId: event._id }).sort({ createdAt: -1 });

    return NextResponse.json({ 
      success: true, 
      event, 
      attendees,
      planLimit: passLimit,
      planName: plan.name,
      stats: {
        total: attendees.length,
        entered: attendees.filter(a => a.status === 'entered').length,
        pending: attendees.filter(a => a.status === 'registered').length
      }
    });

  } catch (error: any) {
    console.error('Admin fetch error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
