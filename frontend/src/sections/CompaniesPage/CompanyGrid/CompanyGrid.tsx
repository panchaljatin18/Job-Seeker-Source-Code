"use client";

import React from "react";
import { SlidersHorizontal, Building2, ArrowUpDown, SearchX } from "lucide-react";
import CompanyCard from "@/Components/common/CompanyCard";

interface CompanyGridProps {
  companies: any[];
  totalCompaniesCount: number;
  sortBy: string;
  setSortBy: (val: string) => void;
  onOpenMobileFilters: () => void;
  onClearFilters: () => void;
}

export default function CompanyGrid({
  companies,
  totalCompaniesCount,
  sortBy,
  setSortBy,
  onOpenMobileFilters,
  onClearFilters,
}: CompanyGridProps) {
  return (
    <div className="flex-1 min-w-0">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 bg-white p-4 sm:p-5 rounded-2xl border border-[#E2E8F0] shadow-xs">
        <div>
          <div className="flex items-center gap-2">
            <Building2 className="w-5 h-5 text-[#2563EB]" />
            <h2 className="text-xl sm:text-2xl font-black text-[#0F172A] tracking-tight">
              {totalCompaniesCount.toLocaleString()} {totalCompaniesCount === 1 ? "Company" : "Companies"}
            </h2>
          </div>
          <p className="text-xs sm:text-sm font-medium text-[#64748B] mt-0.5">
            Discover companies hiring talented professionals.
          </p>
        </div>

        <div className="flex items-center gap-3 self-start sm:self-auto w-full sm:w-auto">
          <button
            onClick={onOpenMobileFilters}
            className="lg:hidden flex-1 sm:flex-initial inline-flex items-center justify-center gap-2 px-3.5 py-2.5 bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-xl text-xs sm:text-sm font-semibold text-[#0F172A] transition-colors cursor-pointer"
          >
            <SlidersHorizontal className="w-4 h-4 text-[#2563EB]" />
            <span>Filters</span>
          </button>
          <div className="flex-1 sm:flex-initial flex items-center gap-2 bg-slate-50 border border-slate-200/90 rounded-xl px-3 py-2">
            <ArrowUpDown className="w-3.5 h-3.5 text-[#2563EB] shrink-0" />
            <span className="text-xs font-semibold text-[#64748B] hidden sm:inline">Sort By:</span>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="bg-transparent text-xs font-bold text-[#0F172A] focus:outline-none cursor-pointer w-full"
              aria-label="Sort companies by"
            >
              <option value="popular">Most Popular</option>
              <option value="jobs">Most Jobs</option>
              <option value="name">A–Z</option>
              <option value="recent">Recently Added</option>
            </select>
          </div>
        </div>
      </div>

      {companies.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5 sm:gap-6">
          {companies.map((comp) => (
            <CompanyCard key={comp.id || comp.slug} company={comp} />
          ))}
        </div>
      ) : (
        <div className="bg-white border border-[#E2E8F0] rounded-2xl p-10 text-center max-w-lg mx-auto my-8 shadow-xs">
          <div className="w-16 h-16 rounded-2xl bg-[#EFF6FF] text-[#2563EB] flex items-center justify-center mx-auto mb-4 border border-blue-100">
            <SearchX className="w-8 h-8 stroke-[1.8]" />
          </div>
          <h3 className="text-xl font-bold text-[#0F172A] mb-2">No Companies Found</h3>
          <p className="text-sm text-[#64748B] mb-6 leading-relaxed">
            We couldn't find any companies matching your current search. Try another keyword or clear your filters.
          </p>
          <button
            onClick={onClearFilters}
            className="px-5 py-2.5 bg-[#2563EB] hover:bg-blue-700 text-white font-semibold text-sm rounded-xl shadow-md transition-colors inline-flex items-center gap-2 cursor-pointer"
          >
            Clear Filters
          </button>
        </div>
      )}
    </div>
  );
}