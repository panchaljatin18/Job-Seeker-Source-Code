import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const { email } = await req.json();

    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return NextResponse.json(
        { success: false, message: "Valid email is required." },
        { status: 400 }
      );
    }

    return NextResponse.json({
      success: true,
      message: `Password reset link sent to ${email}. Check your inbox.`,
    });
  } catch {
    return NextResponse.json(
      { success: false, message: "Failed to send reset link." },
      { status: 500 }
    );
  }
}
