import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/mongodb';
import { Event } from '@/models/Event';
import { Visitor } from '@/models/Visitor';
import { getServerSession } from "next-auth/next";
import { Organizer } from "@/models/Organizer";
import bcrypt from "bcryptjs";
import GoogleProvider from "next-auth/providers/google";
import CredentialsProvider from "next-auth/providers/credentials";
import { NextAuthOptions } from "next-auth";

// Auth options repeated for standalone route reliability
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
    async session({ session, token }) {
      if (session.user && token.sub) {
        (session.user as any).id = token.sub;
      }
      return session;
    },
  },
  session: { strategy: 'jwt' },
  secret: process.env.NEXTAUTH_SECRET || "fallback_secret_key",
};

export async function PUT(req: NextRequest, props: { params: Promise<{ id: string }> }) {
  try {
    const session = await getServerSession(authOptions) as any;
    if (!session?.user?.id) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const { id } = await props.params;
    const body = await req.json();

    await connectDB();
    const event = await Event.findOne({ _id: id, organizerId: session.user.id });
    if (!event) return NextResponse.json({ error: 'Event not found or unauthorized' }, { status: 404 });

    // Update fields
    const allowedUpdates = ['name', 'slug', 'date', 'endDate', 'venue', 'description', 'passSettings', 'checkinPin'];
    allowedUpdates.forEach(field => {
      if (body[field] !== undefined) {
        if (field === 'slug') {
            event[field] = body[field].toLowerCase().replace(/\s+/g, '-');
        } else {
            event[field] = body[field];
        }
      }
    });

    await event.save();
    return NextResponse.json({ success: true, event });
  } catch (error: any) {
    return NextResponse.json({ error: 'Internal Server Error', details: error.message }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest, props: { params: Promise<{ id: string }> }) {
  try {
    const session = await getServerSession(authOptions) as any;
    if (!session?.user?.id) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const { id } = await props.params;
    await connectDB();

    const event = await Event.findOne({ _id: id, organizerId: session.user.id });
    if (!event) return NextResponse.json({ error: 'Event not found or unauthorized' }, { status: 404 });

    // Delete all visitors associated with this event
    await Visitor.deleteMany({ eventId: event._id });
    
    // Delete the event itself
    await Event.deleteOne({ _id: id });

    return NextResponse.json({ success: true, message: 'Event and all attendees deleted' });
  } catch (error: any) {
    return NextResponse.json({ error: 'Internal Server Error', details: error.message }, { status: 500 });
  }
}
