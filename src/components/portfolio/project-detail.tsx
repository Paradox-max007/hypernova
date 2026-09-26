"use client";

import { motion, useReducedMotion } from "framer-motion";
import { ArrowLeft, ArrowRight, ExternalLink, Github, Layers, Lock } from "lucide-react";
import type { Project } from "@/lib/types";
import { Button } from "@/components/ui/button";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { ArchitectureDiagram, hasDiagram } from "./architecture-diagrams";
import { ProjectVisual } from "./project-visual";
import { AnimatedCounter } from "./animated-counter";
import { Reveal } from "./reveal";
import { cn } from "@/lib/utils";

interface ProjectDetailProps {
  project: Project;
  allProjects: Project[];
}

/* ------------------------------ sub-blocks ------------------------------- */

function CaseLabel({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex items-center gap-3 font-mono text-[11px] tracking-[0.25em] uppercase text-muted-foreground">
      <span className="inline-block size-1.5 rotate-45 bg-primary" aria-hidden />
      {children}
    </div>
  );
}

function CaseBlock({
  id,
  label,
  children,
  className,
}: {
  id: string;
  label: string;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <section id={id} className={cn("scroll-mt-28 border-t border-border/50 pt-10 md:pt-14", className)}>
      <Reveal>
        <CaseLabel>{label}</CaseLabel>
      </Reveal>
      <Reveal delay={0.08}>
        <div className="mt-5">{children}</div>
      </Reveal>
    </section>
  );
}

function BrowserFrame({ url, children }: { url: string; children: React.ReactNode }) {
  return (
    <div className="overflow-hidden rounded-xl border border-border/70 bg-card shadow-xl shadow-black/10">
      <div className="flex items-center gap-3 border-b border-border/60 px-4 py-3">
        <div className="flex gap-1.5" aria-hidden>
          <span className="size-2.5 rounded-full bg-destructive/60" />
          <span className="size-2.5 rounded-full bg-chart-5/70" />
          <span className="size-2.5 rounded-full bg-primary/70" />
        </div>
        <div className="flex-1 rounded-md border border-border/60 bg-background px-3 py-1 font-mono text-[10px] text-muted-foreground">
          {url}
        </div>
      </div>
      {children}
    </div>
  );
}

/* ------------------------------- main view -------------------------------- */

