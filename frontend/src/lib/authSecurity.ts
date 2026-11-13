import crypto from "crypto";

// Secret for signing tokens - in production, read from process.env.AUTH_SECRET
const AUTH_SECRET = process.env.AUTH_SECRET || "tecjob-super-secret-auth-key-2026-production-grade";

// ─── Input Sanitization & Validation ──────────────────────────────────────────

export function sanitizeString(input: string): string {
  if (typeof input !== "string") return "";
  return input
    .trim()
    .replace(/[<>]/g, ""); // Strip potential HTML tags to prevent XSS
}

export function normalizeEmail(email: string): string {
  return sanitizeString(email).toLowerCase();
}

export function validateEmailFormat(email: string): { isValid: boolean; error?: string } {
  const normalized = normalizeEmail(email);
  if (!normalized) {
    return { isValid: false, error: "Email address is required." };
  }
  // RFC 5322 compliant regex for practical modern email validation
  const emailRegex = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)+$/;
  if (!emailRegex.test(normalized) || normalized.length > 254) {
    return { isValid: false, error: "Please enter a valid email address." };
  }
  return { isValid: true };
}

export function normalizePhone(phone: string): string {
  return sanitizeString(phone).replace(/[^\d+]/g, "");
}

export function validatePhoneFormat(phone: string): { isValid: boolean; error?: string } {
  const cleaned = normalizePhone(phone);
  if (!cleaned) {
    return { isValid: false, error: "Phone number is required." };
  }
  const digitsOnly = cleaned.replace(/\D/g, "");
  if (digitsOnly.length < 10 || digitsOnly.length > 15) {
    return { isValid: false, error: "Please enter a valid phone number (10 to 15 digits)." };
  }
  return { isValid: true };
}

export interface PasswordValidationResult {
  isValid: boolean;
  errors: string[];
  score: number; // 0-4
}

export function validatePasswordStrength(password: string): PasswordValidationResult {
  const errors: string[] = [];
  let score = 0;

  if (!password || password.length < 8) {
    errors.push("Password must be at least 8 characters long.");
  } else {
    score++;
  }

  if (password.length > 128) {
    errors.push("Password must not exceed 128 characters.");
  }

  if (!/[A-Z]/.test(password)) {
    errors.push("Password must contain at least one uppercase letter (A-Z).");
  } else {
    score++;
  }

  if (!/[a-z]/.test(password)) {
    errors.push("Password must contain at least one lowercase letter (a-z).");
  }

  if (!/[0-9]/.test(password)) {
    errors.push("Password must contain at least one digit (0-9).");
  } else {
    score++;
  }

  if (!/[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]/.test(password)) {
    errors.push("Password must contain at least one special character.");
  } else {
    score++;
  }

  // Check against common insecure passwords
  const commonPasswords = ["password", "12345678", "qwertyuiop", "admin123", "password123"];
  if (commonPasswords.includes(password.toLowerCase())) {
    errors.push("This password is too common. Please choose a stronger password.");
    score = 0;
  }

  return {
    isValid: errors.length === 0,
    errors,
    score,
  };
}

// ─── Cryptographic Password Hashing (PBKDF2 with SHA-512) ─────────────────────

export function hashPassword(password: string): { hash: string; salt: string } {
  const salt = crypto.randomBytes(16).toString("hex");
  const hash = crypto
    .pbkdf2Sync(password, salt, 100000, 64, "sha512")
    .toString("hex");
  return { hash, salt };
}

export function verifyPassword(password: string, storedHash: string, salt: string): boolean {
  try {
    const hashToVerify = crypto
      .pbkdf2Sync(password, salt, 100000, 64, "sha512")
      .toString("hex");

    const hashBuffer = Buffer.from(hashToVerify, "hex");
    const storedBuffer = Buffer.from(storedHash, "hex");

    if (hashBuffer.length !== storedBuffer.length) {
      return false;
    }

    // Timing-safe constant time comparison to prevent timing attacks
    return crypto.timingSafeEqual(hashBuffer, storedBuffer);
  } catch {
    return false;
  }
}

// ─── OTP (One Time Password) Utilities ────────────────────────────────────────

export function generateOTP(): string {
  // Generates a cryptographically secure 6-digit number between 100000 and 999999
  return crypto.randomInt(100000, 999999).toString();
}

