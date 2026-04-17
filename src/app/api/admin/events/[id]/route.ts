import { NextRequest, NextResponse } from 'next/server';
import { Event } from '@/models/Event';
import { Visitor } from '@/models/Visitor';
import { getServerSession } from "next-auth/next";
import { connectDB } from '@/lib/mongodb';
import { authOptions } from '@/lib/auth';

export async function PUT(req: NextRequest, props: { params: Promise<{ id: string }> }) {
  try {
    const session = await getServerSession(authOptions) as any;
    if (!session?.user?.id) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const { id } = await props.params;
    const body = await req.json();

    await connectDB();
    const event = await Event.findOne({ _id: id, organizerId: session.user.id });
    if (!event) return NextResponse.json({ error: 'Event not found or unauthorized' }, { status: 404 });

    // Update fields
    const allowedUpdates = ['name', 'slug', 'date', 'endDate', 'venue', 'description', 'passSettings', 'checkinPin'];
    allowedUpdates.forEach(field => {
      if (body[field] !== undefined) {
        if (field === 'slug') {
            event[field] = body[field].toLowerCase().replace(/\s+/g, '-');
        } else {
            event[field] = body[field];
        }
      }
    });

    await event.save();
    return NextResponse.json({ success: true, event });
  } catch (error: any) {
    return NextResponse.json({ error: 'Internal Server Error', details: error.message }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest, props: { params: Promise<{ id: string }> }) {
  try {
    const session = await getServerSession(authOptions) as any;
    if (!session?.user?.id) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const { id } = await props.params;
    await connectDB();

    const event = await Event.findOne({ _id: id, organizerId: session.user.id });
    if (!event) return NextResponse.json({ error: 'Event not found or unauthorized' }, { status: 404 });

    // Delete all visitors associated with this event
    await Visitor.deleteMany({ eventId: event._id });
    
    // Delete the event itself
    await Event.deleteOne({ _id: id });

    return NextResponse.json({ success: true, message: 'Event and all attendees deleted' });
  } catch (error: any) {
    return NextResponse.json({ error: 'Internal Server Error', details: error.message }, { status: 500 });
  }
}
