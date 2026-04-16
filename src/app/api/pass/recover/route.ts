import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/mongodb';
import { Visitor } from '@/models/Visitor';
import { Event } from '@/models/Event';

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const email = searchParams.get('email');

    if (!email) {
      return NextResponse.json({ error: 'Email is required' }, { status: 400 });
    }

    await connectDB();

    // Find all passes for this email
    const visitors = await Visitor.find({ email: email.toLowerCase() }).lean();

    if (visitors.length === 0) {
       return NextResponse.json({ success: true, passes: [] });
    }

    // Enhance visitors with event slugs for linking
    const eventIds = visitors.map(v => v.eventId).filter(id => !!id);
    const events = await Event.find({ _id: { $in: eventIds } }).select('slug').lean();
    
    // Create a map for quick lookup
    const eventMap = events.reduce((acc: any, curr: any) => {
      acc[curr._id.toString()] = curr.slug;
      return acc;
    }, {});

    const enrichedPasses = visitors.map((v: any) => ({
      ...v,
      eventSlug: v.eventId ? eventMap[v.eventId.toString()] : 'demo'
    }));

    return NextResponse.json({ 
      success: true, 
      passes: enrichedPasses 
    });

  } catch (error: any) {
    console.error('Recover passes error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
