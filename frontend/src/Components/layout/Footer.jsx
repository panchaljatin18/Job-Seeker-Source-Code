"use client";

import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Briefcase, CheckCircle2, AlertCircle, Loader2, ExternalLink } from "lucide-react";

export default function Footer() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [feedback, setFeedback] = useState(null); // { type: 'success' | 'error', message, previewUrl }

  const handleSubscribe = async (e) => {
    e.preventDefault();
    if (!email || loading) return;

    setLoading(true);
    setFeedback(null);

    try {
      const response = await fetch("/api/newsletter/subscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();

      if (response.ok && data.success) {
        setFeedback({
          type: "success",
          message: data.message || "Subscribed successfully! You'll now receive email notifications for new jobs & updates.",
          previewUrl: data.previewUrl || null,
        });
        setEmail("");
      } else {
        setFeedback({
          type: "error",
          message: data.message || "Failed to subscribe. Please try again.",
        });
      }
    } catch (err) {
      console.error("Subscription error:", err);
      setFeedback({
        type: "error",
        message: "An error occurred while subscribing. Please check your network.",
      });
    } finally {
      setLoading(false);
    }
  };

  const jobSeekerLinks = [
    { name: "Browse Jobs", href: "/jobs" },
    { name: "Career Resources", href: "/jobs" },
    { name: "Job Alerts", href: "#newsletter" },
    { name: "Companies List", href: "/companies" },
  ];

  const employerLinks = [
    { name: "Post a Job", href: "/post-job" },
    { name: "Notification Hub", href: "/post-job?tab=broadcast" },
    { name: "Add Company", href: "/post-job?tab=company" },
    { name: "Company Profiles", href: "/companies" },
    { name: "Subscribers List", href: "/post-job?tab=subscribers" },
  ];

  const quickLinks = [
    { name: "Home", href: "/" },
    { name: "Jobs", href: "/jobs" },
    { name: "Companies", href: "/companies" },
    { name: "Post Opportunity", href: "/post-job" },
  ];

  return (
    <footer id="newsletter" className="bg-[#0F172A] text-slate-300 border-t border-slate-800/80">
      <div className="max-w-[1280px] mx-auto px-4 sm:px-8 lg:px-12 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-10 lg:gap-8">
          <div className="lg:col-span-4 space-y-4">
            <Link href="/" className="inline-flex items-center">
              <Image
                src="/tecjob-logo-white.webp"
                alt="TecJob - YOUR NEXT OPPORTUNITY"
                width={300}
                height={108}
                quality={100}
                unoptimized
                className="h-13 sm:h-14 md:h-15 w-auto object-contain"
              />
            </Link>
            <p className="text-sm text-slate-400 max-w-sm leading-relaxed font-normal">
              Your trusted platform to find the right job opportunities and build a better future with TecJob.
            </p>
            <div className="flex items-center gap-3 pt-2">
              <Link
                href="#"
                aria-label="LinkedIn"
                className="w-9 h-9 rounded-lg bg-slate-800/80 hover:bg-[#2563EB] hover:text-white flex items-center justify-center text-slate-400 transition-colors"
              >
                <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                  <path d="M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14m-.5 15.5v-5.3a3.26 3.26 0 0 0-3.26-3.26c-.85 0-1.84.52-2.28 1.3v-1.11h-2.79v8.37h2.79v-4.93c0-.77.62-1.4 1.39-1.4a1.4 1.4 0 0 1 1.4 1.4v4.93h2.75M6.46 10.9v8.37H9.25V10.9H6.46M7.86 6.7a1.62 1.62 0 1 0 0 3.24 1.62 1.62 0 0 0 0-3.24z" />
                </svg>
              </Link>
              <Link
                href="#"
                aria-label="Facebook"
                className="w-9 h-9 rounded-lg bg-slate-800/80 hover:bg-[#2563EB] hover:text-white flex items-center justify-center text-slate-400 transition-colors"
              >
                <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                  <path d="M12 2.04C6.5 2.04 2 6.53 2 12.06C2 17.06 5.66 21.21 10.44 21.96V14.96H7.9V12.06H10.44V9.85C10.44 7.34 11.93 5.96 14.22 5.96C15.31 5.96 16.45 6.15 16.45 6.15V8.62H15.19C13.95 8.62 13.56 9.39 13.56 10.18V12.06H16.34L15.89 14.96H13.56V21.96A10 10 0 0 0 22 12.06C22 6.53 17.5 2.04 12 2.04Z" />
                </svg>
              </Link>
              <Link
                href="#"
                aria-label="Twitter"
                className="w-9 h-9 rounded-lg bg-slate-800/80 hover:bg-[#2563EB] hover:text-white flex items-center justify-center text-slate-400 transition-colors"
              >
                <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                  <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                </svg>
              </Link>
            </div>
          </div>

          <div className="lg:col-span-2">
            <h3 className="text-sm font-bold text-white uppercase tracking-wider mb-4">
              For Job Seekers
            </h3>
            <ul className="space-y-2.5 text-xs sm:text-sm">
              {jobSeekerLinks.map((item) => (
                <li key={item.name}>
                  <Link href={item.href} className="text-slate-400 hover:text-white transition-colors">
                    {item.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div className="lg:col-span-2">
            <h3 className="text-sm font-bold text-white uppercase tracking-wider mb-4">
              For Employers
            </h3>
            <ul className="space-y-2.5 text-xs sm:text-sm">
              {employerLinks.map((item) => (
                <li key={item.name}>
                  <Link href={item.href} className="text-slate-400 hover:text-white transition-colors">
                    {item.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div className="lg:col-span-2">
            <h3 className="text-sm font-bold text-white uppercase tracking-wider mb-4">
              Quick Links
            </h3>
            <ul className="space-y-2.5 text-xs sm:text-sm">
              {quickLinks.map((item) => (
                <li key={item.name}>
                  <Link href={item.href} className="text-slate-400 hover:text-white transition-colors">
                    {item.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div className="lg:col-span-2">
            <h3 className="text-sm font-bold text-white uppercase tracking-wider mb-4">
              Subscribe to Our Newsletter
            </h3>
            <p className="text-xs text-slate-400 mb-3 leading-relaxed">
              Get real-time email notifications for new job posts, added companies & platform updates.
            </p>

            <form onSubmit={handleSubscribe} className="space-y-2.5">
              <input
                type="email"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  if (feedback) setFeedback(null);
                }}
                placeholder="Enter your email"
                required
                disabled={loading}
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-white placeholder:text-slate-500 text-xs focus:outline-none focus:border-[#2563EB] disabled:opacity-50 transition-colors"
              />
              <button
                type="submit"
                disabled={loading}
                className="w-full py-2.5 px-4 bg-[#2563EB] hover:bg-blue-600 active:bg-blue-700 text-white rounded-xl text-xs font-semibold shadow-md transition-all cursor-pointer flex items-center justify-center gap-1.5 disabled:opacity-60"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-3.5 h-3.5 animate-spin" />
                    <span>Subscribing...</span>
                  </>
                ) : (
                  <span>Subscribe</span>
                )}
              </button>
            </form>

            {/* Real-time Feedback Status */}
            {feedback && (
              <div
                className={`mt-3 p-2.5 rounded-xl text-xs border transition-all ${
                  feedback.type === "success"
                    ? "bg-emerald-950/60 border-emerald-600/50 text-emerald-300"
                    : "bg-rose-950/60 border-rose-600/50 text-rose-300"
                }`}
              >
                <div className="flex items-start gap-2">
                  {feedback.type === "success" ? (
                    <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-400 mt-0.5" />
                  ) : (
                    <AlertCircle className="w-4 h-4 shrink-0 text-rose-400 mt-0.5" />
                  )}
                  <div className="flex-1">
                    <p className="leading-snug">{feedback.message}</p>
                    {feedback.previewUrl && (
                      <a
                        href={feedback.previewUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex items-center gap-1 mt-1.5 text-[11px] font-bold text-blue-300 hover:text-white underline"
                      >
                        <span>View Sent Confirmation Email Preview</span>
                        <ExternalLink className="w-3 h-3" />
                      </a>
                    )}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        <div className="mt-14 pt-6 border-t border-slate-800/80 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-400">
          <div>© 2026 TecJob. All rights reserved.</div>
          <div className="flex items-center gap-6">
            <Link href="/post-job" className="hover:text-blue-400 font-medium transition-colors">
              Post a Job & Notify Subscribers
            </Link>
            <Link href="#" className="hover:text-white transition-colors">
              Privacy Policy
            </Link>
            <Link href="#" className="hover:text-white transition-colors">
              Terms & Conditions
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}