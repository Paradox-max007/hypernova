"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ChevronDown, GraduationCap } from "lucide-react";
import { RotatingText } from "./rotating-text";
import { Reveal } from "./reveal";
import { cn } from "@/lib/utils";

const WORDS = [
  "web applications.",
  "interactive experiences.",
  "AI-powered systems.",
  "data-driven solutions.",
  "digital products.",
];

const FACTS = [
  { label: "BCA", value: "Mar Augusthinose College" },
  { label: "CGPA", value: "7.46 / 10" },
  { label: "Class of", value: "2021 — 2024" },
];

/** "What I do" — animated statement + expandable background. */
export function IntroSection() {
  const [expanded, setExpanded] = useState(false);

  return (
    <section id="intro" className="relative border-t border-border/60 py-24 md:py-32">
      <div className="mx-auto w-[min(92%,72rem)]">
        <Reveal>
          <div className="font-mono text-[11px] tracking-[0.25em] uppercase text-muted-foreground">
            <span className="text-primary">◆</span> What I do
          </div>
        </Reveal>
        <Reveal delay={0.1}>
          <h2 className="mt-6 max-w-4xl font-display text-3xl font-semibold leading-[1.15] tracking-tight text-foreground sm:text-4xl md:text-[2.9rem]">
            I turn ideas into <RotatingText words={WORDS} className="font-display" interval={2500} />
          </h2>
        </Reveal>

        <Reveal delay={0.2}>
          <button
            type="button"
            onClick={() => setExpanded((v) => !v)}
            aria-expanded={expanded}
            className={cn(
              "group mt-9 inline-flex items-center gap-2 rounded-full border px-5 py-2.5 font-mono text-[11px] tracking-[0.18em] uppercase transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring",
              expanded
                ? "border-primary/50 bg-primary/10 text-primary"
                : "border-border text-muted-foreground hover:border-primary/40 hover:text-primary"
            )}
          >
            <GraduationCap size={14} strokeWidth={1.75} />
            {expanded ? "Close" : "More about me"}
            <ChevronDown
              size={14}
              strokeWidth={1.75}
              className={cn("transition-transform duration-300", expanded && "rotate-180")}
            />
          </button>
        </Reveal>

        <AnimatePresence initial={false}>
          {expanded && (
            <motion.div
              key="more"
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
              className="overflow-hidden"
            >
              <div className="mt-8 max-w-3xl border-l-2 border-primary/40 pl-6">
                <p className="text-base leading-relaxed text-muted-foreground md:text-lg">
                  I&apos;m a computer applications graduate whose work spans data science, machine learning, web
                  development and application development. The degree gave me the foundations — the work gave me
                  the practice: a year of production development on a live UAE platform, realtime multiplayer
                  hobby projects, and full-stack systems built end-to-end from college onward.
                </p>
                <div className="mt-6 flex flex-wrap gap-3">
                  {FACTS.map((f) => (
                    <div
                      key={f.label}
                      className="rounded-lg border border-border/80 bg-card px-4 py-2.5"
                    >
                      <div className="font-mono text-[9px] tracking-[0.24em] uppercase text-muted-foreground">
                        {f.label}
                      </div>
                      <div className="mt-0.5 text-sm font-medium text-foreground">{f.value}</div>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </section>
  );
}
