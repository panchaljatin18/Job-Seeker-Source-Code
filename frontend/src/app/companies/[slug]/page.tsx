"use client";

import { use } from "react";
import Link from "next/link";
import { notFound } from "next/navigation";
import Navbar from "@/Components/layout/Navbar";
import Footer from "@/Components/layout/Footer";
import JobCard from "@/Components/common/JobCard";
import { companiesData } from "@/data/companies";
import { jobsData } from "@/data/jobs";
import {
  MapPin,
  Users,
  Briefcase,
  BadgeCheck,
  Star,
  Globe,
  Calendar,
  ArrowLeft,
  CheckCircle2,
  Building2,
} from "lucide-react";

export default function CompanyDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const resolvedParams = use(params);
  const company = companiesData.find((c) => c.slug === resolvedParams.slug);

  if (!company) {
    notFound();
  }

  const companyJobs = jobsData.filter(
    (j) => j.company.toLowerCase() === company.name.toLowerCase()
  );

  return (
    <div className="min-h-screen flex flex-col bg-[#F8FAFC] text-[#172033] font-sans antialiased">
      <Navbar />

      {/* Header Banner */}
      <section className="bg-gradient-to-r from-[#0B1F3A] via-[#0F172A] to-[#1E3A8A] text-white pt-10 pb-16 px-4 sm:px-8 lg:px-12 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="max-w-[1280px] mx-auto relative z-10">
          <Link
            href="/companies"
            className="inline-flex items-center gap-2 text-xs font-semibold text-slate-300 hover:text-white mb-6 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" /> Back to Companies
          </Link>

          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
            <div className="flex items-center gap-5">
              <div className="w-20 h-20 rounded-2xl bg-white p-2.5 shadow-xl flex items-center justify-center shrink-0 border border-slate-200">
                <span className={`w-full h-full rounded-xl flex items-center justify-center font-black text-2xl border ${company.logoColor}`}>
                  {company.logoText}
                </span>
              </div>

              <div>
                <div className="flex items-center gap-2.5">
                  <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black text-white tracking-tight">
                    {company.name}
                  </h1>
                  {company.verified && (
                    <BadgeCheck className="w-6 h-6 text-[#2563EB] fill-white" />
                  )}
                </div>

                <p className="text-sm font-semibold text-blue-300 mt-1">
                  {company.industry}
                </p>

                <div className="flex flex-wrap items-center gap-y-1.5 gap-x-4 text-xs text-slate-300 mt-3">
                  <div className="flex items-center gap-1.5">
                    <MapPin className="w-3.5 h-3.5 text-blue-400" />
                    <span>{company.location}</span>
                  </div>

                  <div className="flex items-center gap-1.5">
                    <Users className="w-3.5 h-3.5 text-blue-400" />
                    <span>{company.companySize}</span>
                  </div>

                  <div className="flex items-center gap-1.5">
                    <Calendar className="w-3.5 h-3.5 text-blue-400" />
                    <span>Founded {company.foundedYear}</span>
                  </div>

                  <div className="flex items-center gap-1 text-amber-400 font-bold">
                    <Star className="w-3.5 h-3.5 fill-amber-400" />
                    <span>{company.rating} Rating</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-3 self-stretch md:self-auto">
              <a
                href={company.website}
                target="_blank"
                rel="noreferrer"
                className="px-5 py-3 bg-white/10 hover:bg-white/20 border border-white/20 text-white font-semibold text-xs sm:text-sm rounded-xl transition-colors inline-flex items-center gap-2"
              >
                <Globe className="w-4 h-4" /> Visit Website
              </a>

              <a
                href="#open-jobs"
                className="px-5 py-3 bg-[#2563EB] hover:bg-blue-700 text-white font-semibold text-xs sm:text-sm rounded-xl shadow-lg shadow-blue-600/30 transition-all inline-flex items-center gap-2"
              >
                <Briefcase className="w-4 h-4" /> View {company.openJobs} Jobs
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Main Content Area */}
      <main className="flex-1 max-w-[1280px] w-full mx-auto px-4 sm:px-8 lg:px-12 py-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          <div className="lg:col-span-8 space-y-8">
            <div className="bg-white rounded-2xl p-6 sm:p-8 border border-[#E2E8F0] shadow-xs">
              <h2 className="text-xl font-bold text-[#0F172A] mb-4 flex items-center gap-2">
                <Building2 className="w-5 h-5 text-[#2563EB]" /> About {company.name}
              </h2>
              <p className="text-sm text-[#475569] leading-relaxed mb-4">
                {company.overview || company.description}
              </p>

              <div className="pt-4 border-t border-slate-100">
                <h3 className="text-xs font-bold text-[#0F172A] uppercase tracking-wider mb-3">
                  Core Technologies & Skills
                </h3>
                <div className="flex flex-wrap gap-2">
                  {company.skills.map((skill) => (
                    <span
                      key={skill}
                      className="px-3 py-1 bg-[#EFF6FF] text-[#2563EB] font-semibold text-xs rounded-lg border border-blue-100"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {company.culture && company.culture.length > 0 && (
              <div className="bg-white rounded-2xl p-6 sm:p-8 border border-[#E2E8F0] shadow-xs">
                <h2 className="text-xl font-bold text-[#0F172A] mb-4">
                  Culture &amp; Values
                </h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                  {company.culture.map((val) => (
                    <div
                      key={val}
                      className="flex items-center gap-2.5 p-3 rounded-xl bg-slate-50 border border-slate-100 text-sm font-semibold text-[#0F172A]"
                    >
                      <CheckCircle2 className="w-4 h-4 text-[#10B981] shrink-0" />
                      <span>{val}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div id="open-jobs" className="space-y-4 pt-4">
              <div className="flex items-center justify-between">
                <h2 className="text-2xl font-black text-[#0F172A] tracking-tight">
                  Open Jobs at {company.name}
                </h2>
                <span className="text-xs font-bold text-[#2563EB] bg-blue-50 px-3 py-1 rounded-full border border-blue-100">
                  {companyJobs.length || company.openJobs} Opportunities
                </span>
              </div>

              {companyJobs.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  {companyJobs.map((job) => (
                    <JobCard key={job.id} job={job} />
                  ))}
                </div>
              ) : (
                <div className="bg-white rounded-2xl p-8 border border-slate-200 text-center">
                  <p className="text-sm font-medium text-[#64748B]">
                    Currently showing featured openings for {company.name}. Check back soon for new updates!
                  </p>
                </div>
              )}
            </div>
          </div>

          <div className="lg:col-span-4 space-y-6">
            {company.benefits && company.benefits.length > 0 && (
              <div className="bg-white rounded-2xl p-6 border border-[#E2E8F0] shadow-xs">
                <h3 className="text-base font-bold text-[#0F172A] mb-4">
                  Perks & Benefits
                </h3>
                <ul className="space-y-3">
                  {company.benefits.map((benefit) => (
                    <li
                      key={benefit}
                      className="flex items-start gap-2.5 text-xs font-medium text-[#475569]"
                    >
                      <CheckCircle2 className="w-4 h-4 text-[#2563EB] shrink-0 mt-0.5" />
                      <span>{benefit}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            <div className="bg-white rounded-2xl p-6 border border-[#E2E8F0] shadow-xs space-y-4">
              <h3 className="text-base font-bold text-[#0F172A]">Company Overview</h3>

              <div className="space-y-3 text-xs">
                <div className="flex justify-between py-2 border-b border-slate-100">
                  <span className="text-[#64748B] font-medium">Industry</span>
                  <span className="font-bold text-[#0F172A]">{company.industry}</span>
                </div>

                <div className="flex justify-between py-2 border-b border-slate-100">
                  <span className="text-[#64748B] font-medium">Company Size</span>
                  <span className="font-bold text-[#0F172A]">{company.companySize}</span>
                </div>

                <div className="flex justify-between py-2 border-b border-slate-100">
                  <span className="text-[#64748B] font-medium">Founded Year</span>
                  <span className="font-bold text-[#0F172A]">{company.foundedYear}</span>
                </div>

                <div className="flex justify-between py-2">
                  <span className="text-[#64748B] font-medium">Hiring Status</span>
                  <span className="font-bold text-emerald-600">{company.hiringStatus}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}