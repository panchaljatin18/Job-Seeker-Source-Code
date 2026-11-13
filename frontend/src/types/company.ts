export interface Company {
  id: string;
  name: string;
  slug: string;
  industry: string;
  location: string;
  companySize: string; // e.g. "10000+ Employees", "51-200", "Startup"
  sizeCategory: "Startup" | "51–200" | "201–500" | "501–1000" | "1000+";
  hiringStatus: "Actively Hiring" | "Hiring Developers" | "Hiring Freshers";
  description: string;
  openJobs: number;
  verified: boolean;
  foundedYear: number;
  website: string;
  skills: string[];
  rating: number;
  logoColor: string;
  logoText: string;
  featured?: boolean;
  benefits?: string[];
  overview?: string;
  culture?: string[];
}

export interface CompanyFiltersState {
  searchQuery: string;
  selectedIndustries: string[];
  selectedLocations: string[];
  selectedSizes: string[];
  selectedHiringStatus: string[];
  sortBy: "popular" | "jobs" | "name" | "recent";
}
