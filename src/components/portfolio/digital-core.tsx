"use client";

import { useEffect, useRef, useState } from "react";
import { animate, motion, useMotionValue, useReducedMotion, useSpring, useTransform } from "framer-motion";
import { BrainCircuit, Database, Globe, Smartphone } from "lucide-react";
import { cn } from "@/lib/utils";

const NODES = [
  { id: "ai", label: "AI", icon: BrainCircuit, x: 50, y: 14, sub: "ML · Models · Intelligence" },
  { id: "data", label: "Data", icon: Database, x: 86, y: 50, sub: "SQL · Pipelines · Analytics" },
  { id: "mobile", label: "Mobile", icon: Smartphone, x: 50, y: 86, sub: "Capacitor · Cross-platform" },
  { id: "web", label: "Web", icon: Globe, x: 14, y: 50, sub: "React · TypeScript · Tailwind" },
] as const;

/**
 * The interactive "digital core" — AI / Web / Data / Mobile orbiting a central
 * JR core, with flowing connections and pointer parallax. Falls back to a gentle
 * autonomous drift on touch devices and honors prefers-reduced-motion.
 */
export function DigitalCore({ className }: { className?: string }) {
  const wrapRef = useRef<HTMLDivElement>(null);
  const reduce = useReducedMotion();
  const [activeNode, setActiveNode] = useState<string | null>(null);

  const mx = useMotionValue(0);
  const my = useMotionValue(0);
  const sx = useSpring(mx, { stiffness: 55, damping: 16 });
  const sy = useSpring(my, { stiffness: 55, damping: 16 });

  // Depth layers — core moves most, rings least
  const coreX = useTransform(sx, (v) => v * 18);
  const coreY = useTransform(sy, (v) => v * 18);
  const chipX = useTransform(sx, (v) => v * 10);
  const chipY = useTransform(sy, (v) => v * 10);
  const ringX = useTransform(sx, (v) => v * 6);
  const ringY = useTransform(sy, (v) => v * 6);

  // Autonomous drift when there is no fine pointer or motion is reduced
  useEffect(() => {
    if (reduce) return;
    const fine = window.matchMedia("(pointer: fine)").matches;
    if (fine) return;
    const cx = animate(mx, [-0.4, 0.4], { duration: 7, repeat: Infinity, repeatType: "mirror", ease: "easeInOut" });
    const cy = animate(my, [-0.3, 0.3], { duration: 5.5, repeat: Infinity, repeatType: "mirror", ease: "easeInOut" });
    return () => {
      cx.stop();
      cy.stop();
    };
  }, [mx, my, reduce]);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (reduce) return;
    const rect = wrapRef.current?.getBoundingClientRect();
    if (!rect) return;
    const nx = ((e.clientX - rect.left) / rect.width) * 2 - 1;
    const ny = ((e.clientY - rect.top) / rect.height) * 2 - 1;
    mx.set(Math.max(-1, Math.min(1, nx)) * 0.8);
    my.set(Math.max(-1, Math.min(1, ny)) * 0.8);
  };

  const handleMouseLeave = () => {
    mx.set(0);
    my.set(0);
    setActiveNode(null);
  };

  return (
    <div
      ref={wrapRef}
      className={cn("relative aspect-square select-none", className)}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      role="img"
      aria-label="Interactive diagram: a central core connected to AI, Web, Data and Mobile nodes"
    >
      {/* Connection layer */}
      <svg viewBox="0 0 100 100" className="absolute inset-0 size-full overflow-visible" aria-hidden>
        <defs>
          <linearGradient id="core-grad" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="currentColor" stopOpacity="0.32" />
            <stop offset="100%" stopColor="currentColor" stopOpacity="0.08" />
          </linearGradient>
        </defs>

        {/* Rotating dashed rings */}
        <motion.g style={{ x: ringX, y: ringY }}>
          <circle
            cx="50"
            cy="50"
            r="40"
            fill="none"
            stroke="currentColor"
            strokeOpacity="0.22"
            strokeWidth="0.35"
            strokeDasharray="2 3"
            vectorEffect="non-scaling-stroke"
            className="animate-spin-slow"
            style={{ transformBox: "view-box", transformOrigin: "center" }}
          />
          <circle
            cx="50"
            cy="50"
            r="30"
            fill="none"
            stroke="currentColor"
            strokeOpacity="0.35"
            strokeWidth="0.3"
            strokeDasharray="0.5 2"
            vectorEffect="non-scaling-stroke"
            className="animate-spin-slow-rev"
            style={{ transformBox: "view-box", transformOrigin: "center" }}
          />
        </motion.g>

        {/* Connection lines */}
        <motion.g style={{ x: ringX, y: ringY }}>
          {NODES.map((n) => (
            <line
              key={n.id}
              x1="50"
              y1="50"
              x2={n.x}
              y2={n.y}
              stroke="currentColor"
              strokeOpacity={activeNode === n.id ? 0.85 : 0.3}
              strokeWidth={activeNode === n.id ? 1 : 0.6}
              strokeDasharray="1.5 2.5"
              vectorEffect="non-scaling-stroke"
              className={cn("transition-[stroke-opacity,stroke-width] duration-300", !reduce && "animate-dash-flow")}
            />
          ))}
          {/* Data packets travelling outward */}
          {!reduce &&
            NODES.map((n, i) => (
              <motion.circle
                key={`pulse-${n.id}`}
                r="0.8"
                fill="currentColor"
                initial={{ cx: 50, cy: 50, opacity: 0 }}
                animate={{
                  cx: [50, 50, n.x],
                  cy: [50, 50, n.y],
                  opacity: [0, 1, 0],
                }}
                transition={{ duration: 2.4, times: [0, 0.12, 1], repeat: Infinity, delay: i * 0.6, ease: "linear" }}
              />
            ))}
        </motion.g>

        {/* Core */}
        <motion.g style={{ x: coreX, y: coreY }} className="text-primary">
          {/* Emitted pulse rings */}
          {!reduce && (
            <>
              <motion.circle
                cx="50"
                cy="50"
                r="15"
                fill="none"
                stroke="currentColor"
                strokeWidth="0.4"
                vectorEffect="non-scaling-stroke"
                initial={{ scale: 1, opacity: 0.5 }}
                animate={{ scale: [1, 2.1], opacity: [0.5, 0] }}
                transition={{ duration: 3.2, repeat: Infinity, ease: "easeOut" }}
              />
              <motion.circle
                cx="50"
                cy="50"
                r="15"
                fill="none"
                stroke="currentColor"
                strokeWidth="0.4"
                vectorEffect="non-scaling-stroke"
                initial={{ scale: 1, opacity: 0.5 }}
                animate={{ scale: [1, 2.1], opacity: [0.5, 0] }}
                transition={{ duration: 3.2, repeat: Infinity, ease: "easeOut", delay: 1.6 }}
              />
            </>
          )}
          <circle cx="50" cy="50" r="17.5" fill="url(#core-grad)" />
          <polygon
            points="50,36.5 61.7,43.25 61.7,56.75 50,63.5 38.3,56.75 38.3,43.25"
            fill="url(#core-grad)"
            stroke="currentColor"
            strokeWidth="0.5"
            vectorEffect="non-scaling-stroke"
          />
          <text
            x="50"
            y="53.4"
            textAnchor="middle"
            className="font-display"
            fontSize="8"
            fontWeight="700"
            letterSpacing="0.5"
            fill="currentColor"
          >
            JR
          </text>
        </motion.g>
      </svg>

      {/* Node chips (HTML layer for crisp type + lucide icons) */}
      <motion.div style={{ x: chipX, y: chipY }} className="absolute inset-0">
        {NODES.map((n) => {
          const Icon = n.icon;
          const active = activeNode === n.id;
          return (
            <motion.div
              key={n.id}
              className="absolute"
              style={{ left: `${n.x}%`, top: `${n.y}%` }}
              initial={false}
              animate={{ x: "-50%", y: "-50%", scale: active ? 1.08 : 1 }}
              transition={{ type: "spring", stiffness: 320, damping: 22 }}
              onMouseEnter={() => setActiveNode(n.id)}
              onMouseLeave={() => setActiveNode(null)}
            >
              <div
                className={cn(
                  "flex items-center gap-2 rounded-xl border bg-card/90 px-3.5 py-2.5 shadow-lg shadow-black/10 backdrop-blur-md transition-colors duration-300",
                  active ? "border-primary/60" : "border-border/80"
                )}
              >
                <Icon size={15} strokeWidth={1.75} className={cn("transition-colors", active ? "text-primary" : "text-muted-foreground")} />
                <span className="font-mono text-[11px] font-medium tracking-[0.18em] uppercase text-foreground">
                  {n.label}
                </span>
              </div>
              {/* Technology sub-labels — appear on hover */}
              <motion.div
                className="absolute left-1/2 top-full mt-2 -translate-x-1/2 whitespace-nowrap rounded-full border border-primary/25 bg-background/85 px-2.5 py-1 font-mono text-[9px] tracking-[0.14em] uppercase text-primary backdrop-blur-sm"
                initial={false}
                animate={{ opacity: active ? 1 : 0, y: active ? 0 : -4 }}
                transition={{ duration: 0.25 }}
                aria-hidden
              >
                {n.sub}
              </motion.div>
            </motion.div>
          );
        })}
      </motion.div>
    </div>
  );
}
