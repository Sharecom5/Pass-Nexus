import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import { Event } from "@/models/Event";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const slug = searchParams.get('slug');

    if (!slug) {
      return NextResponse.json({ error: "Missing slug" }, { status: 400 });
    }

    console.log(`[API] Fetching public event with slug: "${slug}"`);
    await connectDB();

    const event = await Event.findOne({ slug }).lean();

    if (!event) {
      console.warn(`[API] Event not found for slug: "${slug}"`);
      return NextResponse.json({ error: "Event not found" }, { status: 404 });
    }

    console.log(`[API] Found event: "${event.name}" (${event._id})`);
    return NextResponse.json({ event });

  } catch (error: any) {
    console.error("Public Event API Error:", error.message);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
