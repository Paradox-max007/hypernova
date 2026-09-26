# Jyothilal Reji — Digital Portfolio

An animated, interactive developer portfolio built as a product, not a template — featuring deep expandable case studies, an animated skills constellation, realtime architecture diagrams, a multi-step project inquiry flow, and a full admin CMS. Every piece of content on the site is data-driven and editable without touching code.

**Positioning:** Full Stack Developer · Data Science · Machine Learning — based in Kerala, India, working with clients worldwide.

## Highlights

- **Interactive hero** — a "digital core" SVG scene with mouse parallax and travelling data packets
- **Deep case studies** — idea → problem → solution → how it works → animated architecture diagrams → features → challenges → result, per project
- **Live flagship** — ONTIME24 (ot24.ae), a production platform built and maintained full-stack for one year
- **Skills constellation** — no percentage bars; clickable technology nodes with usage, pairings and linked projects
- **Animated metric counters** — only resume-backed figures
- **Multi-step project inquiry wizard** — project type → brief → AED budget tier → contact details
- **Admin CMS** at `#/admin` — projects, experience, education, certifications, skills, contact requests inbox and site settings
- **Dark / light theme**, `prefers-reduced-motion` support, fully responsive (phone → ultrawide)
- **Easter eggs** — press `K`, or try the Konami code

## Tech stack

| Layer | Choice |
|---|---|
| Framework | Next.js 16 (App Router) + TypeScript |
| Styling | Tailwind CSS 4 + shadcn/ui |
| Animation | Framer Motion |
| Data | Prisma ORM — SQLite (local dev) / PostgreSQL on Supabase (production) |
| Hosting | Vercel |

## Quick start (local — zero setup)

```bash
git clone https://github.com/Paradox-max007/hypernova.git
cd hypernova
npm install                # generates both Prisma clients (postinstall)
cp .env.example .env       # uses local SQLite by default

npx prisma db push         # create the local SQLite schema
npm run db:seed            # seed all content
npm run dev                # http://localhost:3000
```

The local database is a SQLite file in `db/` — no external services needed.

> Prefer bun? `bun install && bun prisma/seed.ts && bun run dev` works the same.

## Deploy to production (Vercel + Supabase)

The site reads and writes through Prisma, so it needs a hosted PostgreSQL database in production. Supabase's free tier is more than enough.

### 1. Create the database (2 minutes)

1. Create a project at [supabase.com](https://supabase.com) (any region).
2. Open **SQL Editor → New query**.
3. Paste the entire contents of [`db/supabase-setup.sql`](db/supabase-setup.sql) and **Run**.
   This creates every table and seeds all content (projects, experience, skills, settings). Re-running it resets the content to the seed state.

### 2. Connect Vercel

1. Push this repo to GitHub and import it at [vercel.com](https://vercel.com) (framework auto-detects as Next.js).
2. In **Project → Settings → Environment Variables**, add:

   | Variable | Value |
   |---|---|
   | `DATABASE_URL` | your Supabase **Session pooler** connection string (Project Settings → Database → Connection string). Looks like `postgresql://postgres.<ref>:<password>@aws-0-<region>.pooler.supabase.com:5432/postgres` |
   | `ADMIN_PASSWORD` | your admin console password |

3. Deploy.

That's it — the app picks the PostgreSQL Prisma client automatically whenever `DATABASE_URL` starts with `postgres://`. No code changes are needed for production.

> Why the *session pooler* URL? Vercel functions need an IPv4-compatible hostname; Supabase's direct database host is IPv6-only on the free tier. The session pooler works with Prisma out of the box.

#### Troubleshooting: "build worked but the page says it does not exist" (404 on every URL)

This means the Vercel project is **not using the Next.js framework runtime** — it was created with custom/static settings (e.g. a Root Directory like `static`), so Vercel runs the build but then serves the repo as a plain static folder, which has no `index.html` → edge-level `NOT_FOUND`.

Fix — recreate the project cleanly (2 minutes):

1. Vercel dashboard → open the project → **Settings** → scroll to bottom → **Delete Project**.
2. **Add New → Project → Import** the `hypernova` repo again — this time the framework **auto-detects as Next.js** and every setting stays on default (don't set Root Directory / Build Command / Output Directory manually).
3. Before deploying, expand **Environment Variables** on the import screen and add `DATABASE_URL` + `ADMIN_PASSWORD`.
4. Deploy.

If you'd rather not delete the project: **Settings → General → Build & Development Settings** → set every override back to **Default** (Build Command, Output Directory, Install Command) and make sure the Framework Preset is **Next.js** — then Redeploy.

### 3. After deploying

- Visit `https://<your-domain>/#/admin` and log in with your `ADMIN_PASSWORD`.
- All content — projects, case studies, experience, education, skills, contact links, even the languages list — is editable from the CMS and saved to Supabase. The public site reflects changes immediately.
- Project inquiries submitted through the contact wizard land in **Admin → Requests**.

## Admin console

`#/admin` (note: it's a hash route on the same page). Default password for local dev is `jyothilal` — override it with the `ADMIN_PASSWORD` environment variable everywhere.

Tabs: **Dashboard** (stats) · **Projects** (full case-study editor + technology multi-select) · **Experience** · **Education** · **Certificates** · **Skills** · **Requests** (contact inbox with status workflow) · **Settings** (contact links, languages).

## Project structure

```
prisma/
  schema.prisma          # SQLite schema (local dev)
  schema.pg.prisma       # PostgreSQL schema (production — same models)
  seed-data.ts           # ALL portfolio content, single source of truth
  seed.ts                # seeds the local SQLite database
db/
  supabase-setup.sql     # generated schema + seed for Supabase (production)
scripts/
  generate-supabase-sql.ts  # regenerates db/supabase-setup.sql from seed-data
  generate_cv.py            # regenerates public/jyothilal-reji-cv.pdf
src/
  app/                   # Next.js app router (page, APIs, layout)
  components/portfolio/  # every portfolio section + admin CMS
  lib/                   # data loading, types, hash router, db client
public/
  jyothilal-reji-cv.pdf  # downloadable CV
```

### Editing content in code

If you prefer editing content as code instead of through the CMS: change `prisma/seed-data.ts`, then re-run `bun prisma/seed.ts` (local) and `bun scripts/generate-supabase-sql.ts` (to refresh `db/supabase-setup.sql` for Supabase).

## Scripts

| Command | Purpose |
|---|---|
| `npm run dev` | local dev server |
| `npm run db:push` | push schema to local SQLite |
| `npm run db:seed` | seed local SQLite from seed-data |
| `npm run db:sql` | regenerate `db/supabase-setup.sql` |
| `npm run lint` | ESLint |

---

© Jyothilal Reji — designed & built from scratch.
