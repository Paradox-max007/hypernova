import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { tokenFromRequest, verifyToken } from "@/lib/admin-auth";
import { getPortfolioData } from "@/lib/portfolio-data";

/* ------------------------------- entity spec ------------------------------ */

type Spec = { strings: string[]; numbers: string[]; bools: string[]; required: string[] };

const SPECS: Record<string, Spec> = {
  projects: {
    strings: [
      "title", "slug", "tagline", "category", "year", "description", "githubUrl", "liveUrl",
      "accentColor", "roleNote", "idea", "problem", "solution", "howItWorks", "features",
      "challenges", "whatIBuilt", "result", "architecture", "metrics",
    ],
    numbers: ["sortOrder"],
    bools: ["featured"],
    required: ["title", "slug", "tagline", "category"],
  },
  technologies: {
    strings: ["name", "category", "description", "usedFor"],
    numbers: ["sortOrder"],
    bools: [],
    required: ["name", "category"],
  },
  experience: {
    strings: ["company", "role", "location", "startDate", "endDate", "description", "responsibilities", "highlights"],
    numbers: ["sortOrder"],
    bools: ["current"],
    required: ["company", "role", "location", "startDate", "endDate"],
  },
  education: {
    strings: ["degree", "institution", "location", "startDate", "endDate", "cgpa", "description"],
    numbers: ["sortOrder"],
    bools: [],
    required: ["degree", "institution", "startDate", "endDate"],
  },
  certifications: {
    strings: ["title", "issuer", "date", "url"],
    numbers: ["sortOrder"],
    bools: [],
    required: ["title", "issuer"],
  },
};

/* --------------------------------- helpers -------------------------------- */

const bad = (message: string, status = 400) => NextResponse.json({ error: message }, { status });

function sanitize(spec: Spec, body: Record<string, unknown>): Record<string, unknown> {
  const data: Record<string, unknown> = {};
  for (const f of spec.strings) {
    if (!(f in body)) continue;
    const raw = body[f];
    if (raw === null) {
      data[f] = null;
    } else if (typeof raw === "string") {
      const v = raw.trim();
      data[f] = v === "" ? null : v;
    }
  }
  for (const f of spec.numbers) {
    if (!(f in body) || body[f] === null || body[f] === "") continue;
    const n = Number(body[f]);
    if (!Number.isNaN(n)) data[f] = Math.trunc(n);
  }
  for (const f of spec.bools) {
    if (f in body) data[f] = Boolean(body[f]);
  }
  return data;
}

function delegateFor(entity: string) {
  switch (entity) {
    case "projects": return db.project;
    case "technologies": return db.technology;
    case "experience": return db.experience;
    case "education": return db.education;
    case "certifications": return db.certification;
    default: return null;
  }
}

async function syncProjectTechnologies(projectId: string, ids: unknown) {
  if (!Array.isArray(ids)) return;
  const valid = ids.filter((x): x is string => typeof x === "string" && x.length > 0);
  await db.projectTechnology.deleteMany({ where: { projectId } });
  if (valid.length > 0) {
    await db.projectTechnology.createMany({
      data: valid.map((technologyId) => ({ projectId, technologyId })),
    });
  }
}

async function listRequests() {
  const rows = await db.contactRequest.findMany({ orderBy: { createdAt: "desc" } });
  return rows.map((r) => ({ ...r, createdAt: r.createdAt.toISOString() }));
}

const isPrismaKnown = (e: unknown): e is { code: string; message: string } =>
  typeof e === "object" && e !== null && "code" in e;

/* --------------------------------- handlers ------------------------------- */

type Ctx = { params: Promise<{ entity: string }> };

export async function GET(req: NextRequest, ctx: Ctx) {
  if (!verifyToken(tokenFromRequest(req))) return bad("Unauthorized", 401);
  const { entity } = await ctx.params;

  try {
    if (entity === "data") {
      const [data, requests] = await Promise.all([getPortfolioData(), listRequests()]);
      return NextResponse.json({ data, requests });
    }
    if (entity === "requests") {
      return NextResponse.json({ requests: await listRequests() });
    }
    if (entity === "settings") {
      return NextResponse.json({ settings: await db.siteSetting.findMany() });
    }
    const spec = SPECS[entity];
    const delegate = delegateFor(entity);
    if (!spec || !delegate) return bad("Unknown entity", 404);

    if (entity === "projects") {
      const rows = await db.project.findMany({
        orderBy: [{ sortOrder: "asc" }],
        include: { technologies: { select: { technologyId: true } } },
      });
      return NextResponse.json({ rows });
    }
    const rows = await (delegate as unknown as { findMany: (a?: unknown) => Promise<unknown[]> }).findMany({
      orderBy: { sortOrder: "asc" },
    });
    return NextResponse.json({ rows });
  } catch (e) {
    console.error(`Admin GET ${entity} failed:`, e);
    return bad("Server error", 500);
  }
}

