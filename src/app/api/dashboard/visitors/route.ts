import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { connectDB } from "@/lib/mongodb";
import { Visitor } from "@/models/Visitor";

export const dynamic = 'force-dynamic';

export async function GET(req: NextRequest) {
  try {
    const session = await getServerSession();
    if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { searchParams } = new URL(req.url);
    const search = searchParams.get('search') || '';
    const status = searchParams.get('status') || '';
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');

    await connectDB();

    const query: any = {};
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } },
        { passId: { $regex: search, $options: 'i' } },
      ];
    }
    if (status) query.status = status;

    const [visitors, total] = await Promise.all([
      Visitor.find(query)
        .sort({ createdAt: -1 })
        .skip((page - 1) * limit)
        .limit(limit)
        .lean(),
      Visitor.countDocuments(query),
    ]);

    return NextResponse.json({
      visitors,
      pagination: {
        total,
        page,
        pages: Math.ceil(total / limit),
      }
    });

  } catch (error) {
    console.error("Visitors API Error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
