import { NextRequest, NextResponse } from 'next/server';
import { Visitor } from '@/models/Visitor';
import { Event } from '@/models/Event';
import { getServerSession } from "next-auth/next";
import { connectDB } from '@/lib/mongodb';
import { authOptions } from '@/lib/auth';

export async function DELETE(req: NextRequest, props: { params: Promise<{ id: string }> }) {
  try {
    const session = await getServerSession(authOptions) as any;
    if (!session?.user?.id) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const { id } = await props.params;
    await connectDB();

    const visitor = await Visitor.findById(id);
    if (!visitor) return NextResponse.json({ error: 'Visitor not found' }, { status: 404 });

    // Verify the event belongs to this organizer
    const event = await Event.findOne({ _id: visitor.eventId, organizerId: session.user.id });
    if (!event) return NextResponse.json({ error: 'Unauthorized deletion' }, { status: 403 });

    await Visitor.deleteOne({ _id: id });

    return NextResponse.json({ success: true, message: 'Attendee deleted' });
  } catch (error: any) {
    return NextResponse.json({ error: 'Internal Server Error', details: error.message }, { status: 500 });
  }
}
