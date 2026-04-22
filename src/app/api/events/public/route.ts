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

    let event = await Event.findOne({ slug }).lean();

    if (!event && slug === 'demo-event') {
      console.log(`[API] Creating missing demo-event on the fly`);
      const newEvent = await Event.create({ 
        name: 'Demo Event', 
        slug: 'demo-event', 
        venue: 'Virtual/Local Venue', 
        date: '2026-12-31',
        passTypes: ['Visitor', 'VIP', 'Exhibitor'],
        passSettings: {
          showName: true,
          showDesignation: true,
          showCompany: true,
          showPhone: true,
          infoPosition: 60,
          qrPosition: 15
        }
      });
      event = newEvent.toObject();
    }

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
