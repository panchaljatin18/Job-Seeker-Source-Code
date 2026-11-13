"use client";

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import {
  Briefcase,
  Mail,
  Lock,
  Eye,
  EyeOff,
  Phone,
  User,
  Building2,
  CheckCircle2,
  Info,
  X,
  Loader2,
  Check,
  ShieldCheck,
  ArrowRight,
  AlertCircle,
  ExternalLink,
  RotateCcw,
} from "lucide-react";

// ─── Types ───────────────────────────────────────────────────────────────────

type Role = "seeker" | "employer";
type PasswordStrength = { level: "weak" | "medium" | "strong"; score: number };

interface LoginForm {
  email: string;
  password: string;
  remember: boolean;
}

interface RegisterForm {
  name: string;
  email: string;
  phone: string;
  password: string;
  confirmPassword: string;
  companyName: string;
  agreeTerms: boolean;
}

interface FormErrors {
  [key: string]: string;
}

const API_BASE_URL = process.env.NEXT_PUBLIC_BACKEND_URL || "";

// ─── Helpers ─────────────────────────────────────────────────────────────────

function getPasswordStrength(password: string): PasswordStrength {
  if (!password) return { level: "weak", score: 0 };
  let score = 0;
  if (password.length >= 8) score++;
  if (/[A-Z]/.test(password) && /[a-z]/.test(password)) score++;
  if (/[0-9]/.test(password)) score++;
  if (/[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]/.test(password)) score++;

  if (score <= 1) return { level: "weak", score };
  if (score <= 3) return { level: "medium", score };
  return { level: "strong", score };
}

function validateEmail(email: string): boolean {
  return /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)+$/.test(email.trim());
}

function validateLoginForm(form: LoginForm): FormErrors {
  const errors: FormErrors = {};
  if (!form.email.trim()) {
    errors.email = "Email is required.";
  } else if (!validateEmail(form.email)) {
    errors.email = "Please enter a valid email address.";
  }
  if (!form.password) {
    errors.password = "Password is required.";
  }
  return errors;
}

function validateRegisterForm(form: RegisterForm, role: Role): FormErrors {
  const errors: FormErrors = {};
  if (!form.name.trim() || form.name.trim().length < 2) {
    errors.name = "Full name must be at least 2 characters.";
  }
  if (!form.email.trim()) {
    errors.email = "Email address is required.";
  } else if (!validateEmail(form.email)) {
    errors.email = "Please enter a valid email address.";
  }

  const phoneDigits = form.phone.replace(/\D/g, "");
  if (!form.phone.trim()) {
    errors.phone = "Phone number is required.";
  } else if (phoneDigits.length < 10 || phoneDigits.length > 15) {
    errors.phone = "Phone number must be between 10 and 15 digits.";
  }

  if (!form.password) {
    errors.password = "Password is required.";
  } else if (form.password.length < 8) {
    errors.password = "Password must be at least 8 characters.";
  } else if (!/[A-Z]/.test(form.password)) {
    errors.password = "Must include at least one uppercase letter (A-Z).";
  } else if (!/[a-z]/.test(form.password)) {
    errors.password = "Must include at least one lowercase letter (a-z).";
  } else if (!/[0-9]/.test(form.password)) {
    errors.password = "Must include at least one number (0-9).";
  } else if (!/[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]/.test(form.password)) {
    errors.password = "Must include at least one special character.";
  }

  if (!form.confirmPassword) {
    errors.confirmPassword = "Confirm password is required.";
  } else if (form.confirmPassword !== form.password) {
    errors.confirmPassword = "Passwords do not match.";
  }

  if (role === "employer" && (!form.companyName.trim() || form.companyName.trim().length < 2)) {
    errors.companyName = "Company name is required for recruiter accounts.";
  }

  if (!form.agreeTerms) {
    errors.agreeTerms = "You must agree to the Terms & Conditions and Privacy Policy.";
  }

  return errors;
}

// ─── Sub-components ──────────────────────────────────────────────────────────

function TecJobLogo({
  size = "md",
}: {
  size?: "sm" | "md" | "lg";
  variant?: "light" | "dark";
}) {
  const heights = {
    sm: "h-9 sm:h-10",
    md: "h-11 sm:h-12",
    lg: "h-14 sm:h-16",
  };

  return (
    <Link href="/" className="inline-flex items-center">
      <Image
        src="/tecjob-logo.webp"
        alt="TecJob - YOUR NEXT OPPORTUNITY"
        width={260}
        height={87}
        quality={100}
        unoptimized
        className={`${heights[size]} w-auto object-contain drop-shadow-[0_2px_10px_rgba(255,255,255,0.2)]`}
        priority
      />
    </Link>
  );
}

