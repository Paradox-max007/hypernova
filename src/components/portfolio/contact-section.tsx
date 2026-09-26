"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import {
  ArrowLeft,
  ArrowRight,
  AtSign,
  Briefcase,
  Building2,
  Check,
  CircleDollarSign,
  FileText,
  Github,
  Linkedin,
  Loader2,
  Mail,
  Rocket,
  Send,
  User,
} from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";
import { SectionHeading } from "./section-heading";
import { Reveal } from "./reveal";

interface ContactSectionProps {
  email: string;
  github: string;
  linkedin: string;
}

const PROJECT_TYPES = [
  { id: "website", label: "Website" },
  { id: "web-app", label: "Web Application" },
  { id: "mobile-app", label: "Mobile App" },
  { id: "ai-ml", label: "AI / ML" },
  { id: "ecommerce", label: "E-commerce" },
  { id: "other", label: "Something else" },
];

const BUDGETS = ["< AED 3K", "AED 3K–10K", "AED 10K–25K", "AED 25K+", "Not sure yet"];

const STEPS = ["Type", "Project", "Budget", "Contact"] as const;

interface InquiryState {
  projectType: string;
  message: string;
  budget: string;
  name: string;
  email: string;
  company: string;
}

const INITIAL: InquiryState = {
  projectType: "",
  message: "",
  budget: "",
  name: "",
  email: "",
  company: "",
};

