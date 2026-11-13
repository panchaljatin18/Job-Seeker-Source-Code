"use client";

import React from "react";
import { Search, MapPin, ArrowRight } from "lucide-react";
import { popularSearchTags } from "@/data/jobs";

interface JobSearchBarProps {
  searchQuery: string;
  setSearchQuery: (val: string) => void;
  locationQuery: string;
  setLocationQuery: (val: string) => void;
  onSearchSubmit: (e?: React.FormEvent) => void;
}

export default function JobSearchBar({
  searchQuery,
  setSearchQuery,
  locationQuery,
  setLocationQuery,
  onSearchSubmit,
}: JobSearchBarProps) {
  const handleTagClick = (tag: string) => {
    setSearchQuery(tag);
    onSearchSubmit();
  };

  return (
    <div className="w-full max-w-4xl mx-auto mt-6">
      <form
        onSubmit={(e) => {
          e.preventDefault();
          onSearchSubmit(e);
        }}
        className="bg-white p-2 sm:p-2.5 rounded-2xl sm:rounded-2xl shadow-xl shadow-blue-900/5 border border-slate-200/90 flex flex-col md:flex-row items-stretch gap-2 transition-all"
      >
        <div className="flex-1 flex items-center gap-3 px-3.5 py-2.5 sm:py-2 bg-slate-50/60 hover:bg-slate-50 rounded-xl border border-transparent focus-within:border-blue-200 focus-within:bg-white transition-all">
          <Search className="w-5 h-5 text-[#2563EB] shrink-0" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Job title, skills or company"
            className="w-full bg-transparent text-sm font-medium text-[#0F172A] placeholder:text-slate-400 focus:outline-none"
            aria-label="Job title, skills or company"
          />
        </div>
        <div className="hidden md:block w-[1px] bg-slate-200 my-1" />
        <div className="flex-1 flex items-center gap-3 px-3.5 py-2.5 sm:py-2 bg-slate-50/60 hover:bg-slate-50 rounded-xl border border-transparent focus-within:border-blue-200 focus-within:bg-white transition-all">
          <MapPin className="w-5 h-5 text-[#2563EB] shrink-0" />
          <input
            type="text"
            value={locationQuery}
            onChange={(e) => setLocationQuery(e.target.value)}
            placeholder="City, state or remote"
            className="w-full bg-transparent text-sm font-medium text-[#0F172A] placeholder:text-slate-400 focus:outline-none"
            aria-label="City, state or remote"
          />
        </div>
        <button
          type="submit"
          className="px-6 py-3.5 sm:py-3 bg-[#2563EB] hover:bg-blue-700 active:bg-blue-800 text-white font-semibold text-sm rounded-xl shadow-md shadow-blue-600/25 transition-all flex items-center justify-center gap-2 shrink-0 cursor-pointer hover:shadow-lg hover:shadow-blue-600/35"
        >
          <span>Search Jobs</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </form>

      <div className="mt-4 flex flex-wrap items-center justify-center md:justify-start gap-2 text-xs sm:text-sm">
        <span className="font-semibold text-[#64748B] mr-1">Popular:</span>
        {popularSearchTags.map((tag) => (
          <button
            key={tag}
            type="button"
            onClick={() => handleTagClick(tag)}
            className={`px-3 py-1 rounded-full border text-xs font-medium transition-colors cursor-pointer ${
              searchQuery.toLowerCase() === tag.toLowerCase()
                ? "bg-[#EFF6FF] border-[#2563EB] text-[#2563EB] font-semibold"
                : "bg-white/80 hover:bg-[#EFF6FF] border-slate-200/90 hover:border-blue-200 text-[#475569] hover:text-[#2563EB]"
            }`}
          >
            {tag}
          </button>
        ))}
      </div>
    </div>
  );
}