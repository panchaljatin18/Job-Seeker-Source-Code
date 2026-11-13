export interface Job {
  id: string | number;
  title: string;
  slug: string;
  company: string;
  logoColor: string;
  logoText: string;
  location: string;
  workType: "Full Time" | "Part Time" | "Internship" | "Contract" | "Freelance";
  locationType: "On-site" | "Remote" | "Hybrid";
  salary: string;
  salaryMin: number; // In lakhs (e.g. 4)
  salaryMax: number; // In lakhs (e.g. 8)
  postedDate: string;
  tags: string[];
  experience: "Fresher" | "1–3 Years" | "3–5 Years" | "5+ Years";
  education: "Diploma" | "Bachelor's" | "Master's" | "Any Degree";
  verified?: boolean;
}

export interface JobFiltersState {
  searchQuery: string;
  locationQuery: string;
  selectedLocations: string[];
  selectedJobTypes: string[];
  selectedWorkModes: string[];
  selectedExperiences: string[];
  salaryRange: [number, number];
  selectedEducation: string[];
  selectedSkills: string[];
  sortBy: "latest" | "relevant" | "salary-desc" | "salary-asc";
}