function PasswordStrengthBar({ password }: { password: string }) {
  if (!password) return null;
  const { level, score } = getPasswordStrength(password);

  const hasLength = password.length >= 8;
  const hasUpperLower = /[A-Z]/.test(password) && /[a-z]/.test(password);
  const hasNumber = /[0-9]/.test(password);
  const hasSpecial = /[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]/.test(password);

  const config = {
    weak: { width: "w-1/3", color: "bg-red-500", text: "text-red-500", label: "Weak" },
    medium: { width: "w-2/3", color: "bg-amber-500", text: "text-amber-500", label: "Medium" },
    strong: { width: "w-full", color: "bg-emerald-500", text: "text-emerald-500", label: "Strong" },
  };

  const c = config[level];

  return (
    <div className="mt-2.5 space-y-1.5">
      <div className="flex items-center justify-between text-xs">
        <span className="text-slate-500 font-medium">Security strength</span>
        <span className={`font-bold ${c.text}`}>{c.label} ({score}/4)</span>
      </div>
      <div className="h-1.5 rounded-full bg-slate-200 overflow-hidden">
        <div className={`h-full rounded-full transition-all duration-300 ${c.width} ${c.color}`} />
      </div>
      <div className="grid grid-cols-2 gap-1 pt-1 text-[11px] text-slate-500">
        <span className={hasLength ? "text-emerald-600 font-semibold" : "text-slate-400"}>
          {hasLength ? "✓" : "○"} 8+ Characters
        </span>
        <span className={hasUpperLower ? "text-emerald-600 font-semibold" : "text-slate-400"}>
          {hasUpperLower ? "✓" : "○"} Upper & Lower
        </span>
        <span className={hasNumber ? "text-emerald-600 font-semibold" : "text-slate-400"}>
          {hasNumber ? "✓" : "○"} At least 1 number
        </span>
        <span className={hasSpecial ? "text-emerald-600 font-semibold" : "text-slate-400"}>
          {hasSpecial ? "✓" : "○"} Special symbol
        </span>
      </div>
    </div>
  );
}

function RoleSelector({
  value,
  onChange,
}: {
  value: Role;
  onChange: (role: Role) => void;
}) {
  return (
    <div className="p-1 bg-slate-100 rounded-xl flex gap-1 border border-slate-200">
      <button
        type="button"
        onClick={() => onChange("seeker")}
        className={`flex-1 py-2 px-3 rounded-lg text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
          value === "seeker"
            ? "bg-white text-[#2563EB] shadow-sm shadow-blue-500/10 font-black"
            : "text-slate-600 hover:text-slate-900"
        }`}
      >
        <User className="w-3.5 h-3.5" />
        Job Seeker
      </button>
      <button
        type="button"
        onClick={() => onChange("employer")}
        className={`flex-1 py-2 px-3 rounded-lg text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
          value === "employer"
            ? "bg-white text-purple-600 shadow-sm shadow-purple-500/10 font-black"
            : "text-slate-600 hover:text-slate-900"
        }`}
      >
        <Building2 className="w-3.5 h-3.5" />
        Recruiter / Employer
      </button>
    </div>
  );
}

interface InputFieldProps {
  id: string;
  label: string;
  type?: string;
  value: string;
  onChange: (val: string) => void;
  placeholder?: string;
  error?: string;
  icon?: React.ComponentType<{ className?: string }>;
  rightElement?: React.ReactNode;
  autoComplete?: string;
}

function InputField({
  id,
  label,
  type = "text",
  value,
  onChange,
  placeholder,
  error,
  icon: Icon,
  rightElement,
  autoComplete,
}: InputFieldProps) {
  return (
    <div>
      <label htmlFor={id} className="block text-xs font-bold text-slate-700 mb-1">
        {label}
      </label>
      <div className="relative">
        {Icon && (
          <div className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none">
            <Icon className="w-4 h-4" />
          </div>
        )}
        <input
          id={id}
          type={type}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          autoComplete={autoComplete}
          className={`w-full py-2.5 text-sm rounded-xl border bg-white text-slate-900 placeholder:text-slate-400 transition-colors focus:outline-none focus:ring-2 ${
            Icon ? "pl-10" : "pl-3.5"
          } ${rightElement ? "pr-10" : "pr-3.5"} ${
            error
              ? "border-red-400 focus:border-red-500 focus:ring-red-100"
              : "border-slate-200 focus:border-[#2563EB] focus:ring-blue-100"
          }`}
        />
        {rightElement && (
          <div className="absolute right-3.5 top-1/2 -translate-y-1/2 flex items-center">
            {rightElement}
          </div>
        )}
      </div>
      {error && <p className="text-xs text-red-500 mt-1 font-medium">{error}</p>}
    </div>
  );
}

// ─── OTP Verification Modal ───────────────────────────────────────────────────

interface OtpModalProps {
  open: boolean;
  email: string;
  role: Role;
  demoOtp?: string;
  previewUrl?: string;
  onClose: () => void;
  onVerified: (user: any, redirectTo: string) => void;
}

