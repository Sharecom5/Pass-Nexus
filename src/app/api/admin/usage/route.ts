import { NextRequest, NextResponse } from 'next/server';
import { Event } from '@/models/Event';
import { Visitor } from '@/models/Visitor';
import { Organizer } from '@/models/Organizer';
import { getServerSession } from 'next-auth/next';
import { connectDB } from '@/lib/mongodb';
import { authOptions } from '@/lib/auth';
import { getPlanLimits, PlanId } from '@/lib/plans';

export async function GET(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions) as any;
    if (!session?.user?.id) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const organizerId = session.user.id;
    await connectDB();

    const organizer = await Organizer.findById(organizerId).select('plan');
    const plan = (organizer?.plan ?? 'free') as PlanId;
    const limits = getPlanLimits(plan);

    const allEvents = await Event.find({ organizerId }).select('_id');
    const eventIdList = allEvents.map((e: any) => e._id);
    const totalPasses = await Visitor.countDocuments({ eventId: { $in: eventIdList } });
    const totalEvents = allEvents.length;

    const isEventLimited = limits.eventLimit !== -1 && totalEvents >= limits.eventLimit;
    const isPassLimited = limits.passLimit !== -1 && totalPasses >= limits.passLimit;

    return NextResponse.json({
      success: true,
      plan,
      planName: limits.name,
      totalPasses,
      passLimit: limits.passLimit,
      totalEvents,
      eventLimit: limits.eventLimit,
      isPassLimited,
      isEventLimited,
      isLimited: isEventLimited || isPassLimited,
    });
  } catch (error: any) {
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
