"use client";

import { motion, useReducedMotion } from "framer-motion";
import { cn } from "@/lib/utils";

/* ------------------------------ spec types ------------------------------- */

interface DiagNode {
  id: string;
  label: string;
  sub?: string;
  x: number;
  y: number;
  kind?: "core" | "db";
}

interface DiagEdge {
  from: string;
  to: string;
  label?: string;
  bend?: number; // perpendicular offset for curved edges
}

interface DiagramSpec {
  width: number;
  height: number;
  nodes: DiagNode[];
  edges: DiagEdge[];
}

/* ------------------------------- the specs ------------------------------- */

const DIAGRAMS: Record<string, DiagramSpec> = {
  "quicky-system": {
    width: 800,
    height: 480,
    nodes: [
      { id: "sys", label: "QUICKSYSTEM", x: 400, y: 75, kind: "core" },
      { id: "fe", label: "Frontend", sub: "React · TypeScript · Capacitor", x: 145, y: 235 },
      { id: "be", label: "Backend", sub: "Supabase · Database · Auth", x: 400, y: 235 },
      { id: "rt", label: "Realtime", sub: "Chat · Rooms · Games", x: 655, y: 235 },
      { id: "out", label: "Mobile / Web", sub: "One codebase · every device", x: 400, y: 405 },
    ],
    edges: [
      { from: "sys", to: "fe" },
      { from: "sys", to: "be" },
      { from: "sys", to: "rt" },
      { from: "fe", to: "out" },
      { from: "be", to: "out" },
      { from: "rt", to: "out" },
    ],
  },

  "bottle-realtime": {
    width: 830,
    height: 450,
    nodes: [
      { id: "pa", label: "Player A", sub: "spins the bottle", x: 90, y: 225 },
      { id: "gs", label: "Game State", sub: "authoritative · validated", x: 315, y: 225 },
      { id: "sr", label: "Supabase Realtime", sub: "broadcast channels", x: 555, y: 225, kind: "core" },
      { id: "pb", label: "Player B", x: 745, y: 90 },
      { id: "pc", label: "Player C", x: 745, y: 225 },
      { id: "pd", label: "Player D", x: 745, y: 360 },
    ],
    edges: [
      { from: "pa", to: "gs", label: "action" },
      { from: "gs", to: "sr", label: "commit" },
      { from: "sr", to: "pb", label: "fan-out" },
      { from: "sr", to: "pc", label: "fan-out" },
      { from: "sr", to: "pd", label: "fan-out" },
    ],
  },

  "ludo-multiplayer": {
    width: 830,
    height: 510,
    nodes: [
      { id: "p1", label: "Player 1", x: 85, y: 90 },
      { id: "p2", label: "Player 2", x: 85, y: 200 },
      { id: "p3", label: "Player 3", x: 85, y: 310 },
      { id: "p4", label: "Player 4", x: 85, y: 420 },
      { id: "dice", label: "Dice", sub: "server-authoritative", x: 400, y: 80 },
      { id: "server", label: "Game Server / DB", sub: "canonical state", x: 400, y: 255, kind: "core" },
      { id: "state", label: "Game State", sub: "turn rotation", x: 670, y: 255 },
    ],
    edges: [
      { from: "p1", to: "server" },
      { from: "p2", to: "server" },
      { from: "p3", to: "server" },
      { from: "p4", to: "server" },
      { from: "dice", to: "server" },
      { from: "server", to: "state", bend: -42, label: "commit" },
      { from: "state", to: "server", bend: -42, label: "re-sync" },
    ],
  },

  "booking-flow": {
    width: 830,
    height: 450,
    nodes: [
      { id: "patient", label: "Patient", sub: "books online", x: 90, y: 235 },
      { id: "ui", label: "Booking UI", sub: "free slot selection", x: 285, y: 235 },
      { id: "slots", label: "Doctor Schedule", sub: "availability", x: 285, y: 80 },
      { id: "php", label: "PHP Logic", sub: "server-side validation", x: 510, y: 235 },
      { id: "doctors", label: "Doctor Info", sub: "profiles & specialities", x: 510, y: 80 },
      { id: "db", label: "MySQL", sub: "source of truth", x: 720, y: 235, kind: "db" },
    ],
    edges: [
      { from: "patient", to: "ui" },
      { from: "slots", to: "ui" },
      { from: "ui", to: "php" },
      { from: "doctors", to: "php" },
      { from: "php", to: "db" },
    ],
  },

  "commerce-flow": {
    width: 850,
    height: 250,
    nodes: [
      { id: "customer", label: "Customer", sub: "browses", x: 90, y: 125 },
      { id: "product", label: "Product", sub: "catalogue", x: 265, y: 125 },
      { id: "cart", label: "Cart", sub: "session state", x: 440, y: 125 },
      { id: "order", label: "Order", sub: "transactional", x: 615, y: 125 },
      { id: "db", label: "Database", sub: "inventory sync", x: 790, y: 125, kind: "db" },
    ],
    edges: [
      { from: "customer", to: "product" },
      { from: "product", to: "cart" },
      { from: "cart", to: "order" },
      { from: "order", to: "db" },
    ],
  },

  "client-delivery": {
    width: 850,
    height: 280,
    nodes: [
      { id: "client", label: "Client", sub: "UAE business — ot24.ae", x: 425, y: 60, kind: "core" },
      { id: "discover", label: "Discover", sub: "brief + requirements", x: 105, y: 175 },
      { id: "build", label: "Build", sub: "design + full stack", x: 320, y: 175 },
      { id: "ship", label: "Ship", sub: "live production", x: 535, y: 175 },
      { id: "iterate", label: "Iterate", sub: "maintain + improve", x: 750, y: 175 },
    ],
    edges: [
      { from: "client", to: "discover", label: "brief" },
      { from: "discover", to: "build" },
      { from: "build", to: "ship", label: "deploy" },
      { from: "ship", to: "iterate" },
      { from: "iterate", to: "client", bend: 70, label: "feedback" },
    ],
  },
};

