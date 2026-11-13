"use client";

import React from "react";
import Link from "next/link";
import { BadgeCheck, Briefcase, ArrowRight } from "lucide-react";

interface TopCompaniesProps {
  companies: any[];
}

export default function TopCompanies({ companies }: TopCompaniesProps) {
  const topSix = companies.filter((c) => c.featured).slice(0, 6);

  return (
    <section className="max-w-[1280px] mx-auto px-4 sm:px-8 lg:px-12 mb-14 sm:mb-18">
      <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8 gap-4">
        <div>
          <span className="text-xs font-bold text-[#2563EB] uppercase tracking-wider block mb-1">
            FEATURED EMPLOYERS
          </span>
          <h2 className="text-2xl sm:text-3xl font-black text-[#0F172A] tracking-tight">
            Top Companies Hiring
          </h2>
          <p className="text-sm font-medium text-[#64748B] mt-1">
            Explore opportunities from leading companies.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6">
        {topSix.map((comp) => (
          <div
            key={comp.id || comp.slug}
            className="group bg-gradient-to-b from-white to-[#F8FAFC] border border-blue-100 hover:border-[#2563EB]/40 rounded-2xl p-6 shadow-xs hover:shadow-xl hover:shadow-blue-500/5 transition-all duration-200 flex flex-col justify-between"
          >
            <div>
              <div className="flex items-center gap-4 mb-4">
                <div className="w-14 h-14 rounded-2xl bg-white border border-slate-200/80 flex items-center justify-center shrink-0 shadow-xs group-hover:scale-105 transition-transform">
                  <span
                    className={`w-10 h-10 rounded-xl flex items-center justify-center font-bold text-base border ${comp.logoColor}`}
                  >
                    {comp.logoText}
                  </span>
                </div>
                <div>
                  <div className="flex items-center gap-1.5">
                    <h3 className="text-lg font-bold text-[#0F172A] group-hover:text-[#2563EB] transition-colors">
                      <Link href={`/companies/${comp.slug}`}>{comp.name}</Link>
                    </h3>
                    {comp.verified && (
                      <BadgeCheck className="w-4 h-4 text-[#2563EB] fill-blue-50" />
                    )}
                  </div>
                  <span className="text-xs font-semibold text-[#64748B]">{comp.industry}</span>
                </div>
              </div>
              <p className="text-xs text-[#64748B] line-clamp-2 leading-relaxed mb-4">
                {comp.description}
              </p>
            </div>

            <div className="pt-4 border-t border-slate-200/60 flex items-center justify-between">
              <span className="text-xs font-bold text-[#2563EB] bg-blue-50 px-2.5 py-1 rounded-lg border border-blue-100/80 flex items-center gap-1.5">
                <Briefcase className="w-3.5 h-3.5" />
                {comp.openJobs} Open Jobs
              </span>
              <Link
                href={`/companies/${comp.slug}`}
                className="inline-flex items-center gap-1 text-xs font-bold text-[#2563EB] hover:text-blue-700 transition-all group/btn"
              >
                <span>Explore Company</span>
                <ArrowRight className="w-3.5 h-3.5 group-hover/btn:translate-x-1 transition-transform" />
              </Link>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}