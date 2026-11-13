import fs from "fs";
import path from "path";

const dataDir = path.join(process.cwd(), "src", "data");

function ensureDirectoryExists() {
  if (!fs.existsSync(dataDir)) {
    fs.mkdirSync(dataDir, { recursive: true });
  }
}

function readJsonFile(filename, defaultValue = []) {
  try {
    ensureDirectoryExists();
    const filePath = path.join(dataDir, filename);
    if (!fs.existsSync(filePath)) {
      fs.writeFileSync(filePath, JSON.stringify(defaultValue, null, 2), "utf8");
      return defaultValue;
    }
    const content = fs.readFileSync(filePath, "utf8");
    return JSON.parse(content || "[]");
  } catch (error) {
    console.error(`Error reading ${filename}:`, error);
    return defaultValue;
  }
}

function writeJsonFile(filename, data) {
  try {
    ensureDirectoryExists();
    const filePath = path.join(dataDir, filename);
    fs.writeFileSync(filePath, JSON.stringify(data, null, 2), "utf8");
    return true;
  } catch (error) {
    console.error(`Error writing ${filename}:`, error);
    return false;
  }
}

// Subscribers Store
export function getSubscribers() {
  return readJsonFile("subscribers.json", []);
}

export function addSubscriber(email, preferences = {}) {
  const normalizedEmail = email.trim().toLowerCase();
  const subscribers = getSubscribers();
  const existing = subscribers.find(
    (s) => s.email.toLowerCase() === normalizedEmail
  );

  if (existing) {
    if (existing.status !== "active") {
      existing.status = "active";
      existing.updatedAt = new Date().toISOString();
      writeJsonFile("subscribers.json", subscribers);
      return { subscriber: existing, isNew: false, reactivated: true };
    }
    return { subscriber: existing, isNew: false, reactivated: false };
  }

  const newSub = {
    id: `sub_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
    email: normalizedEmail,
    subscribedAt: new Date().toISOString(),
    status: "active",
    preferences: {
      newJobs: preferences.newJobs ?? true,
      newCompanies: preferences.newCompanies ?? true,
      generalUpdates: preferences.generalUpdates ?? true,
    },
  };

  subscribers.unshift(newSub);
  writeJsonFile("subscribers.json", subscribers);
  return { subscriber: newSub, isNew: true };
}

export function unsubscribeUser(email) {
  const normalizedEmail = email.trim().toLowerCase();
  const subscribers = getSubscribers();
  let updated = false;

  const modified = subscribers.map((sub) => {
    if (sub.email.toLowerCase() === normalizedEmail) {
      updated = true;
      return {
        ...sub,
        status: "unsubscribed",
        unsubscribedAt: new Date().toISOString(),
      };
    }
    return sub;
  });

  if (updated) {
    writeJsonFile("subscribers.json", modified);
  }
  return updated;
}

// Notification Logs Store
export function getNotificationLogs() {
  return readJsonFile("notification_logs.json", []);
}

export function logNotification(entry) {
  const logs = getNotificationLogs();
  const newEntry = {
    id: `notif_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
    timestamp: new Date().toISOString(),
    ...entry,
  };
  logs.unshift(newEntry);
  // Keep last 100 logs
  writeJsonFile("notification_logs.json", logs.slice(0, 100));
  return newEntry;
}

// Dynamic Jobs Store
export function getDynamicJobs() {
  return readJsonFile("dynamic_jobs.json", []);
}

export function addDynamicJob(jobData) {
  const jobs = getDynamicJobs();
  const newJob = {
    id: Date.now(),
    slug: `${(jobData.title || "job")
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")}-${Date.now().toString().slice(-4)}`,
    title: jobData.title,
    company: jobData.company,
    logoColor: jobData.logoColor || "bg-blue-50 text-blue-600 border-blue-100",
    logoText: jobData.logoText || (jobData.company ? jobData.company.charAt(0).toUpperCase() : "J"),
    location: jobData.location || "Remote",
    workType: jobData.workType || "Full Time",
    locationType: jobData.locationType || "On-site",
    salary: jobData.salary || "Not disclosed",
    salaryMin: Number(jobData.salaryMin) || 0,
    salaryMax: Number(jobData.salaryMax) || 0,
    postedDate: "Just now",
    tags: Array.isArray(jobData.tags) ? jobData.tags : (jobData.tags || "").split(",").map((s) => s.trim()).filter(Boolean),
    experience: jobData.experience || "Freshers / Experienced",
    education: jobData.education || "Any Degree",
    description: jobData.description || "",
    verified: true,
    createdAt: new Date().toISOString(),
  };

  jobs.unshift(newJob);
  writeJsonFile("dynamic_jobs.json", jobs);
  return newJob;
}

// Dynamic Companies Store
export function getDynamicCompanies() {
  return readJsonFile("dynamic_companies.json", []);
}

export function addDynamicCompany(companyData) {
  const companies = getDynamicCompanies();
  const newCompany = {
    id: Date.now(),
    name: companyData.name,
    slug: (companyData.name || "company")
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-"),
    industry: companyData.industry || "Technology",
    location: companyData.location || "India",
    website: companyData.website || "https://tecjob.com",
    about: companyData.about || "",
    openJobs: Number(companyData.openJobs) || 1,
    size: companyData.size || "50-200 employees",
    rating: companyData.rating || "4.8",
    logoColor: companyData.logoColor || "bg-indigo-50 text-indigo-600 border-indigo-100",
    logoText: companyData.name ? companyData.name.charAt(0).toUpperCase() : "C",
    createdAt: new Date().toISOString(),
  };

  companies.unshift(newCompany);
  writeJsonFile("dynamic_companies.json", companies);
  return newCompany;
}
