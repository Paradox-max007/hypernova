"use client";

import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion, useMotionValue, useSpring } from "framer-motion";
import { ArrowRight, ArrowUpRight } from "lucide-react";
import type { Project } from "@/lib/types";
import { cn } from "@/lib/utils";
import { useMediaQuery } from "@/hooks/use-media-query";
import { SectionHeading } from "./section-heading";
import { Reveal } from "./reveal";
import { ProjectVisual } from "./project-visual";

interface WorkSectionProps {
  projects: Project[];
}

/** Selected Work — interactive vertical gallery with a cursor-following preview. */
export function WorkSection({ projects }: WorkSectionProps) {
  const sectionRef = useRef<HTMLElement>(null);
  const [activeSlug, setActiveSlug] = useState<string | null>(null);
  const canHover = useMediaQuery("(pointer: fine) and (min-width: 1024px)");

  const px = useMotionValue(0);
  const py = useMotionValue(0);
  const sx = useSpring(px, { stiffness: 260, damping: 28, mass: 0.6 });
  const sy = useSpring(py, { stiffness: 260, damping: 28, mass: 0.6 });

  const active = projects.find((p) => p.slug === activeSlug) ?? null;

  const handleMouseMove = (e: React.MouseEvent) => {
    const rect = sectionRef.current?.getBoundingClientRect();
    if (!rect) return;
    px.set(e.clientX - rect.left + 36);
    py.set(e.clientY - rect.top - 120);
  };

  return (
    <section
      id="work"
      ref={sectionRef}
      className="relative border-t border-border/60 py-24 md:py-32"
      onMouseMove={canHover ? handleMouseMove : undefined}
      onMouseLeave={() => setActiveSlug(null)}
    >
      <div className="mx-auto w-[min(92%,72rem)]">
        <SectionHeading
          index="01"
          label="Selected Work"
          title={
            <>
              Work that <span className="text-primary">runs.</span>
            </>
          }
          description="A live production platform for a UAE business, an ambitious realtime hobby build in development, and the college projects where the full-stack habit started. Every one opens into a full case study."
          action={
            <a
              href="#/work"
              className="group inline-flex items-center gap-2 font-mono text-[11px] tracking-[0.2em] uppercase text-muted-foreground transition-colors hover:text-primary"
            >
              All projects
              <ArrowRight size={13} className="transition-transform group-hover:translate-x-1" />
            </a>
          }
        />

        {/* Vertical project gallery */}
        <div className="border-t border-border/60">
          {projects.map((project, i) => (
            <Reveal key={project.slug} delay={Math.min(i * 0.05, 0.25)}>
              <a
                href={`#/work/${project.slug}`}
                className="group relative block border-b border-border/60 py-7 md:py-9"
                onMouseEnter={() => canHover && setActiveSlug(project.slug)}
                onFocus={() => setActiveSlug(project.slug)}
                aria-label={`${project.title} — ${project.tagline}. Open case study`}
              >
                <div className="grid grid-cols-[2.6rem_1fr_auto] items-start gap-4 md:grid-cols-[3.6rem_1fr_auto] md:gap-8">
                  {/* Index */}
                  <span className="pt-1 font-mono text-xs text-muted-foreground transition-colors group-hover:text-primary md:pt-2 md:text-sm">
                    0{i + 1}
                  </span>

                  {/* Title + meta */}
                  <div className="min-w-0">
                    <div className="flex flex-wrap items-center gap-3">
                      <h3 className="font-display text-2xl font-semibold tracking-tight text-foreground transition-all duration-300 group-hover:translate-x-1.5 group-hover:text-primary sm:text-3xl md:text-4xl">
                        {project.title}
                      </h3>
                      {project.featured && (
                        <span className="rounded-full border border-primary/40 bg-primary/10 px-2.5 py-0.5 font-mono text-[9px] tracking-[0.22em] uppercase text-primary">
                          Flagship
                        </span>
                      )}
                    </div>
                    <p className="mt-2 max-w-xl text-sm leading-relaxed text-muted-foreground md:text-base">
                      {project.tagline}
                    </p>
                    {/* Tech tags — revealed on hover (desktop) */}
                    <div className="mt-3.5 hidden flex-wrap gap-1.5 opacity-0 transition-opacity duration-300 group-hover:opacity-100 md:flex">
                      {project.technologies.slice(0, 6).map((t) => (
                        <span
                          key={t.id}
                          className="rounded-md border border-border/70 bg-card px-2 py-0.5 font-mono text-[10px] text-muted-foreground"
                        >
                          {t.name}
                        </span>
                      ))}
                      {project.technologies.length > 6 && (
                        <span className="rounded-md border border-border/70 bg-card px-2 py-0.5 font-mono text-[10px] text-primary">
                          +{project.technologies.length - 6}
                        </span>
                      )}
                    </div>
                    {/* Inline visual for touch/mobile */}
                    <ProjectVisual
                      slug={project.slug}
                      className="mt-5 aspect-[16/9] rounded-lg border border-border/60 md:hidden"
                    />
                  </div>

                  {/* Right meta */}
                  <div className="flex flex-col items-end gap-2 md:pt-2">
                    <span className="hidden font-mono text-[10px] tracking-[0.18em] uppercase text-muted-foreground sm:block">
                      {project.category}
                    </span>
                    <span className="hidden font-mono text-[10px] text-muted-foreground/70 sm:block">{project.year}</span>
                    <span
                      className="mt-1 inline-flex size-9 items-center justify-center rounded-full border border-border/70 text-muted-foreground transition-all duration-300 group-hover:border-primary group-hover:bg-primary group-hover:text-primary-foreground md:size-10"
                      aria-hidden
                    >
                      <ArrowUpRight size={16} className="transition-transform duration-300 group-hover:rotate-45" />
                    </span>
                  </div>
                </div>
              </a>
            </Reveal>
          ))}
        </div>
      </div>

      {/* Cursor-following preview (desktop, fine pointer only) */}
      {canHover && (
        <AnimatePresence>
          {active && (
            <motion.div
              className="pointer-events-none absolute left-0 top-0 z-20 hidden w-[290px] lg:block"
              style={{ x: sx, y: sy }}
              initial={{ opacity: 0, scale: 0.85, rotate: -3 }}
              animate={{ opacity: 1, scale: 1, rotate: 0 }}
              exit={{ opacity: 0, scale: 0.9, rotate: 2 }}
              transition={{ duration: 0.28, ease: [0.16, 1, 0.3, 1] }}
            >
              <div className="overflow-hidden rounded-xl border border-primary/25 bg-card/95 shadow-2xl shadow-black/25 backdrop-blur-md">
                <ProjectVisual slug={active.slug} className="aspect-[16/10] border-b border-border/60" />
                <div className="flex items-center justify-between gap-3 px-4 py-3">
                  <div className="min-w-0">
                    <div className="truncate font-mono text-[10px] tracking-[0.18em] uppercase text-primary">
                      {active.category}
                    </div>
                    <div className="mt-0.5 truncate text-xs text-muted-foreground">
                      {active.technologies.slice(0, 3).map((t) => t.name).join(" · ")}
                    </div>
                  </div>
                  <span className="shrink-0 font-mono text-[10px] tracking-[0.16em] uppercase text-foreground">
                    View case study →
                  </span>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      )}
    </section>
  );
}
