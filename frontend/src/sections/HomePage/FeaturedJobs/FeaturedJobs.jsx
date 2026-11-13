"use client";

import React, { useState } from "react";
import Link from "next/link";
import { MapPin, Bookmark, ArrowRight } from "lucide-react";
import { featuredJobs } from "@/data/mockData";

function FeaturedJobs() {
  const [savedJobs, setSavedJobs] = useState([]);
  const toggleSave = id => {
    setSavedJobs(prev => prev.includes(id) ? prev.filter(item => item !== id) : [...prev, id]);
  };
  return (
    <section className="max-w-[1280px] mx-auto px-4 sm:px-8 lg:px-12 mb-20 sm:mb-28">
      <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8 sm:mb-10 gap-4">
        <div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-[#0F172A] tracking-tight">
            Featured Jobs
          </h2>
          <p className="text-[#64748B] text-sm sm:text-base mt-1.5 font-normal">
            Handpicked opportunities from top companies
          </p>
        </div>
        <Link
          href="/jobs"
          className="inline-flex items-center gap-1.5 text-sm font-semibold text-[#2563EB] hover:text-blue-700 hover:underline group"
        >
          <span>View All Jobs</span>
          <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {featuredJobs.map((job) => {
          const isSaved = savedJobs.includes(job.id);
          return (
            <div
              key={job.id}
              className="bg-white rounded-2xl border border-slate-200/80 p-5 hover:border-blue-300 hover:shadow-xl hover:shadow-blue-950/5 transition-all duration-300 flex flex-col justify-between group"
            >
              <div>
                <div className="flex items-center gap-3 mb-4">
                  <div
                    className={`w-10 h-10 rounded-xl ${job.logoColor} flex items-center justify-center font-bold text-base shadow-2xs`}
                  >
                    {job.logoText}
                  </div>
                  <span className="text-sm font-bold text-[#0F172A]">
                    {job.company}
                  </span>
                </div>
                <h3 className="text-base font-bold text-[#0F172A] group-hover:text-[#2563EB] transition-colors line-clamp-1">
                  {job.title}
                </h3>
                <div className="flex items-center gap-1.5 text-xs font-medium text-[#64748B] mt-2">
                  <MapPin className="w-3.5 h-3.5 text-[#64748B] shrink-0" />
                  <span>{job.location}</span>
                </div>
                <div className="flex items-center gap-2 mt-3">
                  <span className="px-2.5 py-1 bg-[#EFF6FF] text-[#2563EB] rounded-md text-xs font-semibold">
                    {job.workType}
                  </span>
                  <span className="px-2.5 py-1 bg-slate-100 text-[#475569] rounded-md text-xs font-semibold">
                    {job.locationType}
                  </span>
                </div>
                <div className="flex items-center justify-between mt-4 text-xs">
                  <span className="font-extrabold text-[#0F172A] text-sm">
                    {job.salary}
                  </span>
                  <span className="text-[#64748B] font-medium">
                    {job.postedDate}
                  </span>
                </div>
                <div className="flex flex-wrap gap-1.5 mt-4 pt-4 border-t border-slate-100">
                  {job.tags.map((tag) => (
                    <span
                      key={tag}
                      className="px-2 py-0.5 bg-slate-50 border border-slate-200/60 rounded text-[11px] font-medium text-[#475569]"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
              <div className="flex items-center gap-2 mt-6">
                <Link
                  href="/jobs"
                  className="flex-1 py-2.5 px-4 bg-[#2563EB] hover:bg-blue-700 active:bg-blue-800 text-white rounded-xl font-semibold text-xs transition-colors shadow-sm cursor-pointer text-center"
                >
                  View Job
                </Link>
                <button
                  onClick={() => toggleSave(job.id)}
                  aria-label="Save job"
                  className={`p-2.5 rounded-xl border transition-all cursor-pointer ${
                    isSaved
                      ? "border-[#2563EB] bg-[#EFF6FF] text-[#2563EB]"
                      : "border-slate-200 text-[#64748B] hover:border-blue-400 hover:text-[#2563EB] hover:bg-slate-50"
                  }`}
                >
                  <Bookmark
                    className={`w-4 h-4 ${isSaved ? "fill-[#2563EB]" : ""}`}
                  />
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}

export default FeaturedJobs;