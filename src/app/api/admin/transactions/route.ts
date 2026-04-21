import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { connectDB } from "@/lib/mongodb";
import { Transaction } from "@/models/Transaction";

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await connectDB();
    const transactions = await Transaction.find({ organizerEmail: session.user.email }).sort({ createdAt: -1 });

    return NextResponse.json({ transactions });
  } catch (err: any) {
    console.error("Transactions Fetch Error:", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
