"use client";

import { useCallback, useEffect, useState } from "react";
import { format } from "date-fns";
import { toast } from "sonner";
import {
  ArrowLeft,
  BadgeCheck,
  Boxes,
  Briefcase,
  FolderKanban,
  GraduationCap,
  LayoutDashboard,
  Loader2,
  Lock,
  LogOut,
  Mail,
  Settings2,
  Sparkles,
  Trash2,
  Wrench,
} from "lucide-react";
import type { ContactRequestView, PortfolioData } from "@/lib/types";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { cn } from "@/lib/utils";
import { adminFetch, clearToken, getToken, linesToList, setToken } from "./admin-api";
import { AdminProjects } from "./admin-projects";
import { AdminCollections } from "./admin-collections";

type Tab =
  | "overview"
  | "projects"
  | "experience"
  | "education"
  | "certifications"
  | "skills"
  | "requests"
  | "settings";

const TABS: Array<{ id: Tab; label: string; icon: typeof LayoutDashboard }> = [
  { id: "overview", label: "Dashboard", icon: LayoutDashboard },
  { id: "projects", label: "Projects", icon: FolderKanban },
  { id: "experience", label: "Experience", icon: Briefcase },
  { id: "education", label: "Education", icon: GraduationCap },
  { id: "certifications", label: "Certificates", icon: BadgeCheck },
  { id: "skills", label: "Skills", icon: Boxes },
  { id: "requests", label: "Requests", icon: Mail },
  { id: "settings", label: "Settings", icon: Settings2 },
];

const STATUS_COLORS: Record<string, string> = {
  new: "border-primary/40 bg-primary/10 text-primary",
  contacted: "border-chart-5/40 bg-chart-5/10 text-chart-5",
  archived: "border-border bg-muted text-muted-foreground",
};

/* ------------------------------ login gate ------------------------------- */

function LoginGate({ onLogin }: { onLogin: (token: string) => void }) {
  const [password, setPassword] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const submit = async (e?: React.FormEvent) => {
    e?.preventDefault();
    if (!password || busy) return;
    setBusy(true);
    setError(null);
    try {
      const res = await fetch("/api/admin/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password }),
      });
      const json = (await res.json()) as { token?: string; error?: string };
      if (!res.ok || !json.token) throw new Error(json.error ?? "Login failed");
      setToken(json.token);
      onLogin(json.token);
      toast.success("Admin access granted");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Login failed");
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-6">
      <div className="grid-bg pointer-events-none fixed inset-0 opacity-40" />
      <form onSubmit={submit} className="relative w-full max-w-sm">
        <div className="mb-8 text-center">
          <div className="mx-auto inline-flex size-14 items-center justify-center rounded-2xl border border-primary/30 bg-primary/10 text-primary">
            <Lock size={22} strokeWidth={1.75} />
          </div>
          <h1 className="mt-6 font-display text-2xl font-semibold tracking-tight">JYOTHILAL.REJI</h1>
          <p className="mt-2 font-mono text-[10px] tracking-[0.3em] uppercase text-muted-foreground">
            Admin console
          </p>
        </div>
        <div className="space-y-2">
          <Label htmlFor="admin-password" className="text-sm">
            Password
          </Label>
          <Input
            id="admin-password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="••••••••"
            autoFocus
            className="h-11 border-border bg-card"
          />
        </div>
        {error && <p className="mt-3 text-sm text-destructive">{error}</p>}
        <Button type="submit" disabled={!password || busy} className="mt-5 h-11 w-full rounded-full font-semibold">
          {busy ? <Loader2 size={15} className="mr-2 animate-spin" /> : <Sparkles size={15} className="mr-2" />}
          Enter dashboard
        </Button>
        <a
          href="#hero"
          className="mt-6 flex items-center justify-center gap-2 font-mono text-[10px] tracking-[0.24em] uppercase text-muted-foreground transition-colors hover:text-primary"
        >
          <ArrowLeft size={12} />
          Back to portfolio
        </a>
      </form>
    </div>
  );
}

/* ------------------------------ main panel ------------------------------- */

