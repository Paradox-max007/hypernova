"use client";

import { motion, useReducedMotion } from "framer-motion";
import { ArrowRight, ChevronDown, MapPin, Sparkles } from "lucide-react";
import { DigitalCore } from "./digital-core";

interface HeroProps {
  location: string;
}

const container = {
  hidden: {},
  show: { transition: { staggerChildren: 0.12, delayChildren: 0.15 } },
};

const item = {
  hidden: { opacity: 0, y: 26 },
  show: { opacity: 1, y: 0, transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] as const } },
};

export function Hero({ location }: HeroProps) {
  const reduce = useReducedMotion();

  return (
    <section id="hero" className="relative flex min-h-screen items-center overflow-hidden">
      {/* Layered background: grid + radial glow */}
      <div className="grid-bg pointer-events-none absolute inset-0" />
      <div
        className="pointer-events-none absolute inset-0 opacity-70"
        style={{
          background:
            "radial-gradient(42rem 30rem at 78% 30%, oklch(0.78 0.155 160 / 0.12), transparent 70%), radial-gradient(34rem 26rem at 12% 80%, oklch(0.78 0.155 160 / 0.07), transparent 70%)",
        }}
      />
      <div className="pointer-events-none absolute -right-24 -top-24 size-96 rounded-full border border-primary/10" />
      <div className="pointer-events-none absolute -right-10 top-20 size-56 rounded-full border border-primary/10" />

      <div className="relative mx-auto grid w-[min(92%,72rem)] items-center gap-14 pb-24 pt-32 lg:grid-cols-[1.05fr_0.95fr] lg:gap-6 lg:pb-28">
        {/* Copy */}
        <motion.div variants={container} initial={reduce ? undefined : "hidden"} animate="show">
          <motion.div variants={item}>
            <div className="inline-flex items-center gap-2.5 rounded-full border border-primary/30 bg-primary/10 px-3.5 py-1.5 font-mono text-[10px] tracking-[0.24em] uppercase text-primary">
              <span className="relative flex size-1.5">
                <span className="absolute inline-flex size-1.5 animate-ping rounded-full bg-primary opacity-60" />
                <span className="relative inline-flex size-1.5 rounded-full bg-primary" />
              </span>
              System online — available for projects
            </div>
          </motion.div>

          <motion.h1
            variants={item}
            className="mt-7 font-display text-[2.55rem] font-semibold leading-[1.04] tracking-tight text-foreground sm:text-6xl lg:text-[3.9rem]"
          >
            I build digital products, <span className="text-primary text-glow">intelligent systems</span> and
            experiences people actually want to use.
          </motion.h1>

          <motion.p
            variants={item}
            className="mt-7 flex flex-wrap items-center gap-x-3 gap-y-2 font-mono text-[11px] tracking-[0.22em] uppercase text-muted-foreground"
          >
            <span className="text-foreground">Full Stack Developer</span>
            <span className="text-primary" aria-hidden>◆</span>
            <span className="text-foreground">Data Science</span>
            <span className="text-primary" aria-hidden>◆</span>
            <span className="text-foreground">Machine Learning</span>
          </motion.p>

          <motion.div variants={item} className="mt-10 flex flex-wrap items-center gap-4">
            <a
              href="#work"
              className="group inline-flex h-12 items-center gap-2.5 rounded-full bg-primary px-7 text-sm font-semibold text-primary-foreground transition-all hover:shadow-[0_0_36px_oklch(0.78_0.155_160/0.4)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
            >
              Explore My Work
              <ArrowRight size={16} strokeWidth={2} className="transition-transform group-hover:translate-x-1" />
            </a>
            <a
              href="#contact"
              className="group inline-flex h-12 items-center gap-2.5 rounded-full border border-border px-7 text-sm font-semibold text-foreground transition-all hover:border-primary/60 hover:text-primary focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
            >
              <Sparkles size={15} strokeWidth={1.75} className="text-primary" />
              Let&apos;s Build Something
            </a>
          </motion.div>

          <motion.p
            variants={item}
            className="mt-10 flex items-center gap-2 text-sm text-muted-foreground"
          >
            <MapPin size={14} strokeWidth={1.75} className="shrink-0 text-primary/80" />
            {location}
          </motion.p>
        </motion.div>

        {/* Interactive core */}
        <motion.div
          className="mx-auto w-full max-w-[300px] sm:max-w-[420px] lg:max-w-[520px]"
          initial={reduce ? { opacity: 0 } : { opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1.1, delay: 0.35, ease: [0.16, 1, 0.3, 1] }}
        >
          <DigitalCore className="text-primary" />
        </motion.div>
      </div>

      {/* Scroll cue */}
      <motion.a
        href="#intro"
        className="absolute bottom-7 left-1/2 hidden -translate-x-1/2 flex-col items-center gap-2 text-muted-foreground transition-colors hover:text-primary md:flex"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.4, duration: 0.8 }}
        aria-label="Scroll to introduction"
      >
        <span className="font-mono text-[9px] tracking-[0.34em] uppercase">Scroll</span>
        <motion.span animate={reduce ? undefined : { y: [0, 6, 0] }} transition={{ duration: 1.8, repeat: Infinity }}>
          <ChevronDown size={16} strokeWidth={1.75} />
        </motion.span>
      </motion.a>
    </section>
  );
}
