import { NextRequest, NextResponse } from "next/server";
import {
  normalizeEmail,
  validateEmailFormat,
  verifyPassword,
  checkRateLimit,
  recordFailedAttempt,
  clearRateLimit,
  createSessionToken,
} from "@/lib/authSecurity";
import {
  findUserByEmail,
  updateLastLogin,
  createAndSendVerificationOTP,
} from "@/lib/userStore";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const email = normalizeEmail(body.email || "");
    const password = body.password || "";
    const requestedRole = body.role === "employer" ? "employer" : "seeker";

    // 1. Basic validation
    const emailCheck = validateEmailFormat(email);
    if (!emailCheck.isValid) {
      return NextResponse.json(
        { success: false, message: emailCheck.error },
        { status: 400 }
      );
    }

    if (!password) {
      return NextResponse.json(
        { success: false, message: "Password is required." },
        { status: 400 }
      );
    }

    // 2. Brute-force protection: Rate limit by email + IP
    const ip = req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "local";
    const rateLimitKey = `login_${email}_${ip}`;
    const rateStatus = checkRateLimit(rateLimitKey, 5, 5 * 60 * 1000);

    if (!rateStatus.allowed) {
      return NextResponse.json(
        {
          success: false,
          message: `Too many failed login attempts. Account temporarily locked for security. Try again in ${rateStatus.retryAfterSeconds}s.`,
        },
        { status: 429 }
      );
    }

    // 3. User lookup
    const user = findUserByEmail(email);

    if (!user) {
      recordFailedAttempt(rateLimitKey);
      // Generic error message to prevent user enumeration
      return NextResponse.json(
        { success: false, message: "Invalid email or password." },
        { status: 401 }
      );
    }

    // 4. Constant-time password verification
    const isPasswordValid = verifyPassword(password, user.passwordHash, user.salt);

    if (!isPasswordValid) {
      const failInfo = recordFailedAttempt(rateLimitKey);
      if (failInfo.lockoutTriggered) {
        return NextResponse.json(
          {
            success: false,
            message: `Too many failed attempts. Account temporarily locked for ${failInfo.retryAfterSeconds}s.`,
          },
          { status: 429 }
        );
      }
      return NextResponse.json(
        { success: false, message: "Invalid email or password." },
        { status: 401 }
      );
    }

    // 5. Verification Gate: Email must be verified
    if (!user.isEmailVerified) {
      // Generate and send a fresh OTP to complete verification
      const otpRes = await createAndSendVerificationOTP(user.email, user.name);
      return NextResponse.json(
        {
          success: false,
          requiresVerification: true,
          email: user.email,
          role: user.role,
          name: user.name,
          message: "Your email address is not verified yet. We just sent a 6-digit verification code to your email.",
          demoOtp: otpRes.demoOtp,
          previewUrl: otpRes.previewUrl,
        },
        { status: 403 }
      );
    }

    // 6. Login Success: Clear rate-limit counter, update login time
    clearRateLimit(rateLimitKey);
    updateLastLogin(user.email);

    // 7. Issue signed session token
    const token = createSessionToken({
      userId: user.id,
      email: user.email,
      role: user.role,
      name: user.name,
    });

    const response = NextResponse.json({
      success: true,
      message: "Login successful!",
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        companyName: user.companyName,
      },
      redirectTo: user.role === "employer" ? "/employer/dashboard" : "/dashboard",
    });

    // 8. Set HTTP-Only, Secure, SameSite Cookie
    response.cookies.set("tecjob_session", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: 7 * 24 * 3600, // 7 days
    });

    return response;
  } catch (err: any) {
    console.error("Login error:", err);
    return NextResponse.json(
      { success: false, message: "Login failed due to a server error. Please try again." },
      { status: 500 }
    );
  }
}
