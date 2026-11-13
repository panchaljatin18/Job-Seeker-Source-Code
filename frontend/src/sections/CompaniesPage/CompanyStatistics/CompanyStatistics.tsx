"use client";

import React from "react";
import { Building2, Briefcase, Globe, Users } from "lucide-react";
import { companyStatsData } from "@/data/companies";

export default function CompanyStatistics() {
  const iconMap: Record<string, React.ElementType> = {
    Building2,
    Briefcase,
    Globe,
    Users,
  };

  return (
    <div className="max-w-[1280px] mx-auto px-4 sm:px-8 lg:px-12 -mt-6 sm:-mt-8 mb-12 sm:mb-16 relative z-20">
      <div className="bg-white rounded-2xl p-4 sm:p-6 shadow-lg shadow-slate-200/50 border border-slate-100 grid grid-cols-2 lg:grid-cols-4 gap-4 divide-y sm:divide-y-0 lg:divide-x divide-slate-100">
        {companyStatsData.map((stat, idx) => {
          const IconComponent = iconMap[stat.iconName] || Building2;
          return (
            <div
              key={stat.label}
              className={`flex items-center gap-3.5 ${idx > 0 ? "pt-3 sm:pt-0 lg:pl-6" : ""}`}
            >
              <div
                className={`w-11 h-11 rounded-xl ${stat.bgColor} flex items-center justify-center shrink-0 shadow-xs`}
              >
                <IconComponent className="w-5.5 h-5.5 stroke-[2.2]" />
              </div>
              <div>
                <div className="text-xl sm:text-2xl font-black text-[#0F172A] tracking-tight leading-none">
                  {stat.value}
                </div>
                <div className="text-xs font-semibold text-[#64748B] mt-1">{stat.label}</div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}