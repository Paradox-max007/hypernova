"use client";

import { useMemo, useState } from "react";
import { toast } from "sonner";
import { Loader2, Pencil, Plus, Star, Trash2 } from "lucide-react";
import type { PortfolioData, Project } from "@/lib/types";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Switch } from "@/components/ui/switch";
import { cn } from "@/lib/utils";
import { adminFetch, itemsToLines, parseLineItems } from "./admin-api";

/** Valid keys for the animated architecture diagrams (comma-separable). */
const DIAGRAM_KEYS = [
  "quicky-system",
  "bottle-realtime",
  "ludo-multiplayer",
  "booking-flow",
  "commerce-flow",
  "client-delivery",
];

interface Draft {
  id: string | null;
  title: string;
  slug: string;
  tagline: string;
  category: string;
  year: string;
  description: string;
  liveUrl: string;
  githubUrl: string;
  accentColor: string;
  roleNote: string;
  sortOrder: string;
  featured: boolean;
  idea: string;
  problem: string;
  solution: string;
  challenges: string;
  whatIBuilt: string;
  result: string;
  architecture: string;
  howItWorksText: string;
  featuresText: string;
  metricsText: string;
  technologyIds: string[];
}

const EMPTY_DRAFT: Draft = {
  id: null,
  title: "",
  slug: "",
  tagline: "",
  category: "",
  year: "",
  description: "",
  liveUrl: "",
  githubUrl: "",
  accentColor: "#34d399",
  roleNote: "",
  sortOrder: "0",
  featured: false,
  idea: "",
  problem: "",
  solution: "",
  challenges: "",
  whatIBuilt: "",
  result: "",
  architecture: "none",
  howItWorksText: "",
  featuresText: "",
  metricsText: "",
  technologyIds: [],
};

function draftFromProject(p: Project): Draft {
  return {
    id: p.id,
    title: p.title,
    slug: p.slug,
    tagline: p.tagline,
    category: p.category,
    year: p.year ?? "",
    description: p.description ?? "",
    liveUrl: p.liveUrl ?? "",
    githubUrl: p.githubUrl ?? "",
    accentColor: p.accentColor ?? "#34d399",
    roleNote: p.roleNote ?? "",
    sortOrder: String(p.sortOrder),
    featured: p.featured,
    idea: p.idea ?? "",
    problem: p.problem ?? "",
    solution: p.solution ?? "",
    challenges: p.challenges ?? "",
    whatIBuilt: p.whatIBuilt ?? "",
    result: p.result ?? "",
    architecture: p.architecture ?? "none",
    howItWorksText: itemsToLines(p.howItWorks, ["title", "detail"]),
    featuresText: itemsToLines(p.features, ["title", "detail"]),
    metricsText: itemsToLines(p.metrics, ["value", "suffix", "label"]),
    technologyIds: p.technologies.map((t) => t.id),
  };
}

const slugify = (s: string) =>
  s
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");

/* ------------------------------ form fields ------------------------------- */

export function TextField({
  label,
  value,
  onChange,
  placeholder,
  hint,
  type = "text",
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  hint?: string;
  type?: string;
}) {
  return (
    <div className="space-y-1.5">
      <Label className="text-xs font-medium">{label}</Label>
      <Input value={value} onChange={(e) => onChange(e.target.value)} placeholder={placeholder} type={type} className="bg-background text-sm" />
      {hint && <p className="text-[11px] leading-snug text-muted-foreground">{hint}</p>}
    </div>
  );
}

export function AreaField({
  label,
  value,
  onChange,
  rows = 3,
  hint,
  placeholder,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  rows?: number;
  hint?: string;
  placeholder?: string;
}) {
  return (
    <div className="space-y-1.5">
      <Label className="text-xs font-medium">{label}</Label>
      <textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        rows={rows}
        placeholder={placeholder}
        className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm shadow-xs outline-none placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50"
      />
      {hint && <p className="text-[11px] leading-snug text-muted-foreground">{hint}</p>}
    </div>
  );
}

export function FormSection({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="rounded-xl border border-border/60 bg-card/60 p-5">
      <div className="mb-4 font-mono text-[10px] tracking-[0.26em] uppercase text-primary">{title}</div>
      <div className="space-y-4">{children}</div>
    </section>
  );
}

/* ------------------------------- main view -------------------------------- */

