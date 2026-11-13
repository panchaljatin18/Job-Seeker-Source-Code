import fs from "fs";
import path from "path";
import {
  hashPassword,
  hashOTP,
  generateOTP,
  verifyOTP,
  normalizeEmail,
} from "@/lib/authSecurity";
import { sendEmail } from "@/utils/mailer";

export interface StoredUser {
  id: string;
  name: string;
  email: string;
  phone: string;
  role: "seeker" | "employer";
  companyName?: string;
  passwordHash: string;
  salt: string;
  isEmailVerified: boolean;
  createdAt: string;
  updatedAt: string;
  lastLoginAt?: string;
}

export interface OTPRecord {
  email: string;
  otpHash: string;
  plainOtpForDemo?: string; // Stored in development/demo mode for direct preview
  expiresAt: number;
  attempts: number;
  resendAvailableAt: number;
  verificationToken?: string;
}

const DATA_DIR = path.join(process.cwd(), "src", "data");
const USERS_FILE = path.join(DATA_DIR, "users.json");

// In-memory OTP store (email -> OTPRecord)
const otpStore = new Map<string, OTPRecord>();

// Ensure data directory exists
function ensureDataDir(): void {
  try {
    if (!fs.existsSync(DATA_DIR)) {
      fs.mkdirSync(DATA_DIR, { recursive: true });
    }
  } catch (err) {
    console.error("Failed to create data directory:", err);
  }
}

// Initial pre-seeded users
function getInitialUsers(): StoredUser[] {
  const seekerPw = hashPassword("Password123!");
  const recruiterPw = hashPassword("Password123!");
  const now = new Date().toISOString();

  return [
    {
      id: "usr_seed_seeker_001",
      name: "Alex Morgan",
      email: "seeker@tecjob.com",
      phone: "+1 555 019 2831",
      role: "seeker",
      passwordHash: seekerPw.hash,
      salt: seekerPw.salt,
      isEmailVerified: true,
      createdAt: now,
      updatedAt: now,
    },
    {
      id: "usr_seed_recruiter_002",
      name: "Sarah Jenkins",
      email: "recruiter@tecjob.com",
      phone: "+1 555 018 7744",
      role: "employer",
      companyName: "Acme Cloud Technologies",
      passwordHash: recruiterPw.hash,
      salt: recruiterPw.salt,
      isEmailVerified: true,
      createdAt: now,
      updatedAt: now,
    },
  ];
}

// Read users from file (or initialize)
export function getAllUsers(): StoredUser[] {
  ensureDataDir();
  try {
    if (!fs.existsSync(USERS_FILE)) {
      const initial = getInitialUsers();
      fs.writeFileSync(USERS_FILE, JSON.stringify(initial, null, 2), "utf-8");
      return initial;
    }
    const data = fs.readFileSync(USERS_FILE, "utf-8");
    return JSON.parse(data) as StoredUser[];
  } catch (err) {
    console.error("Failed to read users file, returning defaults:", err);
    return getInitialUsers();
  }
}

// Write users to file
export function saveAllUsers(users: StoredUser[]): void {
  ensureDataDir();
  try {
    fs.writeFileSync(USERS_FILE, JSON.stringify(users, null, 2), "utf-8");
  } catch (err) {
    console.error("Failed to save users file:", err);
  }
}

export function findUserByEmail(email: string): StoredUser | null {
  const normalized = normalizeEmail(email);
  const users = getAllUsers();
  return users.find((u) => u.email === normalized) || null;
}