export function AdminPanel() {
  const [authed, setAuthed] = useState(false);
  const [checked, setChecked] = useState(false);
  const [data, setData] = useState<PortfolioData | null>(null);
  const [requests, setRequests] = useState<ContactRequestView[]>([]);
  const [tab, setTab] = useState<Tab>("overview");

  const load = useCallback(async () => {
    const res = await adminFetch<{ data: PortfolioData; requests: ContactRequestView[] }>("data");
    setData(res.data);
    setRequests(res.requests);
  }, []);

  useEffect(() => {
    // Defer the initial auth bootstrap off the effect body.
    const t = setTimeout(() => {
      const token = getToken();
      if (!token) {
        setChecked(true);
        return;
      }
      load()
        .then(() => setAuthed(true))
        .catch(() => clearToken())
        .finally(() => setChecked(true));
    }, 0);
    return () => clearTimeout(t);
  }, [load]);

  const refresh = useCallback(async () => {
    try {
      await load();
    } catch {
      toast.error("Session expired — logging out.");
      clearToken();
      setAuthed(false);
    }
  }, [load]);

  const logout = () => {
    clearToken();
    setAuthed(false);
    setData(null);
    setRequests([]);
  };

  const handleLoginSuccess = async () => {
    try {
      await load();
      setAuthed(true);
    } catch {
      toast.error("Could not load admin data — logging out.");
      clearToken();
      logout();
    }
  };

  if (!checked) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <Loader2 size={22} className="animate-spin text-primary" />
      </div>
    );
  }

  if (!authed) {
    return <LoginGate onLogin={handleLoginSuccess} />;
  }
  if (!data) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <Loader2 size={22} className="animate-spin text-primary" />
      </div>
    );
  }

  const newRequests = requests.filter((r) => r.status === "new").length;

  return (
    <div className="min-h-screen bg-background">
      {/* Admin header */}
      <header className="sticky top-0 z-40 border-b border-border/70 bg-background/85 backdrop-blur-xl">
        <div className="mx-auto flex h-16 w-[min(96%,80rem)] items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <span className="inline-flex size-8 items-center justify-center rounded-lg border border-primary/30 bg-primary/10 text-primary">
              <Wrench size={15} />
            </span>
            <div>
              <div className="font-display text-sm font-bold tracking-[0.12em]">JYOTHILAL.REJI</div>
              <div className="font-mono text-[9px] tracking-[0.3em] uppercase text-primary">Admin console</div>
            </div>
          </div>
          <div className="flex items-center gap-2.5">
            <a
              href="#hero"
              className="hidden items-center gap-2 rounded-full border border-border px-4 py-2 font-mono text-[10px] tracking-[0.18em] uppercase text-muted-foreground transition-colors hover:border-primary/50 hover:text-primary sm:inline-flex"
            >
              <ArrowLeft size={12} />
              View site
            </a>
            <Button variant="outline" size="sm" onClick={logout} className="rounded-full">
              <LogOut size={13} className="mr-1.5" />
              Logout
            </Button>
          </div>
        </div>
        {/* Tabs */}
        <div className="mx-auto w-[min(96%,80rem)]">
          <nav className="no-scrollbar flex gap-1 overflow-x-auto pb-px" aria-label="Admin sections">
            {TABS.map((t) => (
              <button
                key={t.id}
                type="button"
                onClick={() => setTab(t.id)}
                className={cn(
                  "relative flex shrink-0 items-center gap-2 px-3.5 py-3 font-mono text-[11px] tracking-[0.14em] uppercase transition-colors",
                  tab === t.id ? "text-primary" : "text-muted-foreground hover:text-foreground"
                )}
              >
                <t.icon size={13} />
                {t.label}
                {t.id === "requests" && newRequests > 0 && (
                  <span className="ml-0.5 rounded-full bg-primary px-1.5 py-0.5 text-[9px] font-bold text-primary-foreground">
                    {newRequests}
                  </span>
                )}
                {tab === t.id && <span className="absolute inset-x-2 bottom-0 h-0.5 rounded-full bg-primary" />}
              </button>
            ))}
          </nav>
        </div>
      </header>

      <main className="mx-auto w-[min(96%,80rem)] py-10">
        {tab === "overview" && <Overview data={data} requests={requests} onGo={setTab} />}

        {tab === "projects" && <AdminProjects data={data} refresh={refresh} />}

        {tab === "experience" && <AdminCollections kind="experience" data={data} refresh={refresh} />}
        {tab === "education" && <AdminCollections kind="education" data={data} refresh={refresh} />}
        {tab === "certifications" && <AdminCollections kind="certifications" data={data} refresh={refresh} />}
        {tab === "skills" && <AdminCollections kind="technologies" data={data} refresh={refresh} />}

        {tab === "requests" && (
          <RequestsTab requests={requests} refresh={refresh} />
        )}
        {tab === "settings" && <SettingsTab data={data} refresh={refresh} />}
      </main>
    </div>
  );
}