export function AdminProjects({ data, refresh }: { data: PortfolioData; refresh: () => Promise<void> }) {
  const [draft, setDraft] = useState<Draft | null>(null);
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState<Project | null>(null);
  const [slugTouched, setSlugTouched] = useState(false);

  const techByCategory = useMemo(() => {
    const map = new Map<string, typeof data.technologies>();
    for (const t of data.technologies) {
      if (!map.has(t.category)) map.set(t.category, []);
      map.get(t.category)!.push(t);
    }
    return [...map.entries()];
  }, [data.technologies]);

  const openNew = () => {
    setSlugTouched(false);
    setDraft({ ...EMPTY_DRAFT, sortOrder: String(data.projects.length + 1) });
  };

  const openEdit = (p: Project) => {
    setSlugTouched(true);
    setDraft(draftFromProject(p));
  };

  const patch = (fields: Partial<Draft>) => setDraft((d) => (d ? { ...d, ...fields } : d));

  const setTitle = (title: string) => {
    setDraft((d) => {
      if (!d) return d;
      const next: Draft = { ...d, title };
      if (!slugTouched) next.slug = slugify(title);
      return next;
    });
  };

  const toggleTech = (id: string) => {
    setDraft((d) => {
      if (!d) return d;
      const has = d.technologyIds.includes(id);
      return {
        ...d,
        technologyIds: has ? d.technologyIds.filter((x) => x !== id) : [...d.technologyIds, id],
      };
    });
  };

  const save = async () => {
    if (!draft) return;
    if (!draft.title.trim() || !draft.slug.trim() || !draft.tagline.trim() || !draft.category.trim()) {
      toast.error("Title, slug, tagline and category are required.");
      return;
    }
    setSaving(true);
    try {
      const howItWorks = parseLineItems(draft.howItWorksText, ["title", "detail"]).filter((s) => s.title);
      const features = parseLineItems(draft.featuresText, ["title", "detail"]).filter((s) => s.title);
      const metrics = parseLineItems(draft.metricsText, ["value", "suffix", "label"])
        .map((m) => ({ value: Number(m.value) || 0, suffix: m.suffix, label: m.label }))
        .filter((m) => m.label);

      const body: Record<string, unknown> = {
        title: draft.title,
        slug: draft.slug,
        tagline: draft.tagline,
        category: draft.category,
        year: draft.year,
        description: draft.description,
        liveUrl: draft.liveUrl,
        githubUrl: draft.githubUrl,
        accentColor: draft.accentColor,
        roleNote: draft.roleNote,
        sortOrder: Number(draft.sortOrder) || 0,
        featured: draft.featured,
        idea: draft.idea,
        problem: draft.problem,
        solution: draft.solution,
        challenges: draft.challenges,
        whatIBuilt: draft.whatIBuilt,
        result: draft.result,
        architecture: draft.architecture === "none" ? "" : draft.architecture,
        howItWorks: JSON.stringify(howItWorks),
        features: JSON.stringify(features),
        metrics: JSON.stringify(metrics),
        technologyIds: draft.technologyIds,
      };

      if (draft.id) {
        await adminFetch("projects", { method: "PUT", body: { ...body, id: draft.id } });
        toast.success(`“${draft.title}” updated — live now.`);
      } else {
        await adminFetch("projects", { method: "POST", body });
        toast.success(`“${draft.title}” added to the portfolio.`);
      }
      setDraft(null);
      await refresh();
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Save failed");
    } finally {
      setSaving(false);
    }
  };

  const remove = async (p: Project) => {
    try {
      await adminFetch("projects", { method: "DELETE", id: p.id });
      toast.success(`“${p.title}” removed.`);
      setDeleting(null);
      await refresh();
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Delete failed");
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="font-display text-3xl font-semibold tracking-tight">Projects</h1>
          <p className="mt-1.5 text-sm text-muted-foreground">
            {data.projects.length} case studies — add, reorder, and edit everything the visitor sees.
          </p>
        </div>
        <Button onClick={openNew} className="rounded-full font-semibold">
          <Plus size={15} className="mr-1.5" />
          New project
        </Button>
      </div>

      <div className="overflow-hidden rounded-2xl border border-border/70 bg-card">
        <div className="hidden grid-cols-[3rem_1.6fr_1fr_1fr_auto] gap-4 border-b border-border/60 px-5 py-3 font-mono text-[10px] uppercase tracking-[0.18em] text-muted-foreground md:grid">
          <span>#</span>
          <span>Project</span>
          <span>Category</span>
          <span>Tech</span>
          <span className="text-right">Actions</span>
        </div>
        {data.projects.map((p, i) => (
          <div
            key={p.id}
            className="grid grid-cols-1 gap-3 border-b border-border/50 px-5 py-4 transition-colors last:border-0 hover:bg-background/40 md:grid-cols-[3rem_1.6fr_1fr_1fr_auto] md:gap-4 md:py-3.5"
          >
            <span className="hidden font-mono text-xs text-muted-foreground md:block">{String(i + 1).padStart(2, "0")}</span>
            <div className="min-w-0">
              <div className="flex flex-wrap items-center gap-2">
                <span className="text-sm font-medium text-foreground">{p.title}</span>
                {p.featured && (
                  <span className="inline-flex items-center gap-1 rounded-full border border-primary/35 bg-primary/10 px-2 py-0.5 font-mono text-[9px] uppercase tracking-wider text-primary">
                    <Star size={9} /> Flagship
                  </span>
                )}
              </div>
              <span className="font-mono text-[10px] text-muted-foreground">/{p.slug}</span>
            </div>
            <span className="text-xs text-muted-foreground md:flex md:items-center">{p.category}</span>
            <span className="text-xs text-muted-foreground md:flex md:items-center">
              {p.technologies.length} linked
            </span>
            <div className="flex items-center gap-2 md:justify-end">
              <Button variant="outline" size="sm" onClick={() => openEdit(p)} className="rounded-full">
                <Pencil size={13} className="mr-1" /> Edit
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setDeleting(p)}
                className="rounded-full text-muted-foreground hover:border-destructive/50 hover:text-destructive"
              >
                <Trash2 size={13} />
              </Button>
            </div>
          </div>
        ))}
      </div>

      {/* --------------------------- editor dialog --------------------------- */}
      <Dialog open={draft !== null} onOpenChange={(o) => !saving && setDraft(o ? draft : null)}>
        <DialogContent className="max-h-[92vh] gap-0 overflow-y-auto rounded-2xl p-0 sm:max-w-3xl">
          <DialogHeader className="border-b border-border/60 px-6 pb-5 pt-6">
            <DialogTitle className="font-display tracking-tight">
              {draft?.id ? `Edit — ${draft.title}` : "New project"}
            </DialogTitle>
            <DialogDescription>
              Everything here renders on the public case study. Line-based fields use “|” separators.
            </DialogDescription>
          </DialogHeader>

          {draft && (
            <div className="space-y-5 px-6 py-6">
              <FormSection title="Basics">
                <div className="grid gap-4 sm:grid-cols-2">
                  <TextField label="Title *" value={draft.title} onChange={setTitle} placeholder="Quicky" />
                  <TextField
                    label="Slug *"
                    value={draft.slug}
                    onChange={(v) => {
                      setSlugTouched(true);
                      patch({ slug: slugify(v) });
                    }}
                    placeholder="quicky"
                    hint="Lowercase with hyphens — becomes #/work/slug"
                  />
                </div>
                <TextField label="Tagline *" value={draft.tagline} onChange={(v) => patch({ tagline: v })} placeholder="Gamified social connection platform" />
                <div className="grid gap-4 sm:grid-cols-3">
                  <TextField label="Category *" value={draft.category} onChange={(v) => patch({ category: v })} placeholder="Full Stack · Mobile" />
                  <TextField label="Year" value={draft.year} onChange={(v) => patch({ year: v })} placeholder="2024–2025" />
                  <TextField label="Sort order" value={draft.sortOrder} onChange={(v) => patch({ sortOrder: v })} placeholder="1" type="number" />
                </div>
                <div className="flex items-center justify-between rounded-lg border border-border/60 bg-background px-4 py-3">
                  <div>
                    <Label className="text-sm">Flagship project</Label>
                    <p className="text-[11px] text-muted-foreground">Badged + pinned emphasis across the site</p>
                  </div>
                  <Switch checked={draft.featured} onCheckedChange={(v) => patch({ featured: v })} />
                </div>
                <AreaField label="Short description" value={draft.description} onChange={(v) => patch({ description: v })} rows={3} placeholder="One-paragraph overview shown under the case study title." />
              </FormSection>

              <FormSection title="Links & meta">
                <div className="grid gap-4 sm:grid-cols-2">
                  <TextField label="Live URL" value={draft.liveUrl} onChange={(v) => patch({ liveUrl: v })} placeholder="https://…" />
                  <TextField label="GitHub URL" value={draft.githubUrl} onChange={(v) => patch({ githubUrl: v })} placeholder="https://github.com/…" hint="Leave empty to show “Source kept private”" />
                </div>
                <TextField label="Role note" value={draft.roleNote} onChange={(v) => patch({ roleNote: v })} placeholder="Solo developer — concept, design, build" />
                <div className="grid gap-4 sm:grid-cols-[auto_1fr] sm:items-end">
                  <div className="space-y-1.5">
                    <Label className="text-xs font-medium">Accent</Label>
                    <input
                      type="color"
                      value={draft.accentColor}
                      onChange={(e) => patch({ accentColor: e.target.value })}
                      className="h-9 w-16 cursor-pointer rounded-md border border-input bg-background"
                      aria-label="Accent color"
                    />
                  </div>
                  <TextField label="Accent hex" value={draft.accentColor} onChange={(v) => patch({ accentColor: v })} />
                </div>
                <div className="space-y-1.5">
                  <Label className="text-xs font-medium">Architecture diagram(s)</Label>
                  <Input
                    value={draft.architecture === "none" ? "" : draft.architecture}
                    onChange={(e) => patch({ architecture: e.target.value })}
                    placeholder="e.g. quicky-system,bottle-realtime,ludo-multiplayer"
                    className="bg-background font-mono text-xs"
                  />
                  <p className="text-[11px] leading-relaxed text-muted-foreground">
                    Comma-separated diagram keys — leave empty for none. Keys: {DIAGRAM_KEYS.join(" · ")}
                  </p>
                </div>
              </FormSection>

              <FormSection title="Case study narrative">
                <AreaField label="The idea" value={draft.idea} onChange={(v) => patch({ idea: v })} rows={3} />
                <AreaField label="The problem" value={draft.problem} onChange={(v) => patch({ problem: v })} rows={3} />
                <AreaField label="The solution" value={draft.solution} onChange={(v) => patch({ solution: v })} rows={3} />
                <AreaField label="Challenges" value={draft.challenges} onChange={(v) => patch({ challenges: v })} rows={3} />
                <AreaField label="What I built" value={draft.whatIBuilt} onChange={(v) => patch({ whatIBuilt: v })} rows={2} />
                <AreaField label="Result" value={draft.result} onChange={(v) => patch({ result: v })} rows={3} />
              </FormSection>

              <FormSection title="Structure — one per line">
                <AreaField
                  label="How it works — Title | detail"
                  value={draft.howItWorksText}
                  onChange={(v) => patch({ howItWorksText: v })}
                  rows={4}
                  hint={'e.g. "Join the table | Players are seated and a fresh game state is created"'}
                />
                <AreaField
                  label="Features — Title | detail"
                  value={draft.featuresText}
                  onChange={(v) => patch({ featuresText: v })}
                  rows={5}
                  hint={'e.g. "Server-authoritative dice | Rolls generated server-side"'}
                />
                <AreaField
                  label="Metrics — value | suffix | label"
                  value={draft.metricsText}
                  onChange={(v) => patch({ metricsText: v })}
                  rows={3}
                  hint={'e.g. "85 | %+ | Classification accuracy"'}
                />
              </FormSection>

              <FormSection title="Technologies">
                <div className="space-y-4">
                  {techByCategory.map(([cat, techs]) => (
                    <div key={cat}>
                      <div className="mb-2 font-mono text-[10px] uppercase tracking-[0.2em] text-muted-foreground">
                        {cat}
                      </div>
                      <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
                        {techs.map((t) => (
                          <label
                            key={t.id}
                            className={cn(
                              "flex cursor-pointer items-center gap-2 rounded-lg border px-3 py-2 text-xs transition-colors",
                              draft.technologyIds.includes(t.id)
                                ? "border-primary/50 bg-primary/10 text-primary"
                                : "border-border bg-background text-muted-foreground hover:border-primary/30"
                            )}
                          >
                            <Checkbox
                              checked={draft.technologyIds.includes(t.id)}
                              onCheckedChange={() => toggleTech(t.id)}
                            />
                            {t.name}
                          </label>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </FormSection>
            </div>
          )}

          <DialogFooter className="border-t border-border/60 px-6 py-4">
            <Button variant="outline" onClick={() => setDraft(null)} disabled={saving} className="rounded-full">
              Cancel
            </Button>
            <Button onClick={save} disabled={saving} className="rounded-full px-6 font-semibold">
              {saving ? <Loader2 size={14} className="mr-1.5 animate-spin" /> : null}
              {draft?.id ? "Save changes" : "Create project"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete confirm */}
      <AlertDialog open={deleting !== null} onOpenChange={(o) => !o && setDeleting(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete “{deleting?.title}”?</AlertDialogTitle>
            <AlertDialogDescription>
              This removes the project, its case study and technology links from the live portfolio. This action
              cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => deleting && remove(deleting)}
              className="bg-destructive text-white hover:bg-destructive/90"
            >
              Delete project
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
