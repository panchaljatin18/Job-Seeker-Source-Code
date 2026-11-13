"use client";

import React from "react";
import {
  Code,
  Building2,
  Stethoscope,
  GraduationCap,
  ShoppingBag,
  Briefcase,
  TrendingUp,
  Globe,
  ArrowRight,
} from "lucide-react";
import { industryCategoryCards } from "@/data/companies";

interface IndustrySectionProps {
  onSelectIndustry?: (industry: string) => void;
}

export default function IndustrySection({ onSelectIndustry }: IndustrySectionProps) {
  const iconMap: Record<string, React.ElementType> = {
    Code,
    Building2,
    Stethoscope,
    GraduationCap,
    ShoppingBag,
    Briefcase,
    TrendingUp,
    Globe,
  };

  return (
    <section className="max-w-[1280px] mx-auto px-4 sm:px-8 lg:px-12 mt-16 sm:mt-20 mb-16">
      <div className="text-center max-w-2xl mx-auto mb-10">
        <span className="text-xs font-bold text-[#2563EB] uppercase tracking-wider block mb-1">
          BROWSE BY CATEGORY
        </span>
        <h2 className="text-2xl sm:text-3xl font-black text-[#0F172A] tracking-tight">
          Explore Companies by Industry
        </h2>
        <p className="text-sm font-medium text-[#64748B] mt-1.5">
          Find hiring companies categorized by sector and specialization.
        </p>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
        {industryCategoryCards.map((card) => {
          const IconComp = iconMap[card.iconName] || Code;
          return (
            <div
              key={card.name}
              onClick={() => onSelectIndustry && onSelectIndustry(card.name)}
              className="group bg-white border border-[#E2E8F0] hover:border-[#2563EB]/40 rounded-2xl p-5 shadow-xs hover:shadow-lg hover:shadow-blue-500/5 transition-all duration-200 cursor-pointer flex flex-col justify-between"
            >
              <div>
                <div
                  className={`w-12 h-12 rounded-xl flex items-center justify-center border mb-4 ${card.color} group-hover:scale-110 transition-transform`}
                >
                  <IconComp className="w-6 h-6 stroke-[2.2]" />
                </div>
                <h3 className="font-bold text-base text-[#0F172A] group-hover:text-[#2563EB] transition-colors mb-1">
                  {card.name}
                </h3>
                <p className="text-xs font-semibold text-[#64748B] mb-4">{card.count}</p>
              </div>
              <div className="flex items-center gap-1 text-xs font-bold text-[#2563EB] group-hover:underline pt-2 border-t border-slate-100">
                <span>Explore Companies</span>
                <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}