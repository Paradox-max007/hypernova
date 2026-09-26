"use client";

import { useMemo, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowUpRight, Boxes, CircleDot, MousePointerClick } from "lucide-react";
import type { Project, Technology } from "@/lib/types";
import { cn } from "@/lib/utils";
import { SectionHeading } from "./section-heading";
import { Reveal } from "./reveal";

interface SkillsSectionProps {
  technologies: Technology[];
  projects: Project[];
}

/* Constellation layout — deterministic, computed once per render */
const HUBS: Record<string, { x: number; y: number; r: number; angle: number }> = {
  Languages: { x: 195, y: 150, r: 66, angle: 0.35 },
  Web: { x: 475, y: 95, r: 80, angle: 1.15 },
  "Data & ML": { x: 755, y: 150, r: 66, angle: 2.05 },
  "ML Algorithms": { x: 800, y: 432, r: 74, angle: 2.95 },
  Visualization: { x: 560, y: 572, r: 52, angle: 3.85 },
  Tools: { x: 205, y: 470, r: 74, angle: 4.75 },
};

const CENTER = { x: 500, y: 320 };

const RELATED: Record<string, string[]> = {
  Python: ["Pandas", "NumPy", "Scikit-learn", "TensorFlow", "Keras"],
  JavaScript: ["React", "TypeScript", "Tailwind CSS"],
  TypeScript: ["React", "Supabase", "Tailwind CSS"],
  React: ["TypeScript", "Supabase", "Capacitor"],
  Django: ["Python", "MySQL"],
  SQL: ["MySQL", "Pandas"],
  "Power BI": ["Matplotlib", "Seaborn"],
  "Scikit-learn": ["Random Forest", "SVM", "KNN"],
};

interface Node {
  tech: Technology;
  x: number;
  y: number;
  tx: number;
  ty: number;
  anchor: "start" | "middle" | "end";
  hub: { x: number; y: number };
}