/* ------------------------------- overview --------------------------------- */

function Overview({
  data,
  requests,
  onGo,
}: {
  data: PortfolioData;
  requests: ContactRequestView[];
  onGo: (t: Tab) => void;
}) {
  const stats = [
    { label: "Projects", value: data.projects.length, tab: "projects" as Tab, icon: FolderKanban },
    { label: "Technologies", value: data.technologies.length, tab: "skills" as Tab, icon: Boxes },
    { label: "Experience", value: data.experience.length, tab: "experience" as Tab, icon: Briefcase },
    { label: "New requests", value: requests.filter((r) => r.status === "new").length, tab: "requests" as Tab, icon: Mail },
  ];

  return (
    <div className="space-y-8">
      <div>
        <h1 className="font-display text-3xl font-semibold tracking-tight">Dashboard</h1>
        <p className="mt-1.5 text-sm text-muted-foreground">
          Everything on the site is data-driven — changes here go live instantly.
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((s) => (
          <button
            key={s.label}
            type="button"
            onClick={() => onGo(s.tab)}
            className="group rounded-2xl border border-border/70 bg-card p-6 text-left transition-colors hover:border-primary/40"
          >
            <div className="flex items-center justify-between">
              <span className="inline-flex size-9 items-center justify-center rounded-lg border border-border text-muted-foreground transition-colors group-hover:border-primary/40 group-hover:text-primary">
                <s.icon size={16} />
              </span>
              <span className="font-display text-3xl font-semibold tabular-nums text-foreground">{s.value}</span>
            </div>
            <div className="mt-4 font-mono text-[10px] tracking-[0.22em] uppercase text-muted-foreground">
              {s.label}
            </div>
          </button>
        ))}
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Latest requests */}
        <div className="rounded-2xl border border-border/70 bg-card p-6">
          <div className="flex items-center justify-between">
            <h2 className="font-display text-lg font-semibold tracking-tight">Latest requests</h2>
            <button
              type="button"
              onClick={() => onGo("requests")}
              className="font-mono text-[10px] tracking-[0.18em] uppercase text-primary hover:underline"
            >
              View all
            </button>
          </div>
          <div className="mt-5 space-y-3">
            {requests.slice(0, 3).map((r) => (
              <div key={r.id} className="rounded-xl border border-border/60 bg-background/50 p-4">
                <div className="flex items-center justify-between gap-3">
                  <span className="text-sm font-medium text-foreground">
                    {r.name}
                    {r.company ? ` · ${r.company}` : ""}
                  </span>
                  <span className={cn("rounded-full border px-2.5 py-0.5 font-mono text-[9px] uppercase tracking-wider", STATUS_COLORS[r.status] ?? STATUS_COLORS.new)}>
                    {r.status}
                  </span>
                </div>
                <div className="mt-1.5 flex flex-wrap gap-1.5 font-mono text-[10px] text-muted-foreground">
                  <span className="rounded bg-muted px-1.5 py-0.5">{r.projectType}</span>
                  <span className="rounded bg-muted px-1.5 py-0.5">{r.budget}</span>
                </div>
                <p className="mt-2 line-clamp-2 text-xs leading-relaxed text-muted-foreground">{r.message}</p>
              </div>
            ))}
            {requests.length === 0 && (
              <p className="rounded-xl border border-dashed border-border p-6 text-center text-sm text-muted-foreground">
                No project requests yet — they&apos;ll appear here when the contact wizard is used.
              </p>
            )}
          </div>
        </div>

        {/* How this works */}
        <div className="rounded-2xl border border-primary/25 bg-primary/5 p-6">
          <h2 className="font-display text-lg font-semibold tracking-tight">How this portfolio works</h2>
          <ul className="mt-4 space-y-3 text-sm leading-relaxed text-muted-foreground">
            <li className="flex gap-2.5">
              <span className="mt-1.5 inline-block size-1.5 shrink-0 rotate-45 bg-primary" />
              Content lives in a database — projects, skills, experience, education and certifications are all
              editable here, no code changes needed.
            </li>
            <li className="flex gap-2.5">
              <span className="mt-1.5 inline-block size-1.5 shrink-0 rotate-45 bg-primary" />
              Finished a new project? Add it here with its case study, pick its technologies, set the sort order —
              it appears on the portfolio automatically.
            </li>
            <li className="flex gap-2.5">
              <span className="mt-1.5 inline-block size-1.5 shrink-0 rotate-45 bg-primary" />
              Project inquiries from the 4-step contact wizard land in the Requests tab — never in a spam folder.
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}

