"use client";

import CompanySearch from "@/sections/CompaniesPage/CompaniesHero/CompanySearch";

function CompaniesHero({
  searchQuery,
  setSearchQuery,
  selectedIndustry,
  setSelectedIndustry,
  onSearchSubmit
}) {
  return /*#__PURE__*/<section className="relative bg-gradient-to-b from-[#EFF6FF] via-[#F8FAFC] to-white border-b border-slate-100 pt-10 pb-12 sm:pt-12 sm:pb-14 px-4 sm:px-8 lg:px-12 overflow-hidden">{/*#__PURE__*/<div className="absolute -top-20 left-1/2 -translate-x-1/2 w-[700px] h-[260px] bg-blue-400/10 blur-[90px] rounded-full pointer-events-none" />}{/*#__PURE__*/<div className="max-w-[1280px] mx-auto text-center relative z-10">{/*#__PURE__*/<span className="inline-block px-3.5 py-1 rounded-full text-xs font-bold text-[#2563EB] bg-blue-100/60 border border-blue-200/50 tracking-wider uppercase mb-3.5">EXPLORE TOP COMPANIES</span>}{/*#__PURE__*/<h1 className="text-3xl sm:text-4xl lg:text-[44px] font-black tracking-tight leading-tight mb-3 text-[#0F172A]">Discover Companies {/*#__PURE__*/<span className="text-[#2563EB]">Hiring Now</span>}</h1>}{/*#__PURE__*/<p className="text-sm sm:text-base text-[#64748B] max-w-2xl mx-auto font-normal leading-relaxed">Explore companies, discover their culture and find opportunities that match your career goals.</p>}{/*#__PURE__*/<CompanySearch searchQuery={searchQuery} setSearchQuery={setSearchQuery} selectedIndustry={selectedIndustry} setSelectedIndustry={setSelectedIndustry} onSearchSubmit={onSearchSubmit} />}</div>}</section>;
}

export default CompaniesHero;