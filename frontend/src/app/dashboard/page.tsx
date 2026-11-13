"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  User,
  Bookmark,
  Briefcase,
  CheckCircle2,
  Clock,
  MapPin,
  Calendar,
  LogOut,
  Mail,
} from "lucide-react";
import Navbar from "@/Components/layout/Navbar";
import Footer from "@/Components/layout/Footer";

type DashboardTab = "profile" | "saved" | "applied" | "status";

export default function JobSeekerDashboard() {
  const [activeTab, setActiveTab] = useState<DashboardTab>("profile");

  // Mock Candidate Profile State
  const [profile, setProfile] = useState({
    name: "Alex Morgan",
    title: "Senior Full Stack Software Engineer",
    email: "alex.morgan@demo.com",
    phone: "+1 (555) 234-5678",
    location: "San Francisco, CA (Open to Remote)",
    bio: "Passionate engineer with 5+ years building scalable cloud platforms and reactive web apps. Specialized in React, Next.js, TypeScript, and microservices architecture.",
    experienceYears: "5+ Years",
    education: "B.S. in Computer Science — UC Berkeley (2019)",
    skills: [
      "React",
      "Next.js",
      "TypeScript",
      "Node.js",
      "Python",
      "Tailwind CSS",
      "PostgreSQL",
      "Docker",
      "AWS",
      "REST APIs"
    ]
  });

  // Mock Saved Jobs
  const [savedJobs, setSavedJobs] = useState([
    {
      id: "job-1",
      title: "Senior Frontend Engineer",
      company: "Stripe",
      location: "San Francisco, CA (Hybrid)",
      salary: "$150,000 - $185,000",
      type: "Full-time",
      posted: "2 days ago",
      tags: ["React", "TypeScript", "Next.js"]
    },
    {
      id: "job-2",
      title: "Full Stack Cloud Developer",
      company: "Vercel",
      location: "Remote (US)",
      salary: "$140,000 - $175,000",
      type: "Full-time",
      posted: "4 days ago",
      tags: ["Next.js", "Edge Computing", "Node.js"]
    },
    {
      id: "job-3",
      title: "Lead UI Systems Architect",
      company: "Figma",
      location: "San Francisco, CA",
      salary: "$165,000 - $200,000",
      type: "Full-time",
      posted: "1 week ago",
      tags: ["Design Systems", "WebAssembly", "TypeScript"]
    }
  ]);

  // Mock Applied Jobs
  const [appliedJobs, setAppliedJobs] = useState([
    {
      id: "app-1",
      title: "Staff Frontend Platform Engineer",
      company: "Shopify",
      appliedDate: "Oct 18, 2026",
      status: "Interview Scheduled",
      statusColor: "bg-blue-100 text-blue-800 border-blue-200",
      stage: 3, // 1: Applied, 2: Under Review, 3: Interview, 4: Offer
      nextStep: "Technical System Architecture Interview on Oct 28"
    },
    {
      id: "app-2",
      title: "Senior Full Stack Engineer",
      company: "Linear",
      appliedDate: "Oct 14, 2026",
      status: "Under Review",
      statusColor: "bg-amber-100 text-amber-800 border-amber-200",
      stage: 2,
      nextStep: "Hiring Manager reviewing code sample"
    },
    {
      id: "app-3",
      title: "Lead Web Application Developer",
      company: "Supabase",
      appliedDate: "Oct 08, 2026",
      status: "Shortlisted",
      statusColor: "bg-purple-100 text-purple-800 border-purple-200",
      stage: 3,
      nextStep: "Culture & Team Alignment Call scheduled"
    },
    {
      id: "app-4",
      title: "Backend API Specialist (Python)",
      company: "Datadog",
      appliedDate: "Sep 28, 2026",
      status: "Offer Received",
      statusColor: "bg-emerald-100 text-emerald-800 border-emerald-200",
      stage: 4,
      nextStep: "Offer package under review until Friday"
    }
  ]);

  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#F8FAFC]">
      <Navbar />

      <main className="flex-1 max-w-[1280px] w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Toast Alert */}
        {toastMessage && (
          <div className="fixed bottom-6 right-6 z-50 bg-[#0F172A] text-white px-5 py-3 rounded-2xl shadow-2xl flex items-center gap-2.5 text-sm animate-bounce">
            <CheckCircle2 className="w-5 h-5 text-emerald-400" />
            <span>{toastMessage}</span>
          </div>
        )}

        {/* Prototype Warning Banner */}
        <div className="mb-6 p-4 rounded-2xl bg-blue-50/90 border border-blue-200 text-blue-900 shadow-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-xl bg-blue-600 text-white flex items-center justify-center shrink-0">
              <User className="w-4 h-4" />
            </div>
            <div>
              <span className="font-bold text-xs uppercase tracking-wider text-blue-700 block">
                Job Seeker Static Dashboard (Demo View)
              </span>
              <p className="text-xs text-blue-800/90">
                You are viewing the simulated candidate portal for <strong>{profile.name}</strong>.
                No persistent storage or real backend is connected.
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2 self-end sm:self-auto shrink-0">
            <Link
              href="/employer/dashboard"
              className="px-3 py-1.5 rounded-xl bg-white border border-blue-200 text-blue-700 font-semibold text-xs hover:bg-blue-100/70 transition-colors inline-flex items-center gap-1"
            >
              Switch to HR View
            </Link>
            <Link
              href="/auth"
              className="px-3 py-1.5 rounded-xl bg-blue-600 text-white font-semibold text-xs hover:bg-blue-700 transition-colors inline-flex items-center gap-1"
            >
              <LogOut className="w-3 h-3" />
              Sign Out (Demo)
            </Link>
          </div>
        </div>

        {/* Candidate Profile Header Card */}
        <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-sm mb-8">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
            <div className="flex items-center gap-4 sm:gap-5">
              <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-gradient-to-tr from-blue-600 to-indigo-600 flex items-center justify-center text-white font-black text-2xl sm:text-3xl shadow-lg shadow-blue-500/25">
                AM
              </div>
              <div>
                <div className="flex items-center gap-2.5 flex-wrap">
                  <h1 className="text-xl sm:text-2xl font-black text-[#0F172A] tracking-tight">
                    {profile.name}
                  </h1>
                  <span className="px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-700 text-xs font-bold border border-emerald-200">
                    Active Job Seeker
                  </span>
                </div>
                <p className="text-sm text-slate-600 font-medium mt-0.5">
                  {profile.title}
                </p>
                <div className="flex items-center gap-4 text-xs text-slate-500 mt-2 flex-wrap">
                  <span className="flex items-center gap-1">
                    <MapPin className="w-3.5 h-3.5 text-slate-400" />
                    {profile.location}
                  </span>
                  <span className="flex items-center gap-1">
                    <Mail className="w-3.5 h-3.5 text-slate-400" />
                    {profile.email}
                  </span>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-3 w-full md:w-auto">
              <Link
                href="/jobs"
                className="flex-1 md:flex-none px-4 py-2.5 rounded-xl bg-[#2563EB] hover:bg-blue-700 text-white font-semibold text-xs sm:text-sm shadow-sm transition-all text-center inline-flex items-center justify-center gap-1.5"
              >
                Browse All Jobs
              </Link>
            </div>
          </div>

          {/* Quick Metrics */}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 sm:gap-4 mt-6 pt-6 border-t border-slate-100">
            <div className="p-3.5 rounded-2xl bg-slate-50/80 border border-slate-100">
              <span className="text-xs font-semibold text-slate-500 block">Applied Jobs</span>
              <span className="text-xl sm:text-2xl font-black text-[#0F172A] mt-0.5 block">
                {appliedJobs.length}
              </span>
            </div>
            <div className="p-3.5 rounded-2xl bg-slate-50/80 border border-slate-100">
              <span className="text-xs font-semibold text-slate-500 block">Saved Jobs</span>
              <span className="text-xl sm:text-2xl font-black text-[#0F172A] mt-0.5 block">
                {savedJobs.length}
              </span>
            </div>
            <div className="p-3.5 rounded-2xl bg-slate-50/80 border border-slate-100">
              <span className="text-xs font-semibold text-slate-500 block">Interviews</span>
              <span className="text-xl sm:text-2xl font-black text-blue-600 mt-0.5 block">2</span>
            </div>
          </div>
        </div>

        {/* Dashboard Navigation Tabs */}
        <div className="flex overflow-x-auto no-scrollbar gap-2 pb-2 mb-6 border-b border-slate-200">
          <button
            onClick={() => setActiveTab("profile")}
            className={`px-4 py-2.5 rounded-xl text-sm font-semibold transition-all whitespace-nowrap flex items-center gap-2 cursor-pointer ${
              activeTab === "profile"
                ? "bg-[#2563EB] text-white shadow-md shadow-blue-500/20"
                : "bg-white text-slate-600 hover:text-slate-900 border border-slate-200"
            }`}
          >
            <User className="w-4 h-4" />
            Profile
          </button>
          <button
            onClick={() => setActiveTab("saved")}
            className={`px-4 py-2.5 rounded-xl text-sm font-semibold transition-all whitespace-nowrap flex items-center gap-2 cursor-pointer ${
              activeTab === "saved"
                ? "bg-[#2563EB] text-white shadow-md shadow-blue-500/20"
                : "bg-white text-slate-600 hover:text-slate-900 border border-slate-200"
            }`}
          >
            <Bookmark className="w-4 h-4" />
            Saved Jobs ({savedJobs.length})
          </button>
          <button
            onClick={() => setActiveTab("applied")}
            className={`px-4 py-2.5 rounded-xl text-sm font-semibold transition-all whitespace-nowrap flex items-center gap-2 cursor-pointer ${
              activeTab === "applied"
                ? "bg-[#2563EB] text-white shadow-md shadow-blue-500/20"
                : "bg-white text-slate-600 hover:text-slate-900 border border-slate-200"
            }`}
          >
            <Briefcase className="w-4 h-4" />
            Applied Jobs ({appliedJobs.length})
          </button>
          <button
            onClick={() => setActiveTab("status")}
            className={`px-4 py-2.5 rounded-xl text-sm font-semibold transition-all whitespace-nowrap flex items-center gap-2 cursor-pointer ${
              activeTab === "status"
                ? "bg-[#2563EB] text-white shadow-md shadow-blue-500/20"
                : "bg-white text-slate-600 hover:text-slate-900 border border-slate-200"
            }`}
          >
            <Clock className="w-4 h-4" />
            Application Status
          </button>
        </div>

        {/* TAB 1: PROFILE SECTION */}
        {activeTab === "profile" && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 space-y-6">
              {/* About Me */}
              <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-7 shadow-sm">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-base font-bold text-[#0F172A]">About Me</h3>
                  <button
                    onClick={() => showToast("Profile edit feature is in demo mode.")}
                    className="text-xs font-semibold text-[#2563EB] hover:underline cursor-pointer"
                  >
                    Edit (Demo)
                  </button>
                </div>
                <p className="text-sm text-slate-600 leading-relaxed">{profile.bio}</p>
              </div>

              {/* Skills */}
              <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-7 shadow-sm">
                <h3 className="text-base font-bold text-[#0F172A] mb-3">Core Skills</h3>
                <div className="flex flex-wrap gap-2">
                  {profile.skills.map((skill) => (
                    <span
                      key={skill}
                      className="px-3 py-1.5 rounded-xl bg-slate-100 text-[#0F172A] text-xs font-semibold border border-slate-200/80"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </div>

              {/* Experience Highlights */}
              <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-7 shadow-sm">
                <h3 className="text-base font-bold text-[#0F172A] mb-4">Work Experience Overview</h3>
                <div className="space-y-4">
                  <div className="border-l-2 border-[#2563EB] pl-4 py-1">
                    <div className="font-bold text-sm text-[#0F172A]">
                      Senior Software Engineer — CloudScale Labs
                    </div>
                    <div className="text-xs text-slate-500">2021 — Present • San Francisco, CA</div>
                    <p className="text-xs text-slate-600 mt-1.5">
                      Architected high-throughput microservices using Next.js and TypeScript, increasing system throughput by 45%.
                    </p>
                  </div>
                  <div className="border-l-2 border-slate-300 pl-4 py-1">
                    <div className="font-bold text-sm text-[#0F172A]">
                      Full Stack Developer — TechNova Inc
                    </div>
                    <div className="text-xs text-slate-500">2019 — 2021 • San Jose, CA</div>
                    <p className="text-xs text-slate-600 mt-1.5">
                      Developed React user dashboards used by 150K+ active users with 99.9% uptime.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Column: Contact & Education */}
            <div className="space-y-6">
              <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-sm">
                <h3 className="text-base font-bold text-[#0F172A] mb-4">Contact Details</h3>
                <div className="space-y-3 text-xs">
                  <div>
                    <span className="text-slate-400 block font-medium">Email</span>
                    <span className="text-[#0F172A] font-semibold">{profile.email}</span>
                  </div>
                  <div>
                    <span className="text-slate-400 block font-medium">Phone</span>
                    <span className="text-[#0F172A] font-semibold">{profile.phone}</span>
                  </div>
                  <div>
                    <span className="text-slate-400 block font-medium">Location</span>
                    <span className="text-[#0F172A] font-semibold">{profile.location}</span>
                  </div>
                  <div>
                    <span className="text-slate-400 block font-medium">LinkedIn</span>
                    <span className="text-[#2563EB] font-semibold">linkedin.com/in/alexmorgan</span>
                  </div>
                  <div>
                    <span className="text-slate-400 block font-medium">GitHub</span>
                    <span className="text-[#2563EB] font-semibold">github.com/alexmorgan-dev</span>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-sm">
                <h3 className="text-base font-bold text-[#0F172A] mb-3">Education</h3>
                <div className="text-xs text-slate-600">
                  <div className="font-semibold text-[#0F172A]">B.S. Computer Science</div>
                  <div>University of California, Berkeley</div>
                  <div className="text-slate-400 mt-0.5">Graduated 2019 • GPA: 3.8 / 4.0</div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: SAVED JOBS */}
        {activeTab === "saved" && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-bold text-[#0F172A]">
                Bookmarked Jobs ({savedJobs.length})
              </h2>
              <Link
                href="/jobs"
                className="text-xs font-semibold text-[#2563EB] hover:underline"
              >
                Find more jobs →
              </Link>
            </div>

            <div className="grid grid-cols-1 gap-3.5">
              {savedJobs.map((job) => (
                <div
                  key={job.id}
                  className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm hover:border-blue-300 transition-all flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
                >
                  <div>
                    <div className="flex items-center gap-2 flex-wrap">
                      <h3 className="font-bold text-base text-[#0F172A]">{job.title}</h3>
                      <span className="px-2 py-0.5 rounded-md bg-blue-50 text-[#2563EB] text-xs font-semibold">
                        {job.type}
                      </span>
                    </div>
                    <div className="text-xs text-slate-500 mt-1 flex items-center gap-3 flex-wrap">
                      <span className="font-semibold text-slate-700">{job.company}</span>
                      <span>•</span>
                      <span>{job.location}</span>
                      <span>•</span>
                      <span className="text-emerald-700 font-semibold">{job.salary}</span>
                    </div>
                    <div className="flex flex-wrap gap-1.5 mt-2.5">
                      {job.tags.map((t) => (
                        <span
                          key={t}
                          className="px-2 py-0.5 rounded-md bg-slate-100 text-slate-600 text-[11px] font-medium"
                        >
                          {t}
                        </span>
                      ))}
                    </div>
                  </div>
                  <div className="flex items-center gap-2 w-full sm:w-auto shrink-0">
                    <button
                      onClick={() => {
                        setSavedJobs(savedJobs.filter((j) => j.id !== job.id));
                        showToast(`Removed "${job.title}" from saved list.`);
                      }}
                      className="px-3 py-2 rounded-xl text-xs font-semibold text-red-600 hover:bg-red-50 transition-colors cursor-pointer"
                    >
                      Remove
                    </button>
                    <button
                      onClick={() => showToast(`Simulated application submitted for ${job.title}!`)}
                      className="px-4 py-2 rounded-xl bg-[#2563EB] hover:bg-blue-700 text-white text-xs font-semibold transition-colors cursor-pointer"
                    >
                      Apply Now (Demo)
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 4: APPLIED JOBS */}
        {activeTab === "applied" && (
          <div className="space-y-4">
            <h2 className="text-lg font-bold text-[#0F172A]">
              Submitted Applications ({appliedJobs.length})
            </h2>

            <div className="bg-white rounded-3xl border border-slate-200 overflow-hidden shadow-sm">
              <div className="divide-y divide-slate-100">
                {appliedJobs.map((app) => (
                  <div key={app.id} className="p-5 sm:p-6 hover:bg-slate-50/50 transition-colors">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                      <div>
                        <div className="flex items-center gap-2.5 flex-wrap">
                          <h3 className="font-bold text-base text-[#0F172A]">{app.title}</h3>
                          <span
                            className={`px-2.5 py-0.5 rounded-full text-xs font-bold border ${app.statusColor}`}
                          >
                            {app.status}
                          </span>
                        </div>
                        <div className="text-xs text-slate-500 mt-1">
                          <span className="font-semibold text-slate-700">{app.company}</span> • Applied on {app.appliedDate}
                        </div>
                      </div>
                      <div className="text-xs text-slate-600 font-medium bg-slate-50 px-3 py-2 rounded-xl border border-slate-200/80">
                        <span className="text-slate-400 block text-[10px] uppercase font-bold">Next Milestone</span>
                        {app.nextStep}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* TAB 5: APPLICATION STATUS TRACKER */}
        {activeTab === "status" && (
          <div className="space-y-6">
            <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-sm">
              <h2 className="text-lg font-bold text-[#0F172A] mb-2">
                Hiring Pipeline Status Tracker
              </h2>
              <p className="text-xs text-slate-500 mb-6">
                Interactive candidate status view for ongoing applications.
              </p>

              {/* Status Columns */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                {/* Column 1: Applied */}
                <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200">
                  <div className="flex items-center justify-between mb-3">
                    <span className="font-bold text-xs uppercase tracking-wider text-slate-700">
                      1. Applied
                    </span>
                    <span className="w-5 h-5 rounded-full bg-slate-200 text-slate-700 text-xs flex items-center justify-center font-bold">
                      4
                    </span>
                  </div>
                  <div className="space-y-2">
                    <div className="p-3 bg-white rounded-xl border border-slate-200 shadow-xs text-xs">
                      <div className="font-bold text-slate-900">Datadog</div>
                      <div className="text-slate-500">Backend API Specialist</div>
                    </div>
                  </div>
                </div>

                {/* Column 2: In Review */}
                <div className="p-4 rounded-2xl bg-amber-50/60 border border-amber-200">
                  <div className="flex items-center justify-between mb-3">
                    <span className="font-bold text-xs uppercase tracking-wider text-amber-800">
                      2. Under Review
                    </span>
                    <span className="w-5 h-5 rounded-full bg-amber-200 text-amber-800 text-xs flex items-center justify-center font-bold">
                      1
                    </span>
                  </div>
                  <div className="space-y-2">
                    <div className="p-3 bg-white rounded-xl border border-amber-200 shadow-xs text-xs">
                      <div className="font-bold text-slate-900">Linear</div>
                      <div className="text-slate-500">Senior Full Stack Engineer</div>
                      <span className="inline-block mt-2 text-[10px] font-semibold text-amber-700">
                        Reviewing Portfolio
                      </span>
                    </div>
                  </div>
                </div>

                {/* Column 3: Interviewing */}
                <div className="p-4 rounded-2xl bg-blue-50/60 border border-blue-200">
                  <div className="flex items-center justify-between mb-3">
                    <span className="font-bold text-xs uppercase tracking-wider text-blue-800">
                      3. Interviewing
                    </span>
                    <span className="w-5 h-5 rounded-full bg-blue-200 text-blue-800 text-xs flex items-center justify-center font-bold">
                      2
                    </span>
                  </div>
                  <div className="space-y-2">
                    <div className="p-3 bg-white rounded-xl border border-blue-200 shadow-xs text-xs">
                      <div className="font-bold text-slate-900">Shopify</div>
                      <div className="text-slate-500">Staff Frontend Platform</div>
                      <div className="mt-2 text-[11px] font-semibold text-blue-600 flex items-center gap-1">
                        <Calendar className="w-3 h-3" />
                        Oct 28 • Tech Arch
                      </div>
                    </div>
                    <div className="p-3 bg-white rounded-xl border border-blue-200 shadow-xs text-xs">
                      <div className="font-bold text-slate-900">Supabase</div>
                      <div className="text-slate-500">Lead Web App Dev</div>
                      <div className="mt-2 text-[11px] font-semibold text-purple-600 flex items-center gap-1">
                        <Calendar className="w-3 h-3" />
                        Culture Alignment
                      </div>
                    </div>
                  </div>
                </div>

                {/* Column 4: Offer */}
                <div className="p-4 rounded-2xl bg-emerald-50/60 border border-emerald-200">
                  <div className="flex items-center justify-between mb-3">
                    <span className="font-bold text-xs uppercase tracking-wider text-emerald-800">
                      4. Offer Received
                    </span>
                    <span className="w-5 h-5 rounded-full bg-emerald-200 text-emerald-800 text-xs flex items-center justify-center font-bold">
                      1
                    </span>
                  </div>
                  <div className="p-3 bg-white rounded-xl border border-emerald-200 shadow-xs text-xs">
                    <div className="font-bold text-slate-900">Datadog</div>
                    <div className="text-emerald-700 font-bold mt-1">$175K + Equity</div>
                    <span className="inline-block mt-2 text-[10px] font-semibold text-slate-500">
                      Decision deadline: Nov 5
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}


