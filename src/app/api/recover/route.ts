import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import { Visitor } from "@/models/Visitor";
import { sendPassEmail } from "@/lib/resend";
import { generateQRCodeBase64 } from "@/lib/qrcode";

export async function POST(req: NextRequest) {
  try {
    const { email } = await req.json();

    if (!email) {
      return NextResponse.json({ error: "Email is required" }, { status: 400 });
    }

    await connectDB();

    const visitors = await Visitor.find({ email: email.toLowerCase().trim() }).sort({ createdAt: -1 });

    if (visitors.length === 0) {
      return NextResponse.json({ error: "No passes found for this email" }, { status: 404 });
    }

    const latestVisitor = visitors[0];
    const verificationUrl = `${process.env.NEXT_PUBLIC_APP_URL || ''}/pass/${latestVisitor.passId}`;
    const qrCode = await generateQRCodeBase64(verificationUrl);

    // Send Email via Resend in the background
    try {
      await sendPassEmail({
        to: latestVisitor.email,
        visitorName: latestVisitor.name,
        passId: latestVisitor.passId,
        passType: latestVisitor.passType,
        eventName: latestVisitor.eventName || 'Your Event',
        eventDate: 'See Ticket',
        eventVenue: 'Venue',    
        qrCodeBase64: qrCode
      });
    } catch (e) {
      console.error("Recovery email failed to send", e);
    }

    return NextResponse.json({ 
      success: true, 
      message: `We found ${visitors.length} passes and sent them to your email.`,
      visitor: {
        ...latestVisitor.toObject(),
        qrCode
      }
    });

  } catch (error) {
    console.error("Recovery API Error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