export function ProjectDetail({ project, allProjects }: ProjectDetailProps) {
  const reduce = useReducedMotion();
  const index = allProjects.findIndex((p) => p.slug === project.slug);
  const next = allProjects[(index + 1) % allProjects.length];

  const sections: Array<{ id: string; label: string; enabled: boolean }> = [
    { id: "idea", label: "The Idea", enabled: !!project.idea },
    { id: "problem", label: "The Problem", enabled: !!project.problem },
    { id: "solution", label: "The Solution", enabled: !!project.solution },
    { id: "how", label: "How It Works", enabled: project.howItWorks.length > 0 },
    { id: "architecture", label: "Architecture", enabled: hasDiagram(project.architecture) },
    { id: "technology", label: "Technology", enabled: project.technologies.length > 0 },
    { id: "features", label: "Features", enabled: project.features.length > 0 },
    { id: "challenges", label: "Challenges", enabled: !!project.challenges },
    { id: "built", label: "What I Built", enabled: !!project.whatIBuilt },
    { id: "result", label: "Result", enabled: !!project.result || project.metrics.length > 0 },
  ].filter((s) => s.enabled);

  const prose = "text-base leading-relaxed text-muted-foreground md:text-lg md:leading-[1.75]";

  return (
    <div className="relative">
      <div className="mx-auto w-[min(92%,72rem)] pb-24 pt-28 md:pt-32">
        {/* Back + index */}
        <motion.div
          initial={reduce ? { opacity: 0 } : { opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="flex items-center justify-between"
        >
          <a
            href="#/work"
            className="group inline-flex items-center gap-2 font-mono text-[11px] tracking-[0.2em] uppercase text-muted-foreground transition-colors hover:text-primary"
          >
            <ArrowLeft size={14} className="transition-transform group-hover:-translate-x-1" />
            Back to Work
          </a>
          <span className="font-mono text-[11px] tracking-[0.2em] uppercase text-muted-foreground">
            {String(index + 1).padStart(2, "0")} / {String(allProjects.length).padStart(2, "0")}
          </span>
        </motion.div>

        {/* Header */}
        <div className="mt-10">
          <motion.div
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.08 }}
            className="flex flex-wrap items-center gap-3"
          >
            <span className="rounded-full border border-primary/35 bg-primary/10 px-3.5 py-1 font-mono text-[10px] tracking-[0.22em] uppercase text-primary">
              {project.category}
            </span>
            {project.year && (
              <span className="font-mono text-[11px] tracking-[0.18em] uppercase text-muted-foreground">
                {project.year}
              </span>
            )}
            {project.featured && (
              <span className="rounded-full border border-border px-3 py-1 font-mono text-[9px] tracking-[0.22em] uppercase text-muted-foreground">
                Flagship case study
              </span>
            )}
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.14 }}
            className="mt-6 font-display text-5xl font-semibold leading-[1.02] tracking-tight text-foreground sm:text-6xl md:text-7xl"
          >
            {project.title}
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.2 }}
            className="mt-5 max-w-2xl font-display text-xl font-medium text-muted-foreground md:text-2xl"
          >
            {project.tagline}
          </motion.p>

          {project.description && (
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.7, delay: 0.26 }}
              className="mt-6 max-w-2xl text-sm leading-relaxed text-muted-foreground/90 md:text-base"
            >
              {project.description}
            </motion.p>
          )}

          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="mt-8 flex flex-wrap gap-3.5"
          >
            {project.liveUrl && (
              <Button asChild className="h-11 rounded-full px-6 text-sm font-semibold">
                <a href={project.liveUrl} target="_blank" rel="noreferrer noopener">
                  <ExternalLink size={15} className="mr-2" />
                  Visit Live Website
                </a>
              </Button>
            )}
            {project.githubUrl ? (
              <Button asChild variant="outline" className="h-11 rounded-full px-6 text-sm font-semibold">
                <a href={project.githubUrl} target="_blank" rel="noreferrer noopener">
                  <Github size={15} className="mr-2" />
                  GitHub Repository
                </a>
              </Button>
            ) : (
              <span className="inline-flex h-11 items-center gap-2 rounded-full border border-dashed border-border px-6 text-sm text-muted-foreground">
                <Lock size={14} />
                Source kept private
              </span>
            )}
          </motion.div>
        </div>

        {/* Preview visual */}
        <motion.div
          initial={reduce ? { opacity: 0 } : { opacity: 0, scale: 0.97, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.34 }}
          className="mt-14"
        >
          {project.slug === "ot24" && project.liveUrl ? (
            <a href={project.liveUrl} target="_blank" rel="noreferrer noopener" className="group block">
              <BrowserFrame url="ot24.ae — live">
                <ProjectVisual slug={project.slug} className="aspect-[21/10]" />
              </BrowserFrame>
              <p className="mt-3 text-center font-mono text-[10px] tracking-[0.22em] uppercase text-muted-foreground transition-colors group-hover:text-primary">
                Click to open the live site →
              </p>
            </a>
          ) : (
            <ProjectVisual
              slug={project.slug}
              className="aspect-[21/10] rounded-xl border border-border/70"
            />
          )}
        </motion.div>

        {/* Meta strip */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.42 }}
          className="mt-10 grid grid-cols-2 gap-6 rounded-2xl border border-border/70 bg-card/60 p-6 md:grid-cols-4 md:p-7"
        >
          <div>
            <div className="font-mono text-[9px] tracking-[0.26em] uppercase text-muted-foreground">Category</div>
            <div className="mt-1.5 text-sm font-medium text-foreground">{project.category}</div>
          </div>
          <div>
            <div className="font-mono text-[9px] tracking-[0.26em] uppercase text-muted-foreground">Year</div>
            <div className="mt-1.5 text-sm font-medium text-foreground">{project.year ?? "—"}</div>
          </div>
          <div className="col-span-2">
            <div className="font-mono text-[9px] tracking-[0.26em] uppercase text-muted-foreground">Role</div>
            <div className="mt-1.5 text-sm font-medium text-foreground">{project.roleNote ?? "Full-stack development"}</div>
          </div>
        </motion.div>

        {/* Case study body + sticky side nav */}
        <div className="mt-16 grid gap-10 xl:grid-cols-[13rem_1fr]">
          <aside className="hidden xl:block">
            <div className="sticky top-28 space-y-1">
              <div className="mb-3 font-mono text-[9px] tracking-[0.3em] uppercase text-muted-foreground">
                Case study
              </div>
              {sections.map((s) => (
                <a
                  key={s.id}
                  href={`#${s.id}`}
                  onClick={(e) => {
                    e.preventDefault();
                    document.getElementById(s.id)?.scrollIntoView({ behavior: reduce ? "auto" : "smooth" });
                  }}
                  className="block rounded-md px-3 py-2 font-mono text-[11px] uppercase tracking-[0.14em] text-muted-foreground transition-colors hover:bg-primary/10 hover:text-primary"
                >
                  {s.label}
                </a>
              ))}
            </div>
          </aside>

          <div className="min-w-0 space-y-10 md:space-y-14">
            {project.idea && (
              <CaseBlock id="idea" label="The Idea">
                <p className={prose}>{project.idea}</p>
              </CaseBlock>
            )}

            {project.problem && (
              <CaseBlock id="problem" label="The Problem">
                <p className={prose}>{project.problem}</p>
              </CaseBlock>
            )}

            {project.solution && (
              <CaseBlock id="solution" label="The Solution">
                <p className={prose}>{project.solution}</p>
              </CaseBlock>
            )}

            {project.howItWorks.length > 0 && (
              <CaseBlock id="how" label="How It Works">
                <ol className="space-y-6">
                  {project.howItWorks.map((step, i) => (
                    <Reveal key={step.title} delay={i * 0.05}>
                      <li className="flex gap-5">
                        <span className="flex size-9 shrink-0 items-center justify-center rounded-full border border-primary/35 bg-primary/10 font-mono text-xs text-primary">
                          {String(i + 1).padStart(2, "0")}
                        </span>
                        <div>
                          <h3 className="font-display text-lg font-semibold tracking-tight text-foreground">
                            {step.title}
                          </h3>
                          <p className="mt-1.5 text-sm leading-relaxed text-muted-foreground md:text-base">
                            {step.detail}
                          </p>
                        </div>
                      </li>
                    </Reveal>
                  ))}
                </ol>
              </CaseBlock>
            )}

            {hasDiagram(project.architecture) && (
              <CaseBlock id="architecture" label="Architecture">
                <p className={cn(prose, "mb-8")}>
                  The system at a glance — nodes, authoritative flows and how every layer connects. Animated edges
                  show live data movement.
                </p>
                <ArchitectureDiagram architecture={project.architecture!} />
              </CaseBlock>
            )}

            {project.technologies.length > 0 && (
              <CaseBlock id="technology" label="Technology">
                <div className="flex flex-wrap gap-2.5">
                  {project.technologies.map((t) => (
                    <span
                      key={t.id}
                      className="inline-flex items-center gap-2 rounded-lg border border-border/70 bg-card px-4 py-2 text-sm text-foreground/90"
                    >
                      <Layers size={12} className="text-primary" />
                      {t.name}
                      <span className="font-mono text-[9px] uppercase tracking-wider text-muted-foreground/70">
                        {t.category}
                      </span>
                    </span>
                  ))}
                </div>
              </CaseBlock>
            )}

            {project.features.length > 0 && (
              <CaseBlock id="features" label="Features">
                <Accordion type="single" collapsible className="rounded-2xl border border-border/70 bg-card px-6">
                  {project.features.map((f, i) => (
                    <AccordionItem
                      key={f.title}
                      value={f.title}
                      className={cn(i === 0 && "border-t-0", i === project.features.length - 1 && "border-b-0")}
                    >
                      <AccordionTrigger className="py-5 text-left font-display text-base font-medium tracking-tight hover:text-primary hover:no-underline">
                        {f.title}
                      </AccordionTrigger>
                      <AccordionContent className="pb-5 text-sm leading-relaxed text-muted-foreground">
                        {f.detail}
                      </AccordionContent>
                    </AccordionItem>
                  ))}
                </Accordion>
              </CaseBlock>
            )}

            {project.challenges && (
              <CaseBlock id="challenges" label="Challenges">
                <div className="border-l-2 border-primary/40 pl-6">
                  <p className={prose}>{project.challenges}</p>
                </div>
              </CaseBlock>
            )}

            {project.whatIBuilt && (
              <CaseBlock id="built" label="What I Built">
                <p className={prose}>{project.whatIBuilt}</p>
              </CaseBlock>
            )}

            {(project.result || project.metrics.length > 0) && (
              <CaseBlock id="result" label="Result">
                {project.result && <p className={cn(prose, project.metrics.length ? "mb-8" : "")}>{project.result}</p>}
                {project.metrics.length > 0 && (
                  <div className="grid gap-4 sm:grid-cols-3">
                    {project.metrics.map((m) => (
                      <div
                        key={m.label}
                        className="rounded-2xl border border-primary/25 bg-primary/5 p-6 text-center"
                      >
                        <div className="font-display text-4xl font-semibold text-foreground">
                          <AnimatedCounter value={m.value} suffix={m.suffix} />
                        </div>
                        <div className="mt-2 text-xs leading-snug text-muted-foreground">{m.label}</div>
                      </div>
                    ))}
                  </div>
                )}
              </CaseBlock>
            )}
          </div>
        </div>

        {/* Next project */}
        <Reveal className="mt-24">
          <a
            href={`#/work/${next.slug}`}
            className="group block rounded-2xl border border-border/70 bg-card/60 p-8 transition-colors hover:border-primary/40 md:p-12"
          >
            <div className="flex items-center justify-between gap-6">
              <div>
                <div className="font-mono text-[10px] tracking-[0.28em] uppercase text-muted-foreground">
                  Next project
                </div>
                <div className="mt-3 font-display text-3xl font-semibold tracking-tight text-foreground transition-colors group-hover:text-primary md:text-5xl">
                  {next.title}
                </div>
                <div className="mt-2 text-sm text-muted-foreground md:text-base">{next.tagline}</div>
              </div>
              <span className="inline-flex size-14 shrink-0 items-center justify-center rounded-full border border-border transition-all duration-300 group-hover:border-primary group-hover:bg-primary group-hover:text-primary-foreground md:size-16">
                <ArrowRight size={22} className="transition-transform duration-300 group-hover:translate-x-1" />
              </span>
            </div>
          </a>
        </Reveal>
      </div>
    </div>
  );
}
