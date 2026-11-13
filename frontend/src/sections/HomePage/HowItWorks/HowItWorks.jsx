"use client";

import { User, FileText, Search, CheckCircle2, ArrowRight } from "lucide-react";
import { howItWorksSteps } from "@/data/mockData";

function HowItWorks() {
  const iconMap = {
    User: User,
    FileText: FileText,
    Search: Search,
    CheckCircle2: CheckCircle2
  };
  return (
    <section className="max-w-[1280px] mx-auto px-4 sm:px-8 lg:px-12 mb-20 sm:mb-28">
      <div className="mb-10 sm:mb-12">
        <h2 className="text-2xl sm:text-3xl font-extrabold text-[#0F172A] tracking-tight">
          How It Works
        </h2>
        <p className="text-[#64748B] text-sm sm:text-base mt-1.5 font-normal">
          Get hired in 4 simple steps
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 relative">
        {howItWorksSteps.map((stepItem, idx) => {
          const IconComp = iconMap[stepItem.iconName] || User;
          const isLast = idx === howItWorksSteps.length - 1;
          return (
            <div
              key={stepItem.title || idx}
              className="relative flex flex-col group"
            >
              <div className="flex items-center gap-4">
                <div
                  className={`w-14 h-14 rounded-2xl flex items-center justify-center shrink-0 transition-transform group-hover:scale-105 shadow-2xs ${
                    isLast
                      ? "bg-[#ECFDF5] text-[#10B981]"
                      : "bg-[#EFF6FF] text-[#2563EB]"
                  }`}
                >
                  <IconComp className="w-6 h-6 stroke-[2.2]" />
                </div>
                {!isLast && (
                  <div className="hidden lg:flex flex-1 items-center justify-center text-slate-300 pl-2 pr-4">
                    <ArrowRight className="w-5 h-5 text-slate-300 stroke-[1.8]" />
                  </div>
                )}
              </div>
              <div className="mt-4">
                <h3 className="text-base sm:text-lg font-extrabold text-[#0F172A]">
                  {stepItem.title}
                </h3>
                <p className="text-xs sm:text-sm text-[#475569] mt-1.5 leading-relaxed">
                  {stepItem.desc}
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}

export default HowItWorks;