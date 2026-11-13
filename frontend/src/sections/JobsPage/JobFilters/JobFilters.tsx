"use client";

import React, { useState } from "react";
import { SlidersHorizontal, X, RotateCcw, Search } from "lucide-react";

const LOCATIONS = ["Ahmedabad", "Bangalore", "Mumbai", "Delhi", "Pune", "Remote"];
const JOB_TYPES = ["Full Time", "Part Time", "Internship", "Contract", "Freelance"];
const WORK_MODES = ["On-site", "Remote", "Hybrid"];
const EXPERIENCES = ["Fresher", "1–3 Years", "3–5 Years", "5+ Years"];
const EDUCATIONS = ["Diploma", "Bachelor's", "Master's", "Any Degree"];
const ALL_SKILLS = ["React", "JavaScript", "Node.js", "Python", "PHP", "SQL", "Next.js", "TypeScript", "Tailwind", "MongoDB", "Java", "AWS", "Figma"];
function JobFilters({
  filters,
  setFilters,
  onClearAll,
  isMobileDrawerOpen,
  setIsMobileDrawerOpen,
  totalFilteredCount
}) {
  const [skillSearchQuery, setSkillSearchQuery] = useState("");
  const toggleArrayFilter = (field, value) => {
    setFilters(prev => {
      const currentList = prev[field] || [];
      const exists = currentList.includes(value);
      const updated = exists ? currentList.filter(item => item !== value) : [...currentList, value];
      return {
        ...prev,
        [field]: updated
      };
    });
  };
  const handleSalaryChange = (index, value) => {
    setFilters(prev => {
      const newSalary = [...prev.salaryRange];
      newSalary[index] = value;
      if (newSalary[0] > newSalary[1]) {
        if (index === 0) newSalary[1] = newSalary[0];else newSalary[0] = newSalary[1];
      }
      return {
        ...prev,
        salaryRange: newSalary
      };
    });
  };
  const filteredSkills = ALL_SKILLS.filter(s => s.toLowerCase().includes(skillSearchQuery.toLowerCase()));
  const activeFiltersCount = filters.selectedLocations.length + filters.selectedJobTypes.length + filters.selectedWorkModes.length + filters.selectedExperiences.length + filters.selectedEducation.length + filters.selectedSkills.length + (filters.salaryRange[0] > 2 || filters.salaryRange[1] < 20 ? 1 : 0);
  const FilterSection = ({
    title,
    options,
    selectedValues,
    fieldKey,
  }: {
    title: string;
    options: string[];
    selectedValues: string[];
    fieldKey: keyof typeof filters;
  }) => (
    <div className="py-4 border-b border-slate-100 last:border-b-0">
      <h4 className="text-xs font-bold text-[#0F172A] tracking-wider uppercase mb-3">
        {title}
      </h4>
      <div className="space-y-2 max-h-48 overflow-y-auto pr-1 custom-scrollbar">
        {options.map((opt) => {
          const isChecked = selectedValues.includes(opt);
          return (
            <label
              key={opt}
              className="flex items-center gap-2.5 text-sm text-[#475569] hover:text-[#0F172A] cursor-pointer group"
            >
              <input
                type="checkbox"
                checked={isChecked}
                onChange={() => toggleArrayFilter(fieldKey, opt)}
                className="w-4 h-4 rounded text-[#2563EB] border-slate-300 focus:ring-[#2563EB] focus:ring-offset-0 cursor-pointer accent-[#2563EB]"
              />
              <span
                className={`transition-colors ${
                  isChecked ? "font-semibold text-[#2563EB]" : ""
                }`}
              >
                {opt}
              </span>
            </label>
          );
        })}
      </div>
    </div>
  );

  const FilterContent = () => (
    <div className="divide-y divide-slate-100">
      <FilterSection
        title="Location"
        options={LOCATIONS}
        selectedValues={filters.selectedLocations}
        fieldKey="selectedLocations"
      />
      <FilterSection
        title="Job Type"
        options={JOB_TYPES}
        selectedValues={filters.selectedJobTypes}
        fieldKey="selectedJobTypes"
      />
      <FilterSection
        title="Work Mode"
        options={WORK_MODES}
        selectedValues={filters.selectedWorkModes}
        fieldKey="selectedWorkModes"
      />
      <FilterSection
        title="Experience"
        options={EXPERIENCES}
        selectedValues={filters.selectedExperiences}
        fieldKey="selectedExperiences"
      />

      <div className="py-4 border-b border-slate-100">
        <div className="flex items-center justify-between mb-2">
          <h4 className="text-xs font-bold text-[#0F172A] tracking-wider uppercase">
            Salary Range
          </h4>
          <span className="text-xs font-semibold text-[#2563EB]">
            ₹{filters.salaryRange[0]}L – ₹{filters.salaryRange[1]}L
          </span>
        </div>
        <div className="space-y-3 mt-3">
          <div className="flex items-center gap-3">
            <div className="flex-1">
              <label className="text-[11px] text-slate-400 block mb-1">
                Min: ₹{filters.salaryRange[0]}L
              </label>
              <input
                type="range"
                min={2}
                max={20}
                step={1}
                value={filters.salaryRange[0]}
                onChange={(e) => handleSalaryChange(0, Number(e.target.value))}
                className="w-full accent-[#2563EB] bg-slate-200 h-1.5 rounded-lg cursor-pointer"
              />
            </div>
            <div className="flex-1">
              <label className="text-[11px] text-slate-400 block mb-1 text-right">
                Max: ₹{filters.salaryRange[1]}L
              </label>
              <input
                type="range"
                min={2}
                max={20}
                step={1}
                value={filters.salaryRange[1]}
                onChange={(e) => handleSalaryChange(1, Number(e.target.value))}
                className="w-full accent-[#2563EB] bg-slate-200 h-1.5 rounded-lg cursor-pointer"
              />
            </div>
          </div>
          <div className="flex justify-between text-[11px] font-medium text-slate-400 pt-1">
            <span>₹2L</span>
            <span>₹10L</span>
            <span>₹20L+</span>
          </div>
        </div>
      </div>

      <FilterSection
        title="Education"
        options={EDUCATIONS}
        selectedValues={filters.selectedEducation}
        fieldKey="selectedEducation"
      />

      <div className="py-4">
        <h4 className="text-xs font-bold text-[#0F172A] tracking-wider uppercase mb-2.5">
          Skills
        </h4>
        <div className="relative mb-3">
          <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search skills..."
            value={skillSearchQuery}
            onChange={(e) => setSkillSearchQuery(e.target.value)}
            className="w-full pl-8 pr-3 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-xs text-[#0F172A] focus:outline-none focus:border-[#2563EB]"
          />
        </div>
        <div className="space-y-2 max-h-40 overflow-y-auto pr-1">
          {filteredSkills.map((skill) => {
            const isChecked = filters.selectedSkills.includes(skill);
            return (
              <label
                key={skill}
                className="flex items-center gap-2.5 text-sm text-[#475569] hover:text-[#0F172A] cursor-pointer"
              >
                <input
                  type="checkbox"
                  checked={isChecked}
                  onChange={() => toggleArrayFilter("selectedSkills", skill)}
                  className="w-4 h-4 rounded text-[#2563EB] border-slate-300 focus:ring-[#2563EB] cursor-pointer accent-[#2563EB]"
                />
                <span
                  className={isChecked ? "font-semibold text-[#2563EB]" : ""}
                >
                  {skill}
                </span>
              </label>
            );
          })}
        </div>
      </div>
    </div>
  );

  return (
    <div>
      <aside className="hidden lg:block w-[280px] xl:w-[300px] shrink-0 sticky top-24 h-fit">
        <div className="bg-white border border-[#E2E8F0] rounded-2xl p-5 shadow-xs">
          <div className="flex items-center justify-between pb-4 border-b border-slate-100 mb-2">
            <div className="flex items-center gap-2">
              <SlidersHorizontal className="w-4 h-4 text-[#2563EB]" />
              <h3 className="font-bold text-base text-[#0F172A]">Filters</h3>
              {activeFiltersCount > 0 && (
                <span className="w-5 h-5 rounded-full bg-[#2563EB] text-white text-xs font-semibold flex items-center justify-center">
                  {activeFiltersCount}
                </span>
              )}
            </div>
            <button
              onClick={onClearAll}
              className="text-xs font-semibold text-[#2563EB] hover:text-blue-700 transition-colors cursor-pointer inline-flex items-center gap-1"
            >
              <RotateCcw className="w-3 h-3" /> Clear All
            </button>
          </div>
          <FilterContent />
        </div>
      </aside>

      {isMobileDrawerOpen && (
        <div className="fixed inset-0 z-50 lg:hidden flex justify-end">
          <div
            onClick={() => setIsMobileDrawerOpen(false)}
            className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs transition-opacity"
          />
          <div className="relative w-full max-w-xs sm:max-w-sm bg-white h-full shadow-2xl flex flex-col z-10 animate-in slide-in-from-right duration-200">
            <div className="flex items-center justify-between p-4 border-b border-slate-100 bg-white">
              <div className="flex items-center gap-2">
                <SlidersHorizontal className="w-4 h-4 text-[#2563EB]" />
                <h3 className="font-bold text-base text-[#0F172A]">Filters</h3>
                {activeFiltersCount > 0 && (
                  <span className="w-5 h-5 rounded-full bg-[#2563EB] text-white text-xs font-semibold flex items-center justify-center">
                    {activeFiltersCount}
                  </span>
                )}
              </div>
              <div className="flex items-center gap-3">
                <button
                  onClick={onClearAll}
                  className="text-xs font-semibold text-[#2563EB] hover:underline"
                >
                  Clear All
                </button>
                <button
                  onClick={() => setIsMobileDrawerOpen(false)}
                  className="p-1.5 text-slate-400 hover:text-slate-700 rounded-lg hover:bg-slate-100"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>
            <div className="flex-1 overflow-y-auto p-4 space-y-2">
              <FilterContent />
            </div>
            <div className="p-4 border-t border-slate-100 bg-white shadow-md">
              <button
                onClick={() => setIsMobileDrawerOpen(false)}
                className="w-full py-3 bg-[#2563EB] hover:bg-blue-700 text-white font-semibold text-sm rounded-xl shadow-md transition-colors"
              >
                Show {totalFilteredCount} Jobs
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default JobFilters;