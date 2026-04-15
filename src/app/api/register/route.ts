import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/mongodb';
import { Pass } from '@/models/Pass';
import { Event } from '@/models/Event';
import { nanoid } from 'nanoid';

export async function POST(req: NextRequest) {
  try {
    const data = await req.json();
    const { eventSlug, name, email, phone, company, designation } = data;

    if (!eventSlug || !name || !email) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    await connectDB();

    // Verify event exists
    const event = await Event.findOne({ slug: eventSlug });
    if (!event) {
      return NextResponse.json({ error: 'Event not found' }, { status: 404 });
    }

    // Check if attendee already registered for this event
    const existing = await Pass.findOne({ eventSlug, email });
    if (existing) {
      return NextResponse.json({ 
        message: 'Attendee already registered', 
        passId: existing.passId 
      });
    }

    // Generate unique pass ID
    const passId = `PN-${nanoid(8).toUpperCase()}`;

    const newPass = await Pass.create({
      passId,
      eventSlug,
      name,
      email,
      phone,
      company,
      designation,
      passType: 'Visitor', // Default type
      status: 'active'
    });

    return NextResponse.json({ 
      success: true, 
      passId: newPass.passId,
      message: 'Registration successful'
    });

  } catch (error: any) {
    console.error('Registration Error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
