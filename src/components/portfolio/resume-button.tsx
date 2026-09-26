"use client";

import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowDownToLine, Check, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

type State = "idle" | "preparing" | "done";

/** Download CV with the PRD's "Preparing your CV… → Download" micro-animation. */
export function ResumeButton({ className, compact = false }: { className?: string; compact?: boolean }) {
  const [state, setState] = useState<State>("idle");
  const anchorRef = useRef<HTMLAnchorElement>(null);

  useEffect(() => {
    if (state !== "done") return;
    const t = setTimeout(() => setState("idle"), 2400);
    return () => clearTimeout(t);
  }, [state]);

  const handleClick = () => {
    if (state !== "idle") return;
    setState("preparing");
    setTimeout(() => {
      anchorRef.current?.click();
      setState("done");
    }, 1100);
  };

  return (
    <button
      type="button"
      onClick={handleClick}
      className={cn(
        "group relative inline-flex items-center justify-center gap-2 overflow-hidden rounded-full border border-primary/40 bg-primary/10 font-mono text-[11px] font-medium tracking-[0.18em] uppercase text-primary transition-all hover:border-primary hover:bg-primary hover:text-primary-foreground focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring",
        compact ? "h-9 px-4" : "h-10 px-5",
        className
      )}
      aria-label="Download CV (PDF)"
    >
      <AnimatePresence mode="wait" initial={false}>
        {state === "idle" && (
          <motion.span
            key="idle"
            className="inline-flex items-center gap-2"
            initial={{ y: 12, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: -12, opacity: 0 }}
            transition={{ duration: 0.22 }}
          >
            <ArrowDownToLine size={13} strokeWidth={2} />
            Resume
          </motion.span>
        )}
        {state === "preparing" && (
          <motion.span
            key="prep"
            className="inline-flex items-center gap-2"
            initial={{ y: 12, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: -12, opacity: 0 }}
            transition={{ duration: 0.22 }}
          >
            <Loader2 size={13} className="animate-spin" />
            Preparing CV…
          </motion.span>
        )}
        {state === "done" && (
          <motion.span
            key="done"
            className="inline-flex items-center gap-2"
            initial={{ y: 12, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: -12, opacity: 0 }}
            transition={{ duration: 0.22 }}
          >
            <Check size={13} strokeWidth={2.5} />
            Download started
          </motion.span>
        )}
      </AnimatePresence>
      <a
        ref={anchorRef}
        href="/jyothilal-reji-cv.pdf"
        download="Jyothilal-Reji-CV.pdf"
        className="absolute inset-0 size-0 opacity-0"
        tabIndex={-1}
        aria-hidden
      />
    </button>
  );
}
