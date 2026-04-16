import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { connectDB } from "@/lib/mongodb";
import { Visitor } from "@/models/Visitor";
import { Event } from "@/models/Event";
import { nanoid } from "nanoid";
import { generateQRCodeBase64 } from "@/lib/qrcode";
import { sendPassEmail } from "@/lib/resend";

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

    // Background processing for emails (non-blocking for the bulk response)
    (async () => {
      for (const visitor of result) {
        try {
          const verificationUrl = `${process.env.NEXT_PUBLIC_APP_URL || ''}/pass/${visitor.passId}`;
          const qrCode = await generateQRCodeBase64(verificationUrl);
          await sendPassEmail({
            to: visitor.email,
            visitorName: visitor.name,
            passId: visitor.passId,
            passType: visitor.passType,
            eventName: visitor.eventName || 'Your Event',
            eventDate: 'See Ticket', 
            eventVenue: 'Venue',     
            qrCodeBase64: qrCode
          });
        } catch (e) {
          console.error(`Failed to send bulk email to ${visitor.email}`, e);
        }
      }
    })();

    return NextResponse.json({
      success: true,
      count: result.length,
      message: `${result.length} passes generated and queued for delivery.`,
    });

  } catch (error) {
    console.error("Bulk Generation Error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