function OtpVerificationModal({
  open,
  email,
  role,
  demoOtp,
  previewUrl,
  onClose,
  onVerified,
}: OtpModalProps) {
  const [digits, setDigits] = useState<string[]>(["", "", "", "", "", ""]);
  const [error, setError] = useState("");
  const [verifying, setVerifying] = useState(false);
  const [cooldown, setCooldown] = useState(60);
  const [resending, setResending] = useState(false);
  const [currentDemoOtp, setCurrentDemoOtp] = useState(demoOtp || "");
  const [currentPreviewUrl, setCurrentPreviewUrl] = useState(previewUrl || "");
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  useEffect(() => {
    if (demoOtp) setCurrentDemoOtp(demoOtp);
    if (previewUrl) setCurrentPreviewUrl(previewUrl);
  }, [demoOtp, previewUrl]);

  // Focus first input on open
  useEffect(() => {
    if (open) {
      setDigits(["", "", "", "", "", ""]);
      setError("");
      setCooldown(60);
      setTimeout(() => inputRefs.current[0]?.focus(), 150);
    }
  }, [open]);

  // Cooldown countdown
  useEffect(() => {
    if (!open || cooldown <= 0) return;
    const timer = setInterval(() => setCooldown((c) => Math.max(0, c - 1)), 1000);
    return () => clearInterval(timer);
  }, [open, cooldown]);

  const handleDigitChange = (index: number, val: string) => {
    const numeric = val.replace(/\D/g, "");
    if (!numeric) {
      const next = [...digits];
      next[index] = "";
      setDigits(next);
      return;
    }

    // Single digit input
    const char = numeric.slice(-1);
    const next = [...digits];
    next[index] = char;
    setDigits(next);

    // Auto focus next
    if (index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Backspace" && !digits[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handlePaste = (e: React.ClipboardEvent) => {
    e.preventDefault();
    const pasteData = e.clipboardData.getData("text").replace(/\D/g, "").slice(0, 6);
    if (!pasteData) return;
    const next = ["", "", "", "", "", ""];
    for (let i = 0; i < pasteData.length; i++) {
      next[i] = pasteData[i];
    }
    setDigits(next);
    const nextFocus = Math.min(pasteData.length, 5);
    inputRefs.current[nextFocus]?.focus();
  };

  const handleFillDemo = () => {
    if (!currentDemoOtp) return;
    const next = currentDemoOtp.slice(0, 6).split("");
    setDigits(next);
    inputRefs.current[5]?.focus();
  };

  const handleVerify = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    const code = digits.join("");
    if (code.length !== 6) {
      setError("Please enter all 6 digits of your verification code.");
      return;
    }

    setError("");
    setVerifying(true);
    try {
      const res = await fetch(`${API_BASE_URL}/api/auth/verify-otp`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, otp: code }),
      });
      const data = await res.json();
      if (data.success) {
        if (data.accessToken && typeof window !== "undefined") {
          localStorage.setItem("tecjob_token", data.accessToken);
        }
        onVerified(data.user, data.redirectTo || (role === "employer" ? "/employer/dashboard" : "/dashboard"));
      } else {
        setError(data.message || "Invalid verification code.");
      }
    } catch {
      setError("Verification failed. Please try again.");
    } finally {
      setVerifying(false);
    }
  };

  const handleResend = async () => {
    if (cooldown > 0 || resending) return;
    setResending(true);
    setError("");
    try {
      const res = await fetch(`${API_BASE_URL}/api/auth/resend-otp`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      const data = await res.json();
      if (data.success) {
        if (data.demoOtp) setCurrentDemoOtp(data.demoOtp);
        if (data.previewUrl) setCurrentPreviewUrl(data.previewUrl);
        setCooldown(60);
        setDigits(["", "", "", "", "", ""]);
        inputRefs.current[0]?.focus();
      } else {
        setError(data.message || "Could not resend code.");
      }
    } catch {
      setError("Failed to resend code. Please try again.");
    } finally {
      setResending(false);
    }
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[120] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" onClick={onClose} />
      <div className="relative z-10 w-full max-w-md bg-white rounded-3xl shadow-2xl p-7 sm:p-9 border border-slate-100">
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-1.5 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors cursor-pointer"
          aria-label="Close verification modal"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header icon */}
        <div className="text-center mb-6">
          <div className="inline-flex items-center justify-center mb-3">
            <TecJobLogo size="sm" />
          </div>
          <h2 className="text-2xl font-black text-[#0F172A] tracking-tight">Email Verification</h2>
          <p className="text-sm text-slate-500 mt-1">
            We sent a secure 6-digit code to <br />
            <span className="font-semibold text-slate-800">{email}</span>
          </p>
        </div>

        {/* Demo Fast-Fill Pill */}
        {currentDemoOtp && (
          <div className="mb-5 p-3 rounded-2xl bg-amber-50 border border-amber-200/80 flex items-center justify-between gap-2">
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-amber-800">Demo Code:</span>
              <span className="font-mono font-black text-amber-900 text-sm tracking-wider">
                {currentDemoOtp}
              </span>
            </div>
            <button
              type="button"
              onClick={handleFillDemo}
              className="text-xs font-bold text-blue-700 hover:text-blue-900 hover:underline bg-white px-2.5 py-1 rounded-lg border border-amber-300 cursor-pointer shadow-xs"
            >
              Autofill Code
            </button>
          </div>
        )}

        {/* Email Preview Link */}
        {currentPreviewUrl && (
          <div className="mb-4 text-center">
            <a
              href={currentPreviewUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#2563EB] hover:underline"
            >
              <span>View Sent Email Preview</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
          </div>
        )}

        {/* 6 Digit Inputs */}
        <form onSubmit={handleVerify} className="space-y-5">
          <div className="flex justify-between gap-2" onPaste={handlePaste}>
            {digits.map((digit, idx) => (
              <input
                key={idx}
                ref={(el) => { inputRefs.current[idx] = el; }}
                type="text"
                inputMode="numeric"
                maxLength={1}
                value={digit}
                onChange={(e) => handleDigitChange(idx, e.target.value)}
                onKeyDown={(e) => handleKeyDown(idx, e)}
                className="w-12 h-14 text-center text-xl font-black rounded-xl border border-slate-200 focus:border-[#2563EB] focus:ring-4 focus:ring-blue-100 bg-slate-50 text-slate-900 outline-none transition-all shadow-xs"
              />
            ))}
          </div>

          {error && (
            <div className="p-3 rounded-xl bg-red-50 border border-red-200 flex items-center gap-2">
              <AlertCircle className="w-4 h-4 text-red-500 shrink-0" />
              <p className="text-xs text-red-600 font-semibold">{error}</p>
            </div>
          )}

          <button
            type="submit"
            disabled={verifying || digits.join("").length !== 6}
            className="w-full py-3.5 bg-[#2563EB] hover:bg-blue-700 disabled:opacity-50 text-white font-bold rounded-xl transition-all shadow-md shadow-blue-500/20 flex items-center justify-center gap-2 cursor-pointer"
          >
            {verifying ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                Verifying Code…
              </>
            ) : (
              <>
                <span>Verify & Complete Registration</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </form>

        {/* Resend Cooldown */}
        <div className="mt-5 text-center">
          {cooldown > 0 ? (
            <p className="text-xs text-slate-400">
              Resend code in{" "}
              <span className="font-semibold text-slate-600">
                00:{cooldown.toString().padStart(2, "0")}
              </span>
            </p>
          ) : (
            <button
              type="button"
              onClick={handleResend}
              disabled={resending}
              className="inline-flex items-center gap-1.5 text-xs font-bold text-[#2563EB] hover:underline cursor-pointer"
            >
              {resending ? (
                <>
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  Sending new code…
                </>
              ) : (
                <>
                  <RotateCcw className="w-3.5 h-3.5" />
                  Resend Verification Code
                </>
              )}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

// ─── Forgot Password Modal ────────────────────────────────────────────────────

function ForgotPasswordModal({
  open,
  onClose,
}: {
  open: boolean;
  onClose: () => void;
}) {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim() || !validateEmail(email)) {
      setError("Please enter a valid email address.");
      return;
    }
    setError("");
    setLoading(true);
    try {
      const res = await fetch(`${API_BASE_URL}/api/auth/forgot-password`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      const data = await res.json();
      if (data.success) {
        setSuccess(data.message);
      } else {
        setError(data.message || "Something went wrong.");
      }
    } catch {
      setError("Failed to send reset link. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    setEmail("");
    setSuccess("");
    setError("");
    setLoading(false);
    onClose();
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" onClick={handleClose} />
      <div className="relative z-10 w-full max-w-sm bg-white rounded-2xl shadow-2xl p-8">
        <button
          onClick={handleClose}
          className="absolute top-4 right-4 p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors cursor-pointer"
          aria-label="Close modal"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="mb-6">
          <div className="w-12 h-12 rounded-xl bg-blue-50 flex items-center justify-center mb-4">
            <Lock className="w-6 h-6 text-[#2563EB]" />
          </div>
          <h2 className="text-xl font-bold text-[#0F172A]">Reset Your Password</h2>
          <p className="text-sm text-slate-500 mt-1">
            Enter your email and we&apos;ll send you a recovery link.
          </p>
        </div>

        {success ? (
          <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-4 flex items-start gap-3">
            <CheckCircle2 className="w-5 h-5 text-emerald-500 shrink-0 mt-0.5" />
            <p className="text-sm text-emerald-700 font-medium">{success}</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <InputField
              id="forgot-email"
              label="Email Address"
              type="email"
              value={email}
              onChange={setEmail}
              placeholder="you@example.com"
              error={error}
              icon={Mail}
              autoComplete="email"
            />
            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 bg-[#2563EB] hover:bg-blue-700 disabled:opacity-60 text-white font-bold rounded-xl transition-colors flex items-center justify-center gap-2 cursor-pointer"
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Sending…
                </>
              ) : (
                "Send Reset Link"
              )}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}

// ─── Main Page ────────────────────────────────────────────────────────────────

export default function AuthPage() {
  const router = useRouter();

  // Flip state: false = Login, true = Register
  const [isFlipped, setIsFlipped] = useState(false);

  // Login form state
  const [loginRole, setLoginRole] = useState<Role>("seeker");
  const [loginForm, setLoginForm] = useState<LoginForm>({
    email: "",
    password: "",
    remember: false,
  });
  const [loginErrors, setLoginErrors] = useState<FormErrors>({});
  const [showLoginPassword, setShowLoginPassword] = useState(false);
  const [loginSubmitting, setLoginSubmitting] = useState(false);
  const [loginSuccess, setLoginSuccess] = useState("");

  // Register form state
  const [registerRole, setRegisterRole] = useState<Role>("seeker");
  const [registerForm, setRegisterForm] = useState<RegisterForm>({
    name: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
    companyName: "",
    agreeTerms: false,
  });
  const [registerErrors, setRegisterErrors] = useState<FormErrors>({});
  const [showRegPassword, setShowRegPassword] = useState(false);
  const [showRegConfirmPassword, setShowRegConfirmPassword] = useState(false);
  const [registerSubmitting, setRegisterSubmitting] = useState(false);
  const [registerSuccess, setRegisterSuccess] = useState("");

  // Modals state
  const [forgotOpen, setForgotOpen] = useState(false);
  const [otpModalOpen, setOtpModalOpen] = useState(false);
  const [otpEmail, setOtpEmail] = useState("");
  const [otpDemoCode, setOtpDemoCode] = useState("");
  const [otpPreviewUrl, setOtpPreviewUrl] = useState("");

  // Handlers
  const patchLoginForm = (key: keyof LoginForm, value: string | boolean) =>
    setLoginForm((prev) => ({ ...prev, [key]: value }));

  const patchRegisterForm = (key: keyof RegisterForm, value: string | boolean) =>
    setRegisterForm((prev) => ({ ...prev, [key]: value }));

  const handleQuickDemoFill = (role: Role) => {
    setLoginRole(role);
    setLoginErrors({});
    if (role === "seeker") {
      setLoginForm({
        email: "seeker@tecjob.com",
        password: "Password123!",
        remember: true,
      });
    } else {
      setLoginForm({
        email: "recruiter@tecjob.com",
        password: "Password123!",
        remember: true,
      });
    }
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    const errors = validateLoginForm(loginForm);
    if (Object.keys(errors).length > 0) {
      setLoginErrors(errors);
      return;
    }
    setLoginErrors({});
    setLoginSubmitting(true);
    try {
      const res = await fetch(`${API_BASE_URL}/api/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: loginForm.email,
          password: loginForm.password,
          role: loginRole,
        }),
      });
      const data = await res.json();

      if (data.requiresVerification) {
        // User needs to verify email with OTP first
        setOtpEmail(data.email || loginForm.email);
        setOtpDemoCode(data.demoOtp || "");
        setOtpPreviewUrl(data.previewUrl || "");
        setOtpModalOpen(true);
        return;
      }

      if (data.success) {
        if (data.accessToken && typeof window !== "undefined") {
          localStorage.setItem("tecjob_token", data.accessToken);
        }
        setLoginSuccess("Login verified! Redirecting to dashboard…");
        setTimeout(() => router.push(data.redirectTo || "/dashboard"), 1000);
      } else {
        setLoginErrors({ submit: data.message || "Invalid credentials. Please try again." });
      }
    } catch {
      setLoginErrors({ submit: "Connection error. Please try again." });
    } finally {
      setLoginSubmitting(false);
    }
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    const errors = validateRegisterForm(registerForm, registerRole);
    if (Object.keys(errors).length > 0) {
      setRegisterErrors(errors);
      return;
    }
    setRegisterErrors({});
    setRegisterSubmitting(true);
    try {
      const res = await fetch(`${API_BASE_URL}/api/auth/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: registerForm.name,
          email: registerForm.email,
          password: registerForm.password,
          phone: registerForm.phone,
          role: registerRole,
          companyName: registerForm.companyName,
          agreeTerms: registerForm.agreeTerms,
        }),
      });
      const data = await res.json();

      if (data.requiresVerification) {
        // Trigger OTP verification modal!
        setOtpEmail(data.email || registerForm.email);
        setOtpDemoCode(data.demoOtp || "");
        setOtpPreviewUrl(data.previewUrl || "");
        setOtpModalOpen(true);
      } else if (data.success) {
        setRegisterSuccess("Account created successfully!");
        setTimeout(() => router.push(data.redirectTo || "/dashboard"), 1200);
      } else {
        setRegisterErrors({ submit: data.message || "Registration failed. Please try again." });
      }
    } catch {
      setRegisterErrors({ submit: "Something went wrong. Please check your connection." });
    } finally {
      setRegisterSubmitting(false);
    }
  };

  const handleOtpVerified = (_user: any, redirectTo: string) => {
    setOtpModalOpen(false);
    setRegisterSuccess("Email verified successfully! Redirecting…");
    setLoginSuccess("Email verified! Redirecting…");
    setTimeout(() => {
      router.push(redirectTo || "/dashboard");
    }, 800);
  };

  const handleGoogleAuth = () => {
    alert("Google OAuth is not configured in this demo.");
  };

  const flipToRegister = () => {
    setLoginErrors({});
    setIsFlipped(true);
  };

  const flipToLogin = () => {
    setRegisterErrors({});
    setIsFlipped(false);
  };

  // ─── Render ───────────────────────────────────────────────────────────────

  return (
    <>
      <ForgotPasswordModal open={forgotOpen} onClose={() => setForgotOpen(false)} />
      <OtpVerificationModal
        open={otpModalOpen}
        email={otpEmail}
        role={isFlipped ? registerRole : loginRole}
        demoOtp={otpDemoCode}
        previewUrl={otpPreviewUrl}
        onClose={() => setOtpModalOpen(false)}
        onVerified={handleOtpVerified}
      />

      <div className="min-h-screen bg-gradient-to-br from-[#F0F7FF] via-white to-[#F8FAFC] flex flex-col">
        {/* Background blobs */}
        <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
          <div className="absolute w-80 h-80 rounded-full bg-blue-100/50 blur-3xl -top-20 -right-20" />
          <div className="absolute w-96 h-96 rounded-full bg-indigo-50/60 blur-3xl -bottom-32 -left-20" />
        </div>

        {/* Main layout */}
        <div className="relative z-10 flex flex-1 items-center justify-center lg:items-stretch">
          {/* ── Left branding panel ─────────────────────────────────── */}
          <div className="hidden lg:flex flex-col justify-between w-[45%] bg-gradient-to-br from-[#0B1F3A] to-[#1E3A5F] p-12 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-80 h-80 bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />
            <div className="absolute bottom-0 left-0 w-80 h-80 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />

            {/* Top: Logo */}
            <div className="relative z-10">
              <div className="mb-8">
                <TecJobLogo size="md" variant="dark" />
              </div>

              <p className="text-xs font-bold tracking-widest text-blue-400 uppercase mb-2">
                YOUR NEXT OPPORTUNITY
              </p>
              <h1 className="text-4xl xl:text-5xl font-black text-white leading-tight mb-4 tracking-tight">
                Your Next Career
                <br />
                Starts Here.
              </h1>
              <p className="text-slate-300 text-sm leading-relaxed max-w-sm">
                Discover verified jobs, connect with top tech employers, and unlock career opportunities with industry-grade security.
              </p>
            </div>

            {/* Middle: Feature highlights */}
            <div className="relative z-10 space-y-4 my-8">
              {[
                {
                  icon: Briefcase,
                  title: "Discover Relevant Jobs",
                  desc: "AI-matched roles from verified hiring companies.",
                },
                {
                  icon: ShieldCheck,
                  title: "High-Security OTP Verification",
                  desc: "Encrypted password protection with 2FA email verification.",
                },
                {
                  icon: Building2,
                  title: "Direct Employer Connection",
                  desc: "Real-time application status and recruiter messaging.",
                },
              ].map((item, i) => (
                <div key={i} className="flex items-start gap-3.5 group">
                  <div className="w-10 h-10 rounded-xl bg-white/10 border border-white/15 flex items-center justify-center shrink-0 text-blue-400 group-hover:bg-blue-600 group-hover:text-white transition-all">
                    <item.icon className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-white">{item.title}</h3>
                    <p className="text-xs text-slate-400 mt-0.5">{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>

            {/* Bottom: Activity visual */}
            <div className="relative z-10 bg-white/5 border border-white/10 rounded-2xl p-5 backdrop-blur-sm">
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-semibold text-slate-300">Live Portal Metrics</span>
                <span className="text-xs font-bold text-emerald-400 flex items-center gap-1">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                  Realtime Active
                </span>
              </div>
              <div className="h-16 flex items-end gap-2 px-1 relative">
                {[35, 60, 45, 80, 55, 95, 75].map((h, i) => (
                  <div
                    key={i}
                    className="flex-1 rounded-t-md transition-all duration-500"
                    style={{
                      height: `${h}%`,
                      background:
                        i === 5
                          ? "linear-gradient(to top, #2563EB, #60A5FA)"
                          : i === 6
                          ? "linear-gradient(to top, #1D4ED8, #3B82F6)"
                          : "linear-gradient(to top, #1E3A5F, #2563EB60)",
                      opacity: i >= 5 ? 1 : 0.6,
                    }}
                  />
                ))}
              </div>
              <p className="text-slate-400 text-xs mt-2 text-center">99.8% verification reliability · 2026</p>
            </div>
          </div>

          {/* ── Right: Flip Card Section ────────────────────────────── */}
          <div className="flex-1 lg:w-[55%] flex flex-col items-center justify-center px-4 py-8 lg:py-12">
            <div
              className="w-full max-w-[500px]"
              style={{ perspective: "1400px" }}
            >
              <div
                style={{
                  transformStyle: "preserve-3d",
                  transition: "transform 0.65s cubic-bezier(0.4, 0, 0.2, 1)",
                  transform: isFlipped ? "rotateY(180deg)" : "rotateY(0deg)",
                  position: "relative",
                  minHeight: "720px",
                }}
              >
                {/* ── FRONT: Login ──────────────────────────────────── */}
                <div
                  style={{
                    backfaceVisibility: "hidden",
                    WebkitBackfaceVisibility: "hidden",
                    position: "absolute",
                    inset: 0,
                  }}
                >
                  <div className="bg-white rounded-3xl shadow-xl shadow-blue-900/10 border border-slate-100 p-7 sm:p-9 h-full flex flex-col justify-between">
                    <div>
                      {/* Logo */}
                      <div className="flex items-center justify-between mb-4">
                        <TecJobLogo size="sm" />
                        <span className="text-[11px] font-bold text-slate-400 uppercase tracking-widest">
                          Secure Login
                        </span>
                      </div>

                      <h2 className="text-2xl font-black text-[#0F172A] tracking-tight">Welcome Back!</h2>
                      <p className="text-sm text-slate-500 mb-4">Log in to manage your jobs and applications.</p>

                      {/* Demo Quick Fill Buttons */}
                      <div className="mb-4 p-2.5 bg-slate-50 border border-slate-200/80 rounded-xl flex items-center justify-between gap-2">
                        <span className="text-xs text-slate-500 font-medium flex items-center gap-1">
                          Quick Demo:
                        </span>
                        <div className="flex items-center gap-1.5">
                          <button
                            type="button"
                            onClick={() => handleQuickDemoFill("seeker")}
                            className="px-2.5 py-1 text-xs font-semibold rounded-lg bg-blue-50 text-blue-700 hover:bg-blue-100 transition-colors border border-blue-200 cursor-pointer"
                          >
                            Seeker
                          </button>
                          <button
                            type="button"
                            onClick={() => handleQuickDemoFill("employer")}
                            className="px-2.5 py-1 text-xs font-semibold rounded-lg bg-purple-50 text-purple-700 hover:bg-purple-100 transition-colors border border-purple-200 cursor-pointer"
                          >
                            Recruiter
                          </button>
                        </div>
                      </div>

                      {/* Role selector */}
                      <div className="mb-4">
                        <RoleSelector value={loginRole} onChange={setLoginRole} />
                      </div>

                      {/* Login success banner */}
                      {loginSuccess && (
                        <div className="mb-4 p-3 bg-emerald-50 border border-emerald-200 rounded-xl flex items-center gap-2">
                          <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                          <span className="text-sm text-emerald-700 font-medium">{loginSuccess}</span>
                        </div>
                      )}

                      {/* Submit error */}
                      {loginErrors.submit && (
                        <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-xl flex items-center gap-2">
                          <AlertCircle className="w-4 h-4 text-red-500 shrink-0" />
                          <p className="text-sm text-red-600 font-medium">{loginErrors.submit}</p>
                        </div>
                      )}

                      <form onSubmit={handleLogin} className="space-y-3.5">
                        <InputField
                          id="login-email"
                          label="Email Address"
                          type="email"
                          value={loginForm.email}
                          onChange={(v) => patchLoginForm("email", v)}
                          placeholder="Enter your email"
                          error={loginErrors.email}
                          icon={Mail}
                          autoComplete="email"
                        />

                        <InputField
                          id="login-password"
                          label="Password"
                          type={showLoginPassword ? "text" : "password"}
                          value={loginForm.password}
                          onChange={(v) => patchLoginForm("password", v)}
                          placeholder="Enter your password"
                          error={loginErrors.password}
                          icon={Lock}
                          autoComplete="current-password"
                          rightElement={
                            <button
                              type="button"
                              onClick={() => setShowLoginPassword((s) => !s)}
                              className="text-slate-400 hover:text-slate-600 transition-colors cursor-pointer"
                              aria-label="Toggle password visibility"
                            >
                              {showLoginPassword ? (
                                <EyeOff className="w-4 h-4" />
                              ) : (
                                <Eye className="w-4 h-4" />
                              )}
                            </button>
                          }
                        />

                        {/* Remember me & Forgot Password */}
                        <div className="flex items-center justify-between text-xs pt-0.5">
                          <label className="flex items-center gap-2 text-slate-600 cursor-pointer select-none">
                            <input
                              type="checkbox"
                              checked={loginForm.remember}
                              onChange={(e) => patchLoginForm("remember", e.target.checked)}
                              className="w-4 h-4 rounded border-slate-300 accent-[#2563EB]"
                            />
                            <span>Remember me</span>
                          </label>

                          <button
                            type="button"
                            onClick={() => setForgotOpen(true)}
                            className="text-[#2563EB] font-semibold hover:underline cursor-pointer"
                          >
                            Forgot Password?
                          </button>
                        </div>

                        {/* Submit Button */}
                        <button
                          type="submit"
                          disabled={loginSubmitting}
                          className="w-full py-3.5 bg-[#2563EB] hover:bg-blue-700 disabled:opacity-60 text-white font-bold rounded-xl transition-all flex items-center justify-center gap-2 cursor-pointer shadow-md shadow-blue-600/20"
                        >
                          {loginSubmitting ? (
                            <>
                              <Loader2 className="w-4 h-4 animate-spin" />
                              Authenticating…
                            </>
                          ) : (
                            "Login to TecJob →"
                          )}
                        </button>
                      </form>

                      {/* Google */}
                      <div className="mt-3.5">
                        <button
                          type="button"
                          onClick={handleGoogleAuth}
                          className="w-full py-2.5 border border-slate-200 rounded-xl bg-white hover:bg-slate-50 transition-colors flex items-center justify-center gap-2.5 text-xs font-semibold text-slate-700 cursor-pointer"
                        >
                          <svg viewBox="0 0 24 24" className="w-4 h-4">
                            <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                            <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                            <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                            <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
                          </svg>
                          Continue with Google
                        </button>
                      </div>
                    </div>

                    {/* Bottom Flip Trigger */}
                    <div className="pt-4 border-t border-slate-100 text-center">
                      <p className="text-sm text-slate-600">
                        Don&apos;t have an account?{" "}
                        <button
                          type="button"
                          onClick={flipToRegister}
                          className="text-[#2563EB] font-bold hover:underline cursor-pointer ml-1"
                        >
                          Create Account
                        </button>
                      </p>
                    </div>
                  </div>
                </div>

                {/* ── BACK: Register ────────────────────────────────── */}
                <div
                  style={{
                    backfaceVisibility: "hidden",
                    WebkitBackfaceVisibility: "hidden",
                    transform: "rotateY(180deg)",
                    position: "absolute",
                    inset: 0,
                  }}
                >
                  <div className="bg-white rounded-3xl shadow-xl shadow-blue-900/10 border border-slate-100 p-7 sm:p-9 h-full flex flex-col overflow-y-auto">
                    <div className="flex items-center justify-between mb-3">
                      <TecJobLogo size="sm" />
                      <span className="text-[11px] font-bold text-slate-400 uppercase tracking-widest">
                        New Registration
                      </span>
                    </div>

                    <h2 className="text-2xl font-black text-[#0F172A] tracking-tight">Create Your Account</h2>
                    <p className="text-xs text-slate-500 mb-4">Complete your profile to receive an OTP verification.</p>

                    {/* Role selector */}
                    <div className="mb-4">
                      <RoleSelector value={registerRole} onChange={setRegisterRole} />
                    </div>

                    {/* Register success */}
                    {registerSuccess && (
                      <div className="mb-4 p-3 bg-emerald-50 border border-emerald-200 rounded-xl flex items-center gap-2">
                        <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                        <span className="text-sm text-emerald-700 font-medium">{registerSuccess}</span>
                      </div>
                    )}

                    {/* Submit error */}
                    {registerErrors.submit && (
                      <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-xl flex items-center gap-2">
                        <AlertCircle className="w-4 h-4 text-red-500 shrink-0" />
                        <p className="text-sm text-red-600 font-medium">{registerErrors.submit}</p>
                      </div>
                    )}

                    <form onSubmit={handleRegister} className="space-y-3 flex-1 flex flex-col">
                      <InputField
                        id="reg-name"
                        label="Full Name"
                        value={registerForm.name}
                        onChange={(v) => patchRegisterForm("name", v)}
                        placeholder="e.g. John Doe"
                        error={registerErrors.name}
                        icon={User}
                        autoComplete="name"
                      />

                      <InputField
                        id="reg-email"
                        label={registerRole === "employer" ? "Work Email Address" : "Email Address"}
                        type="email"
                        value={registerForm.email}
                        onChange={(v) => patchRegisterForm("email", v)}
                        placeholder="you@domain.com"
                        error={registerErrors.email}
                        icon={Mail}
                        autoComplete="email"
                      />

                      {registerRole === "employer" && (
                        <InputField
                          id="reg-company"
                          label="Company / Employer Name"
                          value={registerForm.companyName}
                          onChange={(v) => patchRegisterForm("companyName", v)}
                          placeholder="e.g. Acme Tech Solutions"
                          error={registerErrors.companyName}
                          icon={Building2}
                        />
                      )}

                      <InputField
                        id="reg-phone"
                        label="Mobile Phone Number"
                        type="tel"
                        value={registerForm.phone}
                        onChange={(v) => patchRegisterForm("phone", v)}
                        placeholder="+1 (555) 000-0000"
                        error={registerErrors.phone}
                        icon={Phone}
                        autoComplete="tel"
                      />

                      {/* Password + Strength Indicator */}
                      <div>
                        <InputField
                          id="reg-password"
                          label="Account Password"
                          type={showRegPassword ? "text" : "password"}
                          value={registerForm.password}
                          onChange={(v) => patchRegisterForm("password", v)}
                          placeholder="8+ chars, upper, lower, number, symbol"
                          error={registerErrors.password}
                          icon={Lock}
                          autoComplete="new-password"
                          rightElement={
                            <button
                              type="button"
                              onClick={() => setShowRegPassword((s) => !s)}
                              className="text-slate-400 hover:text-slate-600 transition-colors cursor-pointer"
                              aria-label="Toggle password visibility"
                            >
                              {showRegPassword ? (
                                <EyeOff className="w-4 h-4" />
                              ) : (
                                <Eye className="w-4 h-4" />
                              )}
                            </button>
                          }
                        />
                        <PasswordStrengthBar password={registerForm.password} />
                      </div>

                      <InputField
                        id="reg-confirm"
                        label="Confirm Password"
                        type={showRegConfirmPassword ? "text" : "password"}
                        value={registerForm.confirmPassword}
                        onChange={(v) => patchRegisterForm("confirmPassword", v)}
                        placeholder="Repeat password"
                        error={registerErrors.confirmPassword}
                        icon={Lock}
                        autoComplete="new-password"
                        rightElement={
                          <button
                            type="button"
                            onClick={() => setShowRegConfirmPassword((s) => !s)}
                            className="text-slate-400 hover:text-slate-600 transition-colors cursor-pointer"
                            aria-label="Toggle confirm password visibility"
                          >
                            {showRegConfirmPassword ? (
                              <EyeOff className="w-4 h-4" />
                            ) : (
                              <Eye className="w-4 h-4" />
                            )}
                          </button>
                        }
                      />

                      {/* Terms */}
                      <div className="pt-1">
                        <label className="flex items-start gap-2.5 cursor-pointer select-none">
                          <input
                            type="checkbox"
                            checked={registerForm.agreeTerms}
                            onChange={(e) => patchRegisterForm("agreeTerms", e.target.checked)}
                            className="mt-0.5 w-4 h-4 rounded border-slate-300 accent-[#2563EB]"
                          />
                          <span className="text-xs text-slate-600 leading-snug">
                            I agree to the{" "}
                            <Link href="#" className="text-[#2563EB] font-bold hover:underline">
                              Terms &amp; Conditions
                            </Link>{" "}
                            and{" "}
                            <Link href="#" className="text-[#2563EB] font-bold hover:underline">
                              Privacy Policy
                            </Link>
                          </span>
                        </label>
                        {registerErrors.agreeTerms && (
                          <p className="text-xs text-red-500 mt-1 font-medium">{registerErrors.agreeTerms}</p>
                        )}
                      </div>

                      {/* Submit */}
                      <button
                        type="submit"
                        disabled={registerSubmitting}
                        className="w-full py-3.5 mt-2 bg-[#2563EB] hover:bg-blue-700 disabled:opacity-60 text-white font-bold rounded-xl transition-all flex items-center justify-center gap-2 cursor-pointer shadow-md shadow-blue-600/20"
                      >
                        {registerSubmitting ? (
                          <>
                            <Loader2 className="w-4 h-4 animate-spin" />
                            Validating & Sending OTP…
                          </>
                        ) : (
                          "Create My Account (Send OTP) →"
                        )}
                      </button>

                      {/* Flip to login */}
                      <p className="text-center text-sm text-slate-600 pt-3 border-t border-slate-100 mt-auto">
                        Already have an account?{" "}
                        <button
                          type="button"
                          onClick={flipToLogin}
                          className="text-[#2563EB] font-bold hover:underline cursor-pointer ml-1"
                        >
                          Login
                        </button>
                      </p>
                    </form>
                  </div>
                </div>
              </div>
            </div>

            {/* Page minimal footer */}
            <p className="mt-6 text-xs text-slate-400 text-center">
              © 2026 TecJob Inc. · High Security Auth with Email OTP Verification
            </p>
          </div>
        </div>
      </div>
    </>
  );
}
