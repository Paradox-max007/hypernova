"use client";

import { motion, useReducedMotion } from "framer-motion";
import { cn } from "@/lib/utils";

/**
 * Generative animated previews — one authored SVG scene per project.
 * Decorative by design (no fake screenshots); accent flows via currentColor.
 */
const r2 = (v: number) => Math.round(v * 100) / 100;

export function ProjectVisual({ slug, className }: { slug: string; className?: string }) {
  const reduce = useReducedMotion();

  const spin = (origin: string, duration: number) => ({
    className: "animate-spin-slow",
    style: { transformBox: "view-box" as const, transformOrigin: origin, animationDuration: `${duration}s` },
  });

  const common = "absolute inset-0 size-full";

  const scenes: Record<string, React.ReactNode> = {
    /* ------------------------------- Quicky ------------------------------- */
    quicky: (
      <svg viewBox="0 0 320 200" className={common}>
        <circle cx="160" cy="100" r="72" fill="none" stroke="var(--border)" strokeWidth="1" strokeDasharray="3 5" />
        {[...Array(8)].map((_, i) => {
          const a = (i / 8) * Math.PI * 2;
          return (
            <circle
              key={i}
              cx={r2(160 + Math.cos(a) * 72)}
              cy={r2(100 + Math.sin(a) * 72)}
              r="5"
              fill="currentColor"
              opacity={i % 3 === 0 ? 0.9 : 0.35}
            />
          );
        })}
        <motion.circle
          cx="160"
          cy="100"
          r="10"
          fill="none"
          stroke="currentColor"
          strokeWidth="1"
          initial={reduce ? undefined : { scale: 1, opacity: 0.6 }}
          animate={reduce ? undefined : { scale: [1, 1.8], opacity: [0.6, 0] }}
          transition={{ duration: 2.4, repeat: Infinity, ease: "easeOut" }}
        />
        <circle cx="160" cy="100" r="7" fill="currentColor" />
        <g {...(!reduce ? spin("160px 100px", 9) : {})}>
          <line x1="160" y1="100" x2="160" y2="38" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" />
          <circle cx="160" cy="42" r="6" fill="currentColor" />
        </g>
      </svg>
    ),

    /* -------------------------------- OT24 -------------------------------- */
    ot24: (
      <svg viewBox="0 0 320 200" className={common}>
        <rect x="62" y="34" width="196" height="132" rx="8" fill="var(--card)" stroke="currentColor" strokeOpacity="0.5" strokeWidth="1.2" />
        <line x1="62" y1="54" x2="258" y2="54" stroke="currentColor" strokeOpacity="0.35" strokeWidth="1" />
        {[68, 78, 88].map((cx) => (
          <circle key={cx} cx={cx} cy="44" r="2.5" fill="currentColor" opacity="0.5" />
        ))}
        <rect x="74" y="66" width="100" height="9" rx="4.5" fill="currentColor" opacity="0.85" />
        <rect x="74" y="82" width="64" height="7" rx="3.5" fill="currentColor" opacity="0.35" />
        <motion.rect
          x="74"
          y="104"
          width="80"
          height="44"
          rx="5"
          fill="currentColor"
          initial={reduce ? undefined : { opacity: 0.1 }}
          animate={reduce ? { opacity: 0.16 } : { opacity: [0.1, 0.3, 0.1] }}
          transition={{ duration: 3, repeat: Infinity }}
        />
        <rect x="164" y="104" width="40" height="44" rx="5" fill="none" stroke="currentColor" strokeOpacity="0.4" />
        <rect x="216" y="104" width="28" height="44" rx="5" fill="none" stroke="currentColor" strokeOpacity="0.4" />
        <motion.path
          d="M228 118 l8 8 -8 8"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          initial={reduce ? undefined : { x: 0 }}
          animate={reduce ? undefined : { x: [0, 4, 0] }}
          transition={{ duration: 1.8, repeat: Infinity }}
        />
      </svg>
    ),

    /* ------------------------ Doctor Appointment -------------------------- */
    "doctor-appointment": (
      <svg viewBox="0 0 320 200" className={common}>
        <rect x="70" y="40" width="140" height="120" rx="8" fill="var(--card)" stroke="currentColor" strokeOpacity="0.45" strokeWidth="1.2" />
        <rect x="70" y="40" width="140" height="22" rx="8" fill="currentColor" opacity="0.14" />
        <circle cx="84" cy="51" r="3" fill="currentColor" opacity="0.7" />
        {[0, 1, 2].map((r) =>
          [0, 1, 2, 3].map((c) => {
            const filled = (r * 4 + c) % 5 === 2 || (r * 4 + c) === 7;
            const animated = !reduce && filled;
            return (
              <motion.rect
                key={`${r}-${c}`}
                x={82 + c * 30}
                y={74 + r * 27}
                width="24"
                height="20"
                rx="4"
                fill="currentColor"
                opacity={animated ? undefined : filled ? 0.55 : 0.1}
                initial={animated ? { opacity: 0.35 } : undefined}
                animate={animated ? { opacity: [0.35, 0.75, 0.35] } : undefined}
                transition={animated ? { duration: 2.2, repeat: Infinity, delay: (r * 4 + c) * 0.2 } : undefined}
              />
            );
          })
        )}
        <circle cx="248" cy="72" r="18" fill="none" stroke="currentColor" strokeWidth="1.6" />
        <path d="M248 62 L248 72 L255 76" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
        <motion.circle
          cx="248"
          cy="140"
          r="14"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.8"
          initial={reduce ? undefined : { scale: 1 }}
          animate={reduce ? undefined : { scale: [1, 1.15, 1] }}
          transition={{ duration: 2, repeat: Infinity }}
        />
        <path d="M242 140 l4 4 7 -8" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    ),

    /* -------------------------- Online Shoe Store ------------------------- */
    "online-shoe-store": (
      <svg viewBox="0 0 320 200" className={common}>
        {[66, 128, 190].map((x, i) => (
          <motion.g
            key={x}
            initial={reduce ? undefined : { y: 0 }}
            animate={reduce ? undefined : { y: [0, -5, 0] }}
            transition={{ duration: 2.6, repeat: Infinity, delay: i * 0.45 }}
          >
            <rect x={x} y={56} width="48" height="60" rx="6" fill="currentColor" opacity="0.12" stroke="currentColor" strokeOpacity="0.5" />
            <rect x={x + 8} y={64} width="32" height="26" rx="4" fill="currentColor" opacity={0.3 - i * 0.07} />
            <rect x={x + 8} y={98} width="20" height="5" rx="2.5" fill="currentColor" opacity="0.45" />
          </motion.g>
        ))}
        <path d="M242 62 h24 l-4 16 h-16 z" fill="none" stroke="currentColor" strokeWidth="1.6" />
        <motion.circle
          cx="268"
          cy="60"
          r="7"
          fill="currentColor"
          initial={reduce ? undefined : { scale: 1 }}
          animate={reduce ? undefined : { scale: [1, 1.25, 1] }}
          transition={{ duration: 1.8, repeat: Infinity }}
        />
        <text x="268" y="63.5" textAnchor="middle" fontSize="8" className="font-mono" fill="var(--background)" fontWeight="700">
          3
        </text>
        <rect x="238" y="118" width="34" height="24" rx="5" fill="none" stroke="currentColor" strokeOpacity="0.6" strokeDasharray="3 3" />
        <path d="M255 118 v-12" stroke="currentColor" strokeWidth="1.2" strokeDasharray="2 3" className={reduce ? "" : "animate-dash-flow"} />
        <path d="M238 130 h-20" stroke="currentColor" strokeWidth="1.2" strokeDasharray="2 3" className={reduce ? "" : "animate-dash-flow"} />
        <text x="255" y="134" textAnchor="middle" fontSize="8" className="font-mono" fill="currentColor" opacity="0.8">
          ORDER
        </text>
      </svg>
    ),
  };

  return (
    <div className={cn("relative overflow-hidden", className)}>
      <div
        className="absolute inset-0 opacity-60"
        style={{
          background:
            "radial-gradient(16rem 10rem at 30% 20%, oklch(from var(--color-primary) l c h / 0.09), transparent 70%)",
        }}
      />
      <svg viewBox="0 0 320 200" className="pointer-events-none absolute inset-0 size-full">
        <defs>
          <pattern id={`pv-dots-${slug}`} width="14" height="14" patternUnits="userSpaceOnUse">
            <circle cx="1" cy="1" r="0.8" fill="var(--border)" />
          </pattern>
        </defs>
        <rect width="320" height="200" fill={`url(#pv-dots-${slug})`} />
      </svg>
      {scenes[slug] ?? scenes.quicky}
    </div>
  );
}
