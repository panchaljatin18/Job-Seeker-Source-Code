import { NextRequest, NextResponse } from "next/server";
import {
  sanitizeString,
  normalizeEmail,
  validateEmailFormat,
  normalizePhone,
  validatePhoneFormat,
  validatePasswordStrength,
  checkRateLimit,
  recordFailedAttempt,
} from "@/lib/authSecurity";
import {
  findUserByEmail,
  createUser,
  createAndSendVerificationOTP,
} from "@/lib/userStore";

export async function POST(req: NextRequest) {
  try {
    // 1. IP / Rate limit protection (prevent spam registrations)
    const ip = req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "local_ip";
    const rateCheck = checkRateLimit(`reg_${ip}`, 10, 10 * 60 * 1000); // Max 10 registrations per 10 mins per IP
    if (!rateCheck.allowed) {
      return NextResponse.json(
        {
          success: false,
          message: `Too many registration attempts. Please wait ${rateCheck.retryAfterSeconds}s before trying again.`,
        },
        { status: 429 }
      );
    }

    const body = await req.json();
    const name = sanitizeString(body.name || "");
    const email = normalizeEmail(body.email || "");
    const phone = normalizePhone(body.phone || "");
    const password = body.password || "";
    const role = body.role === "employer" ? "employer" : "seeker";
    const companyName = sanitizeString(body.companyName || "");
    const agreeTerms = Boolean(body.agreeTerms);

    // 2. High Security Input Validations
    if (!name || name.length < 2) {
      return NextResponse.json(
        { success: false, message: "Please provide a valid full name (minimum 2 characters)." },
        { status: 400 }
      );
    }

    const emailCheck = validateEmailFormat(email);
    if (!emailCheck.isValid) {
      return NextResponse.json(
        { success: false, message: emailCheck.error },
        { status: 400 }
      );
    }

    const phoneCheck = validatePhoneFormat(phone);
    if (!phoneCheck.isValid) {
      return NextResponse.json(
        { success: false, message: phoneCheck.error },
        { status: 400 }
      );
    }

    if (role === "employer" && (!companyName || companyName.length < 2)) {
      return NextResponse.json(
        { success: false, message: "Company name is required for recruiter accounts." },
        { status: 400 }
      );
    }

    const pwCheck = validatePasswordStrength(password);
    if (!pwCheck.isValid) {
      return NextResponse.json(
        {
          success: false,
          message: pwCheck.errors[0] || "Password does not meet security requirements.",
          errors: pwCheck.errors,
        },
        { status: 400 }
      );
    }

    if (!agreeTerms) {
      return NextResponse.json(
        { success: false, message: "You must accept the Terms & Conditions and Privacy Policy." },
        { status: 400 }
      );
    }

    // 3. Check existing user
    const existing = findUserByEmail(email);
    if (existing && existing.isEmailVerified) {
      // Don't leak too much detail, but let user know they can log in
      return NextResponse.json(
        {
          success: false,
          message: "An account with this email address is already registered. Please log in.",
        },
        { status: 409 }
      );
    }

    // 4. Create or update unverified user
    const user = createUser({
      name,
      email,
      phone,
      role,
      companyName: role === "employer" ? companyName : undefined,
      password,
      isEmailVerified: false, // Mandatory verification!
    });

    // 5. Generate and send 6-digit OTP via Email
    const otpResult = await createAndSendVerificationOTP(email, name);

    return NextResponse.json({
      success: true,
      requiresVerification: true,
      email,
      role,
      name,
      message: `A 6-digit verification code was sent to ${email}.`,
      demoOtp: otpResult.demoOtp, // Provided for instant demo testing
      previewUrl: otpResult.previewUrl,
    });
  } catch (err: any) {
    console.error("Registration error:", err);
    return NextResponse.json(
      { success: false, message: "Registration failed due to a server error. Please try again." },
      { status: 500 }
    );
  }
}
