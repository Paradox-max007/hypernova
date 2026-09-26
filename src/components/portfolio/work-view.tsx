"use client";

import { ArrowUpRight } from "lucide-react";
import type { Project } from "@/lib/types";
import { ProjectVisual } from "./project-visual";
import { Reveal } from "./reveal";

/** Full work listing — every case study as an interactive card. */
export function WorkView({ projects }: { projects: Project[] }) {
  return (
    <div className="mx-auto w-[min(92%,72rem)] pb-24 pt-28 md:pt-32">
      <Reveal>
        <div className="font-mono text-[11px] tracking-[0.25em] uppercase text-muted-foreground">
          <span className="text-primary">◆</span> Archive
        </div>
      </Reveal>
      <Reveal delay={0.08}>
        <h1 className="mt-5 font-display text-4xl font-semibold tracking-tight text-foreground sm:text-5xl md:text-6xl">
          All work<span className="text-primary">.</span>
        </h1>
      </Reveal>
      <Reveal delay={0.14}>
        <p className="mt-4 max-w-xl text-base leading-relaxed text-muted-foreground">
          {projects.length} projects — realtime platforms, games, machine learning, client delivery. Each opens
          into a full case study.
        </p>
      </Reveal>

      <div className="mt-14 grid gap-6 md:grid-cols-2">
        {projects.map((p, i) => (
          <Reveal key={p.slug} delay={Math.min(i * 0.06, 0.3)}>
            <a
              href={`#/work/${p.slug}`}
              className="group block overflow-hidden rounded-2xl border border-border/70 bg-card transition-all duration-300 hover:border-primary/40 hover:shadow-xl hover:shadow-primary/5"
            >
              <div className="relative">
                <ProjectVisual slug={p.slug} className="aspect-[16/9] border-b border-border/60" />
                <div className="absolute left-4 top-4 rounded-full border border-primary/30 bg-background/85 px-3 py-1 font-mono text-[9px] tracking-[0.2em] uppercase text-primary backdrop-blur-sm">
                  {p.category}
                </div>
                {p.featured && (
                  <div className="absolute right-4 top-4 rounded-full border border-border bg-background/85 px-3 py-1 font-mono text-[9px] tracking-[0.2em] uppercase text-muted-foreground backdrop-blur-sm">
                    Flagship
                  </div>
                )}
              </div>
              <div className="flex items-start justify-between gap-4 p-6">
                <div className="min-w-0">
                  <h2 className="font-display text-2xl font-semibold tracking-tight text-foreground transition-colors group-hover:text-primary">
                    {p.title}
                  </h2>
                  <p className="mt-1.5 line-clamp-2 text-sm leading-relaxed text-muted-foreground">{p.tagline}</p>
                  <div className="mt-4 flex flex-wrap gap-1.5">
                    {p.technologies.slice(0, 4).map((t) => (
                      <span
                        key={t.id}
                        className="rounded-md border border-border/60 bg-background px-2 py-0.5 font-mono text-[10px] text-muted-foreground"
                      >
                        {t.name}
                      </span>
                    ))}
                    {p.technologies.length > 4 && (
                      <span className="rounded-md border border-border/60 bg-background px-2 py-0.5 font-mono text-[10px] text-primary">
                        +{p.technologies.length - 4}
                      </span>
                    )}
                  </div>
                </div>
                <span className="mt-1 inline-flex size-10 shrink-0 items-center justify-center rounded-full border border-border text-muted-foreground transition-all duration-300 group-hover:rotate-45 group-hover:border-primary group-hover:bg-primary group-hover:text-primary-foreground">
                  <ArrowUpRight size={17} />
                </span>
              </div>
            </a>
          </Reveal>
        ))}
      </div>
    </div>
  );
}
