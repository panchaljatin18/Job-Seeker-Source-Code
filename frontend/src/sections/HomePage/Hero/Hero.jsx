"use client";

import React, { useState } from "react";
import Image from "next/image";
import {
  Search,
  MapPin,
  ArrowRight,
  Briefcase,
  UserCheck,
  TrendingUp,
} from "lucide-react";

export default function Hero() {
  const [searchTerm, setSearchTerm] = useState("");
  const [locationTerm, setLocationTerm] = useState("");
  const popularSearches = [
    "Frontend Developer",
    "React Developer",
    "Full Stack Developer",
    "Data Analyst",
    "Digital Marketing",
  ];

  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-[#EFF6FF] via-indigo-50/20 to-white pt-10 pb-16 lg:pt-14 lg:pb-24">
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-blue-200/30 rounded-full blur-3xl pointer-events-none -z-10" />
      <div className="max-w-[1280px] mx-auto px-4 sm:px-8 lg:px-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
          <div className="lg:col-span-7 flex flex-col justify-center">
            <div className="inline-flex items-center gap-2 mb-4">
              <span className="text-xs font-bold uppercase tracking-widest text-[#64748B]">
                THOUSANDS OF JOBS. ENDLESS OPPORTUNITIES
              </span>
            </div>
            <h1 className="text-4xl sm:text-5xl lg:text-[54px] font-black text-[#0F172A] tracking-tight leading-[1.08]">
              Find Your Next <br />
              <span className="text-[#2563EB]">Career Opportunity</span>
            </h1>
            <p className="mt-4 text-base sm:text-lg text-[#475569] max-w-xl font-normal leading-relaxed">
              Discover jobs that match your skills, experience and career goals. Apply, track
              and build a better future with top companies.
            </p>
            <div className="mt-8 bg-white p-2.5 sm:p-3 rounded-2xl shadow-xl shadow-blue-900/5 border border-slate-200/80 flex flex-col md:flex-row items-center gap-3 max-w-2xl">
              <div className="w-full flex-1 flex items-center gap-3 px-3 py-2 border-b md:border-b-0 md:border-r border-slate-200/80">
                <Search className="w-5 h-5 text-[#64748B] shrink-0" />
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Job title, keywords or company"
                  className="w-full bg-transparent outline-none text-[#0F172A] placeholder:text-[#64748B] text-sm font-medium"
                />
              </div>
              <div className="w-full md:w-52 flex items-center gap-3 px-3 py-2">
                <MapPin className="w-5 h-5 text-[#64748B] shrink-0" />
                <input
                  type="text"
                  value={locationTerm}
                  onChange={(e) => setLocationTerm(e.target.value)}
                  placeholder="Location"
                  className="w-full bg-transparent outline-none text-[#0F172A] placeholder:text-[#64748B] text-sm font-medium"
                />
              </div>
              <button className="w-full md:w-auto bg-[#2563EB] hover:bg-blue-700 active:bg-blue-800 text-white font-semibold px-6 py-3.5 rounded-xl flex items-center justify-center gap-2 transition-all shadow-md shadow-blue-600/30 cursor-pointer text-sm whitespace-nowrap group">
                <span>Search Jobs</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
              </button>
            </div>
            <div className="mt-5 flex flex-wrap items-center gap-2 text-xs">
              <span className="text-[#64748B] font-semibold mr-1">Popular Searches:</span>
              {popularSearches.map((tag) => (
                <button
                  key={tag}
                  onClick={() => setSearchTerm(tag)}
                  className="px-3 py-1.5 bg-white hover:bg-[#EFF6FF] hover:text-[#2563EB] hover:border-blue-200 border border-slate-200/80 rounded-lg text-[#475569] font-medium transition-all cursor-pointer shadow-2xs"
                >
                  {tag}
                </button>
              ))}
            </div>
          </div>
          <div className="lg:col-span-5 relative flex justify-center lg:justify-end">
            <div className="relative w-full max-w-md lg:max-w-none">
              <div className="absolute -top-6 -right-2 sm:right-4 z-30 flex items-center gap-1.5 bg-white/95 backdrop-blur-xs px-3.5 py-1.5 rounded-full border border-blue-100 shadow-md transform rotate-6">
                <span className="text-xs font-bold text-[#0F172A] italic">
                  Better Jobs Brighter Future
                </span>
              </div>
              <div className="relative mx-auto rounded-3xl overflow-hidden bg-gradient-to-tr from-blue-600/10 via-indigo-500/10 to-transparent p-2">
                <div className="relative w-full h-[420px] sm:h-[480px] lg:h-[520px] rounded-2xl overflow-hidden shadow-2xl shadow-blue-900/15">
                  <Image
                    src="/hero-person.webp"
                    alt="Working Professional"
                    fill
                    sizes="(max-width: 768px) 100vw, 50vw"
                    priority
                    className="object-cover object-top hover:scale-105 transition-transform duration-700"
                  />
                </div>
              </div>
              <div className="absolute top-8 -left-4 sm:-left-8 z-20 bg-white rounded-2xl p-3 sm:p-3.5 shadow-xl border border-slate-100 flex items-center gap-3 hover:-translate-y-1 transition-transform">
                <div className="w-10 h-10 rounded-xl bg-[#ECFDF5] text-[#10B981] flex items-center justify-center shrink-0">
                  <Briefcase className="w-5 h-5 stroke-[2.2]" />
                </div>
                <div>
                  <div className="text-sm font-extrabold text-[#0F172A] leading-none">5000+</div>
                  <div className="text-xs font-medium text-[#64748B] mt-1">Active Jobs</div>
                </div>
              </div>
              <div className="absolute top-48 -left-6 sm:-left-10 z-20 bg-white rounded-2xl p-3 sm:p-3.5 shadow-xl border border-slate-100 flex items-center gap-3 hover:-translate-y-1 transition-transform">
                <div className="w-10 h-10 rounded-xl bg-[#EFF6FF] text-[#2563EB] flex items-center justify-center shrink-0">
                  <UserCheck className="w-5 h-5 stroke-[2.2]" />
                </div>
                <div>
                  <div className="text-sm font-extrabold text-[#0F172A] leading-none">Top</div>
                  <div className="text-xs font-medium text-[#64748B] mt-1">Companies</div>
                </div>
              </div>
              <div className="absolute bottom-10 -right-4 sm:-right-6 z-20 bg-white rounded-2xl p-3.5 shadow-xl border border-slate-100 flex items-center gap-3 hover:-translate-y-1 transition-transform">
                <div className="w-10 h-10 rounded-xl bg-[#ECFDF5] text-[#10B981] flex items-center justify-center shrink-0">
                  <TrendingUp className="w-5 h-5 stroke-[2.2]" />
                </div>
                <div>
                  <div className="text-sm font-extrabold text-[#0F172A] leading-none">Build</div>
                  <div className="text-xs font-medium text-[#64748B] mt-1">Your Career</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}