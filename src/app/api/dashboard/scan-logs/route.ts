import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { connectDB } from '@/lib/mongodb';
import { ScanLog } from '@/models/ScanLog';

export async function GET(req: NextRequest) {
  try {
    const session = await getServerSession();
    if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const searchParams = req.nextUrl.searchParams;
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '20');
    const filter = searchParams.get('filter') || 'all'; // all, granted, denied

    await connectDB();

    const query: any = {};
    if (filter === 'granted') {
      query.success = true;
    } else if (filter === 'denied') {
      query.success = false;
    }

    const skip = (page - 1) * limit;

    const [logs, total] = await Promise.all([
      ScanLog.find(query)
        .sort({ scannedAt: -1 })
        .skip(skip)
        .limit(limit)
        .lean(),
      ScanLog.countDocuments(query)
    ]);

    return NextResponse.json({
      logs,
      total,
      page,
      totalPages: Math.ceil(total / limit)
    });

  } catch (error) {
    console.error('Scan logs API Error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
