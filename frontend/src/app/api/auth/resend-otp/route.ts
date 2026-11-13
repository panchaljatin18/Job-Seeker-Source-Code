import { NextRequest, NextResponse } from "next/server";
import { normalizeEmail, validateEmailFormat } from "@/lib/authSecurity";
import { findUserByEmail, createAndSendVerificationOTP } from "@/lib/userStore";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const email = normalizeEmail(body.email || "");

    const emailCheck = validateEmailFormat(email);
    if (!emailCheck.isValid) {
      return NextResponse.json(
        { success: false, message: emailCheck.error },
        { status: 400 }
      );
    }

    const user = findUserByEmail(email);
    if (!user) {
      return NextResponse.json(
        { success: false, message: "No account found with this email." },
        { status: 404 }
      );
    }

    if (user.isEmailVerified) {
      return NextResponse.json(
        { success: false, message: "This email is already verified. You can log in." },
        { status: 400 }
      );
    }

    const result = await createAndSendVerificationOTP(user.email, user.name);

    if (!result.success) {
      return NextResponse.json(
        { success: false, message: result.error || "Could not resend verification code." },
        { status: 429 }
      );
    }

    return NextResponse.json({
      success: true,
      message: `A new 6-digit verification code was sent to ${user.email}.`,
      demoOtp: result.demoOtp,
      previewUrl: result.previewUrl,
    });
  } catch (err: any) {
    console.error("Resend OTP error:", err);
    return NextResponse.json(
      { success: false, message: "Failed to resend code. Please try again." },
      { status: 500 }
    );
  }
}

