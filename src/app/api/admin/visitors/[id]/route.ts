import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/mongodb';
import { Visitor } from '@/models/Visitor';
import { Event } from '@/models/Event';
import { getServerSession } from "next-auth/next";
import { Organizer } from "@/models/Organizer";
import bcrypt from "bcryptjs";
import GoogleProvider from "next-auth/providers/google";
import CredentialsProvider from "next-auth/providers/credentials";
import { NextAuthOptions } from "next-auth";

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

export async function DELETE(req: NextRequest, props: { params: Promise<{}> }) {
  try {
    const session = await getServerSession(authOptions) as any;
    if (!session?.user?.id) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const {  } = await props.params;
    await connectDB();

    const visitor = await Visitor.findById(id);
    if (!visitor) return NextResponse.json({ error: 'Visitor not found' }, { status: 404 });

    // Verify the event belongs to this organizer
    const event = await Event.findOne({ _id: visitor.eventId, organizerId: session.user.id });
    if (!event) return NextResponse.json({ error: 'Unauthorized deletion' }, { status: 403 });

    await Visitor.deleteOne({ _id: id });

    return NextResponse.json({ success: true, message: 'Attendee deleted' });
  } catch (error: any) {
    return NextResponse.json({ error: 'Internal Server Error', details: error.message }, { status: 500 });
  }
}
