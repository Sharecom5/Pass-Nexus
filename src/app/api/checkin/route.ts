import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import { Visitor } from "@/models/Visitor";
import { Event } from "@/models/Event";
import { ScanLog } from "@/models/ScanLog";

// POST /api/checkin  { passId, pin }
export async function POST(req: NextRequest) {
  try {
    const { passId, pin } = await req.json();

    if (!passId || !pin) {
      return NextResponse.json({ success: false, message: "Missing passId or PIN" }, { status: 400 });
    }

    await connectDB();

    // Find the visitor
    const visitor = await Visitor.findOne({ passId: passId.trim() });
    if (!visitor) {
      return NextResponse.json({ success: false, status: "not_found", message: "Pass not found" });
    }

    // Find the event and verify PIN
    const event = await Event.findById(visitor.eventId);
    if (!event) {
      return NextResponse.json({ success: false, status: "not_found", message: "Event not found" });
    }

    if (String(event.checkinPin) !== String(pin)) {
      return NextResponse.json({ success: false, status: "wrong_pin", message: "Incorrect PIN" });
    }

    // Check if already entered
    if (visitor.status === "cancelled") {
      return NextResponse.json({ success: false, status: "denied", message: "Pass has been cancelled" });
    }

    // Grant entry
    visitor.status = "entered";
    visitor.enteredAt = new Date();
    await visitor.save();

    await ScanLog.create({ passId: visitor.passId, visitorName: visitor.name, result: "granted" });

    return NextResponse.json({
      success: true,
      status: "granted",
      message: "Access Granted",
      visitor: {
        name: visitor.name,
        company: visitor.company,
        designation: visitor.designation,
        passType: visitor.passType,
        passId: visitor.passId,
        eventName: visitor.eventName,
      }
    });

  } catch (error: any) {
    console.error("Check-in error:", error.message);
    return NextResponse.json({ success: false, status: "error", message: "System error" }, { status: 500 });
  }
}
