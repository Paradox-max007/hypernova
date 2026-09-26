"use client";

import { useMemo, useState } from "react";
import { toast } from "sonner";
import { Loader2, Pencil, Plus, Trash2 } from "lucide-react";
import type { Certification, Education, PortfolioData, Technology } from "@/lib/types";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Switch } from "@/components/ui/switch";
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
import { AreaField, FormSection, TextField } from "./admin-projects";
import { adminFetch, itemsToLines, linesToList, parseLineItems } from "./admin-api";

export type CollectionKind = "experience" | "education" | "certifications" | "technologies";

interface AdminCollectionsProps {
  kind: CollectionKind;
  data: PortfolioData;
  refresh: () => Promise<void>;
}

/* ------------------------------ shared shell ------------------------------ */

interface RowTarget {
  id: string;
  label: string;
}

function CollectionShell({
  title,
  subtitle,
  rows,
  onNew,
  renderRow,
  dialogTitle,
  onClose,
  saving,
  onSave,
  children,
  onDelete,
  deleting,
  onCancelDelete,
}: {
  title: string;
  subtitle: string;
  rows: RowTarget[];
  onNew: () => void;
  renderRow: (row: RowTarget, index: number) => React.ReactNode;
  dialogTitle: string;
  onClose: () => void;
  saving: boolean;
  onSave: () => void;
  children: React.ReactNode;
  onDelete: (row: RowTarget) => void;
  deleting: RowTarget | null;
  onCancelDelete: () => void;
}) {
  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="font-display text-3xl font-semibold tracking-tight">{title}</h1>
          <p className="mt-1.5 text-sm text-muted-foreground">{subtitle}</p>
        </div>
        <Button onClick={onNew} className="rounded-full font-semibold">
          <Plus size={15} className="mr-1.5" />
          Add entry
        </Button>
      </div>

      <div className="overflow-hidden rounded-2xl border border-border/70 bg-card">
        {rows.map((row, i) => (
          <div key={row.id} className="border-b border-border/50 transition-colors last:border-0 hover:bg-background/40">
            {renderRow(row, i)}
          </div>
        ))}
        {rows.length === 0 && (
          <p className="px-6 py-10 text-center text-sm text-muted-foreground">Nothing here yet — add the first entry.</p>
        )}
      </div>

      <Dialog open={children !== null} onOpenChange={(o) => !saving && (o ? undefined : onClose())}>
        <DialogContent className="max-h-[92vh] gap-0 overflow-y-auto rounded-2xl p-0 sm:max-w-xl">
          <DialogHeader className="border-b border-border/60 px-6 pb-5 pt-6">
            <DialogTitle className="font-display tracking-tight">{dialogTitle}</DialogTitle>
            <DialogDescription>Changes go live on the portfolio immediately.</DialogDescription>
          </DialogHeader>
          <div className="px-6 py-6">{children}</div>
          <DialogFooter className="border-t border-border/60 px-6 py-4">
            <Button variant="outline" onClick={onClose} disabled={saving} className="rounded-full">
              Cancel
            </Button>
            <Button onClick={onSave} disabled={saving} className="rounded-full px-6 font-semibold">
              {saving ? <Loader2 size={14} className="mr-1.5 animate-spin" /> : null}
              Save
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <AlertDialog open={deleting !== null} onOpenChange={(o) => !o && onCancelDelete()}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete “{deleting?.label}”?</AlertDialogTitle>
            <AlertDialogDescription>This cannot be undone.</AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => deleting && onDelete(deleting)}
              className="bg-destructive text-white hover:bg-destructive/90"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}

function RowActions({ onEdit, onDelete }: { onEdit: () => void; onDelete: () => void }) {
  return (
    <div className="flex items-center gap-2">
      <Button variant="outline" size="sm" onClick={onEdit} className="rounded-full">
        <Pencil size={13} className="mr-1" /> Edit
      </Button>
      <Button
        variant="outline"
        size="sm"
        onClick={onDelete}
        className="rounded-full text-muted-foreground hover:border-destructive/50 hover:text-destructive"
      >
        <Trash2 size={13} />
      </Button>
    </div>
  );
}

