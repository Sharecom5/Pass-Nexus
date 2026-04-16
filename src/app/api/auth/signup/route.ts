import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/mongodb';
import { Organizer } from '@/models/Organizer';
import { sendWelcomeEmail } from '@/lib/resend';
import bcrypt from 'bcryptjs';

export async function POST(req: NextRequest) {
  try {
    const { name, email, password, companyName } = await req.json();

    if (!name || !email || !password) {
      return NextResponse.json({ error: 'Name, email, and password are required.' }, { status: 400 });
    }

    if (password.length < 8) {
      return NextResponse.json({ error: 'Password must be at least 8 characters.' }, { status: 400 });
    }

    await connectDB();

    const existing = await Organizer.findOne({ email: email.toLowerCase() });
    if (existing) {
      return NextResponse.json({ error: 'An account with this email already exists.' }, { status: 409 });
    }

    const passwordHash = await bcrypt.hash(password, 12);

    const organizer = await Organizer.create({
      name,
      email: email.toLowerCase(),
      passwordHash,
      companyName: companyName || name,
      plan: 'free',
    });

    // Send Welcome Email
    try {
      await sendWelcomeEmail(email.toLowerCase(), name);
    } catch (e) {
      console.error('Failed to send welcome email:', e);
    }

    return NextResponse.json({
      success: true,
      message: 'Account created successfully.',
      organizerId: organizer._id.toString(),
    });

  } catch (error: any) {
    console.error('Signup error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