export async function POST(req: NextRequest, ctx: Ctx) {
  if (!verifyToken(tokenFromRequest(req))) return bad("Unauthorized", 401);
  const { entity } = await ctx.params;
  const spec = SPECS[entity];
  const delegate = delegateFor(entity);
  if (!spec || !delegate) return bad("Unknown entity", 404);

  try {
    const body = (await req.json().catch(() => ({}))) as Record<string, unknown>;
    const data = sanitize(spec, body);

    for (const f of spec.required) {
      if (typeof data[f] !== "string" || (data[f] as string).length === 0) {
        return bad(`Field "${f}" is required.`);
      }
    }
    if (entity === "projects" && !/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(String(data.slug))) {
      return bad("Slug must be lowercase with hyphens (e.g. my-project).");
    }

    const create = (delegate as unknown as { create: (a: unknown) => Promise<{ id: string }> }).create;
    const row = await create({ data });
    if (entity === "projects") await syncProjectTechnologies(row.id, body.technologyIds);

    return NextResponse.json({ ok: true, row });
  } catch (e) {
    if (isPrismaKnown(e) && e.code === "P2002") {
      return bad("A record with this unique value (slug/name) already exists.", 409);
    }
    console.error(`Admin POST ${entity} failed:`, e);
    return bad("Server error while creating.", 500);
  }
}

export async function PUT(req: NextRequest, ctx: Ctx) {
  if (!verifyToken(tokenFromRequest(req))) return bad("Unauthorized", 401);
  const { entity } = await ctx.params;

  try {
    const body = (await req.json().catch(() => ({}))) as Record<string, unknown>;

    /* Special entities */
    if (entity === "settings") {
      const key = typeof body.key === "string" ? body.key.trim() : "";
      const value = typeof body.value === "string" ? body.value : "";
      if (!key) return bad("Setting key is required.");
      await db.siteSetting.upsert({ where: { key }, update: { value }, create: { key, value } });
      return NextResponse.json({ ok: true });
    }
    if (entity === "requests") {
      const id = typeof body.id === "string" ? body.id : "";
      const status = typeof body.status === "string" ? body.status : "";
      if (!id || !["new", "contacted", "archived"].includes(status)) {
        return bad("Valid id and status (new/contacted/archived) required.");
      }
      await db.contactRequest.update({ where: { id }, data: { status } });
      return NextResponse.json({ ok: true });
    }

    const spec = SPECS[entity];
    const delegate = delegateFor(entity);
    if (!spec || !delegate) return bad("Unknown entity", 404);

    const id = typeof body.id === "string" ? body.id : "";
    if (!id) return bad("Record id is required.");

    const data = sanitize(spec, body);
    if (entity === "projects" && typeof data.slug === "string" && !/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(data.slug)) {
      return bad("Slug must be lowercase with hyphens (e.g. my-project).");
    }

    const update = (delegate as unknown as { update: (a: unknown) => Promise<{ id: string }> }).update;
    const row = await update({ where: { id }, data });
    if (entity === "projects") await syncProjectTechnologies(id, body.technologyIds);

    return NextResponse.json({ ok: true, row });
  } catch (e) {
    if (isPrismaKnown(e) && e.code === "P2025") return bad("Record not found.", 404);
    if (isPrismaKnown(e) && e.code === "P2002") {
      return bad("A record with this unique value (slug/name) already exists.", 409);
    }
    console.error(`Admin PUT ${entity} failed:`, e);
    return bad("Server error while updating.", 500);
  }
}

export async function DELETE(req: NextRequest, ctx: Ctx) {
  if (!verifyToken(tokenFromRequest(req))) return bad("Unauthorized", 401);
  const { entity } = await ctx.params;
  const id = req.nextUrl.searchParams.get("id");
  if (!id) return bad("Record id is required.");

  try {
    if (entity === "requests") {
      await db.contactRequest.delete({ where: { id } });
      return NextResponse.json({ ok: true });
    }
    if (entity === "settings") {
      await db.siteSetting.delete({ where: { key: id } });
      return NextResponse.json({ ok: true });
    }
    const delegate = delegateFor(entity);
    if (!delegate) return bad("Unknown entity", 404);
    const remove = (delegate as unknown as { delete: (a: unknown) => Promise<unknown> }).delete;
    await remove({ where: { id } });
    return NextResponse.json({ ok: true });
  } catch (e) {
    if (isPrismaKnown(e) && e.code === "P2025") return bad("Record not found.", 404);
    console.error(`Admin DELETE ${entity} failed:`, e);
    return bad("Server error while deleting.", 500);
  }
}