export function SkillsSection({ technologies, projects }: SkillsSectionProps) {
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [hoverId, setHoverId] = useState<string | null>(null);
  const panelRef = useRef<HTMLDivElement>(null);

  const categories = useMemo(() => {
    const map = new Map<string, Technology[]>();
    for (const t of technologies) {
      if (!map.has(t.category)) map.set(t.category, []);
      map.get(t.category)!.push(t);
    }
    return [...map.entries()];
  }, [technologies]);

  const nodes = useMemo<Node[]>(() => {
    const r2 = (v: number) => Math.round(v * 100) / 100;
    const result: Node[] = [];
    for (const [cat, techs] of categories) {
      const hub = HUBS[cat];
      if (!hub) continue;
      techs.forEach((tech, i) => {
        const a = hub.angle + (i / techs.length) * Math.PI * 2;
        const x = r2(hub.x + Math.cos(a) * hub.r);
        const y = r2(hub.y + Math.sin(a) * hub.r);
        const dirX = Math.cos(a);
        const dirY = Math.sin(a);
        const anchor: "start" | "middle" | "end" =
          Math.abs(dirX) < 0.35 ? "middle" : dirX > 0 ? "start" : "end";
        result.push({
          tech,
          x,
          y,
          tx: r2(x + dirX * 17),
          ty: r2(y + dirY * 17 + 4),
          anchor,
          hub: { x: hub.x, y: hub.y },
        });
      });
    }
    return result;
  }, [categories]);

  const selected = technologies.find((t) => t.id === selectedId) ?? null;
  const focusId = selectedId ?? hoverId;
  const focus = focusId ? nodes.find((n) => n.tech.id === focusId) : null;

  const relatedFor = (tech: Technology): Technology[] => {
    const names = RELATED[tech.name];
    if (names) {
      const found = names.map((n) => technologies.find((t) => t.name === n)).filter((t): t is Technology => !!t);
      if (found.length) return found;
    }
    return technologies.filter((t) => t.category === tech.category && t.id !== tech.id).slice(0, 5);
  };

  const selectTech = (id: string) => {
    setSelectedId(id === selectedId ? null : id);
    if (window.innerWidth < 1024) {
      setTimeout(() => panelRef.current?.scrollIntoView({ behavior: "smooth", block: "nearest" }), 60);
    }
  };

  const projectsUsing = (tech: Technology) =>
    projects.filter((p) => p.technologies.some((t) => t.id === tech.id));

  return (
    <section id="skills" className="relative border-t border-border/60 py-24 md:py-32">
      <div className="mx-auto w-[min(92%,72rem)]">
        <SectionHeading
          index="03"
          label="Skills"
          title={
            <>
              The technology <span className="text-primary">constellation.</span>
            </>
          }
          description="No percentage bars. Every node is real, grounded in shipped work — select any technology to see what it's used for and which projects it powers."
        />

        {/* ------------------------- Desktop constellation ------------------------- */}
        <Reveal className="hidden lg:block">
          <div className="relative overflow-hidden rounded-2xl border border-border/70 bg-card/40">
            <div className="grid-bg absolute inset-0 opacity-50" />
            <svg viewBox="0 0 1000 640" className="relative w-full">
              {/* Center → hub links */}
              {categories.map(([cat]) => {
                const hub = HUBS[cat];
                if (!hub) return null;
                return (
                  <line
                    key={`c-${cat}`}
                    x1={CENTER.x}
                    y1={CENTER.y}
                    x2={hub.x}
                    y2={hub.y}
                    stroke="var(--primary)"
                    strokeOpacity="0.28"
                    strokeWidth="1"
                    strokeDasharray="4 6"
                    className="animate-dash-flow"
                  />
                );
              })}

              {/* Hub → skill links */}
              {nodes.map((n) => {
                const lit = focus ? n.tech.id === focus.tech.id : false;
                return (
                  <line
                    key={`l-${n.tech.id}`}
                    x1={n.hub.x}
                    y1={n.hub.y}
                    x2={n.x}
                    y2={n.y}
                    stroke="var(--primary)"
                    strokeOpacity={lit ? 0.85 : 0.2}
                    strokeWidth={lit ? 1.4 : 0.8}
                    className="transition-all duration-300"
                  />
                );
              })}

              {/* Center core */}
              <motion.circle
                cx={CENTER.x}
                cy={CENTER.y}
                r="26"
                fill="none"
                stroke="var(--primary)"
                strokeOpacity="0.5"
                initial={{ r: 26, opacity: 0.5 }}
                animate={{ r: [26, 34, 26], opacity: [0.5, 0.15, 0.5] }}
                transition={{ duration: 3.4, repeat: Infinity, ease: "easeInOut" }}
              />
              <circle cx={CENTER.x} cy={CENTER.y} r="20" fill="var(--primary)" fillOpacity="0.12" stroke="var(--primary)" strokeWidth="1.2" />
              <text x={CENTER.x} y={CENTER.y + 4} textAnchor="middle" fontSize="11" className="font-mono" fill="var(--primary)" letterSpacing="2">
                CORE
              </text>

              {/* Category hubs */}
              {categories.map(([cat, techs]) => {
                const hub = HUBS[cat];
                if (!hub) return null;
                const lit = focus?.hub.x === hub.x && focus?.hub.y === hub.y;
                return (
                  <g key={`h-${cat}`}>
                    <circle
                      cx={hub.x}
                      cy={hub.y}
                      r="9"
                      fill="var(--primary)"
                      fillOpacity={lit ? 0.9 : 0.45}
                      className="transition-all duration-300"
                    />
                    <circle cx={hub.x} cy={hub.y} r="15" fill="none" stroke="var(--primary)" strokeOpacity={lit ? 0.5 : 0.2} />
                    <text
                      x={hub.x}
                      y={hub.y + 32}
                      textAnchor="middle"
                      fontSize="11.5"
                      className="font-mono uppercase"
                      fill="var(--foreground)"
                      letterSpacing="1.5"
                      opacity="0.85"
                    >
                      {cat}
                    </text>
                    <text x={hub.x} y={hub.y + 46} textAnchor="middle" fontSize="9.5" className="font-mono" fill="var(--muted-foreground)" opacity="0.7">
                      {techs.length} technologies
                    </text>
                  </g>
                );
              })}

              {/* Skill nodes */}
              {nodes.map((n) => {
                const isSel = selectedId === n.tech.id;
                const isFocus = focusId === n.tech.id;
                return (
                  <g
                    key={n.tech.id}
                    onClick={() => selectTech(n.tech.id)}
                    onMouseEnter={() => setHoverId(n.tech.id)}
                    onMouseLeave={() => setHoverId(null)}
                    className="cursor-pointer"
                    role="button"
                    aria-label={`${n.tech.name} — ${n.tech.category}`}
                  >
                    <circle cx={n.x} cy={n.y} r="16" fill="transparent" />
                    <motion.circle
                      cx={n.x}
                      cy={n.y}
                      r={isSel ? 7 : 5}
                      fill={isFocus ? "var(--primary)" : "var(--background)"}
                      stroke="var(--primary)"
                      strokeWidth={isFocus ? 2 : 1.2}
                      initial={{ scale: 1 }}
                      animate={{ scale: isFocus ? 1.25 : 1 }}
                      transition={{ type: "spring", stiffness: 320, damping: 18 }}
                      style={{ transformBox: "view-box", transformOrigin: `${n.x}px ${n.y}px` }}
                    />
                    <text
                      x={n.tx}
                      y={n.ty}
                      textAnchor={n.anchor}
                      fontSize="12.5"
                      className="font-mono"
                      fill={isFocus ? "var(--primary)" : "var(--muted-foreground)"}
                    >
                      {n.tech.name}
                    </text>
                  </g>
                );
              })}
            </svg>

            <div className="absolute bottom-4 right-5 flex items-center gap-2 font-mono text-[10px] tracking-[0.2em] uppercase text-muted-foreground">
              <MousePointerClick size={13} />
              Click a node to explore
            </div>
          </div>
        </Reveal>

        {/* ------------------- Mobile / tablet category groups ------------------- */}
        <div className="space-y-8 lg:hidden">
          {categories.map(([cat, techs], i) => (
            <Reveal key={cat} delay={Math.min(i * 0.05, 0.2)}>
              <div>
                <div className="flex items-center gap-3">
                  <CircleDot size={13} className="text-primary" />
                  <span className="font-mono text-[11px] tracking-[0.26em] uppercase text-foreground">{cat}</span>
                  <span className="font-mono text-[10px] text-muted-foreground">{techs.length}</span>
                </div>
                <div className="mt-4 flex flex-wrap gap-2">
                  {techs.map((t) => (
                    <button
                      key={t.id}
                      type="button"
                      onClick={() => selectTech(t.id)}
                      className={cn(
                        "rounded-full border px-4 py-2 text-sm transition-all active:scale-95",
                        selectedId === t.id
                          ? "border-primary bg-primary text-primary-foreground"
                          : "border-border bg-card text-muted-foreground hover:border-primary/50 hover:text-primary"
                      )}
                      aria-pressed={selectedId === t.id}
                    >
                      {t.name}
                    </button>
                  ))}
                </div>
              </div>
            </Reveal>
          ))}
        </div>

        {/* ------------------------------ Explorer ------------------------------ */}
        <div ref={panelRef} className="mt-10 scroll-mt-28">
          <AnimatePresence mode="wait">
            {selected ? (
              <motion.div
                key={selected.id}
                initial={{ opacity: 0, y: 18 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
                className="grid gap-8 rounded-2xl border border-primary/25 bg-card p-7 md:grid-cols-[1.1fr_1fr] md:p-9"
              >
                {/* Identity */}
                <div>
                  <div className="flex flex-wrap items-center gap-3">
                    <h3 className="font-display text-3xl font-semibold tracking-tight text-foreground">
                      {selected.name}
                    </h3>
                    <span className="rounded-full border border-primary/30 bg-primary/10 px-3 py-1 font-mono text-[10px] tracking-[0.2em] uppercase text-primary">
                      {selected.category}
                    </span>
                  </div>
                  {selected.description && (
                    <p className="mt-4 text-sm leading-relaxed text-muted-foreground md:text-base">
                      {selected.description}
                    </p>
                  )}

                  {selected.usedFor.length > 0 && (
                    <div className="mt-6">
                      <div className="font-mono text-[10px] tracking-[0.28em] uppercase text-muted-foreground">
                        Used for
                      </div>
                      <div className="mt-3 flex flex-wrap gap-2">
                        {selected.usedFor.map((u) => (
                          <span
                            key={u}
                            className="rounded-md border border-border bg-background px-2.5 py-1 font-mono text-[11px] text-foreground/80"
                          >
                            {u}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  <div className="mt-6">
                    <div className="font-mono text-[10px] tracking-[0.28em] uppercase text-muted-foreground">
                      Works well with
                    </div>
                    <div className="mt-3 flex flex-wrap gap-2">
                      {relatedFor(selected).map((t) => (
                        <button
                          key={t.id}
                          type="button"
                          onClick={() => selectTech(t.id)}
                          className="rounded-full border border-border px-3.5 py-1.5 text-xs text-muted-foreground transition-colors hover:border-primary/50 hover:text-primary"
                        >
                          {t.name}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Project connections */}
                <div className="rounded-xl border border-border/70 bg-background/60 p-6">
                  <div className="flex items-center gap-2 font-mono text-[10px] tracking-[0.28em] uppercase text-muted-foreground">
                    <Boxes size={13} className="text-primary" />
                    Ships in {projectsUsing(selected).length} project{projectsUsing(selected).length === 1 ? "" : "s"}
                  </div>
                  <div className="mt-4 space-y-2">
                    {projectsUsing(selected).map((p) => (
                      <a
                        key={p.id}
                        href={`#/work/${p.slug}`}
                        className="group flex items-center justify-between gap-3 rounded-lg border border-border/60 bg-card px-4 py-3 transition-colors hover:border-primary/40"
                      >
                        <div className="min-w-0">
                          <div className="truncate text-sm font-medium text-foreground group-hover:text-primary">
                            {p.title}
                          </div>
                          <div className="truncate font-mono text-[10px] uppercase tracking-wider text-muted-foreground">
                            {p.category}
                          </div>
                        </div>
                        <ArrowUpRight size={15} className="shrink-0 text-muted-foreground transition-all group-hover:rotate-45 group-hover:text-primary" />
                      </a>
                    ))}
                    {projectsUsing(selected).length === 0 && (
                      <p className="text-sm text-muted-foreground">Foundational tooling — used across my work.</p>
                    )}
                  </div>
                </div>
              </motion.div>
            ) : (
              <motion.div
                key="empty"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="flex items-center justify-center gap-3 rounded-2xl border border-dashed border-border/80 bg-card/40 px-6 py-10 text-center"
              >
                <MousePointerClick size={16} className="text-primary" />
                <p className="text-sm text-muted-foreground">
                  Select any technology above — see what it does, what it pairs with, and the projects it ships
                  in.
                </p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </section>
  );
}