/* Captions shown above each diagram inside a case study */
export const DIAGRAM_TITLES: Record<string, string> = {
  "quicky-system": "Platform — one codebase, every device",
  "bottle-realtime": "Feature deep-dive · Spin the Bottle — realtime fan-out",
  "ludo-multiplayer": "Feature deep-dive · Quicky Ludo — authoritative game loop",
  "booking-flow": "Booking — request flow",
  "commerce-flow": "Commerce — order flow",
  "client-delivery": "Delivery — a year of build, ship, iterate",
};

/* ------------------------------- renderer -------------------------------- */

function nodeSize(n: DiagNode) {
  const w = Math.min(215, Math.max(125, n.label.length * 7.2 + 42));
  const h = n.sub ? 60 : 44;
  return { w, h };
}

/** Animated architecture diagram — flowing dashed edges, travelling packets. */
export function ArchitectureDiagram({ architecture, className }: { architecture: string; className?: string }) {
  const reduce = useReducedMotion();
  const spec = DIAGRAMS[architecture];
  if (!spec) return null;

  const nodeMap = new Map(spec.nodes.map((n) => [n.id, n]));

  const edgeGeometry = (e: DiagEdge) => {
    const a = nodeMap.get(e.from)!;
    const b = nodeMap.get(e.to)!;
    const sa = nodeSize(a);
    const sb = nodeSize(b);
    const dx = b.x - a.x;
    const dy = b.y - a.y;
    const len = Math.hypot(dx, dy) || 1;
    const ux = dx / len;
    const uy = dy / len;
    const r2 = (v: number) => Math.round(v * 100) / 100;
    const sx = r2(a.x + ux * (sa.w / 2 + 6));
    const sy = r2(a.y + uy * (sa.h / 2 + 6));
    const tx = r2(b.x - ux * (sb.w / 2 + 14));
    const ty = r2(b.y - uy * (sb.h / 2 + 14));

    let d = `M ${sx} ${sy} L ${tx} ${ty}`;
    let mid = { x: r2((sx + tx) / 2), y: r2((sy + ty) / 2) };
    if (e.bend) {
      const px = -uy;
      const py = ux;
      const cx = r2((sx + tx) / 2 + px * e.bend);
      const cy = r2((sy + ty) / 2 + py * e.bend);
      d = `M ${sx} ${sy} Q ${cx} ${cy} ${tx} ${ty}`;
      mid = { x: r2((sx + 2 * cx + tx) / 4), y: r2((sy + 2 * cy + ty) / 4) };
    }
    return { d, sx, sy, tx, ty, mid, straight: !e.bend };
  };

  return (
    <div className={cn("relative overflow-hidden rounded-2xl border border-border/70 bg-card/40", className)}>
      <div className="grid-bg absolute inset-0 opacity-50" />
      <svg viewBox={`0 0 ${spec.width} ${spec.height}`} className="relative w-full">
        <defs>
          <marker
            id={`diag-arrow-${architecture}`}
            viewBox="0 0 10 10"
            refX="8"
            refY="5"
            markerWidth="6.5"
            markerHeight="6.5"
            orient="auto-start-reverse"
          >
            <path d="M 0 0 L 10 5 L 0 10 z" fill="var(--primary)" fillOpacity="0.75" />
          </marker>
        </defs>

        {/* Edges */}
        {spec.edges.map((e, i) => {
          const geo = edgeGeometry(e);
          return (
            <g key={`e-${i}`}>
              <path
                d={geo.d}
                fill="none"
                stroke="var(--primary)"
                strokeOpacity="0.5"
                strokeWidth="1.4"
                strokeDasharray="5 5"
                markerEnd={`url(#diag-arrow-${architecture})`}
                className={reduce ? "" : "animate-dash-flow"}
              />
              {e.label && (
                <text
                  x={geo.mid.x}
                  y={geo.mid.y - 9}
                  textAnchor="middle"
                  fontSize="9.5"
                  className="font-mono"
                  fill="var(--muted-foreground)"
                >
                  {e.label}
                </text>
              )}
              {/* Travelling packet */}
              {!reduce && geo.straight && (
                <motion.circle
                  r="4"
                  fill="var(--primary)"
                  initial={{ cx: geo.sx, cy: geo.sy, opacity: 0 }}
                  animate={{
                    cx: [geo.sx, geo.tx],
                    cy: [geo.sy, geo.ty],
                    opacity: [0, 1, 1, 0],
                  }}
                  transition={{
                    duration: 1.9,
                    times: [0, 0.15, 0.85, 1],
                    repeat: Infinity,
                    delay: i * 0.35,
                    ease: "linear",
                  }}
                />
              )}
            </g>
          );
        })}

        {/* Nodes */}
        {spec.nodes.map((n) => {
          const { w, h } = nodeSize(n);
          const isCore = n.kind === "core";
          const isDb = n.kind === "db";
          return (
            <g key={n.id}>
              <rect
                x={n.x - w / 2}
                y={n.y - h / 2}
                width={w}
                height={h}
                rx="10"
                fill={isCore ? "var(--primary)" : "var(--card)"}
                fillOpacity={isCore ? 0.1 : 1}
                stroke="var(--primary)"
                strokeOpacity={isCore ? 0.8 : 0.4}
                strokeWidth={isCore ? 1.6 : 1}
                strokeDasharray={isDb ? "4 3" : undefined}
              />
              <text
                x={n.x}
                y={n.sub ? n.y - 3 : n.y + 4}
                textAnchor="middle"
                fontSize="12"
                fontWeight="600"
                className="font-mono"
                fill={isCore ? "var(--primary)" : "var(--foreground)"}
              >
                {n.label}
              </text>
              {n.sub && (
                <text x={n.x} y={n.y + 15} textAnchor="middle" fontSize="9" className="font-mono" fill="var(--muted-foreground)">
                  {n.sub}
                </text>
              )}
            </g>
          );
        })}
      </svg>
    </div>
  );
}

export const hasDiagram = (key: string | null) => !!key && key in DIAGRAMS;

/** A project may compose several diagrams — "quicky-system,bottle-realtime,ludo-multiplayer". */
export const diagramKeys = (value: string | null | undefined): string[] =>
  (value ?? "")
    .split(",")
    .map((s) => s.trim())
    .filter((key) => key in DIAGRAMS);