/* ------------------------------ experience -------------------------------- */

function ExperienceManager({ data, refresh }: { data: PortfolioData; refresh: () => Promise<void> }) {
  const [draft, setDraft] = useState<null | {
    id: string | null;
    company: string;
    role: string;
    location: string;
    startDate: string;
    endDate: string;
    current: boolean;
    description: string;
    responsibilitiesText: string;
    highlightsText: string;
    sortOrder: string;
  }>(null);
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState<RowTarget | null>(null);

  const patch = (f: Partial<NonNullable<typeof draft>>) => setDraft((d) => (d ? { ...d, ...f } : d));

  const save = async () => {
    if (!draft) return;
    if (!draft.company.trim() || !draft.role.trim() || !draft.location.trim()) {
      toast.error("Company, role and location are required.");
      return;
    }
    setSaving(true);
    try {
      const highlights = parseLineItems(draft.highlightsText, ["value", "suffix", "label"])
        .map((h) => ({ value: Number(h.value) || 0, suffix: h.suffix, label: h.label }))
        .filter((h) => h.label);
      const body = {
        company: draft.company,
        role: draft.role,
        location: draft.location,
        startDate: draft.startDate,
        endDate: draft.endDate,
        current: draft.current,
        description: draft.description,
        responsibilities: JSON.stringify(linesToList(draft.responsibilitiesText)),
        highlights: JSON.stringify(highlights),
        sortOrder: Number(draft.sortOrder) || 0,
        ...(draft.id ? { id: draft.id } : {}),
      };
      await adminFetch("experience", { method: draft.id ? "PUT" : "POST", body });
      toast.success(draft.id ? "Experience updated." : "Experience added.");
      setDraft(null);
      await refresh();
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Save failed");
    } finally {
      setSaving(false);
    }
  };

  const remove = async (row: RowTarget) => {
    try {
      await adminFetch("experience", { method: "DELETE", id: row.id });
      toast.success("Deleted.");
      setDeleting(null);
      await refresh();
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Delete failed");
    }
  };

  const rows = data.experience.map((e) => ({ id: e.id, label: `${e.role} @ ${e.company}` }));

  return (
    <CollectionShell
      title="Experience"
      subtitle="Documented professional roles — shown on the timeline with animated highlight counters."
      rows={rows}
      onNew={() =>
        setDraft({
          id: null,
          company: "",
          role: "",
          location: "",
          startDate: "",
          endDate: "Present",
          current: true,
          description: "",
          responsibilitiesText: "",
          highlightsText: "",
          sortOrder: String(data.experience.length + 1),
        })
      }
      renderRow={(_row, i) => {
        const e = data.experience[i];
        return (
          <div className="flex flex-wrap items-center justify-between gap-3 px-5 py-4">
            <div className="min-w-0">
              <div className="flex flex-wrap items-center gap-2">
                <span className="text-sm font-medium text-foreground">{e.role}</span>
                {e.current && (
                  <span className="rounded-full border border-primary/35 bg-primary/10 px-2 py-0.5 font-mono text-[9px] uppercase tracking-wider text-primary">
                    Current
                  </span>
                )}
              </div>
              <span className="text-xs text-muted-foreground">
                {e.company} · {e.startDate} — {e.endDate}
              </span>
            </div>
            <RowActions
              onEdit={() =>
                setDraft({
                  id: e.id,
                  company: e.company,
                  role: e.role,
                  location: e.location,
                  startDate: e.startDate,
                  endDate: e.endDate,
                  current: e.current,
                  description: e.description ?? "",
                  responsibilitiesText: (e.responsibilities ?? []).join("\n"),
                  highlightsText: itemsToLines(e.highlights, ["value", "suffix", "label"]),
                  sortOrder: String(e.sortOrder),
                })
              }
              onDelete={() => setDeleting({ id: e.id, label: `${e.role} @ ${e.company}` })}
            />
          </div>
        );
      }}
      dialogTitle={draft?.id ? `Edit — ${draft.company || "entry"}` : "New experience"}
      onClose={() => setDraft(null)}
      saving={saving}
      onSave={save}
      onDelete={remove}
      deleting={deleting}
      onCancelDelete={() => setDeleting(null)}
    >
      {draft && (
        <div className="space-y-5">
          <FormSection title="Role">
            <TextField label="Role *" value={draft.role} onChange={(v) => patch({ role: v })} placeholder="Data Science Intern" />
            <div className="grid gap-4 sm:grid-cols-2">
              <TextField label="Company *" value={draft.company} onChange={(v) => patch({ company: v })} placeholder="Luminar Technolab" />
              <TextField label="Location *" value={draft.location} onChange={(v) => patch({ location: v })} placeholder="Kochi, Ernakulam" />
            </div>
            <div className="grid gap-4 sm:grid-cols-3">
              <TextField label="Start *" value={draft.startDate} onChange={(v) => patch({ startDate: v })} placeholder="May 2024" />
              <TextField label="End *" value={draft.endDate} onChange={(v) => patch({ endDate: v })} placeholder="Present" />
              <TextField label="Sort order" value={draft.sortOrder} onChange={(v) => patch({ sortOrder: v })} type="number" />
            </div>
            <div className="flex items-center justify-between rounded-lg border border-border/60 bg-background px-4 py-3">
              <Label className="text-sm">Current role</Label>
              <Switch checked={draft.current} onCheckedChange={(v) => patch({ current: v })} />
            </div>
          </FormSection>
          <FormSection title="Detail">
            <AreaField label="Description" value={draft.description} onChange={(v) => patch({ description: v })} rows={3} />
            <AreaField
              label="Responsibilities — one per line"
              value={draft.responsibilitiesText}
              onChange={(v) => patch({ responsibilitiesText: v })}
              rows={4}
            />
            <AreaField
              label="Highlights — value | suffix | label"
              value={draft.highlightsText}
              onChange={(v) => patch({ highlightsText: v })}
              rows={3}
              hint={'e.g. "30 | % | Prediction accuracy improvement"'}
            />
          </FormSection>
        </div>
      )}
    </CollectionShell>
  );
}

