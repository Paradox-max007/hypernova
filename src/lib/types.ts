/* Shared domain types for the portfolio (client + server) */

export interface StepItem {
  title: string;
  detail: string;
}

export interface Metric {
  value: number;
  suffix: string;
  label: string;
}

export interface ProjectTechnologyRef {
  id: string;
  name: string;
  category: string;
}

export interface Project {
  id: string;
  title: string;
  slug: string;
  tagline: string;
  category: string;
  year: string | null;
  description: string | null;
  featured: boolean;
  githubUrl: string | null;
  liveUrl: string | null;
  accentColor: string | null;
  roleNote: string | null;
  sortOrder: number;
  idea: string | null;
  problem: string | null;
  solution: string | null;
  challenges: string | null;
  whatIBuilt: string | null;
  result: string | null;
  architecture: string | null;
  howItWorks: StepItem[];
  features: StepItem[];
  metrics: Metric[];
  technologies: ProjectTechnologyRef[];
}

export interface Technology {
  id: string;
  name: string;
  category: string;
  description: string | null;
  usedFor: string[];
  sortOrder: number;
  projectCount: number;
}

export interface ExperienceHighlight {
  value: number;
  suffix: string;
  label: string;
}

export interface Experience {
  id: string;
  company: string;
  role: string;
  location: string;
  startDate: string;
  endDate: string;
  current: boolean;
  description: string | null;
  responsibilities: string[];
  highlights: ExperienceHighlight[];
  sortOrder: number;
}

export interface Education {
  id: string;
  degree: string;
  institution: string;
  location: string | null;
  startDate: string;
  endDate: string;
  cgpa: string | null;
  description: string | null;
  sortOrder: number;
}

export interface Certification {
  id: string;
  title: string;
  issuer: string;
  date: string | null;
  url: string | null;
  sortOrder: number;
}

export interface LanguageEntry {
  name: string;
  level: string;
}

export interface PortfolioData {
  projects: Project[];
  technologies: Technology[];
  experience: Experience[];
  education: Education[];
  certifications: Certification[];
  settings: Record<string, string>;
}

export interface ContactRequestView {
  id: string;
  name: string;
  email: string;
  company: string | null;
  projectType: string;
  budget: string;
  message: string;
  status: string;
  createdAt: string;
}
