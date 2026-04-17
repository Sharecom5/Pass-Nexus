import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import { Event } from "@/models/Event";

export async function PATCH(req: NextRequest, { params }: { params: { slug: string } }) {
  try {
    const { slug } = params;
    const body = await req.json();

    await connectDB();
    const event = await Event.findOneAndUpdate(
      { slug },
      { $set: body },
      { new: true }
    );

    if (!event) return NextResponse.json({ error: "Event not found" }, { status: 404 });

    return NextResponse.json({ success: true, event });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
