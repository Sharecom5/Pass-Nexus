import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { connectDB } from "@/lib/mongodb";
import { Visitor } from "@/models/Visitor";
import { ScanLog } from "@/models/ScanLog";
import { Event } from "@/models/Event";

export async function GET(req: NextRequest) {
  try {
    const session = await getServerSession();
    if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    await connectDB();

    // In a real multi-organizer setup, we'd filter by session.user.id
    // For now, we'll provide global stats for the first event
    const [totalVisitors, enteredCount, recentScans, activeEvent] = await Promise.all([
      Visitor.countDocuments({ status: { $ne: 'cancelled' } }),
      Visitor.countDocuments({ status: 'entered' }),
      ScanLog.find().sort({ createdAt: -1 }).limit(10).lean(),
      Event.findOne().lean(),
    ]);

    // Calculate conversion / scan rate
    const scanRate = totalVisitors > 0 ? (enteredCount / totalVisitors) * 100 : 0;

    return NextResponse.json({
      stats: {
        totalVisitors,
        enteredCount,
        pendingCount: totalVisitors - enteredCount,
        scanRate: scanRate.toFixed(1) + '%',
      },
      recentScans,
      activeEvent
    });

  } catch (error) {
    console.error("Stats API Error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