/** Contact — the final CTA with an animated project-inquiry wizard. */
export function ContactSection({ email, github, linkedin }: ContactSectionProps) {
  const [open, setOpen] = useState(false);
  const [step, setStep] = useState(0);
  const [submitting, setSubmitting] = useState(false);
  const [sent, setSent] = useState(false);
  const [form, setForm] = useState<InquiryState>(INITIAL);

  const set = <K extends keyof InquiryState>(key: K, value: InquiryState[K]) =>
    setForm((f) => ({ ...f, [key]: value }));

  const emailValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email);
  const canContinue =
    step === 0
      ? form.projectType !== ""
      : step === 1
        ? form.message.trim().length >= 10
        : step === 2
          ? form.budget !== ""
          : form.name.trim() !== "" && emailValid;

  const reset = () => {
    setForm(INITIAL);
    setStep(0);
    setSent(false);
  };

  const handleSubmit = async () => {
    if (!canContinue || submitting) return;
    setSubmitting(true);
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error ?? "Request failed");
      }
      setSent(true);
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Something went wrong — please email me directly.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <section id="contact" className="relative overflow-hidden border-t border-border/60 py-28 md:py-36">
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "radial-gradient(38rem 24rem at 50% 100%, oklch(0.78 0.155 160 / 0.1), transparent 70%)",
        }}
      />
      <div className="grid-bg pointer-events-none absolute inset-0 opacity-40 mask-fade-y" />

      <div className="relative mx-auto w-[min(92%,72rem)] text-center">
        <SectionHeading
          index="05"
          label="Contact"
          title={
            <span className="block">
              Have something <span className="text-primary text-glow">worth building?</span>
            </span>
          }
        />

        <Reveal delay={0.1}>
          <p className="mx-auto max-w-xl text-base leading-relaxed text-muted-foreground md:text-lg">
            Tell me what you&apos;re trying to build. I&apos;ll help turn the idea into a working product — from
            first sketch to something live.
          </p>
        </Reveal>

        <Reveal delay={0.18}>
          <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
            <Button
              size="lg"
              onClick={() => {
                reset();
                setOpen(true);
              }}
              className="h-12 rounded-full px-8 text-sm font-semibold shadow-[0_0_36px_oklch(0.78_0.155_160/0.25)] transition-shadow hover:shadow-[0_0_48px_oklch(0.78_0.155_160/0.4)]"
            >
              <Rocket size={16} className="mr-2" />
              Start a Project
            </Button>
            <Button
              size="lg"
              variant="outline"
              asChild
              className="h-12 rounded-full px-8 text-sm font-semibold"
            >
              <a href={`mailto:${email}`}>
                <Mail size={16} className="mr-2" />
                Email Me
              </a>
            </Button>
          </div>
        </Reveal>

        <Reveal delay={0.26}>
          <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
            {[
              { label: "LinkedIn", href: linkedin, icon: Linkedin },
              { label: "GitHub", href: github, icon: Github },
            ].map((s) => (
              <a
                key={s.label}
                href={s.href}
                target="_blank"
                rel="noreferrer noopener"
                className="inline-flex items-center gap-2 rounded-full border border-border px-5 py-2.5 text-sm text-muted-foreground transition-colors hover:border-primary/50 hover:text-primary"
              >
                <s.icon size={15} strokeWidth={1.75} />
                {s.label}
              </a>
            ))}
          </div>
        </Reveal>

        <Reveal delay={0.32}>
          <p className="mt-12 font-mono text-[10px] tracking-[0.3em] uppercase text-muted-foreground/70">
            Based in Kerala · Working worldwide · Replies within 24h
          </p>
        </Reveal>
      </div>

      {/* ------------------------- Project wizard ------------------------- */}
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-h-[92vh] gap-0 overflow-y-auto rounded-2xl border-border/80 p-0 sm:max-w-lg">
          <DialogHeader className="space-y-none border-b border-border/60 px-6 pb-5 pt-6 text-left">
            <DialogTitle className="flex items-center gap-2.5 font-display text-lg tracking-tight">
              <span className="inline-flex size-8 items-center justify-center rounded-lg border border-primary/30 bg-primary/10 text-primary">
                <Rocket size={15} />
              </span>
              {sent ? "Request received" : "Start a project"}
            </DialogTitle>
            <DialogDescription className="mt-1.5 text-sm">
              {sent ? "I'll get back to you within 24 hours." : "Four quick steps — takes under a minute."}
            </DialogDescription>

            {/* Step progress */}
            {!sent && (
              <div className="mt-5 flex items-center gap-2" aria-label={`Step ${step + 1} of 4`}>
                {STEPS.map((s, i) => (
                  <div key={s} className="flex flex-1 flex-col gap-1.5">
                    <div className="h-1 overflow-hidden rounded-full bg-border">
                      <motion.div
                        className="h-full rounded-full bg-primary"
                        initial={false}
                        animate={{ width: i <= step ? "100%" : "0%" }}
                        transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
                      />
                    </div>
                    <span
                      className={cn(
                        "font-mono text-[9px] uppercase tracking-[0.14em]",
                        i <= step ? "text-primary" : "text-muted-foreground/60"
                      )}
                    >
                      {s}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </DialogHeader>

          <div className="px-6 py-6">
            <AnimatePresence mode="wait">
              {sent ? (
                <motion.div
                  key="sent"
                  initial={{ opacity: 0, scale: 0.94 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="flex flex-col items-center py-8 text-center"
                >
                  <motion.span
                    className="inline-flex size-16 items-center justify-center rounded-full border border-primary/40 bg-primary/10 text-primary"
                    initial={{ scale: 0 }}
                    animate={{ scale: [0, 1.15, 1] }}
                    transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
                  >
                    <Check size={26} strokeWidth={2.5} />
                  </motion.span>
                  <h3 className="mt-6 font-display text-xl font-semibold text-foreground">
                    Your project request is in.
                  </h3>
                  <p className="mt-2 max-w-xs text-sm leading-relaxed text-muted-foreground">
                    Thanks {form.name.split(" ")[0]} — I&apos;ll reply from {email} within 24 hours with next steps.
                  </p>
                  <div className="mt-7 flex gap-3">
                    <Button variant="outline" onClick={() => setOpen(false)} className="rounded-full">
                      Close
                    </Button>
                    <Button variant="ghost" onClick={reset} className="rounded-full text-muted-foreground">
                      Send another
                    </Button>
                  </div>
                </motion.div>
              ) : (
                <motion.div
                  key={step}
                  initial={{ opacity: 0, x: 26 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -26 }}
                  transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
                >
                  {/* Step 1 — project type */}
                  {step === 0 && (
                    <div>
                      <div className="flex items-center gap-2 font-mono text-[10px] uppercase tracking-[0.2em] text-muted-foreground">
                        <Briefcase size={13} className="text-primary" /> What are you looking for?
                      </div>
                      <div className="mt-5 grid grid-cols-2 gap-3">
                        {PROJECT_TYPES.map((t) => (
                          <button
                            key={t.id}
                            type="button"
                            onClick={() => set("projectType", t.label)}
                            className={cn(
                              "rounded-xl border px-4 py-3.5 text-sm transition-all active:scale-[0.97]",
                              form.projectType === t.label
                                ? "border-primary bg-primary/10 font-medium text-primary"
                                : "border-border bg-card text-muted-foreground hover:border-primary/40 hover:text-foreground"
                            )}
                          >
                            {t.label}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Step 2 — description */}
                  {step === 1 && (
                    <div>
                      <div className="flex items-center gap-2 font-mono text-[10px] uppercase tracking-[0.2em] text-muted-foreground">
                        <FileText size={13} className="text-primary" /> Tell me about it
                      </div>
                      <div className="mt-5 space-y-2">
                        <Label htmlFor="message" className="text-sm text-foreground">
                          The idea, in your own words
                        </Label>
                        <Textarea
                          id="message"
                          value={form.message}
                          onChange={(e) => set("message", e.target.value)}
                          placeholder="What should it do? Who is it for? Anything you've seen that feels like the right direction…"
                          className="min-h-32 resize-none border-border bg-card"
                        />
                        <p
                          className={cn(
                            "text-right font-mono text-[10px]",
                            form.message.trim().length >= 10 ? "text-primary" : "text-muted-foreground/60"
                          )}
                        >
                          {form.message.trim().length} / min 10 characters
                        </p>
                      </div>
                    </div>
                  )}

                  {/* Step 3 — budget */}
                  {step === 2 && (
                    <div>
                      <div className="flex items-center gap-2 font-mono text-[10px] uppercase tracking-[0.2em] text-muted-foreground">
                        <CircleDollarSign size={13} className="text-primary" /> Budget range
                      </div>
                      <div className="mt-5 space-y-2.5">
                        {BUDGETS.map((b) => (
                          <button
                            key={b}
                            type="button"
                            onClick={() => set("budget", b)}
                            className={cn(
                              "flex w-full items-center justify-between rounded-xl border px-4 py-3.5 text-sm transition-all active:scale-[0.98]",
                              form.budget === b
                                ? "border-primary bg-primary/10 font-medium text-primary"
                                : "border-border bg-card text-muted-foreground hover:border-primary/40 hover:text-foreground"
                            )}
                          >
                            {b}
                            {form.budget === b && <Check size={15} />}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Step 4 — contact details */}
                  {step === 3 && (
                    <div>
                      <div className="flex items-center gap-2 font-mono text-[10px] uppercase tracking-[0.2em] text-muted-foreground">
                        <AtSign size={13} className="text-primary" /> Where can I reach you?
                      </div>
                      <div className="mt-5 space-y-4">
                        <div className="space-y-2">
                          <Label htmlFor="name" className="text-sm text-foreground">
                            Name <span className="text-primary">*</span>
                          </Label>
                          <div className="relative">
                            <User size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted-foreground" />
                            <Input
                              id="name"
                              value={form.name}
                              onChange={(e) => set("name", e.target.value)}
                              placeholder="Your name"
                              className="border-border bg-card pl-9"
                            />
                          </div>
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="email" className="text-sm text-foreground">
                            Email <span className="text-primary">*</span>
                          </Label>
                          <div className="relative">
                            <Mail size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted-foreground" />
                            <Input
                              id="email"
                              type="email"
                              value={form.email}
                              onChange={(e) => set("email", e.target.value)}
                              placeholder="you@company.com"
                              className={cn("border-border bg-card pl-9", form.email && !emailValid && "border-destructive")}
                            />
                          </div>
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="company" className="text-sm text-foreground">
                            Company <span className="text-muted-foreground/60">(optional)</span>
                          </Label>
                          <div className="relative">
                            <Building2 size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted-foreground" />
                            <Input
                              id="company"
                              value={form.company}
                              onChange={(e) => set("company", e.target.value)}
                              placeholder="Company or brand"
                              className="border-border bg-card pl-9"
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Footer controls */}
          {!sent && (
            <div className="flex items-center justify-between border-t border-border/60 px-6 py-4">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setStep((s) => Math.max(0, s - 1))}
                disabled={step === 0}
                className="rounded-full text-muted-foreground"
              >
                <ArrowLeft size={14} className="mr-1.5" /> Back
              </Button>
              {step < 3 ? (
                <Button
                  size="sm"
                  onClick={() => setStep((s) => s + 1)}
                  disabled={!canContinue}
                  className="rounded-full px-6"
                >
                  Continue <ArrowRight size={14} className="ml-1.5" />
                </Button>
              ) : (
                <Button size="sm" onClick={handleSubmit} disabled={!canContinue || submitting} className="rounded-full px-6">
                  {submitting ? <Loader2 size={14} className="mr-1.5 animate-spin" /> : <Send size={14} className="mr-1.5" />}
                  Send Project Request
                </Button>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>
    </section>
  );
}