/* ------------------------------- requests --------------------------------- */

function RequestsTab({ requests, refresh }: { requests: ContactRequestView[]; refresh: () => Promise<void> }) {
  const [busyId, setBusyId] = useState<string | null>(null);

  const setStatus = async (id: string, status: string) => {
    setBusyId(id);
    try {
      await adminFetch("requests", { method: "PUT", body: { id, status } });
      await refresh();
      toast.success(`Marked as ${status}`);
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Update failed");
    } finally {
      setBusyId(null);
    }
  };

  const remove = async (id: string) => {
    setBusyId(id);
    try {
      await adminFetch("requests", { method: "DELETE", id });
      await refresh();
      toast.success("Request deleted");
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Delete failed");
    } finally {
      setBusyId(null);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-3xl font-semibold tracking-tight">Project requests</h1>
        <p className="mt-1.5 text-sm text-muted-foreground">
          Inquiries submitted through the contact wizard, newest first.
        </p>
      </div>

      <div className="space-y-4">
        {requests.map((r) => (
          <div key={r.id} className="rounded-2xl border border-border/70 bg-card p-6">
            <div className="flex flex-wrap items-start justify-between gap-4">
              <div>
                <div className="flex flex-wrap items-center gap-2.5">
                  <h3 className="font-display text-lg font-semibold tracking-tight">{r.name}</h3>
                  <span className={cn("rounded-full border px-2.5 py-0.5 font-mono text-[9px] uppercase tracking-wider", STATUS_COLORS[r.status] ?? STATUS_COLORS.new)}>
                    {r.status}
                  </span>
                </div>
                <div className="mt-1.5 flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-muted-foreground">
                  <a href={`mailto:${r.email}`} className="text-primary hover:underline">
                    {r.email}
                  </a>
                  {r.company && <span>{r.company}</span>}
                  <span className="font-mono text-[10px] uppercase tracking-wider">
                    {format(new Date(r.createdAt), "d MMM yyyy · HH:mm")}
                  </span>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Select value={r.status} onValueChange={(v) => setStatus(r.id, v)} disabled={busyId === r.id}>
                  <SelectTrigger className="h-9 w-32 rounded-full border-border bg-background text-xs">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="new">New</SelectItem>
                    <SelectItem value="contacted">Contacted</SelectItem>
                    <SelectItem value="archived">Archived</SelectItem>
                  </SelectContent>
                </Select>
                <Button
                  variant="outline"
                  size="icon"
                  className="size-9 rounded-full text-muted-foreground hover:border-destructive/50 hover:text-destructive"
                  onClick={() => remove(r.id)}
                  disabled={busyId === r.id}
                  aria-label="Delete request"
                >
                  <Trash2 size={14} />
                </Button>
              </div>
            </div>

            <div className="mt-4 flex flex-wrap gap-2">
              <span className="rounded-lg border border-border bg-background px-3 py-1.5 font-mono text-[10px] uppercase tracking-wider text-foreground">
                {r.projectType}
              </span>
              <span className="rounded-lg border border-border bg-background px-3 py-1.5 font-mono text-[10px] uppercase tracking-wider text-foreground">
                {r.budget}
              </span>
            </div>

            <p className="mt-4 whitespace-pre-wrap rounded-xl border border-border/60 bg-background/50 p-4 text-sm leading-relaxed text-foreground/90">
              {r.message}
            </p>
          </div>
        ))}
        {requests.length === 0 && (
          <div className="rounded-2xl border border-dashed border-border p-12 text-center">
            <Mail size={20} className="mx-auto text-muted-foreground/50" />
            <p className="mt-3 text-sm text-muted-foreground">
              No requests yet. Inquiries from the portfolio&apos;s project wizard will appear here.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

/* ------------------------------- settings --------------------------------- */

function SettingsTab({ data, refresh }: { data: PortfolioData; refresh: () => Promise<void> }) {
  const [email, setEmail] = useState(data.settings["contact.email"] ?? "");
  const [github, setGithub] = useState(data.settings["contact.github"] ?? "");
  const [linkedin, setLinkedin] = useState(data.settings["contact.linkedin"] ?? "");
  const [location, setLocation] = useState(data.settings["contact.location"] ?? "");
  const [languages, setLanguages] = useState(() => {
    try {
      const list = JSON.parse(data.settings["languages"] ?? "[]") as Array<{ name: string; level: string }>;
      return list.map((l) => `${l.name} | ${l.level}`).join("\n");
    } catch {
      return "";
    }
  });
  const [saving, setSaving] = useState(false);

  const save = async () => {
    setSaving(true);
    try {
      const langList = linesToList(languages).map((line) => {
        const [name, level] = line.split("|").map((p) => p.trim());
        return { name: name ?? "", level: level ?? "" };
      });
      const entries: Array<[string, string]> = [
        ["contact.email", email.trim()],
        ["contact.github", github.trim()],
        ["contact.linkedin", linkedin.trim()],
        ["contact.location", location.trim()],
        ["languages", JSON.stringify(langList)],
      ];
      for (const [key, value] of entries) {
        await adminFetch("settings", { method: "PUT", body: { key, value } });
      }
      await refresh();
      toast.success("Settings saved — live on the site now.");
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Save failed");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="max-w-2xl space-y-6">
      <div>
        <h1 className="font-display text-3xl font-semibold tracking-tight">Site settings</h1>
        <p className="mt-1.5 text-sm text-muted-foreground">
          Contact channels, location line and spoken languages used across the portfolio.
        </p>
      </div>

      <div className="space-y-5 rounded-2xl border border-border/70 bg-card p-6 md:p-8">
        <div className="grid gap-5 sm:grid-cols-2">
          <div className="space-y-2">
            <Label className="text-sm">Contact email</Label>
            <Input value={email} onChange={(e) => setEmail(e.target.value)} className="bg-background" placeholder="you@example.com" />
          </div>
          <div className="space-y-2">
            <Label className="text-sm">Location line</Label>
            <Input value={location} onChange={(e) => setLocation(e.target.value)} className="bg-background" placeholder="Kerala, India · Working worldwide" />
          </div>
          <div className="space-y-2">
            <Label className="text-sm">GitHub URL</Label>
            <Input value={github} onChange={(e) => setGithub(e.target.value)} className="bg-background" placeholder="https://github.com/…" />
          </div>
          <div className="space-y-2">
            <Label className="text-sm">LinkedIn URL</Label>
            <Input value={linkedin} onChange={(e) => setLinkedin(e.target.value)} className="bg-background" placeholder="https://linkedin.com/in/…" />
          </div>
        </div>
        <div className="space-y-2">
          <Label className="text-sm">Languages — one per line: Name | Level</Label>
          <textarea
            value={languages}
            onChange={(e) => setLanguages(e.target.value)}
            rows={3}
            placeholder={"English | Fluent\nMalayalam | Native"}
            className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm shadow-xs outline-none placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50"
          />
        </div>
        <Button onClick={save} disabled={saving} className="rounded-full px-6 font-semibold">
          {saving ? <Loader2 size={14} className="mr-2 animate-spin" /> : null}
          Save settings
        </Button>
      </div>
    </div>
  );
}
