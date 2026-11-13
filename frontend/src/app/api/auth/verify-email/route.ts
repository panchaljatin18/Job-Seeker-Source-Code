import { NextRequest, NextResponse } from "next/server";
import { normalizeEmail, createSessionToken } from "@/lib/authSecurity";
import { findUserByEmail, verifyByToken } from "@/lib/userStore";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const email = normalizeEmail(searchParams.get("email") || "");
  const token = searchParams.get("token") || "";
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";

  if (!email || !token) {
    return NextResponse.redirect(`${baseUrl}/auth?error=invalid_verification_link`);
  }

  const result = verifyByToken(email, token);
  if (!result.success) {
    return NextResponse.redirect(
      `${baseUrl}/auth?error=${encodeURIComponent(result.error || "Verification failed")}`
    );
  }

  const user = findUserByEmail(email);
  const redirectTarget = user?.role === "employer" ? "/employer/dashboard" : "/dashboard";

  const response = NextResponse.redirect(`${baseUrl}${redirectTarget}?verified=true`);

  if (user) {
    const sessionToken = createSessionToken({
      userId: user.id,
      email: user.email,
      role: user.role,
      name: user.name,
    });
    response.cookies.set("tecjob_session", sessionToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: 7 * 24 * 3600,
    });
  }

  return response;
}

