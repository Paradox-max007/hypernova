/**
 * Generates db/supabase-setup.sql — a complete, self-contained PostgreSQL setup
 * script (schema + seed content) for deploying the portfolio to Supabase, which
 * is then connected to Vercel via the DATABASE_URL environment variable.
 *
 * Run: bun scripts/generate-supabase-sql.ts
 *
 * The generated SQL is idempotent: re-running it resets the database back to
 * the seed state (⚠️ it drops existing rows first).
 */
import { writeFileSync } from "node:fs";
import { certifications, education, experience, projectTechMap, projects, settings, technologies } from "../prisma/seed-data";

/* ------------------------------ sql helpers ------------------------------- */

const lit = (v: unknown): string => {
  if (v === null || v === undefined) return "NULL";
  if (typeof v === "boolean") return v ? "TRUE" : "FALSE";
  if (typeof v === "number") return String(v);
  return "'" + String(v).replace(/'/g, "''") + "'";
};

const q = (name: string) => `"${name}"`;

function insert(table: string, row: Record<string, unknown>): string {
  const cols = Object.keys(row).map(q).join(", ");
  const vals = Object.values(row).map(lit).join(", ");
  return `INSERT INTO ${q(table)} (${cols}) VALUES (${vals});`;
}

/* --------------------------------- header --------------------------------- */

const out: string[] = [];
out.push(`-- ============================================================
-- Jyothilal Reji — Digital Portfolio · database setup (PostgreSQL)
-- ============================================================
-- Where to run this:
--   Supabase → your project → SQL Editor → New query → paste → Run.
--
-- What it does:
--   1. Drops the portfolio tables (⚠️ resets existing data)
--   2. Recreates the schema (matches prisma/schema.pg.prisma exactly)
--   3. Seeds all content: projects, technologies, experience,
--      education, certifications and site settings
--
-- After running: copy the "Session pooler" connection string from
-- Supabase → Project Settings → Database and set it as DATABASE_URL
-- in your Vercel project. See README.md for the full walkthrough.
-- ============================================================

-- ------------------------------ clean slate ------------------------------
DROP TABLE IF EXISTS "project_technologies" CASCADE;
DROP TABLE IF EXISTS "projects" CASCADE;
DROP TABLE IF EXISTS "technologies" CASCADE;
DROP TABLE IF EXISTS "experience" CASCADE;
DROP TABLE IF EXISTS "education" CASCADE;
DROP TABLE IF EXISTS "certifications" CASCADE;
DROP TABLE IF EXISTS "contact_requests" CASCADE;
DROP TABLE IF EXISTS "site_settings" CASCADE;

-- -------------------------------- schema ---------------------------------
CREATE TABLE "projects" (
  "id"           TEXT PRIMARY KEY,
  "title"        TEXT NOT NULL,
  "slug"         TEXT NOT NULL UNIQUE,
  "tagline"      TEXT NOT NULL,
  "category"     TEXT NOT NULL,
  "year"         TEXT,
  "description"  TEXT,
  "featured"     BOOLEAN NOT NULL DEFAULT FALSE,
  "githubUrl"    TEXT,
  "liveUrl"      TEXT,
  "accentColor"  TEXT,
  "roleNote"     TEXT,
  "sortOrder"    INTEGER NOT NULL DEFAULT 0,
  "idea"         TEXT,
  "problem"      TEXT,
  "solution"     TEXT,
  "howItWorks"   TEXT,
  "features"     TEXT,
  "challenges"   TEXT,
  "whatIBuilt"   TEXT,
  "result"       TEXT,
  "architecture" TEXT,
  "metrics"      TEXT,
  "createdAt"    TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt"    TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE "technologies" (
  "id"          TEXT PRIMARY KEY,
  "name"        TEXT NOT NULL UNIQUE,
  "category"    TEXT NOT NULL,
  "description" TEXT,
  "usedFor"     TEXT,
  "sortOrder"   INTEGER NOT NULL DEFAULT 0
);

CREATE TABLE "project_technologies" (
  "projectId"    TEXT NOT NULL REFERENCES "projects"("id") ON DELETE CASCADE ON UPDATE CASCADE,
  "technologyId" TEXT NOT NULL REFERENCES "technologies"("id") ON DELETE CASCADE ON UPDATE CASCADE,
  PRIMARY KEY ("projectId", "technologyId")
);

CREATE TABLE "experience" (
  "id"              TEXT PRIMARY KEY,
  "company"         TEXT NOT NULL,
  "role"            TEXT NOT NULL,
  "location"        TEXT NOT NULL,
  "startDate"       TEXT NOT NULL,
  "endDate"         TEXT NOT NULL,
  "current"         BOOLEAN NOT NULL DEFAULT TRUE,
  "description"     TEXT,
  "responsibilities" TEXT,
  "highlights"      TEXT,
  "sortOrder"       INTEGER NOT NULL DEFAULT 0
);

CREATE TABLE "education" (
  "id"          TEXT PRIMARY KEY,
  "degree"      TEXT NOT NULL,
  "institution" TEXT NOT NULL,
  "location"    TEXT,
  "startDate"   TEXT NOT NULL,
  "endDate"     TEXT NOT NULL,
  "cgpa"        TEXT,
  "description" TEXT,
  "sortOrder"   INTEGER NOT NULL DEFAULT 0
);

CREATE TABLE "certifications" (
  "id"        TEXT PRIMARY KEY,
  "title"     TEXT NOT NULL,
  "issuer"    TEXT NOT NULL,
  "date"      TEXT,
  "url"       TEXT,
  "sortOrder" INTEGER NOT NULL DEFAULT 0
);

CREATE TABLE "contact_requests" (
  "id"          TEXT PRIMARY KEY,
  "name"        TEXT NOT NULL,
  "email"       TEXT NOT NULL,
  "company"     TEXT,
  "projectType" TEXT NOT NULL,
  "budget"      TEXT NOT NULL,
  "message"     TEXT NOT NULL,
  "status"      TEXT NOT NULL DEFAULT 'new',
  "createdAt"   TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE "site_settings" (
  "key"   TEXT PRIMARY KEY,
  "value" TEXT NOT NULL
);

-- Lock the tables away from Supabase's public API (the app connects
-- through Prisma with the postgres role, which owns these tables).
ALTER TABLE "projects"            ENABLE ROW LEVEL SECURITY;
ALTER TABLE "technologies"        ENABLE ROW LEVEL SECURITY;
ALTER TABLE "project_technologies" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "experience"          ENABLE ROW LEVEL SECURITY;
ALTER TABLE "education"           ENABLE ROW LEVEL SECURITY;
ALTER TABLE "certifications"      ENABLE ROW LEVEL SECURITY;
ALTER TABLE "contact_requests"    ENABLE ROW LEVEL SECURITY;
ALTER TABLE "site_settings"       ENABLE ROW LEVEL SECURITY;
`);

/* --------------------------------- seed ----------------------------------- */

out.push("\n-- -------------------------------- content --------------------------------\n");

out.push("-- Projects");
for (const p of projects) {
  out.push(
    insert("projects", {
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
      howItWorks: p.howItWorks,
      features: p.features,
      challenges: p.challenges,
      whatIBuilt: p.whatIBuilt,
      result: p.result,
      architecture: p.architecture,
      metrics: p.metrics,
    }),
  );
}

out.push("\n-- Technologies");
for (const t of technologies) {
  out.push(
    insert("technologies", {
      id: t.id,
      name: t.name,
      category: t.category,
      description: t.description ?? null,
      usedFor: t.usedFor ? JSON.stringify(t.usedFor) : null,
      sortOrder: t.sortOrder,
    }),
  );
}

out.push("\n-- Project ↔ technology links");
const techByName = new Map(technologies.map((t) => [t.name, t.id]));
for (const p of projects) {
  for (const name of projectTechMap[p.slug] ?? []) {
    const techId = techByName.get(name);
    if (!techId) continue;
    out.push(insert("project_technologies", { projectId: p.id, technologyId: techId }));
  }
}

out.push("\n-- Experience");
for (const e of experience) {
  out.push(insert("experience", { ...e }));
}

out.push("\n-- Education");
for (const ed of education) {
  out.push(insert("education", { ...ed }));
}

out.push("\n-- Certifications");
for (const c of certifications) {
  out.push(insert("certifications", { ...c }));
}

out.push("\n-- Site settings");
for (const [key, value] of settings) {
  out.push(insert("site_settings", { key, value }));
}

out.push(
  `
-- --------------------------------- done ----------------------------------
-- The portfolio database is ready. Contact requests submitted through the
-- site will land in the "contact_requests" table (visible in the admin CMS
-- at /#/admin → Requests after deployment).
`,
);

/* --------------------------------- write ---------------------------------- */

const target = new URL("../db/supabase-setup.sql", import.meta.url).pathname;
writeFileSync(target, out.join("\n") + "\n", "utf8");
console.log(`✓ wrote ${target} (${out.length} statements)`);
