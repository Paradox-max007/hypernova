"use client";

import type { ReactNode } from "react";
import { cn } from "@/lib/utils";
import { Reveal } from "./reveal";

interface SectionHeadingProps {
  index: string;
  label: string;
  title: ReactNode;
  description?: string;
  action?: ReactNode;
  className?: string;
}

/** Numbered section header — mono index chip + display title. */
export function SectionHeading({ index, label, title, description, action, className }: SectionHeadingProps) {
  return (
    <div className={cn("mb-12 md:mb-16", className)}>
      <Reveal>
        <div className="flex items-center gap-3 font-mono text-[11px] tracking-[0.25em] uppercase text-muted-foreground">
          <span className="inline-block size-1.5 rotate-45 bg-primary" aria-hidden />
          <span className="text-primary">{index}</span>
          <span aria-hidden>—</span>
          <span>{label}</span>
        </div>
      </Reveal>
      <Reveal delay={0.08}>
        <div className="mt-5 flex flex-wrap items-end justify-between gap-6">
          <h2 className="font-display text-3xl font-semibold leading-[1.05] tracking-tight text-foreground sm:text-4xl md:text-5xl">
            {title}
          </h2>
          {action ? <div className="pb-1">{action}</div> : null}
        </div>
      </Reveal>
      {description ? (
        <Reveal delay={0.16}>
          <p className="mt-5 max-w-2xl text-base leading-relaxed text-muted-foreground md:text-lg">{description}</p>
        </Reveal>
      ) : null}
    </div>
  );
}
