import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/mongodb';
import { Organizer } from '@/models/Organizer';

// This is a simple admin-only endpoint to upgrade a user's plan manually
// In production, this would be triggered by a Stripe webhook
export async function POST(req: NextRequest) {
  try {
    const { email, plan, adminSecret } = await req.json();

    // Simple secret check — replace with proper admin auth in production
    if (adminSecret !== process.env.ADMIN_SECRET) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    if (!email || !plan || !['free', 'pro', 'enterprise'].includes(plan)) {
      return NextResponse.json({ error: 'Invalid request' }, { status: 400 });
    }

    await connectDB();

    const organizer = await Organizer.findOneAndUpdate(
      { email: email.toLowerCase() },
      { plan },
      { new: true }
    );

    if (!organizer) {
      return NextResponse.json({ error: 'Organizer not found' }, { status: 404 });
    }

    return NextResponse.json({
      success: true,
      message: `Plan updated to ${plan} for ${email}`,
      organizer: { email: organizer.email, plan: organizer.plan }
    });

  } catch (error: any) {
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
