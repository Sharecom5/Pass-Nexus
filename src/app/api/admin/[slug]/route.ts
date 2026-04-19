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

    // Verify event and get organizer info safely
    const event = await Event.findOne({ slug });
    if (!event) {
      return NextResponse.json({ error: 'Event not found' }, { status: 404 });
    }

    let organizer = null;
    if (event.organizerId && /^[0-9a-fA-F]{24}$/.test(event.organizerId.toString())) {
      organizer = await Organizer.findById(event.organizerId);
    }

    const planId = organizer?.plan || 'free';
    const plan = (PLANS as any)[planId] || PLANS.free;
    const passLimit = plan.passLimit;

    const url = new URL(req.url);
    const page = parseInt(url.searchParams.get('page') || '1');
    const limit = parseInt(url.searchParams.get('limit') || '50');
    const search = url.searchParams.get('search') || '';
    const filter = url.searchParams.get('filter') || 'all';
    const skip = (page - 1) * limit;

    // Base query for this event
    const query: any = { eventId: event._id };

    // Add status filter if provided
    if (filter === 'entered') {
      query.status = 'entered';
    } else if (filter === 'pending') {
      query.status = 'registered';
    } else if (filter === 'walkin') {
      query.$or = [
        { registrationSource: 'instant' },
        { passType: 'VIP' },
        { passType: 'Walk-in Badge' }
      ];
    }

    // Add search filters if search is provided
    if (search) {
      const searchRegex = { $regex: search, $options: 'i' };
      const searchObj = {
        $or: [
          { name: searchRegex },
          { email: searchRegex },
          { passId: searchRegex },
          { company: searchRegex }
        ]
      };
      
      // If we already have a status filter, we need to AND it with the search OR
      if (query.status || query.$or) {
        query.$and = [
          { $or: query.$or ? query.$or : [{ status: query.status }] },
          searchObj
        ];
        delete query.$or;
        delete query.status;
      } else {
        query.$or = searchObj.$or;
      }
    }

    // Fetch paginated attendees
    const attendees = await Visitor.find(query)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    // Get counts for stats and pagination
    const totalMatching = await Visitor.countDocuments(query);
    const totalForEvent = await Visitor.countDocuments({ eventId: event._id });
    const entered = await Visitor.countDocuments({ eventId: event._id, status: 'entered' });
    const pending = await Visitor.countDocuments({ eventId: event._id, status: 'registered' });

    return NextResponse.json({ 
      success: true, 
      event, 
      attendees,
      planLimit: passLimit,
      planName: plan.name,
      pagination: {
        total: totalMatching,
        totalPages: Math.ceil(totalMatching / limit),
        currentPage: page,
        limit
      },
      stats: {
        total: totalForEvent,
        entered: entered,
        pending: pending
      }
    });

  } catch (error: any) {
    console.error('Admin fetch error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