/* ------------------------------- education -------------------------------- */

function EducationManager({ data, refresh }: { data: PortfolioData; refresh: () => Promise<void> }) {
  const [draft, setDraft] = useState<null | {
    id: string | null;
    degree: string;
    institution: string;
    location: string;
    startDate: string;
    endDate: string;
    cgpa: string;
    description: string;
    sortOrder: string;
  }>(null);
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState<RowTarget | null>(null);

  const patch = (f: Partial<NonNullable<typeof draft>>) => setDraft((d) => (d ? { ...d, ...f } : d));

  const save = async () => {
    if (!draft) return;
    if (!draft.degree.trim() || !draft.institution.trim()) {
      toast.error("Degree and institution are required.");
      return;
    }
    setSaving(true);
    try {
      const body = {
        degree: draft.degree,
        institution: draft.institution,
        location: draft.location,
        startDate: draft.startDate,
        endDate: draft.endDate,
        cgpa: draft.cgpa,
        description: draft.description,
        sortOrder: Number(draft.sortOrder) || 0,
        ...(draft.id ? { id: draft.id } : {}),
      };
      await adminFetch("education", { method: draft.id ? "PUT" : "POST", body });
      toast.success(draft.id ? "Education updated." : "Education added.");
      setDraft(null);
      await refresh();
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Save failed");
    } finally {
      setSaving(false);
    }
  };

  const remove = async (row: RowTarget) => {
    try {
      await adminFetch("education", { method: "DELETE", id: row.id });
      toast.success("Deleted.");
      setDeleting(null);
      await refresh();
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Delete failed");
    }
  };

  const rows: RowTarget[] = data.education.map((e: Education) => ({ id: e.id, label: e.degree }));

  return (
    <CollectionShell
      title="Education"
      subtitle="Degrees and formal education — rendered as the interactive timeline."
      rows={rows}
      onNew={() =>
        setDraft({
          id: null,
          degree: "",
          institution: "",
          location: "",
          startDate: "",
          endDate: "",
          cgpa: "",
          description: "",
          sortOrder: String(data.education.length + 1),
        })
      }
      renderRow={(_row, i) => {
        const e = data.education[i];
        return (
          <div className="flex flex-wrap items-center justify-between gap-3 px-5 py-4">
            <div className="min-w-0">
              <div className="text-sm font-medium text-foreground">{e.degree}</div>
              <span className="text-xs text-muted-foreground">
                {e.institution} · {e.startDate} — {e.endDate}
                {e.cgpa ? ` · CGPA ${e.cgpa}` : ""}
              </span>
            </div>
            <RowActions
              onEdit={() =>
                setDraft({
                  id: e.id,
                  degree: e.degree,
                  institution: e.institution,
                  location: e.location ?? "",
                  startDate: e.startDate,
                  endDate: e.endDate,
                  cgpa: e.cgpa ?? "",
                  description: e.description ?? "",
                  sortOrder: String(e.sortOrder),
                })
              }
              onDelete={() => setDeleting({ id: e.id, label: e.degree })}
            />
          </div>
        );
      }}
      dialogTitle={draft?.id ? `Edit — ${draft.institution || "entry"}` : "New education"}
      onClose={() => setDraft(null)}
      saving={saving}
      onSave={save}
      onDelete={remove}
      deleting={deleting}
      onCancelDelete={() => setDeleting(null)}
    >
      {draft && (
        <div className="space-y-5">
          <FormSection title="Degree">
            <TextField label="Degree *" value={draft.degree} onChange={(v) => patch({ degree: v })} placeholder="Bachelor of Computer Applications (BCA)" />
            <div className="grid gap-4 sm:grid-cols-2">
              <TextField label="Institution *" value={draft.institution} onChange={(v) => patch({ institution: v })} placeholder="Mar Augusthinose College" />
              <TextField label="Location" value={draft.location} onChange={(v) => patch({ location: v })} placeholder="Ramapuram, Kerala" />
            </div>
            <div className="grid gap-4 sm:grid-cols-3">
              <TextField label="Start *" value={draft.startDate} onChange={(v) => patch({ startDate: v })} placeholder="Jun 2021" />
              <TextField label="End *" value={draft.endDate} onChange={(v) => patch({ endDate: v })} placeholder="Mar 2024" />
              <TextField label="CGPA" value={draft.cgpa} onChange={(v) => patch({ cgpa: v })} placeholder="7.46 / 10" />
            </div>
            <TextField label="Sort order" value={draft.sortOrder} onChange={(v) => patch({ sortOrder: v })} type="number" />
          </FormSection>
          <FormSection title="Detail">
            <AreaField label="Description" value={draft.description} onChange={(v) => patch({ description: v })} rows={3} />
          </FormSection>
        </div>
      )}
    </CollectionShell>
  );
}

