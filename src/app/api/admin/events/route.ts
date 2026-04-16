import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/mongodb';
import { Event } from '@/models/Event';
import { getServerSession } from "next-auth/next";
import GoogleProvider from "next-auth/providers/google";
import CredentialsProvider from "next-auth/providers/credentials";
import { Organizer } from "@/models/Organizer";
import bcrypt from "bcryptjs";
import { NextAuthOptions } from "next-auth";
import { getPlanLimits, isWithinLimit, PlanId } from '@/lib/plans';

// We inline authOptions here to avoid circular imports in the API route
const authOptions: NextAuthOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID || "",
      clientSecret: process.env.GOOGLE_CLIENT_SECRET || "",
    }),
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) return null;
        await connectDB();
        const user = await Organizer.findOne({ email: credentials.email.toLowerCase() });
        if (!user || !user.passwordHash) return null;
        const isValid = await bcrypt.compare(credentials.password, user.passwordHash);
        if (!isValid) return null;
        return { id: user._id.toString(), email: user.email, name: user.name };
      }
    })
  ],
  callbacks: {
    async signIn({ user, account, profile }) {
      if (account?.provider === 'google') {
        await connectDB();
        let existingUser = await Organizer.findOne({ email: user.email?.toLowerCase() });
        if (!existingUser) {
          existingUser = await Organizer.create({
            name: user.name || 'Organizer',
            email: user.email?.toLowerCase(),
            googleId: profile?.sub,
            companyName: user.name || 'Organizer',
            plan: 'free',
          });
        } else if (!existingUser.googleId) {
          existingUser.googleId = profile?.sub;
          await existingUser.save();
        }
        user.id = existingUser._id.toString();
      }
      return true;
    },
    async session({ session, token }) {
      if (session.user && token.sub) {
        (session.user as any).id = token.sub;
      }
      return session;
    },
    async jwt({ token, user }) {
      if (user) token.sub = user.id;
      return token;
    }
  },
  session: { strategy: 'jwt' },
  pages: { signIn: '/admin/login' },
  secret: process.env.NEXTAUTH_SECRET || "fallback_secret_key",
};

export async function GET(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions) as any;

    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const organizerId = session.user.id;

    await connectDB();

    const events = await Event.find({ organizerId }).sort({ createdAt: -1 });

    return NextResponse.json({ success: true, events });
  } catch (error: any) {
    console.error('List events error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions) as any;

    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const organizerId = session.user.id;

    const { name, slug, date, venue, description, passSettings, endDate, checkinPin } = await req.json();

    if (!name || !slug || !date || !venue) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    await connectDB();

    // ─── Plan Event Limit ──────────────────────────────────────────────
    const organizer = await Organizer.findById(organizerId).select('plan');
    const plan = (organizer?.plan ?? 'free') as PlanId;
    const limits = getPlanLimits(plan);
    const eventCount = await Event.countDocuments({ organizerId });

    if (!isWithinLimit(eventCount, limits.eventLimit)) {
      return NextResponse.json({
        error: 'EVENT_LIMIT_REACHED',
        message: `Your ${limits.name} plan allows up to ${limits.eventLimit} event(s). Please upgrade to create more.`,
      }, { status: 402 });
    }
    // ─────────────────────────────────────────────────────────────────────


    const existing = await Event.findOne({ slug });
    if (existing) {
      return NextResponse.json({ error: 'Slug already in use. Please choose a different one.' }, { status: 400 });
    }

    const newEvent = await Event.create({
      organizerId,
      name,
      slug: slug.toLowerCase().replace(/\s+/g, '-'),
      date,
      endDate,
      venue,
      description,
      checkinPin: checkinPin || '1234',
      registrationOpen: true,
      passTypes: ['Visitor', 'VIP', 'Speaker'],
      passSettings: passSettings || {
        showName: true,
        showDesignation: true,
        showPhone: false,
        showCompany: true
      }
    });

    return NextResponse.json({ success: true, event: newEvent });
  } catch (error: any) {
    console.error('Create event error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
