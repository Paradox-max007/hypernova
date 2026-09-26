"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Award, BookOpen, Brain, ChevronDown, GraduationCap, Languages as LanguagesIcon, Wrench } from "lucide-react";
import type { Certification, Education, LanguageEntry } from "@/lib/types";
import { cn } from "@/lib/utils";
import { SectionHeading } from "./section-heading";
import { Reveal } from "./reveal";
import { AnimatedCounter } from "./animated-counter";

interface AboutSectionProps {
  education: Education[];
  certifications: Certification[];
  languages: LanguageEntry[];
}

const CARDS = [
  {
    id: "think",
    icon: Brain,
    title: "How I think",
    body: "Products first, features second. Before writing code I ask what the visitor, player or analyst is actually trying to accomplish — then I design the smallest complete thing that gets them there beautifully. Data informs the decisions: I'd rather measure and iterate than guess and defend.",
  },
  {
    id: "build",
    icon: Wrench,
    title: "How I build",
    body: "I prefer building complete experiences rather than isolated features — from interface and interaction design through backend logic, data and deployment. A year on ONTIME24 proved it for a client: one developer owning a live production platform end-to-end. Quicky proves it for the love of the craft: game engines, social systems, economy and admin console, all owned solo.",
  },
  {
    id: "learning",
    icon: BookOpen,
    title: "What I'm learning",
    body: "Going deeper on realtime systems at scale — authoritative state, conflict resolution, presence — on mobile development with Flutter, and on bringing AI meaningfully into products: not chatbots bolted onto pages, but intelligence woven into how an application behaves and responds.",
  },
  {
    id: "interests",
    icon: GraduationCap,
    title: "What I'm interested in",
    body: "Interactive experiences that blur product and play, gamified social systems, applied machine learning, and tools that make small businesses look world-class. I'm especially drawn to work for clients who want something built properly, not just built fast.",
  },
];

