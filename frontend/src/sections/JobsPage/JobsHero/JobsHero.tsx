"use client";

import JobSearchBar from "./JobSearchBar";

function JobsHero({
  searchQuery,
  setSearchQuery,
  locationQuery,
  setLocationQuery,
  onSearchSubmit
}) {
  return /*#__PURE__*/<section className="relative bg-gradient-to-b from-[#EFF6FF] via-[#F8FAFC] to-white border-b border-slate-100 pt-10 pb-12 sm:pt-12 sm:pb-14 px-4 sm:px-8 lg:px-12 overflow-hidden">{/*#__PURE__*/<div className="absolute -top-24 left-1/2 -translate-x-1/2 w-[800px] h-[300px] bg-blue-400/10 blur-[100px] rounded-full pointer-events-none" />}{/*#__PURE__*/<div className="max-w-[1280px] mx-auto text-center relative z-10">{/*#__PURE__*/<span className="inline-block px-3.5 py-1 rounded-full text-xs font-bold text-[#2563EB] bg-blue-100/60 border border-blue-200/50 tracking-wider uppercase mb-3.5">EXPLORE CAREER OPPORTUNITIES</span>}{/*#__PURE__*/<h1 className="text-3xl sm:text-4xl lg:text-[42px] font-black text-[#0F172A] tracking-tight leading-tight mb-3">Find Your Next {/*#__PURE__*/<span className="text-[#2563EB]">Opportunity</span>}</h1>}{/*#__PURE__*/<p className="text-sm sm:text-base text-[#64748B] max-w-2xl mx-auto font-normal leading-relaxed">Discover jobs that match your skills, experience, location and career goals.</p>}{/*#__PURE__*/<JobSearchBar searchQuery={searchQuery} setSearchQuery={setSearchQuery} locationQuery={locationQuery} setLocationQuery={setLocationQuery} onSearchSubmit={onSearchSubmit} />}</div>}</section>;
}

export default JobsHero;