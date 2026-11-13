"use client";

import React from "react";
import { Search, ArrowRight } from "lucide-react";
import { popularCompanyIndustries } from "@/data/companies";

interface CompanySearchProps {
  searchQuery: string;
  setSearchQuery: (val: string) => void;
  selectedIndustry: string;
  setSelectedIndustry: (ind: string) => void;
  onSearchSubmit: (e?: React.FormEvent) => void;
}

export default function CompanySearch({
  searchQuery,
  setSearchQuery,
  selectedIndustry,
  setSelectedIndustry,
  onSearchSubmit,
}: CompanySearchProps) {
  const handleIndustryClick = (industry: string) => {
    if (selectedIndustry === industry) {
      setSelectedIndustry("");
    } else {
      setSelectedIndustry(industry);
    }
    onSearchSubmit();
  };

  return (
    <div className="w-full max-w-3xl mx-auto mt-6">
      <form
        onSubmit={(e) => {
          e.preventDefault();
          onSearchSubmit(e);
        }}
        className="bg-white p-2.5 rounded-2xl shadow-xl shadow-blue-900/5 border border-slate-200/90 flex flex-col sm:flex-row items-center gap-2 transition-all"
      >
        <div className="flex-1 w-full flex items-center gap-3 px-3.5 py-2.5 bg-slate-50/60 hover:bg-slate-50 rounded-xl border border-transparent focus-within:border-blue-200 focus-within:bg-white transition-all">
          <Search className="w-5 h-5 text-[#2563EB] shrink-0" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search companies, industries or skills"
            className="w-full bg-transparent text-sm font-medium text-[#0F172A] placeholder:text-slate-400 focus:outline-none"
            aria-label="Search companies, industries or skills"
          />
        </div>
        <button
          type="submit"
          className="w-full sm:w-auto px-6 py-3 bg-[#2563EB] hover:bg-blue-700 active:bg-blue-800 text-white font-semibold text-sm rounded-xl shadow-md shadow-blue-600/25 transition-all flex items-center justify-center gap-2 shrink-0 cursor-pointer hover:shadow-lg hover:shadow-blue-600/35"
        >
          <span>Search Companies</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </form>

      <div className="mt-4 flex flex-wrap items-center justify-center gap-2 text-xs sm:text-sm">
        <span className="font-semibold text-[#64748B] mr-1">Popular Industries:</span>
        {popularCompanyIndustries.map((ind) => {
          const isSelected = selectedIndustry.toLowerCase() === ind.toLowerCase();
          return (
            <button
              key={ind}
              type="button"
              onClick={() => handleIndustryClick(ind)}
              className={`px-3 py-1 rounded-full border text-xs font-medium transition-colors cursor-pointer ${
                isSelected
                  ? "bg-[#EFF6FF] border-[#2563EB] text-[#2563EB] font-semibold"
                  : "bg-white/90 hover:bg-[#EFF6FF] border-slate-200 hover:border-blue-200 text-[#475569] hover:text-[#2563EB]"
              }`}
            >
              {ind}
            </button>
          );
        })}
      </div>
    </div>
  );
}