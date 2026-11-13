"use client";

import { useState, useMemo, useEffect } from "react";
import Navbar from "@/Components/layout/Navbar";
import Footer from "@/Components/layout/Footer";
import JobsHero from "@/sections/JobsPage/JobsHero/JobsHero";
import JobFilters from "@/sections/JobsPage/JobFilters/JobFilters";
import JobList from "@/sections/JobsPage/JobList/JobList";
import JobsCta from "@/sections/JobsPage/JobsCta/JobsCta";
import Pagination from "@/Components/common/Pagination";
import { jobsData } from "@/data/jobs";
import { Job, JobFiltersState } from "@/types/job";

const ITEMS_PER_PAGE = 8;

const initialFiltersState: JobFiltersState = {
  searchQuery: "",
  locationQuery: "",
  selectedLocations: [],
  selectedJobTypes: [],
  selectedWorkModes: [],
  selectedExperiences: [],
  salaryRange: [2, 20],
  selectedEducation: [],
  selectedSkills: [],
  sortBy: "latest",
};

export default function JobsPage() {
  const [allJobs, setAllJobs] = useState<Job[]>(jobsData);
  const [filters, setFilters] = useState<JobFiltersState>(initialFiltersState);
  const [currentPage, setCurrentPage] = useState(1);
  const [isMobileDrawerOpen, setIsMobileDrawerOpen] = useState(false);
  const [savedJobIds, setSavedJobIds] = useState<(string | number)[]>([]);

  useEffect(() => {
    fetch("/api/jobs")
      .then((res) => res.json())
      .then((data) => {
        if (data?.jobs && Array.isArray(data.jobs)) {
          setAllJobs(data.jobs);
        }
      })
      .catch((err) => console.error("Error loading dynamic jobs:", err));
  }, []);

  // Toggle saved job bookmark state
  const handleToggleSaveJob = (id: string | number) => {
    setSavedJobIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const handleSearchSubmit = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setCurrentPage(1);
  };

  const handleClearAll = () => {
    setFilters(initialFiltersState);
    setCurrentPage(1);
  };

  const filteredJobs = useMemo(() => {
    return allJobs.filter((job) => {
      if (filters.searchQuery.trim()) {
        const query = filters.searchQuery.toLowerCase().trim();
        const matchesTitle = job.title.toLowerCase().includes(query);
        const matchesCompany = job.company.toLowerCase().includes(query);
        const matchesTag = job.tags.some((t) => t.toLowerCase().includes(query));
        if (!matchesTitle && !matchesCompany && !matchesTag) return false;
      }

      if (filters.locationQuery.trim()) {
        const locQuery = filters.locationQuery.toLowerCase().trim();
        const matchesLocation = job.location.toLowerCase().includes(locQuery);
        const matchesLocationType = job.locationType.toLowerCase().includes(locQuery);
        if (!matchesLocation && !matchesLocationType) return false;
      }

      if (filters.selectedLocations.length > 0) {
        const matchesLocCheckbox = filters.selectedLocations.some((loc) =>
          job.location.toLowerCase().includes(loc.toLowerCase())
        );
        if (!matchesLocCheckbox) return false;
      }

      if (filters.selectedJobTypes.length > 0) {
        if (!filters.selectedJobTypes.includes(job.workType)) return false;
      }

      if (filters.selectedWorkModes.length > 0) {
        if (!filters.selectedWorkModes.includes(job.locationType)) return false;
      }

      if (filters.selectedExperiences.length > 0) {
        if (!filters.selectedExperiences.includes(job.experience)) return false;
      }

      if (
        job.salaryMin < filters.salaryRange[0] ||
        job.salaryMax > filters.salaryRange[1] + 2
      ) {
        if (
          job.salaryMin > filters.salaryRange[1] ||
          job.salaryMax < filters.salaryRange[0]
        ) {
          return false;
        }
      }

      if (filters.selectedEducation.length > 0) {
        if (!filters.selectedEducation.includes(job.education)) return false;
      }

      if (filters.selectedSkills.length > 0) {
        const hasSkill = filters.selectedSkills.some((skill) =>
          job.tags.some((t) => t.toLowerCase() === skill.toLowerCase())
        );
        if (!hasSkill) return false;
      }

      return true;
    });
  }, [filters]);

  const sortedJobs = useMemo(() => {
    const list = [...filteredJobs];
    if (filters.sortBy === "salary-desc") {
      return list.sort((a, b) => b.salaryMax - a.salaryMax);
    }
    if (filters.sortBy === "salary-asc") {
      return list.sort((a, b) => a.salaryMin - b.salaryMin);
    }
    if (filters.sortBy === "relevant") {
      return list.sort((a, b) => (b.verified ? 1 : 0) - (a.verified ? 1 : 0));
    }
    return list;
  }, [filteredJobs, filters.sortBy]);

  const totalPages = Math.ceil(sortedJobs.length / ITEMS_PER_PAGE);
  const paginatedJobs = useMemo(() => {
    const start = (currentPage - 1) * ITEMS_PER_PAGE;
    return sortedJobs.slice(start, start + ITEMS_PER_PAGE);
  }, [sortedJobs, currentPage]);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    if (typeof window !== "undefined") {
      const el = document.getElementById("main-jobs-content");
      if (el) el.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-white text-[#172033] font-sans antialiased">
      <Navbar />

      <JobsHero
        searchQuery={filters.searchQuery}
        setSearchQuery={(val) => {
          setFilters((prev) => ({ ...prev, searchQuery: val }));
          setCurrentPage(1);
        }}
        locationQuery={filters.locationQuery}
        setLocationQuery={(val) => {
          setFilters((prev) => ({ ...prev, locationQuery: val }));
          setCurrentPage(1);
        }}
        onSearchSubmit={handleSearchSubmit}
      />

      <main
        id="main-jobs-content"
        className="flex-1 max-w-[1280px] w-full mx-auto px-4 sm:px-8 lg:px-12 py-8 sm:py-12"
      >
        <div className="flex flex-col lg:flex-row gap-8 items-start">
          <JobFilters
            filters={filters}
            setFilters={setFilters}
            onClearAll={handleClearAll}
            isMobileDrawerOpen={isMobileDrawerOpen}
            setIsMobileDrawerOpen={setIsMobileDrawerOpen}
            totalFilteredCount={filteredJobs.length}
          />

          <div className="flex-1 w-full min-w-0">
            <JobList
              jobs={paginatedJobs}
              totalJobsCount={filteredJobs.length}
              sortBy={filters.sortBy}
              setSortBy={(val) => setFilters((prev) => ({ ...prev, sortBy: val as any }))}
              onOpenMobileFilters={() => setIsMobileDrawerOpen(true)}
              onClearFilters={handleClearAll}
              savedJobIds={savedJobIds}
              onToggleSaveJob={handleToggleSaveJob}
            />

            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={handlePageChange}
            />
          </div>
        </div>

        <JobsCta />
      </main>

      <Footer />
    </div>
  );
}