/* ----------------------------- certifications ----------------------------- */

function CertificationManager({ data, refresh }: { data: PortfolioData; refresh: () => Promise<void> }) {
  const [draft, setDraft] = useState<null | {
    id: string | null;
    title: string;
    issuer: string;
    date: string;
    url: string;
    sortOrder: string;
  }>(null);
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState<RowTarget | null>(null);

  const patch = (f: Partial<NonNullable<typeof draft>>) => setDraft((d) => (d ? { ...d, ...f } : d));

  const save = async () => {
    if (!draft) return;
    if (!draft.title.trim() || !draft.issuer.trim()) {
      toast.error("Title and issuer are required.");
      return;
    }
    setSaving(true);
    try {
      const body = {
        title: draft.title,
        issuer: draft.issuer,
        date: draft.date,
        url: draft.url,
        sortOrder: Number(draft.sortOrder) || 0,
        ...(draft.id ? { id: draft.id } : {}),
      };
      await adminFetch("certifications", { method: draft.id ? "PUT" : "POST", body });
      toast.success(draft.id ? "Certification updated." : "Certification added.");
      setDraft(null);
      await refresh();
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Save failed");
    } finally {
      setSaving(false);
    }
  };

  const remove = async (row: RowTarget) => {
    try {
      await adminFetch("certifications", { method: "DELETE", id: row.id });
      toast.success("Deleted.");
      setDeleting(null);
      await refresh();
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Delete failed");
    }
  };

  const rows: RowTarget[] = data.certifications.map((c: Certification) => ({ id: c.id, label: c.title }));

  return (
    <CollectionShell
      title="Certifications"
      subtitle="Verified credentials shown in the About section."
      rows={rows}
      onNew={() =>
        setDraft({ id: null, title: "", issuer: "", date: "", url: "", sortOrder: String(data.certifications.length + 1) })
      }
      renderRow={(_row, i) => {
        const c = data.certifications[i];
        return (
          <div className="flex flex-wrap items-center justify-between gap-3 px-5 py-4">
            <div className="min-w-0">
              <div className="text-sm font-medium text-foreground">{c.title}</div>
              <span className="text-xs text-muted-foreground">
                {c.issuer}
                {c.date ? ` · ${c.date}` : ""}
              </span>
            </div>
            <RowActions
              onEdit={() =>
                setDraft({ id: c.id, title: c.title, issuer: c.issuer, date: c.date ?? "", url: c.url ?? "", sortOrder: String(c.sortOrder) })
              }
              onDelete={() => setDeleting({ id: c.id, label: c.title })}
            />
          </div>
        );
      }}
      dialogTitle={draft?.id ? `Edit — ${draft.title || "entry"}` : "New certification"}
      onClose={() => setDraft(null)}
      saving={saving}
      onSave={save}
      onDelete={remove}
      deleting={deleting}
      onCancelDelete={() => setDeleting(null)}
    >
      {draft && (
        <FormSection title="Certification">
          <TextField label="Title *" value={draft.title} onChange={(v) => patch({ title: v })} placeholder="Data Science Foundations" />
          <TextField label="Issuer *" value={draft.issuer} onChange={(v) => patch({ issuer: v })} placeholder="Great Learning" />
          <div className="grid gap-4 sm:grid-cols-3">
            <TextField label="Date" value={draft.date} onChange={(v) => patch({ date: v })} placeholder="2024" />
            <TextField label="URL" value={draft.url} onChange={(v) => patch({ url: v })} placeholder="https://…" />
            <TextField label="Sort order" value={draft.sortOrder} onChange={(v) => patch({ sortOrder: v })} type="number" />
          </div>
        </FormSection>
      )}
    </CollectionShell>
  );
}