export function hashOTP(otp: string): string {
  return crypto.createHmac("sha256", AUTH_SECRET).update(otp).digest("hex");
}

export function verifyOTP(otp: string, storedHash: string): boolean {
  try {
    const hashToVerify = hashOTP(otp);
    const a = Buffer.from(hashToVerify, "hex");
    const b = Buffer.from(storedHash, "hex");
    if (a.length !== b.length) return false;
    return crypto.timingSafeEqual(a, b);
  } catch {
    return false;
  }
}

// ─── Secure Session Token Signing (HMAC-SHA256) ───────────────────────────────

export interface SessionPayload {
  userId: string;
  email: string;
  role: "seeker" | "employer";
  name: string;
  exp: number; // unix timestamp in seconds
}

export function createSessionToken(payload: Omit<SessionPayload, "exp">, expiresInSeconds = 7 * 24 * 3600): string {
  const exp = Math.floor(Date.now() / 1000) + expiresInSeconds;
  const fullPayload: SessionPayload = { ...payload, exp };
  const encodedPayload = Buffer.from(JSON.stringify(fullPayload)).toString("base64url");
  const signature = crypto
    .createHmac("sha256", AUTH_SECRET)
    .update(encodedPayload)
    .digest("base64url");
  return `${encodedPayload}.${signature}`;
}

export function verifySessionToken(token: string): SessionPayload | null {
  try {
    if (!token || !token.includes(".")) return null;
    const [encodedPayload, signature] = token.split(".");
    const expectedSignature = crypto
      .createHmac("sha256", AUTH_SECRET)
      .update(encodedPayload)
      .digest("base64url");

    const a = Buffer.from(signature);
    const b = Buffer.from(expectedSignature);
    if (a.length !== b.length || !crypto.timingSafeEqual(a, b)) {
      return null;
    }

    const payload: SessionPayload = JSON.parse(Buffer.from(encodedPayload, "base64url").toString("utf-8"));
    if (payload.exp < Math.floor(Date.now() / 1000)) {
      return null; // Expired
    }
    return payload;
  } catch {
    return null;
  }
}

// ─── Rate Limiting / Brute-Force Shield (In-memory) ────────────────────────────

interface RateLimitRecord {
  attempts: number;
  lastAttempt: number;
  lockoutUntil: number;
}

const rateLimitStore = new Map<string, RateLimitRecord>();

export function checkRateLimit(
  key: string,
  maxAttempts = 5,
  lockoutDurationMs = 5 * 60 * 1000 // 5 minutes lockout
): { allowed: boolean; remainingAttempts: number; retryAfterSeconds?: number } {
  const now = Date.now();
  const record = rateLimitStore.get(key);

  if (!record) {
    return { allowed: true, remainingAttempts: maxAttempts };
  }

  if (record.lockoutUntil > now) {
    const retryAfterSeconds = Math.ceil((record.lockoutUntil - now) / 1000);
    return { allowed: false, remainingAttempts: 0, retryAfterSeconds };
  }

  // If lockout expired, reset
  if (record.lockoutUntil !== 0 && record.lockoutUntil <= now) {
    rateLimitStore.delete(key);
    return { allowed: true, remainingAttempts: maxAttempts };
  }

  const remaining = Math.max(0, maxAttempts - record.attempts);
  return { allowed: record.attempts < maxAttempts, remainingAttempts: remaining };
}

export function recordFailedAttempt(
  key: string,
  maxAttempts = 5,
  lockoutDurationMs = 5 * 60 * 1000
): { lockoutTriggered: boolean; retryAfterSeconds?: number } {
  const now = Date.now();
  const record = rateLimitStore.get(key) || { attempts: 0, lastAttempt: now, lockoutUntil: 0 };
  record.attempts += 1;
  record.lastAttempt = now;

  if (record.attempts >= maxAttempts) {
    record.lockoutUntil = now + lockoutDurationMs;
    rateLimitStore.set(key, record);
    return {
      lockoutTriggered: true,
      retryAfterSeconds: Math.ceil(lockoutDurationMs / 1000),
    };
  }

  rateLimitStore.set(key, record);
  return { lockoutTriggered: false };
}

export function clearRateLimit(key: string): void {
  rateLimitStore.delete(key);
}

