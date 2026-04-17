import { NextRequest, NextResponse } from "next/server";
import Razorpay from "razorpay";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { connectDB } from "@/lib/mongodb";
import { Organizer } from "@/models/Organizer";
import { PLANS } from "@/lib/plans";

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { planId } = await req.json();

    if (!process.env.RAZORPAY_KEY_ID || !process.env.RAZORPAY_KEY_SECRET) {
      return NextResponse.json({ error: "Razorpay keys not configured" }, { status: 500 });
    }

    const razorpay = new Razorpay({
      key_id: process.env.RAZORPAY_KEY_ID,
      key_secret: process.env.RAZORPAY_KEY_SECRET,
    });

    const plan = (PLANS as any)[planId];
    if (!plan || planId === 'free') {
      return NextResponse.json({ error: "Invalid plan selected" }, { status: 400 });
    }

    const amount = plan.priceValue; // Price in INR from lib/plans.ts

    // Amount in Razorpay is in Paisa (1 INR = 100 Paisa)
    const options = {
      amount: amount * 100,
      currency: "INR",
      receipt: `plan_upgrade_${session.user.email}_${Date.now()}`,
      notes: {
        planId,
        email: session.user.email,
        type: 'plan_upgrade'
      }
    };

    const order = await razorpay.orders.create(options);

    return NextResponse.json({
      orderId: order.id,
      amount: order.amount,
      currency: order.currency,
      planName: plan.name
    });
  } catch (err: any) {
    console.error("Razorpay Plan Order Error:", err);
    return NextResponse.json({ error: "Failed to create upgrade order" }, { status: 500 });
  }
}
