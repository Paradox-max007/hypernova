"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Menu, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { ThemeToggle } from "./theme-toggle";
import { ResumeButton } from "./resume-button";

const LINKS = [
  { label: "Work", hash: "#work", id: "work" },
  { label: "Experience", hash: "#experience", id: "experience" },
  { label: "Skills", hash: "#skills", id: "skills" },
  { label: "About", hash: "#about", id: "about" },
  { label: "Contact", hash: "#contact", id: "contact" },
] as const;

/** Floating navigation — docks into a frosted pill once the visitor scrolls. */
export function Navigation() {
  const [scrolled, setScrolled] = useState(false);
  const [active, setActive] = useState<string | null>(null);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 32);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Track which section is currently in view (home view only)
  useEffect(() => {
    const sections = LINKS.map((l) => document.getElementById(l.id)).filter((el): el is HTMLElement => !!el);
    if (sections.length === 0) return;
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) setActive(entry.target.id);
        }
      },
      { rootMargin: "-40% 0px -55% 0px" }
    );
    sections.forEach((s) => observer.observe(s));
    return () => observer.disconnect();
  }, []);

  // Close the mobile menu whenever the route changes
  useEffect(() => {
    const close = () => setMenuOpen(false);
    window.addEventListener("hashchange", close);
    return () => window.removeEventListener("hashchange", close);
  }, []);

  useEffect(() => {
    document.body.style.overflow = menuOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [menuOpen]);

  return (
    <>
      <header className="fixed inset-x-0 top-0 z-50">
        <div
          className={cn(
            "mx-auto flex h-16 items-center justify-between gap-4 transition-all duration-500",
            scrolled
              ? "mt-3 w-[min(96%,72rem)] rounded-2xl border border-border/70 bg-background/80 px-4 shadow-lg shadow-black/5 backdrop-blur-xl md:px-6"
              : "w-full border-b border-transparent bg-transparent px-5 md:px-10"
          )}
        >
          {/* Wordmark */}
          <a
            href="#hero"
            className="group flex items-center gap-2.5 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-ring"
            aria-label="Jyothilal Reji — home"
          >
            <span className="relative flex size-2">
              <span className="absolute inline-flex size-2 animate-ping rounded-full bg-primary opacity-60" />
              <span className="relative inline-flex size-2 rounded-full bg-primary" />
            </span>
            <span className="font-display text-sm font-bold tracking-[0.14em] text-foreground md:text-[15px]">
              JYOTHILAL<span className="text-primary">.</span>REJI
            </span>
          </a>

          {/* Desktop links */}
          <nav className="hidden items-center gap-1 lg:flex" aria-label="Primary">
            {LINKS.map((link, i) => (
              <a
                key={link.id}
                href={link.hash}
                className={cn(
                  "group relative rounded-full px-4 py-2 font-mono text-[11px] tracking-[0.2em] uppercase transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring",
                  active === link.id ? "text-primary" : "text-muted-foreground hover:text-foreground"
                )}
              >
                <span className="mr-1.5 text-[9px] text-primary/70">0{i + 1}</span>
                {link.label}
                {active === link.id && (
                  <motion.span
                    layoutId="nav-active"
                    className="absolute inset-0 -z-10 rounded-full border border-primary/30 bg-primary/10"
                    transition={{ type: "spring", stiffness: 380, damping: 32 }}
                  />
                )}
              </a>
            ))}
          </nav>

          <div className="flex items-center gap-2.5">
            <ThemeToggle />
            <ResumeButton compact className="hidden sm:inline-flex" />
            {/* Mobile menu trigger */}
            <button
              type="button"
              onClick={() => setMenuOpen((v) => !v)}
              aria-expanded={menuOpen}
              aria-label={menuOpen ? "Close menu" : "Open menu"}
              className="inline-flex size-9 items-center justify-center rounded-full border border-border/80 text-foreground transition-colors hover:border-primary/50 hover:text-primary lg:hidden"
            >
              {menuOpen ? <X size={16} /> : <Menu size={16} />}
            </button>
          </div>
        </div>
      </header>

      {/* Mobile overlay menu */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            className="fixed inset-0 z-40 flex flex-col bg-background/95 backdrop-blur-2xl lg:hidden"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
          >
            <div className="grid-bg pointer-events-none absolute inset-0 opacity-60" />
            <nav className="relative mt-28 flex flex-col gap-1 px-8" aria-label="Mobile">
              {LINKS.map((link, i) => (
                <motion.a
                  key={link.id}
                  href={link.hash}
                  className="group flex items-baseline gap-4 border-b border-border/60 py-5"
                  initial={{ opacity: 0, x: -24 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -16 }}
                  transition={{ delay: 0.05 + i * 0.06, duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
                >
                  <span className="font-mono text-xs text-primary">0{i + 1}</span>
                  <span className="font-display text-3xl font-semibold tracking-tight text-foreground transition-colors group-hover:text-primary">
                    {link.label}
                  </span>
                </motion.a>
              ))}
              <motion.div
                className="mt-8 flex items-center gap-4"
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4, duration: 0.4 }}
              >
                <ResumeButton />
              </motion.div>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
