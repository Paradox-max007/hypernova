/* Server-side portfolio data loader — single source feeding the whole site */
import { db } from "@/lib/db";
import type {
  Certification,
  Education,
  Experience,
  ExperienceHighlight,
  LanguageEntry,
  Metric,
  PortfolioData,
  Project,
  StepItem,
  Technology,
} from "@/lib/types";

/* ------------------------------ JSON parsing ----------------------------- */

function safeParse<T>(value: string | null | undefined, fallback: T): T {
  if (!value) return fallback;
  try {
    return JSON.parse(value) as T;
  } catch {
    return fallback;
  }
}

export function parseSteps(value: string | null | undefined): StepItem[] {
  return safeParse<StepItem[]>(value, []);
}

export function parseMetrics(value: string | null | undefined): Metric[] {
  return safeParse<Metric[]>(value, []);
}

export function parseStrings(value: string | null | undefined): string[] {
  return safeParse<string[]>(value, []);
}

export function parseHighlights(value: string | null | undefined): ExperienceHighlight[] {
  return safeParse<ExperienceHighlight[]>(value, []);
}

export function parseLanguages(value: string | null | undefined): LanguageEntry[] {
  return safeParse<LanguageEntry[]>(value, []);
}

/* -------------------------------- loaders -------------------------------- */

export async function getPortfolioData(): Promise<PortfolioData> {
  const [projectRows, technologyRows, experienceRows, educationRows, certificationRows, settingRows] =
    await Promise.all([
      db.project.findMany({
        orderBy: [{ sortOrder: "asc" }],
        include: {
          technologies: {
            include: { technology: true },
            orderBy: [{ technology: { sortOrder: "asc" } }],
          },
        },
      }),
      db.technology.findMany({
        orderBy: [{ sortOrder: "asc" }],
        include: { projects: true },
      }),
      db.experience.findMany({ orderBy: [{ sortOrder: "asc" }] }),
      db.education.findMany({ orderBy: [{ sortOrder: "asc" }] }),
      db.certification.findMany({ orderBy: [{ sortOrder: "asc" }] }),
      db.siteSetting.findMany(),
    ]);

  const projects: Project[] = projectRows.map((p) => ({
    id: p.id,
    title: p.title,
    slug: p.slug,
    tagline: p.tagline,
    category: p.category,
    year: p.year,
    description: p.description,
    featured: p.featured,
    githubUrl: p.githubUrl,
    liveUrl: p.liveUrl,
    accentColor: p.accentColor,
    roleNote: p.roleNote,
    sortOrder: p.sortOrder,
    idea: p.idea,
    problem: p.problem,
    solution: p.solution,
    challenges: p.challenges,
    whatIBuilt: p.whatIBuilt,
    result: p.result,
    architecture: p.architecture,
    howItWorks: parseSteps(p.howItWorks),
    features: parseSteps(p.features),
    metrics: parseMetrics(p.metrics),
    technologies: p.technologies.map((pt) => ({
      id: pt.technology.id,
      name: pt.technology.name,
      category: pt.technology.category,
    })),
  }));

  const technologies: Technology[] = technologyRows.map((t) => ({
    id: t.id,
    name: t.name,
    category: t.category,
    description: t.description,
    usedFor: parseStrings(t.usedFor),
    sortOrder: t.sortOrder,
    projectCount: t.projects.length,
  }));

  const experience: Experience[] = experienceRows.map((e) => ({
    id: e.id,
    company: e.company,
    role: e.role,
    location: e.location,
    startDate: e.startDate,
    endDate: e.endDate,
    current: e.current,
    description: e.description,
    responsibilities: parseStrings(e.responsibilities),
    highlights: parseHighlights(e.highlights),
    sortOrder: e.sortOrder,
  }));

  const education: Education[] = educationRows.map((ed) => ({
    id: ed.id,
    degree: ed.degree,
    institution: ed.institution,
    location: ed.location,
    startDate: ed.startDate,
    endDate: ed.endDate,
    cgpa: ed.cgpa,
    description: ed.description,
    sortOrder: ed.sortOrder,
  }));

  const certifications: Certification[] = certificationRows.map((c) => ({
    id: c.id,
    title: c.title,
    issuer: c.issuer,
    date: c.date,
    url: c.url,
    sortOrder: c.sortOrder,
  }));

  const settings: Record<string, string> = {};
  for (const s of settingRows) settings[s.key] = s.value;

  return { projects, technologies, experience, education, certifications, settings };
}

export function getLanguages(settings: Record<string, string>): LanguageEntry[] {
  return parseLanguages(settings["languages"]);
}
