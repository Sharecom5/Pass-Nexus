import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { connectDB } from "@/lib/mongodb";
import { Event } from "@/models/Event";

export async function GET(req: NextRequest) {
  try {
    const session = await getServerSession();
    if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    await connectDB();
    // Filter by organizerId in production
    const events = await Event.find().sort({ createdAt: -1 }).lean();
    return NextResponse.json({ events });

  } catch (error) {
    console.error("Events GET Error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession();
    if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { name, date, venue, slug, passTypes } = await req.json();

    if (!name || !date || !venue || !slug) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    await connectDB();

    const existing = await Event.findOne({ slug });
    if (existing) {
      return NextResponse.json({ error: "Event slug already exists" }, { status: 400 });
    }

    const newEvent = await Event.create({
      name,
      date,
      venue,
      slug,
      passTypes: passTypes || ['Visitor', 'VIP', 'Exhibitor'],
      organizerId: (session.user as any).id || null // Add real ID if available
    });

    return NextResponse.json({ success: true, event: newEvent });

  } catch (error) {
    console.error("Events POST Error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
