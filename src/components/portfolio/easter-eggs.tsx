"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { toast } from "sonner";

const KONAMI = ["ArrowUp", "ArrowUp", "ArrowDown", "ArrowDown", "ArrowLeft", "ArrowRight", "ArrowLeft", "ArrowRight"];

const PARTICLE_COLORS = ["var(--primary)", "var(--chart-5)", "var(--chart-2)", "var(--chart-4)"];

/** Subtle Easter eggs — [K] dev-mode scanline + the Konami burst. */
export function EasterEggs() {
  const [scan, setScan] = useState(false);
  const [burst, setBurst] = useState(0);

  useEffect(() => {
    const seq: string[] = [];
    const handler = (e: KeyboardEvent) => {
      const target = e.target as HTMLElement | null;
      if (target?.closest("input, textarea, select, [contenteditable=true], [role=textbox]")) return;

      if ((e.key === "k" || e.key === "K") && !e.metaKey && !e.ctrlKey && !e.altKey) {
        setScan(true);
        toast("Developer mode activated", {
          description: "Everything here is hand-built — no templates were harmed.",
        });
        setTimeout(() => setScan(false), 1400);
        return;
      }

      seq.push(e.key);
      if (seq.length > KONAMI.length) seq.shift();
      if (seq.length === KONAMI.length && seq.every((k, i) => k === KONAMI[i])) {
        setBurst((b) => b + 1);
        toast("Konami code accepted", {
          description: "You clearly like exploring. We'd get along.",
        });
        seq.length = 0;
      }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, []);

  return (
    <>
      {/* Scanline overlay for dev mode */}
      {scan && (
        <div className="pointer-events-none fixed inset-0 z-[70] overflow-hidden" aria-hidden>
          <div
            className="absolute inset-x-0 h-44 bg-gradient-to-b from-transparent via-primary/15 to-transparent"
            style={{ animation: "scan-line 1.3s linear" }}
          />
        </div>
      )}

      {/* Konami particle burst */}
      {burst > 0 && (
        <div key={burst} className="pointer-events-none fixed inset-0 z-[70]" aria-hidden>
          {Array.from({ length: 28 }).map((_, i) => {
            const angle = (i / 28) * Math.PI * 2 + Math.random() * 0.5;
            const dist = 180 + Math.random() * 320;
            const size = 5 + Math.random() * 6;
            return (
              <motion.span
                key={i}
                className="absolute left-1/2 top-1/2 rounded-[2px]"
                style={{
                  width: size,
                  height: size * (Math.random() > 0.5 ? 1 : 2.2),
                  backgroundColor: PARTICLE_COLORS[i % PARTICLE_COLORS.length],
                }}
                initial={{ x: 0, y: 0, opacity: 1, rotate: 0 }}
                animate={{
                  x: Math.cos(angle) * dist,
                  y: Math.sin(angle) * dist + 120,
                  opacity: 0,
                  rotate: Math.random() * 360,
                }}
                transition={{ duration: 1.1 + Math.random() * 0.5, ease: [0.16, 1, 0.3, 1] }}
              />
            );
          })}
        </div>
      )}
    </>
  );
}
