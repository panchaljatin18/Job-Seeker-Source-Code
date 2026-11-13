"use client";

import { SlidersHorizontal, X, RotateCcw } from "lucide-react";

const INDUSTRIES = ["Technology", "IT Services", "Finance", "Healthcare", "E-commerce", "Education", "Consulting", "Marketing"];
const LOCATIONS = ["Ahmedabad", "Bangalore", "Mumbai", "Delhi", "Pune", "Hyderabad", "Chennai", "Remote"];
const SIZES = ["Startup", "51–200", "201–500", "501–1000", "1000+"];
const HIRING_STATUSES = ["Actively Hiring", "Hiring Developers", "Hiring Freshers"];
function CompanyFilters({
  filters,
  setFilters,
  onClearAll,
  isMobileDrawerOpen,
  setIsMobileDrawerOpen,
  totalFilteredCount
}) {
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
  const activeFiltersCount =
    filters.selectedIndustries.length +
    filters.selectedLocations.length +
    filters.selectedSizes.length +
    filters.selectedHiringStatus.length;

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
        title="Filter by Industry"
        options={INDUSTRIES}
        selectedValues={filters.selectedIndustries}
        fieldKey="selectedIndustries"
      />
      <FilterSection
        title="Location"
        options={LOCATIONS}
        selectedValues={filters.selectedLocations}
        fieldKey="selectedLocations"
      />
      <FilterSection
        title="Company Size"
        options={SIZES}
        selectedValues={filters.selectedSizes}
        fieldKey="selectedSizes"
      />
      <FilterSection
        title="Hiring Status"
        options={HIRING_STATUSES}
        selectedValues={filters.selectedHiringStatus}
        fieldKey="selectedHiringStatus"
      />
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
                Show {totalFilteredCount} Companies
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default CompanyFilters;