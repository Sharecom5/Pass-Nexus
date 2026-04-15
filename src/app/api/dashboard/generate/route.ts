import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { connectDB } from "@/lib/mongodb";
import { Visitor } from "@/models/Visitor";
import { nanoid } from "nanoid";

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession();
    if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { attendees, eventId, eventName } = await req.json();

    if (!attendees || !Array.isArray(attendees)) {
      return NextResponse.json({ error: "Invalid attendees data" }, { status: 400 });
    }

    await connectDB();

    const visitorsToCreate = attendees.map((att: any) => ({
      passId: `PN-${nanoid(8).toUpperCase()}`,
      name: att.name,
      email: att.email,
      phone: att.phone || 'N/A',
      company: att.company || '',
      designation: att.designation || 'Visitor',
      passType: att.passType || 'Standard',
      eventName: eventName || 'General Event',
      eventId: eventId || null,
      status: 'pending',
    }));

    const result = await Visitor.insertMany(visitorsToCreate);

    return NextResponse.json({
      success: true,
      count: result.length,
      message: `${result.length} passes generated successfully`,
    });

  } catch (error) {
    console.error("Bulk Generation Error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
