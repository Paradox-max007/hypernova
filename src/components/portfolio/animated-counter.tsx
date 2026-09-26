"use client";

import { useEffect, useRef, useState } from "react";
import { animate, useInView, useReducedMotion } from "framer-motion";
import { cn } from "@/lib/utils";

interface AnimatedCounterProps {
  value: number;
  suffix?: string;
  prefix?: string;
  decimals?: number;
  className?: string;
  suffixClassName?: string;
}

/** Counts up when scrolled into view. Grounded only in resume-backed numbers. */
export function AnimatedCounter({
  value,
  suffix = "",
  prefix = "",
  decimals = 0,
  className,
  suffixClassName,
}: AnimatedCounterProps) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, margin: "-40px" });
  const reduce = useReducedMotion();
  const [display, setDisplay] = useState((0).toFixed(decimals));

  useEffect(() => {
    if (!inView) return;
    if (reduce) {
      const raf = requestAnimationFrame(() => setDisplay(value.toFixed(decimals)));
      return () => cancelAnimationFrame(raf);
    }
    const controls = animate(0, value, {
      duration: 1.8,
      ease: [0.16, 1, 0.3, 1],
      onUpdate: (v) => setDisplay(v.toFixed(decimals)),
    });
    return () => controls.stop();
  }, [inView, value, decimals, reduce]);

  return (
    <span ref={ref} className={cn("tabular-nums", className)}>
      {prefix}
      {display}
      {suffix ? <span className={cn("ml-0.5 text-primary", suffixClassName)}>{suffix}</span> : null}
    </span>
  );
}
