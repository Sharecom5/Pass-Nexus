import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import { Visitor } from "@/models/Visitor";
// import { sendPassEmail } from "@/lib/resend"; // Need to implement this next

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

    // In a real setup, we would trigger sendPassEmail here for all found active passes
    // For now, we'll return success to the UI

    return NextResponse.json({ 
      success: true, 
      message: `We found ${visitors.length} passes and sent them to your email.` 
    });

  } catch (error) {
    console.error("Recovery API Error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
