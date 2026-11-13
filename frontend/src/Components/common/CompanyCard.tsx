"use client";

import Link from "next/link";
import { MapPin, Users, Briefcase, BadgeCheck, ChevronRight, Star } from "lucide-react";

function CompanyCard({
  company
}) {
  return (
    <div className="group bg-white border border-[#E2E8F0] hover:border-[#2563EB]/40 rounded-2xl p-6 shadow-xs hover:shadow-xl hover:shadow-blue-500/5 transition-all duration-200 flex flex-col justify-between relative overflow-hidden">
      <div>
        <div className="flex items-start justify-between gap-3 mb-4">
          <div className="w-16 h-16 rounded-2xl bg-[#F8FAFC] border border-slate-100 flex items-center justify-center text-xl font-black shrink-0 transition-transform group-hover:scale-105 shadow-xs">
            <span
              className={`w-12 h-12 rounded-xl flex items-center justify-center border ${company.logoColor}`}
            >
              {company.logoText}
            </span>
          </div>
          <div className="flex items-center gap-1.5 bg-blue-50/70 border border-blue-100 px-2.5 py-1 rounded-full text-xs font-semibold text-[#2563EB]">
            {company.verified && (
              <BadgeCheck className="w-3.5 h-3.5 fill-[#2563EB] text-blue-50" />
            )}
            <span>Verified</span>
          </div>
        </div>

        <div className="mb-3">
          <div className="flex items-center justify-between gap-2">
            <h3 className="text-xl font-bold text-[#0F172A] group-hover:text-[#2563EB] transition-colors line-clamp-1">
              <Link href={`/companies/${company.slug}`}>{company.name}</Link>
            </h3>
            {company.rating && (
              <div className="flex items-center gap-1 text-xs font-bold text-amber-500 shrink-0">
                <Star className="w-3.5 h-3.5 fill-amber-400" />
                <span>{company.rating}</span>
              </div>
            )}
          </div>
          <p className="text-xs font-semibold text-[#2563EB] mt-0.5">
            {company.industry}
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-y-1.5 gap-x-4 text-xs text-[#64748B] mb-3.5">
          <div className="flex items-center gap-1.5">
            <MapPin className="w-3.5 h-3.5 text-[#2563EB] shrink-0" />
            <span>{company.location}</span>
          </div>
          <div className="flex items-center gap-1.5">
            <Users className="w-3.5 h-3.5 text-[#64748B] shrink-0" />
            <span>{company.companySize}</span>
          </div>
        </div>

        <div className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-[#EFF6FF] border border-blue-100 rounded-xl text-xs font-bold text-[#2563EB] mb-4">
          <Briefcase className="w-3.5 h-3.5 text-[#2563EB]" />
          <span>{company.openJobs} Open Jobs</span>
        </div>

        <p className="text-xs text-[#64748B] leading-relaxed line-clamp-2 mb-4 font-normal">
          {company.description}
        </p>

        <div className="flex flex-wrap gap-1.5 mb-5">
          {company.skills.slice(0, 3).map((skill: string) => (
            <span
              key={skill}
              className="px-2.5 py-0.5 rounded-md text-[11px] font-medium bg-slate-100 text-[#475569]"
            >
              {skill}
            </span>
          ))}
        </div>
      </div>

      <div className="pt-3.5 border-t border-slate-100 flex items-center justify-between">
        <span className="text-xs font-semibold text-emerald-600 bg-emerald-50 px-2.5 py-1 rounded-md border border-emerald-100">
          {company.hiringStatus}
        </span>
        <Link
          href={`/companies/${company.slug}`}
          className="inline-flex items-center gap-1 text-xs sm:text-sm font-semibold text-[#2563EB] hover:text-blue-700 bg-blue-50/60 hover:bg-[#EFF6FF] px-3.5 py-1.5 rounded-xl border border-blue-100 transition-all group/btn"
        >
          <span>View Company</span>
          <ChevronRight className="w-4 h-4 group-hover/btn:translate-x-0.5 transition-transform" />
        </Link>
      </div>
    </div>
  );
}

export default CompanyCard;