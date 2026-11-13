"use client";

import { useState, useMemo, useEffect } from "react";
import Navbar from "@/Components/layout/Navbar";
import Footer from "@/Components/layout/Footer";
import CompaniesHero from "@/sections/CompaniesPage/CompaniesHero/CompaniesHero";
import CompanyStatistics from "@/sections/CompaniesPage/CompanyStatistics/CompanyStatistics";
import TopCompanies from "@/sections/CompaniesPage/TopCompanies/TopCompanies";
import CompanyFilters from "@/sections/CompaniesPage/CompanyFilters/CompanyFilters";
import CompanyGrid from "@/sections/CompaniesPage/CompanyGrid/CompanyGrid";
import IndustrySection from "@/sections/CompaniesPage/IndustrySection/IndustrySection";
import CompaniesCta from "@/sections/CompaniesPage/CompaniesCta/CompaniesCta";
import Pagination from "@/Components/common/Pagination";
import { companiesData } from "@/data/companies";
import { Company, CompanyFiltersState } from "@/types/company";

const ITEMS_PER_PAGE = 9;


const initialFiltersState: CompanyFiltersState = {
  searchQuery: "",
  selectedIndustries: [],
  selectedLocations: [],
  selectedSizes: [],
  selectedHiringStatus: [],
  sortBy: "popular",
};

export default function CompaniesPage() {
  const [allCompanies, setAllCompanies] = useState<Company[]>(companiesData);
  const [filters, setFilters] = useState<CompanyFiltersState>(initialFiltersState);
  const [currentPage, setCurrentPage] = useState(1);
  const [isMobileDrawerOpen, setIsMobileDrawerOpen] = useState(false);
  const [selectedIndustryTag, setSelectedIndustryTag] = useState("");

  useEffect(() => {
    fetch("/api/companies")
      .then((res) => res.json())
      .then((data) => {
        if (data?.companies && Array.isArray(data.companies)) {
          setAllCompanies(data.companies);
        }
      })
      .catch((err) => console.error("Error loading dynamic companies:", err));
  }, []);

  const handleSearchSubmit = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setCurrentPage(1);
  };

  const handleClearAll = () => {
    setFilters(initialFiltersState);
    setSelectedIndustryTag("");
    setCurrentPage(1);
  };

  const filteredCompanies = useMemo(() => {
    return allCompanies.filter((comp) => {
      if (filters.searchQuery.trim()) {
        const query = filters.searchQuery.toLowerCase().trim();
        const matchesName = comp.name.toLowerCase().includes(query);
        const matchesIndustry = comp.industry.toLowerCase().includes(query);
        const matchesSkills = comp.skills.some((s) => s.toLowerCase().includes(query));
        const matchesLocation = comp.location.toLowerCase().includes(query);
        if (!matchesName && !matchesIndustry && !matchesSkills && !matchesLocation) {
          return false;
        }
      }

      if (selectedIndustryTag) {
        if (comp.industry.toLowerCase() !== selectedIndustryTag.toLowerCase()) {
          return false;
        }
      }

      if (filters.selectedIndustries.length > 0) {
        const matchesInd = filters.selectedIndustries.some((ind) =>
          comp.industry.toLowerCase().includes(ind.toLowerCase())
        );
        if (!matchesInd) return false;
      }

      if (filters.selectedLocations.length > 0) {
        const matchesLoc = filters.selectedLocations.some((loc) =>
          comp.location.toLowerCase().includes(loc.toLowerCase())
        );
        if (!matchesLoc) return false;
      }

      if (filters.selectedSizes.length > 0) {
        if (!filters.selectedSizes.includes(comp.sizeCategory)) return false;
      }

      if (filters.selectedHiringStatus.length > 0) {
        if (!filters.selectedHiringStatus.includes(comp.hiringStatus)) return false;
      }

      return true;
    });
  }, [filters, selectedIndustryTag]);

  const sortedCompanies = useMemo(() => {
    const list = [...filteredCompanies];
    if (filters.sortBy === "jobs") {
      return list.sort((a, b) => b.openJobs - a.openJobs);
    }
    if (filters.sortBy === "name") {
      return list.sort((a, b) => a.name.localeCompare(b.name));
    }
    if (filters.sortBy === "recent") {
      return list.sort((a, b) => b.foundedYear - a.foundedYear);
    }
    return list.sort((a, b) => b.rating - a.rating);
  }, [filteredCompanies, filters.sortBy]);

  const totalPages = Math.ceil(sortedCompanies.length / ITEMS_PER_PAGE);
  const paginatedCompanies = useMemo(() => {
    const start = (currentPage - 1) * ITEMS_PER_PAGE;
    return sortedCompanies.slice(start, start + ITEMS_PER_PAGE);
  }, [sortedCompanies, currentPage]);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    if (typeof window !== "undefined") {
      const el = document.getElementById("main-companies-content");
      if (el) el.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-white text-[#172033] font-sans antialiased">
      <Navbar />

      <CompaniesHero
        searchQuery={filters.searchQuery}
        setSearchQuery={(val) => {
          setFilters((prev) => ({ ...prev, searchQuery: val }));
          setCurrentPage(1);
        }}
        selectedIndustry={selectedIndustryTag}
        setSelectedIndustry={(ind) => {
          setSelectedIndustryTag(ind);
          setCurrentPage(1);
        }}
        onSearchSubmit={handleSearchSubmit}
      />

      <CompanyStatistics />

      <TopCompanies companies={companiesData} />

      <main
        id="main-companies-content"
        className="flex-1 max-w-[1280px] w-full mx-auto px-4 sm:px-8 lg:px-12 py-6"
      >
        <div className="flex flex-col lg:flex-row gap-8 items-start">
          <CompanyFilters
            filters={filters}
            setFilters={setFilters}
            onClearAll={handleClearAll}
            isMobileDrawerOpen={isMobileDrawerOpen}
            setIsMobileDrawerOpen={setIsMobileDrawerOpen}
            totalFilteredCount={filteredCompanies.length}
          />

          <div className="flex-1 w-full min-w-0">
            <CompanyGrid
              companies={paginatedCompanies}
              totalCompaniesCount={filteredCompanies.length}
              sortBy={filters.sortBy}
              setSortBy={(val) => setFilters((prev) => ({ ...prev, sortBy: val as any }))}
              onOpenMobileFilters={() => setIsMobileDrawerOpen(true)}
              onClearFilters={handleClearAll}
            />

            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={handlePageChange}
            />
          </div>
        </div>
      </main>

      <IndustrySection
        onSelectIndustry={(ind) => {
          setSelectedIndustryTag(ind);
          if (typeof window !== "undefined") {
            const el = document.getElementById("main-companies-content");
            if (el) el.scrollIntoView({ behavior: "smooth" });
          }
        }}
      />

      <CompaniesCta />

      <Footer />
    </div>
  );
}