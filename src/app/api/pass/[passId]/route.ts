import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import { Pass } from '@/models/Pass';
import { Event } from '@/models/Event';

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ passId: string }> }
) {
  try {
    const { passId } = await params;

    if (!passId) {
      return NextResponse.json({ error: 'Pass ID is required' }, { status: 400 });
    }

    await connectDB();

    const pass = await Pass.findOne({ passId });
    if (!pass) {
      return NextResponse.json({ error: 'Pass not found' }, { status: 404 });
    }

    const event = await Event.findOne({ slug: pass.eventSlug });

    return NextResponse.json({
      pass,
      event: event || null
    });

  } catch (error: any) {
    console.error('Pass Fetch Error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
