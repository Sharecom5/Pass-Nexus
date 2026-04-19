import { GoogleGenerativeAI } from "@google/generative-ai";
import { NextResponse } from "next/server";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "");

const SYSTEM_PROMPT = `
You are the PassNexus Intelligent Assistant, a helpful and professional AI dedicated to helping users navigate the PassNexus platform. 

PassNexus is a high-end digital event registration and check-in system designed for conferences, exhibitions, and corporate events.

Key Platform Knowledge:
1. Features:
   - Digital QR Passes: Sent via email and SMS.
   - Professional Badges: Auto-generated for on-spot printing.
   - Multi-Entry System: Allows tracking of re-entries at event gates.
   - Admin Dashboard: Real-time tracking of registrations and entries.
   - Public Registration Links: Custom URLs for every event.
   - Manual & Instant Badges: Quick entry for VIPs or walk-in guests.

2. Pricing & Plans:
   - Free: ₹0 (Forever) - 1 Event, 10 Passes.
   - Starter: ₹4,999 (One-time) - 1 Event, 300 Passes.
   - Pro: ₹9,999 (One-time) - 3 Events, 1,000 Passes, Custom Pass Backgrounds.
   - Business: ₹19,999 (One-time) - 10 Events, 5,000 Passes, Custom Branding, WhatsApp Integration.
   - Enterprise: ₹39,999+ (Custom) - Unlimited Events/Passes, White-label portal.

3. Support:
   - Contact: hello@passnexus.in
   - Help Desk: Located in the Admin Dashboard under 'Support'.

Guidelines:
- Keep responses concise and professional.
- Always be helpful and polite.
- If you don't know something, ask them to contact hello@passnexus.in.
- Do not mention other competitors.
- Focus on how PassNexus makes event entry "seamless" and "professional".
`;

export async function POST(req: Request) {
  try {
    const { message, history } = await req.json();

    if (!process.env.GEMINI_API_KEY) {
      return NextResponse.json({ 
        error: "AI service not configured. Please add GEMINI_API_KEY to your environment." 
      }, { status: 500 });
    }

    const model = genAI.getGenerativeModel({ 
      model: "gemini-1.5-flash",
      systemInstruction: SYSTEM_PROMPT
    });

    const chat = model.startChat({
      history: history || [],
    });

    const result = await chat.sendMessage(message);
    const response = await result.response;
    const text = response.text();

    return NextResponse.json({ text });
  } catch (error: any) {
    console.error("Chat Error:", error);
    return NextResponse.json({ error: "Failed to process chat" }, { status: 500 });
  }
}
