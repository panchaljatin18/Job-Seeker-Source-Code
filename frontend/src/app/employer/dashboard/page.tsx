"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  Building2,
  Briefcase,
  Users,
  PlusCircle,
  CheckCircle2,
  Clock,
  MapPin,
  Globe,
  Award,
  Search,
  Filter,
  Eye,
  FileText,
  ShieldAlert,
  LogOut,
  ChevronDown,
  X,
  Plus
} from "lucide-react";
import Navbar from "@/Components/layout/Navbar";
import Footer from "@/Components/layout/Footer";

type EmployerTab = "company" | "post-job" | "manage-jobs" | "applicants";

export default function EmployerDashboard() {
  const [activeTab, setActiveTab] = useState<EmployerTab>("manage-jobs");

  // Company Profile Mock State
  const [company, setCompany] = useState({
    name: "TechCorp Global",
    tagline: "Building next-generation cloud infrastructure & developer tooling",
    industry: "Cloud Software & Enterprise SaaS",
    location: "Austin, TX (with Remote Hubs)",
    website: "https://techcorp.example.com",
    employeeCount: "250 - 500 Employees",
    foundedYear: "2018",
    description:
      "TechCorp Global is a premier provider of distributed cloud orchestration software. We empower engineering organizations around the globe to deploy, monitor, and scale real-time applications with zero downtime.",
    benefits: [
      "Competitive 401(k) matching",
      "Unlimited flexible PTO",
      "Comprehensive health, dental & vision",
      "Annual $3,000 learning & conference budget",
      "Home office setup stipend"
    ]
  });

  // Mock Active Job Postings
  const [jobs, setJobs] = useState([
    {
      id: "tc-101",
      title: "Senior Full Stack Cloud Engineer",
      department: "Engineering",
      location: "San Francisco, CA / Remote",
      type: "Full-time",
      salary: "$150,000 - $180,000",
      postedDate: "Oct 18, 2026",
      status: "Active",
      applicantsCount: 38
    },
    {
      id: "tc-102",
      title: "Lead Product Designer (Design Systems)",
      department: "Product Design",
      location: "Austin, TX / Hybrid",
      type: "Full-time",
      salary: "$140,000 - $170,000",
      postedDate: "Oct 12, 2026",
      status: "Active",
      applicantsCount: 24
    },
    {
      id: "tc-103",
      title: "DevOps & Kubernetes Architect",
      department: "Infrastructure",
      location: "Remote (US/Canada)",
      type: "Full-time",
      salary: "$165,000 - $195,000",
      postedDate: "Sep 30, 2026",
      status: "Active",
      applicantsCount: 56
    },
    {
      id: "tc-104",
      title: "Junior Frontend Developer (React)",
      department: "Engineering",
      location: "Austin, TX",
      type: "Full-time",
      salary: "$85,000 - $105,000",
      postedDate: "Draft",
      status: "Draft",
      applicantsCount: 0
    }
  ]);

  // Mock Applicants List
  const [applicants, setApplicants] = useState([
    {
      id: "app-201",
      name: "Alex Morgan",
      role: "Senior Full Stack Cloud Engineer",
      email: "alex.morgan@demo.com",
      appliedDate: "Oct 21, 2026",
      experience: "5+ Years",
      atsScore: 94,
      status: "Interview Scheduled",
      skills: ["React", "TypeScript", "Next.js", "Python", "Docker", "AWS"],
      summary: "5+ years developing high-throughput web applications with 35% latency reductions."
    },
    {
      id: "app-202",
      name: "Jordan Lee",
      role: "Senior Full Stack Cloud Engineer",
      email: "jordan.lee@example.com",
      appliedDate: "Oct 20, 2026",
      experience: "6 Years",
      atsScore: 89,
      status: "Under Review",
      skills: ["Python", "FastAPI", "Go", "Kubernetes", "PostgreSQL"],
      summary: "Cloud architect with deep expertise in distributed event-driven systems."
    },
    {
      id: "app-203",
      name: "Priya Sharma",
      role: "Lead Product Designer (Design Systems)",
      email: "priya.s@example.com",
      appliedDate: "Oct 19, 2026",
      experience: "7 Years",
      atsScore: 92,
      status: "Shortlisted",
      skills: ["Figma", "Design Systems", "Prototyping", "User Research", "CSS"],
      summary: "Spearheaded design system adoption across 14 product squads at FinTech scale."
    },
    {
      id: "app-204",
      name: "David Chen",
      role: "DevOps & Kubernetes Architect",
      email: "david.c@example.com",
      appliedDate: "Oct 15, 2026",
      experience: "8+ Years",
      atsScore: 85,
      status: "Reviewed",
      skills: ["Terraform", "Kubernetes", "AWS", "CI/CD", "Prometheus"],
      summary: "Maintained 99.99% SLA across multi-cluster hybrid clouds."
    }
  ]);

  // Post a Job Form State
  const [jobForm, setJobForm] = useState({
    title: "",
    department: "Engineering",
    location: "Remote (US)",
    type: "Full-time",
    experienceLevel: "Senior",
    salary: "",
    skills: "",
    description: ""
  });
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});
  const [selectedApplicant, setSelectedApplicant] = useState<any>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  // Static Post Job Submission (Demo Only)
  const handlePostJobSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const errors: Record<string, string> = {};

    if (!jobForm.title.trim()) errors.title = "Job title is required.";
    if (!jobForm.salary.trim()) errors.salary = "Salary range is required.";
    if (!jobForm.description.trim()) errors.description = "Job description is required.";

    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      return;
    }

    // Add to static job list
    const newJob = {
      id: `tc-${Date.now()}`,
      title: jobForm.title,
      department: jobForm.department,
      location: jobForm.location,
      type: jobForm.type,
      salary: jobForm.salary,
      postedDate: "Just now",
      status: "Active",
      applicantsCount: 0
    };

    setJobs([newJob, ...jobs]);
    setJobForm({
      title: "",
      department: "Engineering",
      location: "Remote (US)",
      type: "Full-time",
      experienceLevel: "Senior",
      salary: "",
      skills: "",
      description: ""
    });
    setFormErrors({});
    showToast("Job posted successfully in demo mode! Added to active listings.");
    setActiveTab("manage-jobs");
  };

  const updateApplicantStatus = (id: string, newStatus: string) => {
    setApplicants(
      applicants.map((a) => (a.id === id ? { ...a, status: newStatus } : a))
    );
    showToast(`Applicant status updated to "${newStatus}".`);
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
        <div className="mb-6 p-4 rounded-2xl bg-purple-50/90 border border-purple-200 text-purple-900 shadow-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-xl bg-purple-600 text-white flex items-center justify-center shrink-0">
              <Building2 className="w-4 h-4" />
            </div>
            <div>
              <span className="font-bold text-xs uppercase tracking-wider text-purple-700 block">
                Employer & Recruiter Portal (Demo View)
              </span>
              <p className="text-xs text-purple-800/90">
                You are testing the static HR dashboard for <strong>{company.name}</strong>.
                No backend or database is connected; all actions simulate recruiter flows.
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2 self-end sm:self-auto shrink-0">
            <Link
              href="/dashboard"
              className="px-3 py-1.5 rounded-xl bg-white border border-purple-200 text-purple-700 font-semibold text-xs hover:bg-purple-100/70 transition-colors inline-flex items-center gap-1"
            >
              Switch to Candidate View
            </Link>
            <Link
              href="/auth"
              className="px-3 py-1.5 rounded-xl bg-purple-600 text-white font-semibold text-xs hover:bg-purple-700 transition-colors inline-flex items-center gap-1"
            >
              <LogOut className="w-3 h-3" />
              Sign Out (Demo)
            </Link>
          </div>
        </div>

        {/* Company Header Card */}
        <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-sm mb-8">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
            <div className="flex items-center gap-4 sm:gap-5">
              <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-gradient-to-tr from-purple-600 to-indigo-600 flex items-center justify-center text-white font-black text-2xl sm:text-3xl shadow-lg shadow-purple-500/25">
                TC
              </div>
              <div>
                <div className="flex items-center gap-2.5 flex-wrap">
                  <h1 className="text-xl sm:text-2xl font-black text-[#0F172A] tracking-tight">
                    {company.name}
                  </h1>
                  <span className="px-2.5 py-0.5 rounded-full bg-purple-50 text-purple-700 text-xs font-bold border border-purple-200">
                    Verified Employer
                  </span>
                </div>
                <p className="text-sm text-slate-600 font-medium mt-0.5">
                  Logged in as: Sarah Jenkins (Lead Talent Acquisition Partner)
                </p>
                <div className="flex items-center gap-4 text-xs text-slate-500 mt-2 flex-wrap">
                  <span className="flex items-center gap-1">
                    <MapPin className="w-3.5 h-3.5 text-slate-400" />
                    {company.location}
                  </span>
                  <span className="flex items-center gap-1">
                    <Users className="w-3.5 h-3.5 text-slate-400" />
                    {company.employeeCount}
                  </span>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-3 w-full md:w-auto">
              <button
                onClick={() => setActiveTab("post-job")}
                className="flex-1 md:flex-none px-4.5 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-bold text-xs sm:text-sm shadow-sm transition-all text-center inline-flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <PlusCircle className="w-4 h-4" />
                Post New Job
              </button>
            </div>
          </div>

          {/* Quick Stats Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4 mt-6 pt-6 border-t border-slate-100">
            <div className="p-3.5 rounded-2xl bg-slate-50/80 border border-slate-100">
              <span className="text-xs font-semibold text-slate-500 block">Active Jobs</span>
              <span className="text-xl sm:text-2xl font-black text-[#0F172A] mt-0.5 block">
                {jobs.filter((j) => j.status === "Active").length}
              </span>
            </div>
            <div className="p-3.5 rounded-2xl bg-slate-50/80 border border-slate-100">
              <span className="text-xs font-semibold text-slate-500 block">Total Applicants</span>
              <span className="text-xl sm:text-2xl font-black text-purple-600 mt-0.5 block">
                {applicants.length}
              </span>
            </div>
            <div className="p-3.5 rounded-2xl bg-slate-50/80 border border-slate-100">
              <span className="text-xs font-semibold text-slate-500 block">Interviews Scheduled</span>
              <span className="text-xl sm:text-2xl font-black text-blue-600 mt-0.5 block">1</span>
            </div>
            <div className="p-3.5 rounded-2xl bg-slate-50/80 border border-slate-100">
              <span className="text-xs font-semibold text-slate-500 block">Average ATS Match</span>
              <span className="text-xl sm:text-2xl font-black text-emerald-600 mt-0.5 block">90%</span>
            </div>
          </div>
        </div>

        {/* Employer Dashboard Tabs */}
        <div className="flex overflow-x-auto no-scrollbar gap-2 pb-2 mb-6 border-b border-slate-200">
          <button
            onClick={() => setActiveTab("manage-jobs")}
            className={`px-4 py-2.5 rounded-xl text-sm font-semibold transition-all whitespace-nowrap flex items-center gap-2 cursor-pointer ${
              activeTab === "manage-jobs"
                ? "bg-purple-600 text-white shadow-md shadow-purple-500/20"
                : "bg-white text-slate-600 hover:text-slate-900 border border-slate-200"
            }`}
          >
            <Briefcase className="w-4 h-4" />
            Manage Jobs ({jobs.length})
          </button>
          <button
            onClick={() => setActiveTab("applicants")}
            className={`px-4 py-2.5 rounded-xl text-sm font-semibold transition-all whitespace-nowrap flex items-center gap-2 cursor-pointer ${
              activeTab === "applicants"
                ? "bg-purple-600 text-white shadow-md shadow-purple-500/20"
                : "bg-white text-slate-600 hover:text-slate-900 border border-slate-200"
            }`}
          >
            <Users className="w-4 h-4" />
            Applicants ({applicants.length})
          </button>
          <button
            onClick={() => setActiveTab("post-job")}
            className={`px-4 py-2.5 rounded-xl text-sm font-semibold transition-all whitespace-nowrap flex items-center gap-2 cursor-pointer ${
              activeTab === "post-job"
                ? "bg-purple-600 text-white shadow-md shadow-purple-500/20"
                : "bg-white text-slate-600 hover:text-slate-900 border border-slate-200"
            }`}
          >
            <PlusCircle className="w-4 h-4" />
            Post a Job
          </button>
          <button
            onClick={() => setActiveTab("company")}
            className={`px-4 py-2.5 rounded-xl text-sm font-semibold transition-all whitespace-nowrap flex items-center gap-2 cursor-pointer ${
              activeTab === "company"
                ? "bg-purple-600 text-white shadow-md shadow-purple-500/20"
                : "bg-white text-slate-600 hover:text-slate-900 border border-slate-200"
            }`}
          >
            <Building2 className="w-4 h-4" />
            Company Profile
          </button>
        </div>

        {/* TAB 1: MANAGE JOBS */}
        {activeTab === "manage-jobs" && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-bold text-[#0F172A]">All Job Postings</h2>
              <button
                onClick={() => setActiveTab("post-job")}
                className="text-xs font-semibold text-purple-600 hover:underline inline-flex items-center gap-1 cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5" />
                Create New Posting
              </button>
            </div>

            <div className="bg-white rounded-3xl border border-slate-200 overflow-hidden shadow-sm">
              <div className="divide-y divide-slate-100">
                {jobs.map((job) => (
                  <div key={job.id} className="p-5 sm:p-6 hover:bg-slate-50/50 transition-colors">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                      <div>
                        <div className="flex items-center gap-2.5 flex-wrap">
                          <h3 className="font-bold text-base text-[#0F172A]">{job.title}</h3>
                          <span
                            className={`px-2.5 py-0.5 rounded-full text-xs font-bold ${
                              job.status === "Active"
                                ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                                : "bg-slate-100 text-slate-600 border border-slate-200"
                            }`}
                          >
                            {job.status}
                          </span>
                        </div>
                        <div className="text-xs text-slate-500 mt-1 flex items-center gap-3 flex-wrap">
                          <span className="font-semibold text-slate-700">{job.department}</span>
                          <span>•</span>
                          <span>{job.location}</span>
                          <span>•</span>
                          <span className="text-slate-700 font-medium">{job.salary}</span>
                        </div>
                      </div>

                      <div className="flex items-center gap-3 self-end sm:self-auto">
                        <div className="text-right mr-2 hidden sm:block">
                          <span className="text-sm font-black text-purple-600 block">
                            {job.applicantsCount}
                          </span>
                          <span className="text-[11px] text-slate-400">Applicants</span>
                        </div>
                        <button
                          onClick={() => setActiveTab("applicants")}
                          className="px-3.5 py-2 rounded-xl bg-purple-50 text-purple-700 hover:bg-purple-100 text-xs font-semibold transition-colors cursor-pointer"
                        >
                          View Applicants
                        </button>
                        <button
                          onClick={() => {
                            const newStatus = job.status === "Active" ? "Paused" : "Active";
                            setJobs(
                              jobs.map((j) => (j.id === job.id ? { ...j, status: newStatus } : j))
                            );
                            showToast(`Job status changed to ${newStatus}.`);
                          }}
                          className="px-3 py-2 rounded-xl border border-slate-200 text-xs font-semibold text-slate-600 hover:bg-slate-50 transition-colors cursor-pointer"
                        >
                          {job.status === "Active" ? "Pause" : "Activate"}
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: APPLICANTS PIPELINE */}
        {activeTab === "applicants" && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-bold text-[#0F172A]">
                Candidate Applicants ({applicants.length})
              </h2>
              <span className="text-xs text-slate-500">
                Sorted by AI ATS Match Score
              </span>
            </div>

            <div className="bg-white rounded-3xl border border-slate-200 overflow-hidden shadow-sm">
              <div className="divide-y divide-slate-100">
                {applicants.map((cand) => (
                  <div key={cand.id} className="p-5 sm:p-6 hover:bg-slate-50/50 transition-colors">
                    <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                      <div className="space-y-1">
                        <div className="flex items-center gap-3 flex-wrap">
                          <h3 className="font-bold text-base text-[#0F172A]">{cand.name}</h3>
                          <span className="px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-700 text-xs font-bold border border-emerald-200">
                            {cand.atsScore}% ATS Match
                          </span>
                          <span className="text-xs text-slate-400">• {cand.experience}</span>
                        </div>
                        <div className="text-xs text-slate-500">
                          Applied for <span className="font-semibold text-slate-700">{cand.role}</span> on {cand.appliedDate}
                        </div>
                        <div className="flex flex-wrap gap-1.5 pt-1">
                          {cand.skills.map((s) => (
                            <span
                              key={s}
                              className="px-2 py-0.5 rounded-md bg-slate-100 text-slate-600 text-[11px] font-medium"
                            >
                              {s}
                            </span>
                          ))}
                        </div>
                      </div>

                      <div className="flex items-center gap-3 shrink-0">
                        {/* Status Dropdown */}
                        <div className="relative">
                          <select
                            value={cand.status}
                            onChange={(e) => updateApplicantStatus(cand.id, e.target.value)}
                            className="text-xs font-semibold px-3 py-2 rounded-xl border border-slate-200 bg-white text-slate-800 focus:outline-none focus:ring-2 focus:ring-purple-500/20 cursor-pointer"
                          >
                            <option value="Under Review">Under Review</option>
                            <option value="Interview Scheduled">Interview Scheduled</option>
                            <option value="Shortlisted">Shortlisted</option>
                            <option value="Reviewed">Reviewed</option>
                            <option value="Offer Extended">Offer Extended</option>
                            <option value="Rejected">Rejected</option>
                          </select>
                        </div>

                        {/* Resume Preview Modal Trigger */}
                        <button
                          onClick={() => setSelectedApplicant(cand)}
                          className="px-3.5 py-2 rounded-xl bg-slate-900 text-white text-xs font-semibold hover:bg-slate-800 transition-colors inline-flex items-center gap-1.5 cursor-pointer"
                        >
                          <Eye className="w-3.5 h-3.5" />
                          View Resume
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* TAB 3: POST A JOB FORM */}
        {activeTab === "post-job" && (
          <div className="max-w-[760px] mx-auto bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-sm">
            <div className="mb-6 pb-4 border-b border-slate-100">
              <h2 className="text-xl font-bold text-[#0F172A]">Post a Job Opening (Demo)</h2>
              <p className="text-xs text-slate-500 mt-1">
                Fill in the job details below. In demo mode, this will add the job directly to your active listings.
              </p>
            </div>

            <form onSubmit={handlePostJobSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Job Title *
                </label>
                <input
                  type="text"
                  value={jobForm.title}
                  onChange={(e) => setJobForm({ ...jobForm, title: e.target.value })}
                  placeholder="e.g. Senior Backend Engineer"
                  className={`w-full px-4 py-2.5 rounded-xl border text-sm text-[#0F172A] focus:outline-none focus:ring-2 transition-all ${
                    formErrors.title
                      ? "border-red-400 focus:ring-red-400/20"
                      : "border-slate-200 focus:border-purple-600 focus:ring-purple-500/20"
                  }`}
                />
                {formErrors.title && (
                  <p className="text-xs text-red-600 mt-1">{formErrors.title}</p>
                )}
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Department
                  </label>
                  <select
                    value={jobForm.department}
                    onChange={(e) => setJobForm({ ...jobForm, department: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm text-[#0F172A] bg-white focus:outline-none focus:ring-2 focus:ring-purple-500/20"
                  >
                    <option value="Engineering">Engineering</option>
                    <option value="Product Design">Product Design</option>
                    <option value="Infrastructure">Infrastructure</option>
                    <option value="Product Management">Product Management</option>
                    <option value="Marketing">Marketing</option>
                    <option value="Sales">Sales</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Workplace Type / Location
                  </label>
                  <input
                    type="text"
                    value={jobForm.location}
                    onChange={(e) => setJobForm({ ...jobForm, location: e.target.value })}
                    placeholder="e.g. Remote (US) or San Francisco, CA"
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm text-[#0F172A] focus:outline-none focus:ring-2 focus:ring-purple-500/20"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Employment Type
                  </label>
                  <select
                    value={jobForm.type}
                    onChange={(e) => setJobForm({ ...jobForm, type: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm text-[#0F172A] bg-white focus:outline-none focus:ring-2 focus:ring-purple-500/20"
                  >
                    <option value="Full-time">Full-time</option>
                    <option value="Contract">Contract</option>
                    <option value="Part-time">Part-time</option>
                    <option value="Internship">Internship</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Salary Range *
                  </label>
                  <input
                    type="text"
                    value={jobForm.salary}
                    onChange={(e) => setJobForm({ ...jobForm, salary: e.target.value })}
                    placeholder="e.g. $140,000 - $170,000 USD"
                    className={`w-full px-4 py-2.5 rounded-xl border text-sm text-[#0F172A] focus:outline-none focus:ring-2 transition-all ${
                      formErrors.salary
                        ? "border-red-400 focus:ring-red-400/20"
                        : "border-slate-200 focus:border-purple-600 focus:ring-purple-500/20"
                    }`}
                  />
                  {formErrors.salary && (
                    <p className="text-xs text-red-600 mt-1">{formErrors.salary}</p>
                  )}
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Required Skills (comma separated)
                </label>
                <input
                  type="text"
                  value={jobForm.skills}
                  onChange={(e) => setJobForm({ ...jobForm, skills: e.target.value })}
                  placeholder="e.g. Python, FastAPI, Docker, Kubernetes, AWS"
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm text-[#0F172A] focus:outline-none focus:ring-2 focus:ring-purple-500/20"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Job Description & Responsibilities *
                </label>
                <textarea
                  rows={5}
                  value={jobForm.description}
                  onChange={(e) => setJobForm({ ...jobForm, description: e.target.value })}
                  placeholder="Describe the role, key responsibilities, qualifications, and impact..."
                  className={`w-full px-4 py-2.5 rounded-xl border text-sm text-[#0F172A] focus:outline-none focus:ring-2 transition-all ${
                    formErrors.description
                      ? "border-red-400 focus:ring-red-400/20"
                      : "border-slate-200 focus:border-purple-600 focus:ring-purple-500/20"
                  }`}
                />
                {formErrors.description && (
                  <p className="text-xs text-red-600 mt-1">{formErrors.description}</p>
                )}
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  className="w-full py-3.5 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-bold text-sm shadow-md shadow-purple-600/20 transition-all flex items-center justify-center gap-2 cursor-pointer"
                >
                  <PlusCircle className="w-4 h-4" />
                  Publish Job Posting (Demo)
                </button>
              </div>
            </form>
          </div>
        )}

        {/* TAB 4: COMPANY PROFILE */}
        {activeTab === "company" && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 space-y-6">
              <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-7 shadow-sm">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-base font-bold text-[#0F172A]">Company Overview</h3>
                  <button
                    onClick={() => showToast("Company edit feature is in demo mode.")}
                    className="text-xs font-semibold text-purple-600 hover:underline cursor-pointer"
                  >
                    Edit (Demo)
                  </button>
                </div>
                <p className="text-sm text-slate-600 leading-relaxed">{company.description}</p>
              </div>

              <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-7 shadow-sm">
                <h3 className="text-base font-bold text-[#0F172A] mb-3">Benefits & Perks</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  {company.benefits.map((b) => (
                    <div
                      key={b}
                      className="p-3 rounded-xl bg-slate-50 border border-slate-200/80 text-xs font-medium text-slate-700 flex items-center gap-2"
                    >
                      <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                      <span>{b}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="space-y-6">
              <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-sm">
                <h3 className="text-base font-bold text-[#0F172A] mb-4">Company Details</h3>
                <div className="space-y-3 text-xs">
                  <div>
                    <span className="text-slate-400 block font-medium">Headquarters</span>
                    <span className="text-[#0F172A] font-semibold">{company.location}</span>
                  </div>
                  <div>
                    <span className="text-slate-400 block font-medium">Industry</span>
                    <span className="text-[#0F172A] font-semibold">{company.industry}</span>
                  </div>
                  <div>
                    <span className="text-slate-400 block font-medium">Team Size</span>
                    <span className="text-[#0F172A] font-semibold">{company.employeeCount}</span>
                  </div>
                  <div>
                    <span className="text-slate-400 block font-medium">Founded</span>
                    <span className="text-[#0F172A] font-semibold">{company.foundedYear}</span>
                  </div>
                  <div>
                    <span className="text-slate-400 block font-medium">Website</span>
                    <span className="text-purple-600 font-semibold">{company.website}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Candidate Resume Preview Modal */}
        {selectedApplicant && (
          <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
            <div className="bg-white rounded-3xl max-w-2xl w-full p-6 sm:p-8 shadow-2xl border border-slate-200 max-h-[90vh] overflow-y-auto">
              <div className="flex items-center justify-between pb-4 border-b border-slate-100">
                <div>
                  <h3 className="text-lg font-bold text-[#0F172A]">{selectedApplicant.name}</h3>
                  <p className="text-xs text-slate-500">
                    Applying for {selectedApplicant.role} • {selectedApplicant.experience} Experience
                  </p>
                </div>
                <button
                  onClick={() => setSelectedApplicant(null)}
                  className="p-2 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="mt-5 space-y-4 text-xs text-slate-700 leading-relaxed">
                <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 flex items-center justify-between">
                  <div>
                    <span className="font-bold text-emerald-900 block text-sm">
                      ATS Match Score: {selectedApplicant.atsScore}%
                    </span>
                    <span className="text-emerald-700 text-xs">
                      Strong candidate alignment with job description requirements.
                    </span>
                  </div>
                </div>

                <div>
                  <span className="font-bold text-slate-900 block mb-1">Candidate Summary</span>
                  <p>{selectedApplicant.summary}</p>
                </div>

                <div>
                  <span className="font-bold text-slate-900 block mb-1">Identified Skills</span>
                  <div className="flex flex-wrap gap-1.5">
                    {selectedApplicant.skills.map((s: string) => (
                      <span
                        key={s}
                        className="px-2.5 py-1 rounded-lg bg-slate-100 text-slate-700 font-semibold"
                      >
                        {s}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="pt-4 border-t border-slate-100 flex items-center justify-end gap-2">
                  <button
                    onClick={() => {
                      updateApplicantStatus(selectedApplicant.id, "Interview Scheduled");
                      setSelectedApplicant(null);
                    }}
                    className="px-4 py-2.5 rounded-xl bg-purple-600 text-white font-semibold hover:bg-purple-700 transition-colors cursor-pointer"
                  >
                    Schedule Interview (Demo)
                  </button>
                  <button
                    onClick={() => setSelectedApplicant(null)}
                    className="px-4 py-2.5 rounded-xl border border-slate-200 text-slate-600 hover:bg-slate-50 transition-colors cursor-pointer"
                  >
                    Close
                  </button>
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
