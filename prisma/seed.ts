/**
 * Seed script — Jyothilal Reji Digital Portfolio (local SQLite via Prisma).
 * Content lives in prisma/seed-data.ts (shared with the Supabase SQL generator).
 * Run: bun prisma/seed.ts
 */
import { PrismaClient } from "@prisma/client";

import {
  certifications,
  education,
  experience,
  json,
  projectTechMap,
  projects,
  settings,
  technologies,
} from "./seed-data";

const db = new PrismaClient();

/* --------------------------------- runner --------------------------------- */

async function main() {
  console.log("Seeding portfolio database...");

  // Wipe in dependency-safe order
  await db.projectTechnology.deleteMany();
  await db.project.deleteMany();
  await db.technology.deleteMany();
  await db.experience.deleteMany();
  await db.education.deleteMany();
  await db.certification.deleteMany();
  await db.contactRequest.deleteMany();
  await db.siteSetting.deleteMany();

  // Technologies
  for (const t of technologies) {
    await db.technology.create({
      data: {
        id: t.id,
        name: t.name,
        category: t.category,
        description: t.description ?? null,
        usedFor: t.usedFor ? json(t.usedFor) : null,
        sortOrder: t.sortOrder,
      },
    });
  }
  const techByIdOrName = new Map<string, string>();
  for (const t of await db.technology.findMany()) {
    techByIdOrName.set(t.id, t.id);
    techByIdOrName.set(t.name, t.id);
  }
  console.log(`  ✓ ${technologies.length} technologies`);

  // Projects + technology links
  for (const p of projects) {
    await db.project.create({
      data: {
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
      },
    });
    const names = projectTechMap[p.slug] ?? [];
    for (const name of names) {
      const techId = techByIdOrName.get(name);
      if (!techId) {
        console.warn(`    ! technology not found: ${name}`);
        continue;
      }
      await db.projectTechnology.create({ data: { projectId: p.id, technologyId: techId } });
    }
  }
  console.log(`  ✓ ${projects.length} projects with technology links`);

  for (const e of experience) {
    await db.experience.create({ data: e });
  }
  console.log(`  ✓ ${experience.length} experience entries`);

  for (const ed of education) {
    await db.education.create({ data: ed });
  }
  console.log(`  ✓ ${education.length} education entries`);

  for (const c of certifications) {
    await db.certification.create({ data: c });
  }
  console.log(`  ✓ ${certifications.length} certifications`);

  for (const [key, value] of settings) {
    await db.siteSetting.create({ data: { key, value } });
  }
  console.log(`  ✓ ${settings.length} site settings`);

  console.log("Seed complete.");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => db.$disconnect());
