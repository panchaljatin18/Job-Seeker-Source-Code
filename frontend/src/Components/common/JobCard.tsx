"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  MapPin,
  Briefcase,
  Clock,
  Heart,
  BadgeCheck,
  ChevronRight,
} from "lucide-react";

interface JobCardProps {
  job: any;
  isSaved?: boolean;
  onToggleSave?: (jobId: string | number) => void;
}

export default function JobCard({
  job,
  isSaved: initialIsSaved = false,
  onToggleSave,
}: JobCardProps) {
  const [saved, setSaved] = useState(initialIsSaved);

  const handleSaveClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setSaved(!saved);
    if (onToggleSave) {
      onToggleSave(job.id);
    }
  };

  return (
    <div className="group bg-white border border-[#E2E8F0] hover:border-[#2563EB]/40 rounded-2xl p-5 sm:p-6 shadow-xs hover:shadow-lg hover:shadow-blue-500/5 transition-all duration-200 flex flex-col justify-between relative overflow-hidden">
      <div>
        <div className="flex items-start justify-between gap-4 mb-4">
          <div className="flex items-center gap-3.5">
            <div
              className={`w-12 h-12 rounded-xl flex items-center justify-center font-bold text-lg shrink-0 border ${job.logoColor} transition-transform group-hover:scale-105`}
            >
              {job.logoText}
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-semibold text-sm text-[#475569]">{job.company}</span>
                {job.verified && <BadgeCheck className="w-4 h-4 text-[#2563EB] fill-blue-50" />}
              </div>
              <h3 className="text-lg sm:text-[19px] font-bold text-[#0F172A] group-hover:text-[#2563EB] transition-colors line-clamp-1 mt-0.5">
                <Link href={`/jobs/${job.slug}`}>{job.title}</Link>
              </h3>
            </div>
          </div>
          <button
            onClick={handleSaveClick}
            aria-label={saved ? "Remove from saved jobs" : "Save job"}
            className={`w-9 h-9 rounded-xl flex items-center justify-center border transition-all cursor-pointer ${
              saved
                ? "bg-rose-50 border-rose-200 text-rose-500"
                : "bg-slate-50 hover:bg-slate-100 border-slate-200/80 text-slate-400 hover:text-slate-600"
            }`}
          >
            <Heart className={`w-4.5 h-4.5 transition-transform ${saved ? "fill-rose-500 scale-110" : ""}`} />
          </button>
        </div>

        <div className="flex flex-wrap items-center gap-y-2 gap-x-4 text-xs sm:text-sm text-[#64748B] mb-4">
          <div className="flex items-center gap-1.5">
            <MapPin className="w-4 h-4 text-[#2563EB] shrink-0" />
            <span>{job.location}</span>
          </div>
          <div className="flex items-center gap-1.5">
            <Briefcase className="w-4 h-4 text-[#64748B] shrink-0" />
            <span>
              {job.workType} <span className="text-slate-300">•</span> {job.locationType}
            </span>
          </div>
        </div>

        <div className="flex items-center justify-between py-2.5 px-3.5 bg-[#F8FAFC] rounded-xl border border-slate-100 mb-4">
          <div>
            <span className="text-xs text-[#64748B] block font-medium">Salary</span>
            <span className="text-sm font-bold text-[#0F172A]">
              {job.salary} <span className="text-xs font-normal text-[#64748B]">/ year</span>
            </span>
          </div>
          <div className="text-right">
            <span className="text-xs text-[#64748B] block font-medium">Posted</span>
            <div className="flex items-center gap-1 text-xs text-[#64748B] font-medium">
              <Clock className="w-3.5 h-3.5 text-[#2563EB]" />
              <span>{job.postedDate}</span>
            </div>
          </div>
        </div>

        <div className="flex flex-wrap gap-1.5 mb-5">
          {job.tags.map((tag: string, i: number) => (
            <span
              key={i}
              className="px-2.5 py-1 rounded-lg text-xs font-medium bg-[#EFF6FF] text-[#2563EB] border border-blue-100/60"
            >
              {tag}
            </span>
          ))}
        </div>
      </div>

      <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
        <span className="text-xs font-semibold text-emerald-600 bg-emerald-50 px-2.5 py-1 rounded-md border border-emerald-100 flex items-center gap-1">
          Actively Hiring
        </span>
        <Link
          href={`/jobs/${job.slug}`}
          className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-semibold text-[#2563EB] hover:text-blue-700 bg-blue-50/70 hover:bg-[#EFF6FF] px-4 py-2 rounded-xl border border-blue-100 transition-all group/btn"
        >
          <span>View Job</span>
          <ChevronRight className="w-4 h-4 group-hover/btn:translate-x-0.5 transition-transform" />
        </Link>
      </div>
    </div>
  );
}