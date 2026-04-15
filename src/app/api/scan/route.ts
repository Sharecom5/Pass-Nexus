import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import { Visitor } from "@/models/Visitor";
import { ScanLog } from "@/models/ScanLog";

export async function POST(req: NextRequest) {
  try {
    const { passId } = await req.json();
    const deviceInfo = req.headers.get('user-agent') || 'Scanner App';

    if (!passId) {
      return NextResponse.json({ success: false, status: 'invalid', message: 'No Pass ID detected' });
    }

    await connectDB();

    const visitor = await Visitor.findOne({ passId: passId.trim() });

    if (!visitor) {
      await ScanLog.create({ passId, result: 'denied', visitorName: 'Unknown', deviceInfo });
      return NextResponse.json({ 
        success: false, 
        status: 'not_found', 
        message: 'Invalid Pass: Not found in database' 
      });
    }

    if (visitor.status === 'cancelled') {
        await ScanLog.create({ passId: visitor.passId, visitorName: visitor.name, result: 'denied', deviceInfo });
        return NextResponse.json({ success: false, status: 'invalid', message: 'Access Denied: Pass has been cancelled' });
    }

    if (visitor.status === 'entered') {
      await ScanLog.create({ passId: visitor.passId, visitorName: visitor.name, result: 'duplicate', deviceInfo });
      return NextResponse.json({ 
        success: false, 
        status: 'duplicate', 
        message: 'Already Entered: Multi-entry not allowed',
        visitor: { name: visitor.name, passType: visitor.passType }
      });
    }

    // Grant Entry
    visitor.status = 'entered';
    visitor.enteredAt = new Date();
    await visitor.save();

    await ScanLog.create({ passId: visitor.passId, visitorName: visitor.name, result: 'granted', deviceInfo });

    return NextResponse.json({ 
      success: true, 
      status: 'granted', 
      message: 'Verified! Please allow entry.',
      visitor: {
        name: visitor.name,
        company: visitor.company,
        passType: visitor.passType,
        passId: visitor.passId
      }
    });

  } catch (error) {
    console.error("Scan API Error:", error);
    return NextResponse.json({ success: false, status: 'error', message: 'System error during verification' });
  }
}
