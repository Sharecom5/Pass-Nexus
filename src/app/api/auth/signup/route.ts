import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import { User } from "@/models/User";
import bcrypt from "bcryptjs";

export async function POST(req: NextRequest) {
  try {
    const { name, email, password } = await req.json();

    if (!name || !email || !password) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    await connectDB();

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return NextResponse.json({ error: "Email already registered" }, { status: 400 });
    }

    const hashedPassword = await bcrypt.hash(password, 12);
    const newUser = await User.create({
      name,
      email,
      password: hashedPassword,
      plan: 'free',
    });

    return NextResponse.json({ 
      success: true, 
      message: "Organizer account created successfully",
      user: { id: newUser._id, email: newUser.email }
    });

  } catch (error) {
    console.error("Signup Error:", error);
    return NextResponse.json({ error: "Internal server error during signup" }, { status: 500 });
  }
}
