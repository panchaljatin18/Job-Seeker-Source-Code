"use client";

import React from "react";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { topCompanies } from "@/data/mockData";

export default function TopCompanies() {
  return (
    <section className="max-w-[1280px] mx-auto px-4 sm:px-8 lg:px-12 mb-20 sm:mb-28">
      <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8 sm:mb-10 gap-4">
        <div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-[#0F172A] tracking-tight">
            Top Companies Hiring
          </h2>
          <p className="text-[#64748B] text-sm sm:text-base mt-1.5 font-normal">
            Work with industry leaders
          </p>
        </div>
        <Link
          href="/companies"
          className="inline-flex items-center gap-1.5 text-sm font-semibold text-[#2563EB] hover:text-blue-700 hover:underline group"
        >
          <span>View All Companies</span>
          <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
        </Link>
      </div>

      <div className="flex flex-wrap items-center justify-center lg:justify-between gap-4 sm:gap-5">
        {topCompanies.map((comp) => (
          <div
            key={comp.id}
            className="bg-white rounded-xl border border-slate-200/80 px-5 sm:px-6 py-3.5 flex items-center justify-center shadow-2xs hover:border-blue-300 hover:shadow-md transition-all cursor-pointer group min-w-[110px] sm:min-w-[125px] h-14"
          >
            <span
              className={`text-base sm:text-lg tracking-tight group-hover:scale-105 transition-transform ${comp.color}`}
            >
              {comp.name}
            </span>
          </div>
        ))}
      </div>
    </section>
  );
}