/* ------------------------------ technologies ------------------------------ */

function TechnologyManager({ data, refresh }: { data: PortfolioData; refresh: () => Promise<void> }) {
  const categories = useMemo(
    () => [...new Set(data.technologies.map((t: Technology) => t.category))],
    [data.technologies]
  );

  const [draft, setDraft] = useState<null | {
    id: string | null;
    name: string;
    category: string;
    description: string;
    usedForText: string;
    sortOrder: string;
  }>(null);
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState<RowTarget | null>(null);

  const patch = (f: Partial<NonNullable<typeof draft>>) => setDraft((d) => (d ? { ...d, ...f } : d));

  const save = async () => {
    if (!draft) return;
    if (!draft.name.trim() || !draft.category.trim()) {
      toast.error("Name and category are required.");
      return;
    }
    setSaving(true);
    try {
      const body = {
        name: draft.name,
        category: draft.category,
        description: draft.description,
        usedFor: JSON.stringify(linesToList(draft.usedForText)),
        sortOrder: Number(draft.sortOrder) || 0,
        ...(draft.id ? { id: draft.id } : {}),
      };
      await adminFetch("technologies", { method: draft.id ? "PUT" : "POST", body });
      toast.success(draft.id ? "Technology updated." : "Technology added.");
      setDraft(null);
      await refresh();
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Save failed");
    } finally {
      setSaving(false);
    }
  };

  const remove = async (row: RowTarget) => {
    try {
      await adminFetch("technologies", { method: "DELETE", id: row.id });
      toast.success("Deleted.");
      setDeleting(null);
      await refresh();
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Delete failed");
    }
  };

  const rows: RowTarget[] = data.technologies.map((t: Technology) => ({ id: t.id, label: t.name }));

  return (
    <CollectionShell
      title="Skills & technologies"
      subtitle="Every node in the constellation — linked projects update automatically."
      rows={rows}
      onNew={() =>
        setDraft({ id: null, name: "", category: categories[0] ?? "", description: "", usedForText: "", sortOrder: String(data.technologies.length + 1) })
      }
      renderRow={(_row, i) => {
        const t = data.technologies[i];
        return (
          <div className="flex flex-wrap items-center justify-between gap-3 px-5 py-4">
            <div className="flex min-w-0 items-center gap-3">
              <span className="text-sm font-medium text-foreground">{t.name}</span>
              <span className="rounded-full border border-border bg-background px-2.5 py-0.5 font-mono text-[9px] uppercase tracking-wider text-muted-foreground">
                {t.category}
              </span>
              <span className="font-mono text-[10px] text-muted-foreground">{t.projectCount} projects</span>
            </div>
            <RowActions
              onEdit={() =>
                setDraft({
                  id: t.id,
                  name: t.name,
                  category: t.category,
                  description: t.description ?? "",
                  usedForText: (t.usedFor ?? []).join("\n"),
                  sortOrder: String(t.sortOrder),
                })
              }
              onDelete={() => setDeleting({ id: t.id, label: t.name })}
            />
          </div>
        );
      }}
      dialogTitle={draft?.id ? `Edit — ${draft.name || "entry"}` : "New technology"}
      onClose={() => setDraft(null)}
      saving={saving}
      onSave={save}
      onDelete={remove}
      deleting={deleting}
      onCancelDelete={() => setDeleting(null)}
    >
      {draft && (
        <div className="space-y-5">
          <FormSection title="Technology">
            <TextField label="Name *" value={draft.name} onChange={(v) => patch({ name: v })} placeholder="Python" />
            <div className="space-y-1.5">
              <TextField
                label="Category *"
                value={draft.category}
                onChange={(v) => patch({ category: v })}
                placeholder="Languages"
                hint={`Existing: ${categories.join(", ")}`}
              />
              <datalist id="tech-categories">
                {categories.map((c) => (
                  <option key={c} value={c} />
                ))}
              </datalist>
            </div>
            <TextField label="Sort order" value={draft.sortOrder} onChange={(v) => patch({ sortOrder: v })} type="number" />
          </FormSection>
          <FormSection title="Detail">
            <AreaField label="Description" value={draft.description} onChange={(v) => patch({ description: v })} rows={3} placeholder="Shown in the skill explorer panel." />
            <AreaField
              label="Used for — one per line"
              value={draft.usedForText}
              onChange={(v) => patch({ usedForText: v })}
              rows={3}
              hint={'e.g. "Data Science", "Machine Learning"'}
            />
          </FormSection>
        </div>
      )}
    </CollectionShell>
  );
}

/* --------------------------------- router --------------------------------- */

export function AdminCollections({ kind, data, refresh }: AdminCollectionsProps) {
  switch (kind) {
    case "experience":
      return <ExperienceManager data={data} refresh={refresh} />;
    case "education":
      return <EducationManager data={data} refresh={refresh} />;
    case "certifications":
      return <CertificationManager data={data} refresh={refresh} />;
    case "technologies":
      return <TechnologyManager data={data} refresh={refresh} />;
  }
}
