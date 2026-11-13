import { NextRequest, NextResponse } from "next/server";
import { normalizeEmail, createSessionToken } from "@/lib/authSecurity";
import { findUserByEmail, verifyOTPCode, updateLastLogin } from "@/lib/userStore";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const email = normalizeEmail(body.email || "");
    const otp = (body.otp || "").toString().trim();

    if (!email) {
      return NextResponse.json(
        { success: false, message: "Email is required." },
        { status: 400 }
      );
    }

    if (!otp || !/^\d{6}$/.test(otp)) {
      return NextResponse.json(
        { success: false, message: "Please enter a valid 6-digit verification code." },
        { status: 400 }
      );
    }

    const verification = verifyOTPCode(email, otp);
    if (!verification.success) {
      return NextResponse.json(
        { success: false, message: verification.error || "Invalid verification code." },
        { status: 400 }
      );
    }

    // OTP verification passed! Retrieve verified user
    const user = findUserByEmail(email);
    if (!user) {
      return NextResponse.json(
        { success: false, message: "User account could not be found." },
        { status: 404 }
      );
    }

    updateLastLogin(user.email);

    // Issue signed session token
    const token = createSessionToken({
      userId: user.id,
      email: user.email,
      role: user.role,
      name: user.name,
    });

    const response = NextResponse.json({
      success: true,
      message: "Email verified successfully! Welcome to TecJob.",
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        companyName: user.companyName,
      },
      redirectTo: user.role === "employer" ? "/employer/dashboard" : "/dashboard",
    });

    // Set session cookie
    response.cookies.set("tecjob_session", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: 7 * 24 * 3600,
    });

    return response;
  } catch (err: any) {
    console.error("OTP verification error:", err);
    return NextResponse.json(
      { success: false, message: "Verification failed. Please try again." },
      { status: 500 }
    );
  }
}

