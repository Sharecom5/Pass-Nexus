import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { connectDB } from "@/lib/mongodb";
import { Organizer } from "@/models/Organizer";

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { 
      razorpay_order_id, 
      razorpay_payment_id, 
      razorpay_signature,
      planId
    } = await req.json();

    if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature || !planId) {
      return NextResponse.json({ error: "Missing plan payment details" }, { status: 400 });
    }

    const secret = process.env.RAZORPAY_KEY_SECRET!;
    const body = razorpay_order_id + "|" + razorpay_payment_id;

    const expectedSignature = crypto
      .createHmac("sha256", secret)
      .update(body.toString())
      .digest("hex");

    const isMatch = expectedSignature === razorpay_signature;

    if (isMatch) {
      await connectDB();
      // Update the organizer's plan in DB
      const result = await Organizer.findOneAndUpdate(
        { email: session.user.email },
        { plan: planId },
        { new: true }
      );

      if (!result) {
        return NextResponse.json({ error: "Organizer not found to upgrade" }, { status: 404 });
      }

      return NextResponse.json({ 
        success: true, 
        message: `Successfully upgraded to ${planId} plan!`,
        newPlan: result.plan
      });
    } else {
      return NextResponse.json({ success: false, error: "Invalid payment signature" }, { status: 400 });
    }
  } catch (err: any) {
    console.error("Plan Verification Error:", err);
    return NextResponse.json({ error: "Internal server error during plan verification" }, { status: 500 });
  }
}
