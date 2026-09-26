"use client";

import { ArrowUp, ArrowUpRight, Github, Linkedin, Mail } from "lucide-react";
import { Reveal } from "./reveal";
import { WhatsAppIcon } from "./whatsapp-icon";

interface FooterProps {
  email: string;
  github: string;
  linkedin: string;
  location: string;
  whatsapp?: string | null;
}

/** System footer — the "digital operating system" sign-off. */
export function Footer({ email, github, linkedin, location, whatsapp }: FooterProps) {
  const year = new Date().getFullYear();

  const socials = [
  { label: "GitHub", href: github, icon: Github },
  { label: "LinkedIn", href: linkedin, icon: Linkedin },
  { label: "Email", href: `mailto:${email}`, icon: Mail },
  ...(whatsapp ? [{ label: "WhatsApp", href: whatsapp, icon: WhatsAppIcon }] : []),
  ];

  return (
    <footer className="relative mt-auto border-t border-border/70 bg-background">
      <div className="grid-bg pointer-events-none absolute inset-0 opacity-40 mask-fade-y" />
      <div className="relative mx-auto w-[min(92%,72rem)] px-0 py-14 md:py-20">
        <Reveal>
          <div className="flex flex-col gap-10 md:flex-row md:items-start md:justify-between">
            {/* Identity */}
            <div className="max-w-sm">
              <div className="font-display text-2xl font-bold tracking-[0.1em] text-foreground">
                JYOTHILAL<span className="text-primary">.</span>REJI
              </div>
              <a
                href="#contact"
                className="mt-3 inline-flex items-center gap-2 rounded-full border border-primary/30 bg-primary/10 px-3 py-1 font-mono text-[10px] tracking-[0.22em] uppercase text-primary transition-colors hover:border-primary/60 hover:bg-primary/15"
              >
                Open to contact
                <ArrowUpRight size={10} aria-hidden className="transition-transform duration-300 hover:-translate-y-0.5" />
              </a>
              <p className="mt-4 text-sm leading-relaxed text-muted-foreground">
                Building digital products, interactive systems and intelligent applications.
                <br />
                <span className="font-mono text-xs">{location}</span>
              </p>
            </div>

            {/* Columns */}
            <div className="grid grid-cols-2 gap-10 sm:grid-cols-3">
              <div>
                <div className="font-mono text-[10px] tracking-[0.28em] uppercase text-muted-foreground">Navigate</div>
                <ul className="mt-4 space-y-2.5 text-sm">
                  {[
                    { label: "Work", hash: "#work" },
                    { label: "Experience", hash: "#experience" },
                    { label: "Skills", hash: "#skills" },
                    { label: "About", hash: "#about" },
                    { label: "Contact", hash: "#contact" },
                  ].map((l) => (
                    <li key={l.label}>
                      <a href={l.hash} className="text-muted-foreground transition-colors hover:text-primary">
                        {l.label}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
              <div>
                <div className="font-mono text-[10px] tracking-[0.28em] uppercase text-muted-foreground">Elsewhere</div>
                <ul className="mt-4 space-y-2.5 text-sm">
                  {socials.map((s) => (
                    <li key={s.label}>
                      <a
                        href={s.href}
                        target={s.href.startsWith("mailto") || s.href.startsWith("https://wa.me") ? undefined : "_blank"}
                        rel="noreferrer noopener"
                        className="inline-flex items-center gap-2 text-muted-foreground transition-colors hover:text-primary"
                      >
                        <s.icon size={13} strokeWidth={1.75} />
                        {s.label}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
              <div className="col-span-2 sm:col-span-1">
                <div className="font-mono text-[10px] tracking-[0.28em] uppercase text-muted-foreground">Stack</div>
                <p className="mt-4 text-sm leading-relaxed text-muted-foreground">
                  Next.js · TypeScript
                  <br />
                  Tailwind CSS · Framer Motion
                  <br />
                  Prisma · PostgreSQL (Supabase)
                </p>
              </div>
            </div>
          </div>
        </Reveal>

        <div className="mt-14 flex flex-col items-start justify-between gap-4 border-t border-border/60 pt-6 sm:flex-row sm:items-center">
          <p className="font-mono text-[11px] text-muted-foreground">
            © {year} Jyothilal Reji — Designed &amp; built from scratch.
          </p>
          <button
            type="button"
            onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
            className="group inline-flex items-center gap-2 rounded-full border border-border/70 px-4 py-1.5 font-mono text-[10px] tracking-[0.22em] uppercase text-muted-foreground transition-colors hover:border-primary/50 hover:text-primary"
            aria-label="Back to top"
          >
            <ArrowUp size={12} className="transition-transform group-hover:-translate-y-0.5" />
            Back to top
          </button>
        </div>
      </div>
    </footer>
  );
}
