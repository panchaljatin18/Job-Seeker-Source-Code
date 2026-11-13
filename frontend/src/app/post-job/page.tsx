"use client";

import React, { useState, useEffect } from "react";
import Navbar from "@/Components/layout/Navbar";
import Footer from "@/Components/layout/Footer";
import {
  Briefcase,
  Building2,
  Bell,
  Users,
  Send,
  CheckCircle2,
  AlertCircle,
  Loader2,
  ExternalLink,
  PlusCircle,
  FileText,
  MailCheck,
} from "lucide-react";

export default function EmployerHubPage() {
  const [activeTab, setActiveTab] = useState<"job" | "company" | "broadcast" | "subscribers">("job");
  const [subscribers, setSubscribers] = useState<any[]>([]);
  const [notificationLogs, setNotificationLogs] = useState<any[]>([]);
  const [loadingStats, setLoadingStats] = useState(false);

  // Job Form State
  const [jobForm, setJobForm] = useState({
    title: "",
    company: "",
    location: "Ahmedabad, Gujarat",
    workType: "Full Time",
    locationType: "Hybrid",
    salary: "₹6L – ₹12L",
    experience: "1–3 Years",
    tags: "React, Next.js, Node.js",
    description: "Looking for an energetic developer to join our growing engineering team.",
    notifySubscribers: true,
  });

  // Company Form State
  const [companyForm, setCompanyForm] = useState({
    name: "",
    industry: "Information Technology",
    location: "Bangalore, India",
    website: "https://example.com",
    openJobs: 3,
    about: "Innovative tech enterprise building future-ready digital platforms.",
    notifySubscribers: true,
  });

  // Announcement Form State
  const [broadcastForm, setBroadcastForm] = useState({
    title: "",
    message: "",
    actionText: "Check Updates",
    actionUrl: "http://localhost:3000/jobs",
  });

  // Direct Test Form State
  const [testEmail, setTestEmail] = useState("");
  const [testSending, setTestSending] = useState(false);
  const [testFeedback, setTestFeedback] = useState<any>(null);

  // Submission feedback
  const [submitting, setSubmitting] = useState(false);
  const [resultBanner, setResultBanner] = useState<any>(null);

  // Load subscribers and logs
  const refreshData = async () => {
    setLoadingStats(true);
    try {
      const [subRes, notifRes] = await Promise.all([
        fetch("/api/newsletter/subscribers"),
        fetch("/api/notifications/broadcast"),
      ]);
      const subData = await subRes.json();
      const notifData = await notifRes.json();

      if (subData?.subscribers) setSubscribers(subData.subscribers);
      if (notifData?.logs) setNotificationLogs(notifData.logs);
    } catch (err) {
      console.error("Error loading hub data:", err);
    } finally {
      setLoadingStats(false);
    }
  };

  useEffect(() => {
    refreshData();
  }, []);

  // Post Job Handler
  const handlePostJob = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!jobForm.title || !jobForm.company) return;

    setSubmitting(true);
    setResultBanner(null);

    try {
      const res = await fetch("/api/jobs", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(jobForm),
      });
      const data = await res.json();

      if (res.ok && data.success) {
        setResultBanner({
          type: "success",
          title: "Job Posted Successfully! 🎉",
          message: data.notificationSent
            ? `New job alert email automatically dispatched to ${data.subscribersNotified} active subscriber(s)!`
            : "Job posted successfully (subscriber notifications disabled).",
          previewUrl: data.previewUrl,
        });
        setJobForm({
          title: "",
          company: "",
          location: "Ahmedabad, Gujarat",
          workType: "Full Time",
          locationType: "Hybrid",
          salary: "₹6L – ₹12L",
          experience: "1–3 Years",
          tags: "React, Next.js, Node.js",
          description: "Looking for an energetic developer to join our growing engineering team.",
          notifySubscribers: true,
        });
        refreshData();
      } else {
        setResultBanner({
          type: "error",
          title: "Submission Failed",
          message: data.message || "Could not publish job.",
        });
      }
    } catch (err: any) {
      setResultBanner({
        type: "error",
        title: "Network Error",
        message: err.message || "Something went wrong.",
      });
    } finally {
      setSubmitting(false);
    }
  };

  // Add Company Handler
  const handleAddCompany = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!companyForm.name) return;

    setSubmitting(true);
    setResultBanner(null);

    try {
      const res = await fetch("/api/companies", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(companyForm),
      });
      const data = await res.json();

      if (res.ok && data.success) {
        setResultBanner({
          type: "success",
          title: "Company Registered Successfully! 🏢",
          message: data.notificationSent
            ? `New company alert email automatically sent to ${data.subscribersNotified} subscriber(s)!`
            : "Company registered successfully.",
          previewUrl: data.previewUrl,
        });
        setCompanyForm({
          name: "",
          industry: "Information Technology",
          location: "Bangalore, India",
          website: "https://example.com",
          openJobs: 3,
          about: "Innovative tech enterprise building future-ready digital platforms.",
          notifySubscribers: true,
        });
        refreshData();
      } else {
        setResultBanner({
          type: "error",
          title: "Registration Failed",
          message: data.message || "Could not add company.",
        });
      }
    } catch (err: any) {
      setResultBanner({
        type: "error",
        title: "Error",
        message: err.message || "Failed to add company.",
      });
    } finally {
      setSubmitting(false);
    }
  };

  // Broadcast Handler
  const handleBroadcast = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!broadcastForm.title || !broadcastForm.message) return;

    setSubmitting(true);
    setResultBanner(null);

    try {
      const res = await fetch("/api/notifications/broadcast", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          type: "announcement",
          title: broadcastForm.title,
          message: broadcastForm.message,
          actionText: broadcastForm.actionText,
          actionUrl: broadcastForm.actionUrl,
        }),
      });
      const data = await res.json();

      if (res.ok && data.success) {
        setResultBanner({
          type: "success",
          title: "Announcement Dispatched! 📢",
          message: data.message,
          previewUrl: data.result?.previewUrl,
        });
        setBroadcastForm({
          title: "",
          message: "",
          actionText: "Check Updates",
          actionUrl: "http://localhost:3000/jobs",
        });
        refreshData();
      } else {
        setResultBanner({
          type: "error",
          title: "Broadcast Failed",
          message: data.message || "Could not broadcast update.",
        });
      }
    } catch (err: any) {
      setResultBanner({
        type: "error",
        title: "Broadcast Error",
        message: err.message,
      });
    } finally {
      setSubmitting(false);
    }
  };

  // Direct Test Email Handler
  const handleSendTestNotification = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!testEmail) return;

    setTestSending(true);
    setTestFeedback(null);

    try {
      const res = await fetch("/api/newsletter/subscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: testEmail }),
      });
      const data = await res.json();

      if (res.ok && data.success) {
        setTestFeedback({
          type: "success",
          message: `Confirmation email sent to ${testEmail}!`,
          previewUrl: data.previewUrl,
        });
        refreshData();
      } else {
        setTestFeedback({
          type: "error",
          message: data.message || "Failed to send test email.",
        });
      }
    } catch (err: any) {
      setTestFeedback({
        type: "error",
        message: err.message || "Network error.",
      });
    } finally {
      setTestSending(false);
    }
  };

  const activeSubscribersCount = subscribers.filter((s) => s.status === "active").length;

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 text-[#0F172A] font-sans">
      <Navbar />

      <main className="flex-1 py-10 sm:py-14">
        <div className="max-w-[1280px] mx-auto px-4 sm:px-8 lg:px-12">
          {/* Hero Banner */}
          <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-[#0F172A] via-[#1E3A8A] to-[#2563EB] text-white p-8 sm:p-12 mb-8 shadow-2xl">
            <div className="relative z-10 max-w-2xl">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/20 border border-blue-400/30 text-blue-200 text-xs font-semibold uppercase tracking-wider mb-4">
                Live Notification &amp; Posting Center
              </div>
              <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight">
                Post Updates & Notify Subscribers
              </h1>
              <p className="mt-2 text-blue-100 text-sm sm:text-base leading-relaxed">
                Whenever you post a new job, add a new company, or announce platform updates,
                every subscribed user automatically receives an email notification!
              </p>
            </div>

            {/* Live Stats */}
            <div className="relative z-10 grid grid-cols-2 sm:grid-cols-3 gap-4 mt-8 pt-6 border-t border-white/10">
              <div className="bg-white/10 backdrop-blur-md rounded-2xl p-4 border border-white/10">
                <div className="text-2xl sm:text-3xl font-black text-white">{activeSubscribersCount}</div>
                <div className="text-xs text-blue-200 font-medium">Active Email Subscribers</div>
              </div>
              <div className="bg-white/10 backdrop-blur-md rounded-2xl p-4 border border-white/10">
                <div className="text-2xl sm:text-3xl font-black text-white">{notificationLogs.length}</div>
                <div className="text-xs text-blue-200 font-medium">Total Emails Dispatched</div>
              </div>
              <div className="col-span-2 sm:col-span-1 bg-white/10 backdrop-blur-md rounded-2xl p-4 border border-white/10">
                <div className="text-2xl sm:text-3xl font-black text-emerald-400">Live Active</div>
                <div className="text-xs text-blue-200 font-medium">Email Dispatch Engine</div>
              </div>
            </div>
          </div>

          {/* Quick Test Email Card */}
          <div className="bg-white rounded-2xl border border-blue-100 p-5 sm:p-6 mb-8 shadow-sm">
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
              <div>
                <h3 className="text-base font-bold text-[#0F172A] flex items-center gap-2">
                  <MailCheck className="w-5 h-5 text-[#2563EB]" />
                  Verify Email Notification Right Now
                </h3>
                <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
                  Type any email address below to subscribe it and trigger an instant confirmation email!
                </p>
              </div>

              <form onSubmit={handleSendTestNotification} className="w-full md:w-auto flex flex-col sm:flex-row gap-2 shrink-0">
                <input
                  type="email"
                  value={testEmail}
                  onChange={(e) => setTestEmail(e.target.value)}
                  placeholder="name@example.com"
                  required
                  className="px-3.5 py-2 text-xs sm:text-sm rounded-xl border border-slate-300 focus:outline-none focus:border-[#2563EB] w-full sm:w-64"
                />
                <button
                  type="submit"
                  disabled={testSending}
                  className="px-4 py-2 bg-[#2563EB] hover:bg-blue-700 text-white text-xs sm:text-sm font-semibold rounded-xl shadow transition-colors flex items-center justify-center gap-1.5 cursor-pointer disabled:opacity-50"
                >
                  {testSending ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
                  <span>Test Subscribe & Send</span>
                </button>
              </form>
            </div>

            {testFeedback && (
              <div
                className={`mt-4 p-3 rounded-xl text-xs sm:text-sm border flex items-start gap-2.5 ${
                  testFeedback.type === "success"
                    ? "bg-emerald-50 border-emerald-200 text-emerald-800"
                    : "bg-rose-50 border-rose-200 text-rose-800"
                }`}
              >
                {testFeedback.type === "success" ? (
                  <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
                ) : (
                  <AlertCircle className="w-5 h-5 text-rose-600 shrink-0" />
                )}
                <div>
                  <p className="font-medium">{testFeedback.message}</p>
                  {testFeedback.previewUrl && (
                    <a
                      href={testFeedback.previewUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex items-center gap-1 mt-1 text-xs font-bold text-blue-700 hover:underline"
                    >
                      <span>Click to view the delivered email in browser preview</span>
                      <ExternalLink className="w-3.5 h-3.5" />
                    </a>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Result Alert Banner */}
          {resultBanner && (
            <div
              className={`mb-8 p-4 sm:p-5 rounded-2xl border shadow-sm transition-all ${
                resultBanner.type === "success"
                  ? "bg-emerald-50 border-emerald-200 text-emerald-900"
                  : "bg-rose-50 border-rose-200 text-rose-900"
              }`}
            >
              <div className="flex items-start gap-3">
                {resultBanner.type === "success" ? (
                  <CheckCircle2 className="w-6 h-6 text-emerald-600 shrink-0 mt-0.5" />
                ) : (
                  <AlertCircle className="w-6 h-6 text-rose-600 shrink-0 mt-0.5" />
                )}
                <div className="flex-1">
                  <h4 className="font-bold text-sm sm:text-base">{resultBanner.title}</h4>
                  <p className="text-xs sm:text-sm mt-0.5 opacity-90 leading-relaxed">
                    {resultBanner.message}
                  </p>
                  {resultBanner.previewUrl && (
                    <div className="mt-2.5">
                      <a
                        href={resultBanner.previewUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-bold shadow-sm transition-colors"
                      >
                        <span>View Dispatched Email Preview</span>
                        <ExternalLink className="w-3.5 h-3.5" />
                      </a>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Navigation Tabs */}
          <div className="flex flex-wrap items-center gap-2 border-b border-slate-200 pb-3 mb-8">
            <button
              onClick={() => setActiveTab("job")}
              className={`flex items-center gap-2 px-5 py-2.5 rounded-xl font-bold text-sm transition-all cursor-pointer ${
                activeTab === "job"
                  ? "bg-[#2563EB] text-white shadow-md shadow-blue-500/20"
                  : "bg-white text-slate-600 hover:bg-slate-100 border border-slate-200"
              }`}
            >
              <Briefcase className="w-4 h-4" />
              <span>1. Post New Job (Auto-Notify)</span>
            </button>

            <button
              onClick={() => setActiveTab("company")}
              className={`flex items-center gap-2 px-5 py-2.5 rounded-xl font-bold text-sm transition-all cursor-pointer ${
                activeTab === "company"
                  ? "bg-[#2563EB] text-white shadow-md shadow-blue-500/20"
                  : "bg-white text-slate-600 hover:bg-slate-100 border border-slate-200"
              }`}
            >
              <Building2 className="w-4 h-4" />
              <span>2. Add New Company (Auto-Notify)</span>
            </button>

            <button
              onClick={() => setActiveTab("broadcast")}
              className={`flex items-center gap-2 px-5 py-2.5 rounded-xl font-bold text-sm transition-all cursor-pointer ${
                activeTab === "broadcast"
                  ? "bg-[#2563EB] text-white shadow-md shadow-blue-500/20"
                  : "bg-white text-slate-600 hover:bg-slate-100 border border-slate-200"
              }`}
            >
              <Bell className="w-4 h-4" />
              <span>3. Send Update / Broadcast</span>
            </button>

            <button
              onClick={() => {
                setActiveTab("subscribers");
                refreshData();
              }}
              className={`flex items-center gap-2 px-5 py-2.5 rounded-xl font-bold text-sm transition-all cursor-pointer ${
                activeTab === "subscribers"
                  ? "bg-[#2563EB] text-white shadow-md shadow-blue-500/20"
                  : "bg-white text-slate-600 hover:bg-slate-100 border border-slate-200"
              }`}
            >
              <Users className="w-4 h-4" />
              <span>4. Subscribers & Logs ({subscribers.length})</span>
            </button>
          </div>

          {/* TAB 1: POST A NEW JOB */}
          {activeTab === "job" && (
            <div className="bg-white rounded-3xl border border-slate-200/90 p-6 sm:p-10 shadow-sm">
              <div className="mb-6">
                <h2 className="text-xl sm:text-2xl font-black text-[#0F172A]">
                  Post a New Job Opportunity
                </h2>
                <p className="text-xs sm:text-sm text-slate-500 mt-1">
                  Once published, this job is immediately listed on the website and an email notification is automatically dispatched to all registered subscribers.
                </p>
              </div>

              <form onSubmit={handlePostJob} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                      Job Title *
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Senior React & Next.js Developer"
                      value={jobForm.title}
                      onChange={(e) => setJobForm({ ...jobForm, title: e.target.value })}
                      className="w-full px-4 py-3 rounded-xl border border-slate-300 text-sm focus:outline-none focus:border-[#2563EB]"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                      Company Name *
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Infosys, Swiggy, Amazon"
                      value={jobForm.company}
                      onChange={(e) => setJobForm({ ...jobForm, company: e.target.value })}
                      className="w-full px-4 py-3 rounded-xl border border-slate-300 text-sm focus:outline-none focus:border-[#2563EB]"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                      Location
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. Ahmedabad, Gujarat / Remote"
                      value={jobForm.location}
                      onChange={(e) => setJobForm({ ...jobForm, location: e.target.value })}
                      className="w-full px-4 py-3 rounded-xl border border-slate-300 text-sm focus:outline-none focus:border-[#2563EB]"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                      Salary Range
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. ₹6L – ₹12L"
                      value={jobForm.salary}
                      onChange={(e) => setJobForm({ ...jobForm, salary: e.target.value })}
                      className="w-full px-4 py-3 rounded-xl border border-slate-300 text-sm focus:outline-none focus:border-[#2563EB]"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                      Work Mode & Type
                    </label>
                    <div className="grid grid-cols-2 gap-3">
                      <select
                        value={jobForm.workType}
                        onChange={(e) => setJobForm({ ...jobForm, workType: e.target.value })}
                        className="px-3 py-3 rounded-xl border border-slate-300 text-sm focus:outline-none focus:border-[#2563EB]"
                      >
                        <option>Full Time</option>
                        <option>Part Time</option>
                        <option>Contract</option>
                        <option>Internship</option>
                      </select>

                      <select
                        value={jobForm.locationType}
                        onChange={(e) => setJobForm({ ...jobForm, locationType: e.target.value })}
                        className="px-3 py-3 rounded-xl border border-slate-300 text-sm focus:outline-none focus:border-[#2563EB]"
                      >
                        <option>Remote</option>
                        <option>Hybrid</option>
                        <option>On-site</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                      Skills / Tags (Comma separated)
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. React, Next.js, Node.js, TypeScript"
                      value={jobForm.tags}
                      onChange={(e) => setJobForm({ ...jobForm, tags: e.target.value })}
                      className="w-full px-4 py-3 rounded-xl border border-slate-300 text-sm focus:outline-none focus:border-[#2563EB]"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                    Role Description
                  </label>
                  <textarea
                    rows={3}
                    placeholder="Brief description of responsibilities and qualifications..."
                    value={jobForm.description}
                    onChange={(e) => setJobForm({ ...jobForm, description: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl border border-slate-300 text-sm focus:outline-none focus:border-[#2563EB]"
                  />
                </div>

                {/* Notification Checkbox */}
                <div className="bg-blue-50/70 border border-blue-200/80 rounded-2xl p-4 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <input
                      type="checkbox"
                      id="notifySubscribersJob"
                      checked={jobForm.notifySubscribers}
                      onChange={(e) => setJobForm({ ...jobForm, notifySubscribers: e.target.checked })}
                      className="w-4 h-4 text-[#2563EB] rounded cursor-pointer"
                    />
                    <label htmlFor="notifySubscribersJob" className="text-xs sm:text-sm font-semibold text-[#0F172A] cursor-pointer">
                      Send Instant Email Notification to all ({activeSubscribersCount}) Subscribers
                    </label>
                  </div>
                  <span className="text-xs font-bold text-[#2563EB] bg-white px-2.5 py-1 rounded-full border border-blue-200">
                    Recommended
                  </span>
                </div>

                <button
                  type="submit"
                  disabled={submitting}
                  className="w-full sm:w-auto px-8 py-3.5 bg-[#2563EB] hover:bg-blue-700 text-white font-bold rounded-xl shadow-lg shadow-blue-600/20 transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
                >
                  {submitting ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span>Publishing & Sending Emails...</span>
                    </>
                  ) : (
                    <>
                      <PlusCircle className="w-5 h-5" />
                      <span>Publish Job & Broadcast Alert</span>
                    </>
                  )}
                </button>
              </form>
            </div>
          )}

          {/* TAB 2: ADD A NEW COMPANY */}
          {activeTab === "company" && (
            <div className="bg-white rounded-3xl border border-slate-200/90 p-6 sm:p-10 shadow-sm">
              <div className="mb-6">
                <h2 className="text-xl sm:text-2xl font-black text-[#0F172A]">
                  Add a New Company to TecJob
                </h2>
                <p className="text-xs sm:text-sm text-slate-500 mt-1">
                  Register a hiring organization. Subscribers will receive an instant email alert welcoming the new company.
                </p>
              </div>

              <form onSubmit={handleAddCompany} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                      Company Name *
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Razorpay, Zomato, Adobe"
                      value={companyForm.name}
                      onChange={(e) => setCompanyForm({ ...companyForm, name: e.target.value })}
                      className="w-full px-4 py-3 rounded-xl border border-slate-300 text-sm focus:outline-none focus:border-[#2563EB]"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                      Industry
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. FinTech, Artificial Intelligence, E-Commerce"
                      value={companyForm.industry}
                      onChange={(e) => setCompanyForm({ ...companyForm, industry: e.target.value })}
                      className="w-full px-4 py-3 rounded-xl border border-slate-300 text-sm focus:outline-none focus:border-[#2563EB]"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                      Headquarters Location
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. Bangalore, India"
                      value={companyForm.location}
                      onChange={(e) => setCompanyForm({ ...companyForm, location: e.target.value })}
                      className="w-full px-4 py-3 rounded-xl border border-slate-300 text-sm focus:outline-none focus:border-[#2563EB]"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                      Company Website
                    </label>
                    <input
                      type="url"
                      placeholder="https://company.com"
                      value={companyForm.website}
                      onChange={(e) => setCompanyForm({ ...companyForm, website: e.target.value })}
                      className="w-full px-4 py-3 rounded-xl border border-slate-300 text-sm focus:outline-none focus:border-[#2563EB]"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                    About the Company
                  </label>
                  <textarea
                    rows={3}
                    placeholder="Short introduction about products, vision, and team culture..."
                    value={companyForm.about}
                    onChange={(e) => setCompanyForm({ ...companyForm, about: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl border border-slate-300 text-sm focus:outline-none focus:border-[#2563EB]"
                  />
                </div>

                {/* Notification Checkbox */}
                <div className="bg-blue-50/70 border border-blue-200/80 rounded-2xl p-4 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <input
                      type="checkbox"
                      id="notifySubscribersCompany"
                      checked={companyForm.notifySubscribers}
                      onChange={(e) => setCompanyForm({ ...companyForm, notifySubscribers: e.target.checked })}
                      className="w-4 h-4 text-[#2563EB] rounded cursor-pointer"
                    />
                    <label htmlFor="notifySubscribersCompany" className="text-xs sm:text-sm font-semibold text-[#0F172A] cursor-pointer">
                      Send Instant Email Notification to all ({activeSubscribersCount}) Subscribers
                    </label>
                  </div>
                  <span className="text-xs font-bold text-[#2563EB] bg-white px-2.5 py-1 rounded-full border border-blue-200">
                    Recommended
                  </span>
                </div>

                <button
                  type="submit"
                  disabled={submitting}
                  className="w-full sm:w-auto px-8 py-3.5 bg-[#2563EB] hover:bg-blue-700 text-white font-bold rounded-xl shadow-lg shadow-blue-600/20 transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
                >
                  {submitting ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span>Adding & Sending Notifications...</span>
                    </>
                  ) : (
                    <>
                      <Building2 className="w-5 h-5" />
                      <span>Register Company & Notify Subscribers</span>
                    </>
                  )}
                </button>
              </form>
            </div>
          )}

          {/* TAB 3: BROADCAST UPDATE */}
          {activeTab === "broadcast" && (
            <div className="bg-white rounded-3xl border border-slate-200/90 p-6 sm:p-10 shadow-sm">
              <div className="mb-6">
                <h2 className="text-xl sm:text-2xl font-black text-[#0F172A]">
                  Broadcast Update or Announcement
                </h2>
                <p className="text-xs sm:text-sm text-slate-500 mt-1">
                  Send a custom newsletter, career tip, or platform update straight to the inboxes of all subscribers.
                </p>
              </div>

              <form onSubmit={handleBroadcast} className="space-y-6">
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                    Announcement Headline / Subject *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Major Hiring Drive: 50+ Top Tech Startups Now Recruiting!"
                    value={broadcastForm.title}
                    onChange={(e) => setBroadcastForm({ ...broadcastForm, title: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl border border-slate-300 text-sm focus:outline-none focus:border-[#2563EB]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                    Notification Message Content *
                  </label>
                  <textarea
                    rows={5}
                    required
                    placeholder="Write the full message to be delivered to subscribers' emails..."
                    value={broadcastForm.message}
                    onChange={(e) => setBroadcastForm({ ...broadcastForm, message: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl border border-slate-300 text-sm focus:outline-none focus:border-[#2563EB]"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                      Button Label
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. Explore Opportunities Now"
                      value={broadcastForm.actionText}
                      onChange={(e) => setBroadcastForm({ ...broadcastForm, actionText: e.target.value })}
                      className="w-full px-4 py-3 rounded-xl border border-slate-300 text-sm focus:outline-none focus:border-[#2563EB]"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                      Target Link / URL
                    </label>
                    <input
                      type="url"
                      placeholder="http://localhost:3000/jobs"
                      value={broadcastForm.actionUrl}
                      onChange={(e) => setBroadcastForm({ ...broadcastForm, actionUrl: e.target.value })}
                      className="w-full px-4 py-3 rounded-xl border border-slate-300 text-sm focus:outline-none focus:border-[#2563EB]"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={submitting}
                  className="w-full sm:w-auto px-8 py-3.5 bg-[#2563EB] hover:bg-blue-700 text-white font-bold rounded-xl shadow-lg shadow-blue-600/20 transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
                >
                  {submitting ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span>Broadcasting to {activeSubscribersCount} Subscribers...</span>
                    </>
                  ) : (
                    <>
                      <Send className="w-5 h-5" />
                      <span>Send Email Broadcast to All Subscribers</span>
                    </>
                  )}
                </button>
              </form>
            </div>
          )}

          {/* TAB 4: SUBSCRIBERS & LOGS */}
          {activeTab === "subscribers" && (
            <div className="space-y-8">
              {/* Subscribers List */}
              <div className="bg-white rounded-3xl border border-slate-200/90 p-6 sm:p-8 shadow-sm">
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <h3 className="text-xl font-bold text-[#0F172A] flex items-center gap-2">
                      <Users className="w-5 h-5 text-[#2563EB]" />
                      Subscribed Users ({subscribers.length})
                    </h3>
                    <p className="text-xs text-slate-500 mt-1">
                      All users who subscribed via the footer or newsletter forms.
                    </p>
                  </div>
                  <button
                    onClick={refreshData}
                    disabled={loadingStats}
                    className="text-xs font-semibold text-[#2563EB] hover:underline cursor-pointer"
                  >
                    Refresh List
                  </button>
                </div>

                {subscribers.length === 0 ? (
                  <div className="text-center py-10 bg-slate-50 rounded-2xl border border-dashed border-slate-300">
                    <p className="text-sm text-slate-500">No subscribers yet.</p>
                    <p className="text-xs text-slate-400 mt-1">
                      Type an email in the verification box above or in the footer to add the first subscriber!
                    </p>
                  </div>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse text-xs sm:text-sm">
                      <thead>
                        <tr className="border-b border-slate-200 text-slate-400 font-bold uppercase tracking-wider text-[11px]">
                          <th className="py-3 px-4">Email</th>
                          <th className="py-3 px-4">Status</th>
                          <th className="py-3 px-4">Subscribed At</th>
                          <th className="py-3 px-4">Preferences</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100">
                        {subscribers.map((sub, idx) => (
                          <tr key={sub.id || idx} className="hover:bg-slate-50/80 transition-colors">
                            <td className="py-3 px-4 font-semibold text-[#0F172A]">{sub.email}</td>
                            <td className="py-3 px-4">
                              <span
                                className={`inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-bold ${
                                  sub.status === "active"
                                    ? "bg-emerald-100 text-emerald-800"
                                    : "bg-slate-200 text-slate-700"
                                }`}
                              >
                                {sub.status || "active"}
                              </span>
                            </td>
                            <td className="py-3 px-4 text-slate-500">
                              {sub.subscribedAt ? new Date(sub.subscribedAt).toLocaleString() : "Recently"}
                            </td>
                            <td className="py-3 px-4 text-slate-500">Jobs, Companies, Updates</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>

              {/* Notification Logs */}
              <div className="bg-white rounded-3xl border border-slate-200/90 p-6 sm:p-8 shadow-sm">
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <h3 className="text-xl font-bold text-[#0F172A] flex items-center gap-2">
                      <FileText className="w-5 h-5 text-[#2563EB]" />
                      Sent Notification Logs ({notificationLogs.length})
                    </h3>
                    <p className="text-xs text-slate-500 mt-1">
                      Record of all automated and broadcast email deliveries.
                    </p>
                  </div>
                </div>

                {notificationLogs.length === 0 ? (
                  <div className="text-center py-10 bg-slate-50 rounded-2xl border border-dashed border-slate-300">
                    <p className="text-sm text-slate-500">No email notifications sent yet.</p>
                  </div>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse text-xs sm:text-sm">
                      <thead>
                        <tr className="border-b border-slate-200 text-slate-400 font-bold uppercase tracking-wider text-[11px]">
                          <th className="py-3 px-4">Timestamp</th>
                          <th className="py-3 px-4">Type</th>
                          <th className="py-3 px-4">Subject</th>
                          <th className="py-3 px-4">Recipients</th>
                          <th className="py-3 px-4">Status</th>
                          <th className="py-3 px-4">Preview</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100">
                        {notificationLogs.map((log, idx) => (
                          <tr key={log.id || idx} className="hover:bg-slate-50/80 transition-colors">
                            <td className="py-3 px-4 text-slate-500 whitespace-nowrap">
                              {log.timestamp ? new Date(log.timestamp).toLocaleTimeString() : "-"}
                            </td>
                            <td className="py-3 px-4">
                              <span className="font-bold uppercase text-[10px] tracking-wider px-2 py-0.5 rounded bg-blue-50 text-[#2563EB] border border-blue-100">
                                {log.type || "notification"}
                              </span>
                            </td>
                            <td className="py-3 px-4 font-semibold text-[#0F172A] max-w-xs truncate">
                              {log.subject}
                            </td>
                            <td className="py-3 px-4 text-slate-600">
                              {log.recipient || `${log.recipientsCount || 1} subscriber(s)`}
                            </td>
                            <td className="py-3 px-4">
                              <span className="text-emerald-700 font-semibold bg-emerald-50 px-2 py-0.5 rounded text-xs">
                                {log.status || "sent"}
                              </span>
                            </td>
                            <td className="py-3 px-4">
                              {log.previewUrl ? (
                                <a
                                  href={log.previewUrl}
                                  target="_blank"
                                  rel="noreferrer"
                                  className="text-[#2563EB] hover:underline font-bold inline-flex items-center gap-1 text-xs"
                                >
                                  <span>View Email</span>
                                  <ExternalLink className="w-3 h-3" />
                                </a>
                              ) : (
                                <span className="text-slate-400 text-xs">Delivered</span>
                              )}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
}
