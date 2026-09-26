"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Building2, ChevronDown, MapPin } from "lucide-react";
import type { Experience } from "@/lib/types";
import { cn } from "@/lib/utils";
import { SectionHeading } from "./section-heading";
import { Reveal } from "./reveal";
import { AnimatedCounter } from "./animated-counter";

interface ExperienceSectionProps {
  experience: Experience[];
}

/** Experience — documented roles on an expandable timeline with resume-backed counters. */
export function ExperienceSection({ experience }: ExperienceSectionProps) {
  const [openId, setOpenId] = useState<string | null>(experience[0]?.id ?? null);

  return (
    <section id="experience" className="relative border-t border-border/60 py-24 md:py-32">
      <div className="mx-auto w-[min(92%,72rem)]">
        <SectionHeading
          index="02"
          label="Experience"
          title={
            <>
              Where I&apos;ve <span className="text-primary">worked.</span>
            </>
          }
          description="Documented professional experience. Independent project work — including the Quicky platform — lives under Selected Work, clearly separate from employment."
        />

        <div className="relative">
          {/* Timeline rail */}
          <div className="absolute bottom-2 left-[7px] top-2 w-px bg-border md:left-[9px]" aria-hidden />

          <div className="space-y-6">
            {experience.map((exp, i) => {
              const open = openId === exp.id;
              return (
                <Reveal key={exp.id} delay={i * 0.08}>
                  <div className="relative pl-8 md:pl-12">
                    {/* Timeline node */}
                    <span
                      className={cn(
                        "absolute left-0 top-7 flex size-4 items-center justify-center rounded-full border-2 transition-colors md:top-9",
                        open ? "border-primary bg-primary/30" : "border-border bg-background"
                      )}
                      aria-hidden
                    >
                      <span className={cn("size-1.5 rounded-full", open ? "bg-primary" : "bg-muted-foreground/50")} />
                    </span>

                    <div
                      className={cn(
                        "overflow-hidden rounded-2xl border bg-card transition-colors duration-300",
                        open ? "border-primary/35" : "border-border/70 hover:border-border"
                      )}
                    >
                      {/* Collapsed summary — always visible, clickable */}
                      <button
                        type="button"
                        onClick={() => setOpenId(open ? null : exp.id)}
                        aria-expanded={open}
                        className="flex w-full flex-wrap items-start justify-between gap-4 p-6 text-left focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring md:p-7"
                      >
                        <div className="min-w-0">
                          <h3 className="font-display text-xl font-semibold tracking-tight text-foreground md:text-2xl">
                            {exp.role}
                          </h3>
                          <div className="mt-2 flex flex-wrap items-center gap-x-4 gap-y-1.5 text-sm text-muted-foreground">
                            <span className="inline-flex items-center gap-1.5">
                              <Building2 size={13} strokeWidth={1.75} className="text-primary/80" />
                              {exp.company}
                            </span>
                            <span className="inline-flex items-center gap-1.5">
                              <MapPin size={13} strokeWidth={1.75} className="text-primary/80" />
                              {exp.location}
                            </span>
                          </div>
                        </div>
                        <div className="flex shrink-0 items-center gap-4">
                          <span className="rounded-full border border-border/70 bg-background px-3 py-1 font-mono text-[10px] tracking-[0.16em] uppercase text-muted-foreground">
                            {exp.startDate} — {exp.endDate}
                          </span>
                          <span
                            className={cn(
                              "inline-flex size-9 items-center justify-center rounded-full border transition-all duration-300",
                              open ? "rotate-180 border-primary/50 text-primary" : "border-border text-muted-foreground"
                            )}
                            aria-hidden
                          >
                            <ChevronDown size={16} strokeWidth={1.75} />
                          </span>
                        </div>
                      </button>

                      {/* Expanded detail */}
                      <AnimatePresence initial={false}>
                        {open && (
                          <motion.div
                            key="detail"
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: "auto", opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
                            className="overflow-hidden"
                          >
                            <div className="border-t border-border/60 px-6 pb-7 pt-6 md:px-7">
                              {exp.description && (
                                <p className="max-w-3xl text-sm leading-relaxed text-muted-foreground md:text-base">
                                  {exp.description}
                                </p>
                              )}

                              <div className="mt-7 grid gap-10 md:grid-cols-2">
                                {/* Responsibilities */}
                                <div>
                                  <div className="font-mono text-[10px] tracking-[0.28em] uppercase text-muted-foreground">
                                    Responsibilities
                                  </div>
                                  <ul className="mt-4 space-y-2.5">
                                    {exp.responsibilities.map((r) => (
                                      <li key={r} className="flex items-start gap-2.5 text-sm text-foreground/90">
                                        <span className="mt-1.5 inline-block size-1 shrink-0 rotate-45 bg-primary" aria-hidden />
                                        {r}
                                      </li>
                                    ))}
                                  </ul>
                                </div>

                                {/* Highlights — animated counters */}
                                <div>
                                  <div className="font-mono text-[10px] tracking-[0.28em] uppercase text-muted-foreground">
                                    Highlights
                                  </div>
                                  <div className="mt-4 grid grid-cols-3 gap-4 sm:gap-6">
                                    {exp.highlights.map((h) => (
                                      <div
                                        key={h.label}
                                        className="rounded-xl border border-primary/20 bg-primary/5 p-4"
                                      >
                                        <div className="font-display text-2xl font-semibold text-foreground md:text-3xl">
                                          <AnimatedCounter value={h.value} suffix={h.suffix} />
                                        </div>
                                        <div className="mt-2 text-[11px] leading-snug text-muted-foreground">
                                          {h.label}
                                        </div>
                                      </div>
                                    ))}
                                  </div>
                                </div>
                              </div>
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  </div>
                </Reveal>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
