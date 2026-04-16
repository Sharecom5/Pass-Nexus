import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/mongodb';
import { Event } from '@/models/Event';
import { Visitor } from '@/models/Visitor';
import { getServerSession } from 'next-auth/next';
import GoogleProvider from "next-auth/providers/google";
import CredentialsProvider from "next-auth/providers/credentials";
import { Organizer } from "@/models/Organizer";
import bcrypt from "bcryptjs";
import { NextAuthOptions } from "next-auth";
import { getPlanLimits, PlanId } from '@/lib/plans';

const authOptions: NextAuthOptions = {
  providers: [
    GoogleProvider({ clientId: process.env.GOOGLE_CLIENT_ID || "", clientSecret: process.env.GOOGLE_CLIENT_SECRET || "" }),
    CredentialsProvider({
      name: "Credentials",
      credentials: { email: { label: "Email", type: "email" }, password: { label: "Password", type: "password" } },
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
          existingUser = await Organizer.create({ name: user.name || 'Organizer', email: user.email?.toLowerCase(), googleId: profile?.sub, companyName: user.name || 'Organizer', plan: 'free' });
        } else if (!existingUser.googleId) {
          existingUser.googleId = profile?.sub;
          await existingUser.save();
        }
        user.id = existingUser._id.toString();
      }
      return true;
    },
    async session({ session, token }) { if (session.user && token.sub) { (session.user as any).id = token.sub; } return session; },
    async jwt({ token, user }) { if (user) token.sub = user.id; return token; }
  },
  session: { strategy: 'jwt' },
  pages: { signIn: '/admin/login' },
  secret: process.env.NEXTAUTH_SECRET || "fallback_secret_key",
};

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