export function createUser(userData: {
  name: string;
  email: string;
  phone: string;
  role: "seeker" | "employer";
  companyName?: string;
  password: string;
  isEmailVerified?: boolean;
}): StoredUser {
  const users = getAllUsers();
  const normalized = normalizeEmail(userData.email);

  // Check if exists
  const existingIndex = users.findIndex((u) => u.email === normalized);
  const { hash, salt } = hashPassword(userData.password);
  const now = new Date().toISOString();

  if (existingIndex !== -1) {
    // Update existing unverified user
    const updated: StoredUser = {
      ...users[existingIndex],
      name: userData.name,
      phone: userData.phone,
      role: userData.role,
      companyName: userData.companyName,
      passwordHash: hash,
      salt,
      isEmailVerified: userData.isEmailVerified ?? false,
      updatedAt: now,
    };
    users[existingIndex] = updated;
    saveAllUsers(users);
    return updated;
  }

  const newUser: StoredUser = {
    id: `usr_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
    name: userData.name,
    email: normalized,
    phone: userData.phone,
    role: userData.role,
    companyName: userData.companyName,
    passwordHash: hash,
    salt,
    isEmailVerified: userData.isEmailVerified ?? false,
    createdAt: now,
    updatedAt: now,
  };

  users.push(newUser);
  saveAllUsers(users);
  return newUser;
}

export function markUserEmailVerified(email: string): StoredUser | null {
  const normalized = normalizeEmail(email);
  const users = getAllUsers();
  const index = users.findIndex((u) => u.email === normalized);
  if (index === -1) return null;

  users[index].isEmailVerified = true;
  users[index].updatedAt = new Date().toISOString();
  saveAllUsers(users);
  return users[index];
}

export function updateLastLogin(email: string): void {
  const normalized = normalizeEmail(email);
  const users = getAllUsers();
  const index = users.findIndex((u) => u.email === normalized);
  if (index !== -1) {
    users[index].lastLoginAt = new Date().toISOString();
    saveAllUsers(users);
  }
}

// ─── OTP Lifecycle Management ─────────────────────────────────────────────────

export async function createAndSendVerificationOTP(
  email: string,
  userName: string
): Promise<{ success: boolean; demoOtp: string; previewUrl?: string; error?: string }> {
  const normalized = normalizeEmail(email);
  const existingOtp = otpStore.get(normalized);
  const now = Date.now();

  // Cooldown check (60s)
  if (existingOtp && existingOtp.resendAvailableAt > now) {
    const waitSec = Math.ceil((existingOtp.resendAvailableAt - now) / 1000);
    return {
      success: false,
      demoOtp: "",
      error: `Please wait ${waitSec}s before requesting a new code.`,
    };
  }

  const otp = generateOTP();
  const otpHash = hashOTP(otp);
  const verificationToken = Buffer.from(`${normalized}:${Date.now()}:${otp}`).toString("base64url");

  const record: OTPRecord = {
    email: normalized,
    otpHash,
    plainOtpForDemo: otp,
    expiresAt: now + 10 * 60 * 1000, // 10 minutes expiration
    attempts: 0,
    resendAvailableAt: now + 60 * 1000, // 60 seconds cooldown
    verificationToken,
  };

  otpStore.set(normalized, record);

  // Generate Email HTML
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";
  const magicLink = `${baseUrl}/api/auth/verify-email?email=${encodeURIComponent(normalized)}&token=${verificationToken}`;

  const html = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <title>Verify your TecJob Account</title>
      <style>
        body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; background-color: #f8fafc; margin: 0; padding: 24px; }
        .card { max-width: 520px; margin: 0 auto; background: #ffffff; border-radius: 16px; border: 1px solid #e2e8f0; padding: 36px 32px; box-shadow: 0 4px 12px rgba(0,0,0,0.05); }
        .logo { font-size: 24px; font-weight: 900; color: #0f172a; margin-bottom: 24px; }
        .logo span { color: #2563eb; }
        .otp-box { background: #eff6ff; border: 2px dashed #93c5fd; border-radius: 12px; padding: 18px; text-align: center; margin: 24px 0; }
        .otp-code { font-size: 32px; font-weight: 800; letter-spacing: 8px; color: #1d4ed8; font-family: monospace; }
        .btn { display: inline-block; background-color: #2563eb; color: #ffffff !important; font-weight: 700; text-decoration: none; padding: 12px 28px; border-radius: 10px; margin: 16px 0; }
        .footer { font-size: 12px; color: #94a3b8; text-align: center; margin-top: 24px; }
      </style>
    </head>
    <body>
      <div class="card">
        <div class="logo">Tec<span>Job</span></div>
        <h2 style="color: #0f172a; margin: 0 0 12px;">Verify Your Email Address</h2>
        <p style="color: #475569; font-size: 14px; line-height: 1.6;">
          Hi ${userName || "there"},<br>
          Thank you for joining TecJob! To secure your account and access jobs or post opportunities, please verify your email address.
        </p>
        
        <div class="otp-box">
          <div style="font-size: 12px; font-weight: 600; text-transform: uppercase; color: #3b82f6; margin-bottom: 6px;">Your 6-Digit Verification Code</div>
          <div class="otp-code">${otp}</div>
          <div style="font-size: 11px; color: #64748b; margin-top: 6px;">Valid for 10 minutes</div>
        </div>

        <div style="text-align: center;">
          <p style="font-size: 13px; color: #64748b; margin-bottom: 8px;">Or click the instant verification button below:</p>
          <a href="${magicLink}" class="btn">Verify Email Instantly →</a>
        </div>

        <p style="color: #64748b; font-size: 12px; line-height: 1.5; margin-top: 20px; border-top: 1px solid #f1f5f9; pt: 16px;">
          If you didn't create an account with TecJob, you can safely ignore this email.
        </p>
        <div class="footer">
          © 2026 TecJob Inc. · High-Security Account Protection
        </div>
      </div>
    </body>
    </html>
  `;

  let previewUrl = "";
  try {
    const result = await sendEmail({
      to: normalized,
      subject: `Your TecJob Verification Code: ${otp}`,
      html,
      text: `Your TecJob verification code is: ${otp}. It expires in 10 minutes. Or verify directly: ${magicLink}`,
    });
    previewUrl = result.previewUrl || "";
  } catch (err) {
    console.warn("Email sending skipped or simulated:", err);
  }

  return {
    success: true,
    demoOtp: otp,
    previewUrl,
  };
}

export function verifyOTPCode(
  email: string,
  enteredOtp: string
): { success: boolean; error?: string } {
  const normalized = normalizeEmail(email);
  const record = otpStore.get(normalized);
  const now = Date.now();

  if (!record) {
    return {
      success: false,
      error: "No verification code was requested for this email, or it has expired.",
    };
  }

  if (record.expiresAt < now) {
    otpStore.delete(normalized);
    return {
      success: false,
      error: "Verification code has expired. Please request a new code.",
    };
  }

  if (record.attempts >= 4) {
    otpStore.delete(normalized);
    return {
      success: false,
      error: "Too many failed attempts. For your security, please request a new verification code.",
    };
  }

  const isValid = verifyOTP(enteredOtp.trim(), record.otpHash);

  if (!isValid) {
    record.attempts += 1;
    const remaining = 4 - record.attempts;
    return {
      success: false,
      error: `Invalid code. ${remaining} attempt${remaining === 1 ? "" : "s"} remaining.`,
    };
  }

  // OTP is verified! Clean up
  otpStore.delete(normalized);
  markUserEmailVerified(normalized);

  return { success: true };
}

export function verifyByToken(
  email: string,
  token: string
): { success: boolean; error?: string } {
  const normalized = normalizeEmail(email);
  const record = otpStore.get(normalized);

  if (!record || record.verificationToken !== token) {
    // Check if user is already verified
    const user = findUserByEmail(normalized);
    if (user && user.isEmailVerified) {
      return { success: true };
    }
    return { success: false, error: "Invalid or expired verification link." };
  }

  if (record.expiresAt < Date.now()) {
    otpStore.delete(normalized);
    return { success: false, error: "Verification link has expired." };
  }

  otpStore.delete(normalized);
  markUserEmailVerified(normalized);
  return { success: true };
}

