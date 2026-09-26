"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { cn } from "@/lib/utils";

interface RotatingTextProps {
  words: string[];
  className?: string;
  interval?: number;
}

/** Animated word cycler — "I turn ideas into {web applications}." */
export function RotatingText({ words, className, interval = 2600 }: RotatingTextProps) {
  const [i, setI] = useState(0);
  const reduce = useReducedMotion();

  useEffect(() => {
    const t = setInterval(() => setI((v) => (v + 1) % words.length), interval);
    return () => clearInterval(t);
  }, [words, interval]);

  const word = words[i] ?? words[0];

  return (
    <span className={cn("relative inline-grid overflow-hidden text-primary", className)}>
      <AnimatePresence mode="wait" initial={false}>
        <motion.span
          key={word}
          className="inline-block"
          initial={reduce ? { opacity: 0 } : { y: "108%", opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={reduce ? { opacity: 0 } : { y: "-108%", opacity: 0 }}
          transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
        >
          {word}
        </motion.span>
      </AnimatePresence>
    </span>
  );
}
