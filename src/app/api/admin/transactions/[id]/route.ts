import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { connectDB } from "@/lib/mongodb";
import { Transaction } from "@/models/Transaction";
import { Organizer } from "@/models/Organizer";

export async function GET(req: NextRequest, context: { params: Promise<{ id: string }> }) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await connectDB();
    const resolvedParams = await context.params;
    const { id } = resolvedParams;

    const transaction = await Transaction.findOne({ _id: id, organizerEmail: session.user.email });
    if (!transaction) {
      return NextResponse.json({ error: "Transaction not found" }, { status: 404 });
    }

    const organizer = await Organizer.findOne({ email: session.user.email });

    return NextResponse.json({ transaction, organizer });
  } catch (err: any) {
    console.error("Transaction Fetch Error:", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
