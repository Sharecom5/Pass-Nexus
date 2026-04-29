import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/mongodb';
import { Visitor } from '@/models/Visitor';
import { Event } from '@/models/Event';
import { ScanLog } from '@/models/ScanLog';
import { getServerSession } from "next-auth/next";
import { authOptions } from '@/lib/auth';

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions) as any;
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    const organizerId = session.user.id;

    const body = await req.json().catch(() => ({}));
    const { passId } = body;
    if (!passId) return NextResponse.json({ error: 'Pass ID is required' }, { status: 400 });

    await connectDB();

    const passTemp = await Visitor.findOne({ passId });
    if (!passTemp) {
      await ScanLog.create({ passId, result: 'denied', scannedAt: new Date() });
      return NextResponse.json({ error: 'Pass not found' }, { status: 404 });
    }

    const event = await Event.findById(passTemp.eventId);
    if (!event || event.organizerId.toString() !== organizerId) {
      return NextResponse.json({ error: 'Pass does not belong to any of your events' }, { status: 403 });
    }

    const visitor = await Visitor.findOneAndUpdate(
      { passId },
      { status: 'entered', enteredAt: new Date() },
      { new: true }
    );

    if (!visitor) {
      return NextResponse.json({ error: 'Pass not found' }, { status: 404 });
    }

    await ScanLog.create({
      passId,
      visitorName: visitor.name,
      result: 'granted',
      scannedAt: new Date()
    });

    return NextResponse.json({ success: true, visitor, event });
  } catch (error: any) {
    console.error('Global admin scan error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
