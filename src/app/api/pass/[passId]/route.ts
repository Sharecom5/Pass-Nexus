import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/mongodb';
import { Visitor } from '@/models/Visitor';
import { Event } from '@/models/Event';
import { ScanLog } from '@/models/ScanLog';

// GET visitor details by passId
export async function GET(req: NextRequest, { params }: { params: { passId: string } }) {
  try {
    const { passId } = params;
    await connectDB();

    const visitor = await Visitor.findOne({ passId });
    if (!visitor) {
      return NextResponse.json({ error: 'Pass not found' }, { status: 404 });
    }

    // Also fetch event details, excluding the PIN for security
    const event = await Event.findById(visitor.eventId).select('-checkinPin');

    return NextResponse.json({ 
      success: true, 
      visitor,
      eventSettings: event // Return full event object for layout and dates
    });
  } catch (error: any) {
    console.error('Fetch pass error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

// POST to mark as entered
export async function POST(req: NextRequest, { params }: { params: { passId: string } }) {
  try {
    const { passId } = params;
    const body = await req.json().catch(() => ({}));
    const { eventSlug, checkinPin } = body;

    await connectDB();

    const query: any = { passId };
    let event = null;
    
    // If eventSlug is provided (from the scanner), ensure it matches
    if (eventSlug) {
      event = await Event.findOne({ slug: eventSlug });
      if (event) {
        query.eventId = event._id;
      }
    } else {
      // Find the pass first to get the event
      const passTemp = await Visitor.findOne(query);
      if (passTemp) {
        event = await Event.findById(passTemp.eventId);
      }
    }

    // Verify PIN if the event has one
    if (event && event.checkinPin && event.checkinPin !== checkinPin) {
      return NextResponse.json({ error: 'Invalid or missing Check-in PIN' }, { status: 401 });
    }

    // Verify pass exists
    const checkPass = await Visitor.findOne(query);
    if (!checkPass) {
      await ScanLog.create({ passId, result: 'denied', scannedAt: new Date() });
      return NextResponse.json({ error: 'Pass not found or invalid for this event' }, { status: 404 });
    }

    // Even if status is 'entered', we allow the scan to proceed (re-entry)
    const visitor = await Visitor.findOneAndUpdate(
      query,
      { status: 'entered', enteredAt: new Date() },
      { new: true }
    );

    // Record entry in ScanLog
    await ScanLog.create({
      passId,
      visitorName: visitor.name,
      result: 'granted', // Always granted if the pass is valid
      scannedAt: new Date()
    });

    if (!visitor) {
      return NextResponse.json({ error: 'Pass not found' }, { status: 404 });
    }

    return NextResponse.json({ success: true, visitor });
  } catch (error: any) {
    console.error('Update pass error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