/** About — "Beyond the code" expandable cards, education, certifications, languages. */
export function AboutSection({ education, certifications, languages }: AboutSectionProps) {
  const [openCard, setOpenCard] = useState<string | null>("build");
  const [openCert, setOpenCert] = useState<string | null>(null);

  return (
    <section id="about" className="relative border-t border-border/60 py-24 md:py-32">
      <div className="mx-auto w-[min(92%,72rem)]">
        <SectionHeading
          index="04"
          label="About"
          title={
            <>
              Beyond the <span className="text-primary">code.</span>
            </>
          }
          description="The person behind the commits — how I work, what I'm reaching toward, and the credentials that back it up."
        />

        {/* Expandable "beyond the code" cards */}
        <div className="grid gap-4 sm:grid-cols-2">
          {CARDS.map((card, i) => {
            const open = openCard === card.id;
            const Icon = card.icon;
            return (
              <Reveal key={card.id} delay={Math.min(i * 0.06, 0.2)}>
                <div
                  className={cn(
                    "h-full overflow-hidden rounded-2xl border bg-card transition-colors duration-300",
                    open ? "border-primary/35" : "border-border/70 hover:border-border"
                  )}
                >
                  <button
                    type="button"
                    onClick={() => setOpenCard(open ? null : card.id)}
                    aria-expanded={open}
                    className="flex w-full items-center justify-between gap-4 p-6 text-left focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
                  >
                    <div className="flex items-center gap-4">
                      <span
                        className={cn(
                          "inline-flex size-10 items-center justify-center rounded-xl border transition-colors",
                          open ? "border-primary/40 bg-primary/10 text-primary" : "border-border text-muted-foreground"
                        )}
                      >
                        <Icon size={17} strokeWidth={1.75} />
                      </span>
                      <div>
                        <div className="font-mono text-[9px] tracking-[0.28em] uppercase text-muted-foreground">
                          0{i + 1}
                        </div>
                        <div className="mt-0.5 font-display text-lg font-semibold tracking-tight text-foreground">
                          {card.title}
                        </div>
                      </div>
                    </div>
                    <ChevronDown
                      size={16}
                      className={cn(
                        "shrink-0 text-muted-foreground transition-transform duration-300",
                        open && "rotate-180 text-primary"
                      )}
                    />
                  </button>
                  <AnimatePresence initial={false}>
                    {open && (
                      <motion.div
                        key="body"
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
                        className="overflow-hidden"
                      >
                        <p className="px-6 pb-6 text-sm leading-relaxed text-muted-foreground">{card.body}</p>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </Reveal>
            );
          })}
        </div>

        {/* Education + certifications + languages */}
        <div className="mt-14 grid gap-6 lg:grid-cols-2">
          {/* Education timeline */}
          <Reveal>
            <div className="h-full rounded-2xl border border-border/70 bg-card p-7 md:p-8">
              <div className="flex items-center gap-3">
                <GraduationCap size={16} className="text-primary" />
                <span className="font-mono text-[10px] tracking-[0.28em] uppercase text-muted-foreground">
                  Education
                </span>
              </div>
              {education.map((ed) => (
                <div key={ed.id} className="mt-7">
                  {/* Timeline */}
                  <div className="flex items-center gap-3 font-mono text-[11px] text-muted-foreground">
                    <span>{ed.startDate.split(" ")[1]}</span>
                    <span className="relative h-px flex-1 bg-border">
                      <motion.span
                        className="absolute inset-y-0 left-0 bg-primary"
                        initial={{ width: 0 }}
                        whileInView={{ width: "100%" }}
                        viewport={{ once: true }}
                        transition={{ duration: 1.4, ease: [0.16, 1, 0.3, 1] }}
                      />
                    </span>
                    <span>{ed.endDate.split(" ")[1]}</span>
                  </div>
                  <div className="mt-6">
                    <h3 className="font-display text-xl font-semibold tracking-tight text-foreground">{ed.degree}</h3>
                    <p className="mt-1.5 text-sm text-muted-foreground">
                      {ed.institution}
                      {ed.location ? ` · ${ed.location}` : ""}
                    </p>
                    <p className="mt-1 font-mono text-[11px] text-muted-foreground/80">
                      {ed.startDate} — {ed.endDate}
                    </p>
                    {ed.description && (
                      <p className="mt-4 text-sm leading-relaxed text-muted-foreground">{ed.description}</p>
                    )}
                    {ed.cgpa && (
                      <div className="mt-6 inline-flex items-baseline gap-3 rounded-xl border border-primary/25 bg-primary/5 px-5 py-3.5">
                        <span className="font-mono text-[10px] tracking-[0.24em] uppercase text-muted-foreground">
                          CGPA
                        </span>
                        <span className="font-display text-2xl font-semibold text-foreground">
                          <AnimatedCounter value={7.46} decimals={2} suffix=" / 10" />
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </Reveal>

          {/* Certifications + languages */}
          <div className="flex flex-col gap-6">
            {/* Certifications */}
            <Reveal delay={0.08}>
              <div className="rounded-2xl border border-border/70 bg-card p-7 md:p-8">
                <div className="flex items-center gap-3">
                  <Award size={16} className="text-primary" />
                  <span className="font-mono text-[10px] tracking-[0.28em] uppercase text-muted-foreground">
                    Certifications
                  </span>
                </div>
                <div className="mt-5 divide-y divide-border/60">
                  {certifications.map((c) => {
                    const open = openCert === c.id;
                    return (
                      <div key={c.id} className="py-1">
                        <button
                          type="button"
                          onClick={() => setOpenCert(open ? null : c.id)}
                          aria-expanded={open}
                          className="flex w-full items-center justify-between gap-4 rounded-lg px-1 py-3.5 text-left transition-colors hover:bg-background/40 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
                        >
                          <div>
                            <div className="text-sm font-medium text-foreground">{c.title}</div>
                            <div className="mt-0.5 font-mono text-[10px] uppercase tracking-wider text-muted-foreground">
                              {c.issuer}
                            </div>
                          </div>
                          <ChevronDown
                            size={14}
                            className={cn(
                              "shrink-0 text-muted-foreground transition-transform duration-300",
                              open && "rotate-180 text-primary"
                            )}
                          />
                        </button>
                        <AnimatePresence initial={false}>
                          {open && (
                            <motion.p
                              initial={{ height: 0, opacity: 0 }}
                              animate={{ height: "auto", opacity: 1 }}
                              exit={{ height: 0, opacity: 0 }}
                              transition={{ duration: 0.3 }}
                              className="overflow-hidden pl-1 text-sm leading-relaxed text-muted-foreground"
                            >
                              Verified certification covering {c.title.toLowerCase()} — fundamentals, practical
                              application and assessment, completed through {c.issuer}.
                            </motion.p>
                          )}
                        </AnimatePresence>
                      </div>
                    );
                  })}
                </div>
              </div>
            </Reveal>

            {/* Languages */}
            <Reveal delay={0.14}>
              <div className="rounded-2xl border border-border/70 bg-card p-7 md:p-8">
                <div className="flex items-center gap-3">
                  <LanguagesIcon size={16} className="text-primary" />
                  <span className="font-mono text-[10px] tracking-[0.28em] uppercase text-muted-foreground">
                    Languages
                  </span>
                </div>
                <div className="mt-5 grid grid-cols-2 gap-4">
                  {languages.map((lang, i) => (
                    <motion.div
                      key={lang.name}
                      className="rounded-xl border border-border/60 bg-background/50 p-5"
                      initial={{ opacity: 0, y: 14 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      transition={{ delay: i * 0.12, duration: 0.5 }}
                    >
                      <div className="font-display text-lg font-semibold text-foreground">{lang.name}</div>
                      <div className="mt-1.5 flex items-center gap-2">
                        <span className="h-1.5 w-10 overflow-hidden rounded-full bg-border">
                          <motion.span
                            className="block h-full rounded-full bg-primary"
                            initial={{ width: 0 }}
                            whileInView={{ width: lang.level === "Native" ? "100%" : lang.level === "Fluent" ? "80%" : "45%" }}
                            viewport={{ once: true }}
                            transition={{ delay: 0.3 + i * 0.12, duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
                          />
                        </span>
                        <span className="font-mono text-[10px] uppercase tracking-wider text-primary">
                          {lang.level}
                        </span>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>
            </Reveal>
          </div>
        </div>
      </div>
    </section>
  );
}
