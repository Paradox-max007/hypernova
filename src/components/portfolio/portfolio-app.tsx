"use client";

import { useEffect, useMemo, useRef } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { ArrowLeft, FolderOpen } from "lucide-react";
import type { PortfolioData } from "@/lib/types";
import type { LanguageEntry } from "@/lib/types";
import { useHashRoute } from "@/lib/use-hash-route";
import { cn } from "@/lib/utils";
import { Navigation } from "./navigation";
import { Footer } from "./footer";
import { Hero } from "./hero";
import { IntroSection } from "./intro-section";
import { WorkSection } from "./work-section";
import { ExperienceSection } from "./experience-section";
import { SkillsSection } from "./skills-section";
import { AboutSection } from "./about-section";
import { ContactSection } from "./contact-section";
import { ProjectDetail } from "./project-detail";
import { WorkView } from "./work-view";
import { AdminPanel } from "./admin/admin-panel";
import { EasterEggs } from "./easter-eggs";

export function PortfolioApp({ data }: { data: PortfolioData }) {
  const { route } = useHashRoute();
  const reduce = useReducedMotion();
  const prevView = useRef<string>("home");

  const languages: LanguageEntry[] = useMemo(() => {
    try {
      return JSON.parse(data.settings["languages"] ?? "[]") as LanguageEntry[];
    } catch {
      return [];
    }
  }, [data.settings]);

  const email = data.settings["contact.email"] ?? "hello@example.com";
  const github = data.settings["contact.github"] ?? "https://github.com";
  const linkedin = data.settings["contact.linkedin"] ?? "https://linkedin.com";
  const location = data.settings["contact.location"] ?? "Kerala, India · Working with clients worldwide";

  const viewKey =
    route.view === "project" ? `project-${route.slug}` : route.view === "home" ? "home" : route.view;
  const routeSection = route.view === "home" ? route.section : undefined;

  /* Scroll management per route change */
  useEffect(() => {
    const switchedViews = prevView.current !== viewKey;
    prevView.current = viewKey;

    if (routeSection) {
      const delay = switchedViews ? 420 : 0;
      const t = setTimeout(() => {
        document.getElementById(routeSection)?.scrollIntoView({
          behavior: reduce ? "auto" : "smooth",
          block: "start",
        });
      }, delay);
      return () => clearTimeout(t);
    }
    if (switchedViews) {
      window.scrollTo({ top: 0 });
    }
  }, [viewKey, routeSection, reduce]);

  const project =
    route.view === "project" ? data.projects.find((p) => p.slug === route.slug) ?? null : null;

  return (
    <div className="theme-anim relative flex min-h-screen flex-col bg-background">
      {/* The client-side navigation is hidden on the admin view — the admin console
          renders its own header, so only one top navbar is visible there. */}
      {route.view !== "admin" && <Navigation />}

      <AnimatePresence mode="wait">
        <motion.main
          key={viewKey}
          className="flex flex-1 flex-col"
          initial={reduce ? { opacity: 0 } : { opacity: 0, y: 16, scale: 0.995 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={reduce ? { opacity: 0 } : { opacity: 0, y: -12, scale: 0.995 }}
          transition={{ duration: 0.38, ease: [0.16, 1, 0.3, 1] }}
        >
          {route.view === "home" && (
            <>
              <Hero location={location} />
              <IntroSection />
              <WorkSection projects={data.projects} />
              <ExperienceSection experience={data.experience} />
              <SkillsSection technologies={data.technologies} projects={data.projects} />
              <AboutSection
                education={data.education}
                certifications={data.certifications}
                languages={languages}
              />
              <ContactSection email={email} github={github} linkedin={linkedin} />
              <Footer email={email} github={github} linkedin={linkedin} location={location} />
            </>
          )}

          {route.view === "work" && (
            <>
              <WorkView projects={data.projects} />
              <Footer email={email} github={github} linkedin={linkedin} location={location} />
            </>
          )}

          {route.view === "project" && (
            <>
              {project ? (
                <ProjectDetail project={project} allProjects={data.projects} />
              ) : (
                <div className="mx-auto flex w-[min(92%,48rem)] flex-col items-center py-40 text-center">
                  <span className="font-mono text-[10px] tracking-[0.3em] uppercase text-primary">404</span>
                  <h1 className="mt-4 font-display text-4xl font-semibold tracking-tight">
                    Project not found
                  </h1>
                  <p className="mt-3 text-muted-foreground">
                    The case study you&apos;re looking for doesn&apos;t exist — it may have been renamed.
                  </p>
                  <a
                    href="#/work"
                    className="mt-8 inline-flex items-center gap-2 rounded-full border border-border px-6 py-3 text-sm font-medium transition-colors hover:border-primary/50 hover:text-primary"
                  >
                    <ArrowLeft size={15} />
                    Back to all work
                  </a>
                </div>
              )}
              <Footer email={email} github={github} linkedin={linkedin} location={location} />
            </>
          )}

          {route.view === "admin" && <AdminPanel />}
        </motion.main>
      </AnimatePresence>

      <EasterEggs />
    </div>
  );
}

/* Small shared empty state used by the work view */
export function EmptyState({ label }: { label: string }) {
  return (
    <div className={cn("flex flex-col items-center py-20 text-center")}>
      <FolderOpen size={22} className="text-primary/60" />
      <p className="mt-3 text-sm text-muted-foreground">{label}</p>
    </div>
  );
}
