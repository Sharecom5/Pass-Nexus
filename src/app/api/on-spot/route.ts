import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { connectDB } from "@/lib/mongodb";
import { Visitor } from "@/models/Visitor";
import { nanoid } from "nanoid";
import { generateQRCodeBase64 } from "@/lib/qrcode";

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession();
    if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { name, email, phone, company, designation, passType, eventId, eventName } = await req.json();

    if (!name || !eventId) {
      return NextResponse.json({ error: "Name and Event are required" }, { status: 400 });
    }

    await connectDB();

    const passId = `PN-${nanoid(8).toUpperCase()}`;
    
    // In On-Spot mode, we generate the QR code immediately for printing
    const verificationUrl = `${process.env.NEXT_PUBLIC_APP_URL || ''}/pass/${passId}`;
    const qrCode = await generateQRCodeBase64(verificationUrl);

    const visitor = await Visitor.create({
      passId,
      name,
      email: email || `${passId}@passnexus.in`, // Fallback for walk-ins without email
      phone: phone || 'Walk-in',
      company,
      designation,
      passType: passType || 'Visitor',
      eventName,
      eventId,
      organizerId: (session.user as any).id || null,
      status: 'pending' // Ready for scanning
    });

    return NextResponse.json({ 
      success: true, 
      visitor: {
        ...visitor.toObject(),
        qrCode
      }
    });

  } catch (error) {
    console.error("On-Spot API Error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
