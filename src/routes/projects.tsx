import { createFileRoute } from "@tanstack/react-router";
import { requireAuth } from "@/lib/requireAuth";
import { ProtectedRoute } from "@/components/auth/ProtectedRoute";
import { useMemo, useState, useEffect, useCallback } from "react";
import {
  Plus, Search, SlidersHorizontal, ArrowUpDown, LayoutGrid, List,
  ChevronDown, MoreHorizontal, Calendar, MessageSquare, Paperclip,
  CheckCircle2, GitBranch, Sparkles, Flag, ArrowRight, X, ExternalLink,
  Users, Clock, Star, FolderKanban, Loader2,
} from "lucide-react";
import { useProjects, useDeleteProject, getPersistedProjectId, persistProjectId } from "@/features/projects/hooks";
import { useWorkspaceContext } from "@/context/WorkspaceContext";
import type { ApiProject, ApiStatus, ApiPriority } from "@/features/projects/api";

export const Route = createFileRoute("/projects")({
  head: () => ({
    meta: [
      { title: "Projects — Zabaku" },
      { name: "description", content: "Every project in your Zabaku workspace — progress, owners, deadlines, and status at a glance." },
      { property: "og:title", content: "Projects — Zabaku" },
      { property: "og:description", content: "Every project in your Zabaku workspace — progress, owners, deadlines, and status at a glance." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  beforeLoad: requireAuth,
  component: () => <ProtectedRoute><ProjectsPage /></ProtectedRoute>,
});

/* ============ UI-facing types (unchanged from original) ============ */
type Priority = ApiPriority;
type Status = ApiStatus;

type Member = { initials: string; color: string };

type Project = {
  id: string;      // MongoDB _id
  key: string;
  name: string;
  description: string;
  color: string;
  progress: number;
  status: Status;
  priority: Priority;
  due: string;
  dueRelative: string;
  members: Member[];
  tasks: { done: number; total: number };
  comments: number;
  attachments: number;
  updated: string;
  starred?: boolean;
  aiAssisted?: boolean;
};

/* ============ normalise backend → UI Project ============ */

const MEMBER_COLORS = [
  "oklch(0.55 0.22 279)",
  "oklch(0.72 0.16 180)",
  "oklch(0.75 0.16 92)",
  "oklch(0.68 0.17 28)",
  "oklch(0.62 0.19 30)",
];

const PROJECT_COLORS = [
  "oklch(0.55 0.22 279)",
  "oklch(0.75 0.16 92)",
  "oklch(0.72 0.16 180)",
  "oklch(0.68 0.16 320)",
  "oklch(0.62 0.19 30)",
  "oklch(0.68 0.16 155)",
  "oklch(0.55 0.14 250)",
  "oklch(0.68 0.16 210)",
  "oklch(0.7 0.14 60)",
];

function relativeDate(iso?: string): string {
  if (!iso) return "";
  const d = new Date(iso);
  if (isNaN(d.getTime())) return iso;
  const diff = Math.round((d.getTime() - Date.now()) / 86_400_000);
  if (diff < -1) return `${Math.abs(diff)}d ago`;
  if (diff === -1) return "yesterday";
  if (diff === 0) return "today";
  if (diff === 1) return "tomorrow";
  return `in ${diff} days`;
}

function formatDue(iso?: string): string {
  if (!iso) return "–";
  const d = new Date(iso);
  if (isNaN(d.getTime())) return iso;
  return d.toLocaleDateString("en-US", { month: "short", day: "numeric" });
}

function updatedAgo(iso?: string): string {
  if (!iso) return "";
  const diff = Date.now() - new Date(iso).getTime();
  const mins = Math.floor(diff / 60_000);
  if (mins < 1) return "just now";
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  return `${Math.floor(hrs / 24)}d ago`;
}

function normalise(raw: ApiProject, idx: number): Project {
  const id = raw._id ?? raw.id ?? String(idx);
  const key = raw.key ?? `PRJ-${String(idx + 1).padStart(2, "0")}`;
  return {
    id,
    key,
    name: raw.name,
    description: raw.description ?? "",
    color: raw.color ?? PROJECT_COLORS[idx % PROJECT_COLORS.length],
    progress: raw.progress ?? 0,
    status: raw.status ?? "On track",
    priority: raw.priority ?? "Medium",
    due: formatDue(raw.dueDate),
    dueRelative: relativeDate(raw.dueDate),
    members: (raw.members ?? []).map((m, mi) => ({
      initials: m.initials ?? (m.name ? m.name.split(" ").map((n) => n[0]).join("").slice(0, 2).toUpperCase() : "??"),
      color: m.color ?? MEMBER_COLORS[mi % MEMBER_COLORS.length],
    })),
    tasks: { done: raw.tasksDone ?? 0, total: raw.tasksTotal ?? 0 },
    comments: raw.commentsCount ?? 0,
    attachments: raw.attachmentsCount ?? 0,
    updated: updatedAgo(raw.updatedAt),
    starred: raw.starred,
    aiAssisted: raw.aiAssisted,
  };
}

/* ============ constants ============ */
const STATUSES: Status[] = ["On track", "At risk", "Blocked", "In review", "Shipped"];

/* ============ page ============ */
function ProjectsPage() {
  const { workspaceId } = useWorkspaceContext();

  const { data: rawProjects = [], isLoading, isError, error } = useProjects(workspaceId);
  const deleteProject = useDeleteProject(workspaceId);

  // Normalise once
  const projects = useMemo<Project[]>(
    () => rawProjects.map((p, i) => normalise(p, i)),
    [rawProjects]
  );

  const [view, setView] = useState<"grid" | "list">("grid");
  const [query, setQuery] = useState("");
  const [status, setStatus] = useState<Status | "All">("All");
  const [sort, setSort] = useState<"Recent" | "Due date" | "Progress" | "Priority">("Recent");

  // Active project (drawer) — restore from localStorage
  const [activeId, setActiveId] = useState<string | null>(getPersistedProjectId);
  const active = projects.find((p) => p.id === activeId) ?? null;

  // Clear stale persisted project once data loads
  useEffect(() => {
    if (!isLoading && activeId && !projects.find((p) => p.id === activeId)) {
      setActiveId(null);
      persistProjectId(null);
    }
  }, [isLoading, projects, activeId]);

  const openProject = useCallback((p: Project) => {
    setActiveId(p.id);
    persistProjectId(p.id);
  }, []);

  const closeProject = useCallback(() => {
    setActiveId(null);
    persistProjectId(null);
  }, []);

  const filtered = useMemo(() => {
    const priorityWeight: Record<Priority, number> = { Urgent: 0, High: 1, Medium: 2, Low: 3 };
    const out = projects.filter((p) => {
      if (status !== "All" && p.status !== status) return false;
      if (query && !`${p.name} ${p.key} ${p.description}`.toLowerCase().includes(query.toLowerCase())) return false;
      return true;
    });
    out.sort((a, b) => {
      if (sort === "Progress") return b.progress - a.progress;
      if (sort === "Priority") return priorityWeight[a.priority] - priorityWeight[b.priority];
      if (sort === "Due date") return a.due.localeCompare(b.due);
      return 0;
    });
    return out;
  }, [projects, query, status, sort]);

  function countByStatus(): Record<Status | "All", number> {
    const out: Record<string, number> = { All: projects.length };
    for (const s of STATUSES) out[s] = 0;
    for (const p of projects) out[p.status]++;
    return out as Record<Status | "All", number>;
  }

  // ── Loading ──────────────────────────────────────────────────────────────
  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[oklch(0.985_0.005_265)]">
        <div className="flex flex-col items-center gap-3">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
          <p className="text-[13px] text-muted-foreground animate-pulse">Loading projects…</p>
        </div>
      </div>
    );
  }

  // ── No workspace ─────────────────────────────────────────────────────────
  if (!workspaceId) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[oklch(0.985_0.005_265)]">
        <div className="flex flex-col items-center gap-3 text-center">
          <FolderKanban className="h-10 w-10 text-muted-foreground" />
          <p className="text-[15px] font-semibold text-foreground">No workspace selected</p>
          <p className="text-[13px] text-muted-foreground">Go to Settings → Workspace to create or select one.</p>
        </div>
      </div>
    );
  }

  // ── Error ─────────────────────────────────────────────────────────────────
  if (isError) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[oklch(0.985_0.005_265)] px-6">
        <div className="w-full max-w-md rounded-2xl border border-destructive/30 bg-destructive/10 p-6 text-center">
          <p className="text-[14px] font-semibold text-destructive">Failed to load projects</p>
          <p className="mt-1 text-[12.5px] text-destructive/80">
            {error instanceof Error ? error.message : "An unexpected error occurred."}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[oklch(0.985_0.005_265)] text-foreground">
      <main className="mx-auto max-w-[1400px] px-6 py-8 lg:px-10 lg:py-10">
        <Header
          query={query} setQuery={setQuery}
          view={view} setView={setView}
          sort={sort} setSort={setSort}
          totalCount={projects.length}
          onTrackCount={projects.filter((p) => p.status === "On track" || p.status === "Shipped").length}
          atRiskCount={projects.filter((p) => p.status === "At risk" || p.status === "Blocked").length}
        />
        <StatusChips status={status} setStatus={setStatus} counts={countByStatus()} />

        {projects.length === 0 ? (
          <NoProjectsState />
        ) : filtered.length === 0 ? (
          <EmptyState onClear={() => { setQuery(""); setStatus("All"); }} />
        ) : view === "grid" ? (
          <div className="mt-6 grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-3">
            {filtered.map((p) => (
              <ProjectCard
                key={p.id}
                project={p}
                onOpen={() => openProject(p)}
                onDelete={deleteProject.isPending ? undefined : async () => {
                  if (!window.confirm(`Delete "${p.name}"? This cannot be undone.`)) return;
                  await deleteProject.mutateAsync(p.id);
                  if (activeId === p.id) closeProject();
                }}
              />
            ))}
          </div>
        ) : (
          <ProjectsList
            projects={filtered}
            onOpen={openProject}
            onDelete={async (p) => {
              if (!window.confirm(`Delete "${p.name}"? This cannot be undone.`)) return;
              await deleteProject.mutateAsync(p.id);
              if (activeId === p.id) closeProject();
            }}
          />
        )}
      </main>

      {active && <ProjectDrawer project={active} onClose={closeProject} />}
    </div>
  );
}

/* ============ header ============ */
function Header({
  query, setQuery, view, setView, sort, setSort,
  totalCount, onTrackCount, atRiskCount,
}: {
  query: string; setQuery: (v: string) => void;
  view: "grid" | "list"; setView: (v: "grid" | "list") => void;
  sort: "Recent" | "Due date" | "Progress" | "Priority"; setSort: (v: "Recent" | "Due date" | "Progress" | "Priority") => void;
  totalCount: number; onTrackCount: number; atRiskCount: number;
}) {
  return (
    <div>
      <div className="grid grid-cols-[minmax(0,1fr)_auto] items-end gap-4 sm:flex sm:flex-wrap sm:justify-between">
        <div className="min-w-0">
          <div className="flex items-center gap-2 text-[11.5px] font-medium text-muted-foreground">
            <span>Workspace</span>
            <ChevronDown className="h-3 w-3 -rotate-90" />
            <span className="text-foreground">Projects</span>
          </div>
          <h1 className="mt-1 truncate text-[26px] font-semibold tracking-[-0.02em] sm:text-[28px]">Projects</h1>
          <p className="mt-1 text-[13px] text-muted-foreground">
            <span className="font-medium text-foreground">{totalCount}</span> total ·
            <span className="ml-1 text-success">{onTrackCount} on track</span> ·
            <span className="ml-1 text-warning">{atRiskCount} need attention</span>
          </p>
        </div>
        <button className="flex h-10 shrink-0 items-center gap-1.5 rounded-xl bg-gradient-primary px-3.5 text-[13px] font-semibold text-white shadow-glow transition-transform hover:scale-[1.02] active:scale-[0.99]">
          <Plus className="h-4 w-4" />
          Create project
        </button>
      </div>

      {/* toolbar */}
      <div className="mt-6 grid grid-cols-1 gap-2.5 rounded-xl border border-border/70 bg-white p-2 shadow-xs sm:grid-cols-[1fr_auto]">
        <div className="group flex h-9 items-center gap-2 rounded-lg bg-secondary/50 px-3 transition-colors focus-within:bg-white focus-within:ring-4 focus-within:ring-primary/10">
          <Search className="h-4 w-4 text-muted-foreground" />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search projects by name, key, or description…"
            className="min-w-0 flex-1 bg-transparent text-[13px] text-foreground outline-none placeholder:text-muted-foreground/70"
          />
          {query && (
            <button onClick={() => setQuery("")} className="grid h-5 w-5 place-items-center rounded text-muted-foreground hover:bg-secondary hover:text-foreground">
              <X className="h-3 w-3" />
            </button>
          )}
        </div>

        <div className="flex items-center gap-2">
          <ToolbarBtn icon={<SlidersHorizontal className="h-3.5 w-3.5" />} label="Filters" caret badge="2" />
          <ToolbarSort sort={sort} setSort={setSort} />
          <div className="ml-auto flex h-9 items-center rounded-lg border border-border/70 bg-white p-0.5 shadow-xs">
            <button
              onClick={() => setView("grid")}
              className={`grid h-8 w-8 place-items-center rounded-md transition-colors ${view === "grid" ? "bg-secondary text-foreground shadow-xs" : "text-muted-foreground hover:text-foreground"}`}
              aria-label="Grid view"
            >
              <LayoutGrid className="h-3.5 w-3.5" />
            </button>
            <button
              onClick={() => setView("list")}
              className={`grid h-8 w-8 place-items-center rounded-md transition-colors ${view === "list" ? "bg-secondary text-foreground shadow-xs" : "text-muted-foreground hover:text-foreground"}`}
              aria-label="List view"
            >
              <List className="h-3.5 w-3.5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

function ToolbarBtn({ icon, label, caret, badge }: { icon: React.ReactNode; label: string; caret?: boolean; badge?: string }) {
  return (
    <button className="flex h-9 items-center gap-1.5 rounded-lg border border-border/70 bg-white px-2.5 text-[12.5px] font-semibold text-foreground shadow-xs hover:bg-secondary">
      {icon}
      {label}
      {badge && <span className="rounded bg-primary/12 px-1.5 py-0.5 text-[10px] font-semibold text-primary">{badge}</span>}
      {caret && <ChevronDown className="h-3 w-3 text-muted-foreground" />}
    </button>
  );
}

function ToolbarSort({ sort, setSort }: { sort: string; setSort: (v: "Recent" | "Due date" | "Progress" | "Priority") => void }) {
  const [open, setOpen] = useState(false);
  const options = ["Recent", "Due date", "Progress", "Priority"] as const;
  return (
    <div className="relative">
      <button onClick={() => setOpen((v) => !v)} className="flex h-9 items-center gap-1.5 rounded-lg border border-border/70 bg-white px-2.5 text-[12.5px] font-semibold text-foreground shadow-xs hover:bg-secondary">
        <ArrowUpDown className="h-3.5 w-3.5" />
        Sort: <span className="text-muted-foreground">{sort}</span>
        <ChevronDown className="h-3 w-3 text-muted-foreground" />
      </button>
      {open && (
        <>
          <button className="fixed inset-0 z-10 cursor-default" onClick={() => setOpen(false)} aria-hidden />
          <div className="absolute right-0 top-11 z-20 w-40 rounded-xl border border-border/70 bg-white p-1 shadow-float animate-fade-up">
            {options.map((o) => (
              <button
                key={o}
                onClick={() => { setSort(o); setOpen(false); }}
                className={`flex w-full items-center justify-between rounded-lg px-2.5 py-1.5 text-left text-[12.5px] font-medium transition-colors hover:bg-secondary ${sort === o ? "text-primary" : "text-foreground"}`}
              >
                {o}
                {sort === o && <CheckCircle2 className="h-3.5 w-3.5 text-primary" />}
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  );
}

/* ============ status chips ============ */
function StatusChips({ status, setStatus, counts }: {
  status: Status | "All"; setStatus: (s: Status | "All") => void; counts: Record<Status | "All", number>;
}) {
  const items: (Status | "All")[] = ["All", ...STATUSES];
  return (
    <div className="mt-4 flex flex-wrap items-center gap-1.5">
      {items.map((s) => {
        const isActive = s === status;
        const dot = statusDotColor(s);
        return (
          <button
            key={s}
            onClick={() => setStatus(s)}
            className={`flex h-8 items-center gap-2 rounded-full border px-3 text-[12px] font-semibold transition-all ${
              isActive
                ? "border-foreground/80 bg-foreground text-background shadow-xs"
                : "border-border/70 bg-white text-foreground hover:bg-secondary"
            }`}
          >
            {s !== "All" && <span className={`h-1.5 w-1.5 rounded-full ${dot}`} />}
            {s}
            <span className={`rounded-full px-1.5 py-0.5 text-[10px] font-semibold ${isActive ? "bg-background/15 text-background" : "bg-secondary text-muted-foreground"}`}>
              {counts[s]}
            </span>
          </button>
        );
      })}
    </div>
  );
}

function statusDotColor(s: Status | "All") {
  return ({
    "All": "bg-muted-foreground",
    "On track": "bg-success",
    "At risk": "bg-warning",
    "Blocked": "bg-danger",
    "In review": "bg-accent",
    "Shipped": "bg-primary",
  } as Record<string, string>)[s] ?? "bg-muted-foreground";
}

function statusPillClass(s: Status) {
  return ({
    "On track": "bg-success/12 text-success",
    "At risk": "bg-warning/15 text-warning",
    "Blocked": "bg-danger/12 text-danger",
    "In review": "bg-accent/15 text-accent-foreground",
    "Shipped": "bg-primary/12 text-primary",
  } as Record<string, string>)[s] ?? "bg-secondary text-foreground";
}

function priorityPillClass(p: Priority) {
  return ({
    "Urgent": "bg-danger/12 text-danger",
    "High": "bg-warning/15 text-warning",
    "Medium": "bg-accent/15 text-accent-foreground",
    "Low": "bg-secondary text-muted-foreground",
  } as Record<string, string>)[p] ?? "bg-secondary text-foreground";
}

/* ============ card ============ */
function ProjectCard({
  project: p, onOpen, onDelete,
}: {
  project: Project;
  onOpen: () => void;
  onDelete?: () => void;
}) {
  return (
    <button
      onClick={onOpen}
      className="group relative flex flex-col overflow-hidden rounded-2xl border border-border/70 bg-white p-5 text-left shadow-xs transition-all duration-300 hover:-translate-y-1 hover:shadow-float focus:outline-none focus-visible:ring-4 focus-visible:ring-primary/20"
    >
      {/* colored accent bar */}
      <span className="pointer-events-none absolute inset-x-0 top-0 h-[3px] origin-left scale-x-0 transition-transform duration-300 group-hover:scale-x-100" style={{ background: p.color }} />
      {/* soft glow blob */}
      <span
        className="pointer-events-none absolute -right-16 -top-16 h-40 w-40 rounded-full opacity-0 blur-3xl transition-opacity duration-500 group-hover:opacity-40"
        style={{ background: p.color }}
      />

      {/* top row */}
      <div className="flex items-start justify-between gap-3">
        <div className="flex min-w-0 items-center gap-2.5">
          <span className="grid h-9 w-9 shrink-0 place-items-center rounded-xl text-[11px] font-bold text-white shadow-xs transition-transform duration-300 group-hover:scale-105" style={{ background: p.color }}>
            {p.key.split("-")[0].slice(0, 2)}
          </span>
          <div className="min-w-0">
            <div className="flex items-center gap-1.5">
              <p className="truncate text-[10.5px] font-semibold uppercase tracking-wider text-muted-foreground">{p.key}</p>
              {p.starred && <Star className="h-3 w-3 fill-warning text-warning" />}
              {p.aiAssisted && (
                <span className="flex items-center gap-0.5 rounded bg-gradient-primary px-1 py-[1px] text-[9px] font-semibold text-white">
                  <Sparkles className="h-2 w-2" /> AI
                </span>
              )}
            </div>
            <h3 className="mt-0.5 truncate text-[15px] font-semibold tracking-[-0.01em] text-foreground">{p.name}</h3>
          </div>
        </div>
        <button
          onClick={(e) => { e.stopPropagation(); onDelete?.(); }}
          className="grid h-7 w-7 shrink-0 place-items-center rounded-md text-muted-foreground opacity-0 transition-opacity hover:bg-secondary hover:text-foreground group-hover:opacity-100"
        >
          <MoreHorizontal className="h-3.5 w-3.5" />
        </button>
      </div>

      <p className="mt-2.5 line-clamp-2 text-[12.5px] leading-relaxed text-muted-foreground">{p.description}</p>

      {/* status + priority */}
      <div className="mt-4 flex flex-wrap items-center gap-1.5">
        <span className={`inline-flex items-center gap-1 rounded-md px-1.5 py-0.5 text-[10.5px] font-semibold ${statusPillClass(p.status)}`}>
          <span className="h-1.5 w-1.5 rounded-full bg-current" />
          {p.status}
        </span>
        <span className={`inline-flex items-center gap-1 rounded-md px-1.5 py-0.5 text-[10.5px] font-semibold ${priorityPillClass(p.priority)}`}>
          <Flag className="h-2.5 w-2.5" />
          {p.priority}
        </span>
        <span className="ml-auto text-[10.5px] text-muted-foreground">Updated {p.updated}</span>
      </div>

      {/* progress */}
      <div className="mt-4">
        <div className="flex items-center justify-between text-[11px]">
          <span className="font-semibold text-foreground">Progress</span>
          <span className="tabular-nums text-muted-foreground">
            <span className="font-semibold text-foreground">{p.tasks.done}</span>/{p.tasks.total} tasks · {p.progress}%
          </span>
        </div>
        <div className="mt-1.5 h-1.5 overflow-hidden rounded-full bg-secondary">
          <div
            className="h-full rounded-full transition-[width] duration-500"
            style={{ width: `${p.progress}%`, background: `linear-gradient(90deg, ${p.color}, oklch(0.78 0.14 210))` }}
          />
        </div>
      </div>

      {/* footer */}
      <div className="mt-5 flex items-center justify-between border-t border-border/50 pt-3.5">
        <div className="flex items-center gap-2">
          <div className="flex -space-x-1.5">
            {p.members.slice(0, 3).map((m, i) => (
              <span key={i} className="grid h-6 w-6 place-items-center rounded-full border-2 border-white text-[9.5px] font-semibold text-white" style={{ background: m.color }}>
                {m.initials}
              </span>
            ))}
            {p.members.length > 3 && (
              <span className="grid h-6 w-6 place-items-center rounded-full border-2 border-white bg-secondary text-[9.5px] font-semibold text-muted-foreground">
                +{p.members.length - 3}
              </span>
            )}
          </div>
          <span className="flex items-center gap-1 text-[10.5px] text-muted-foreground">
            <MessageSquare className="h-3 w-3" /> {p.comments}
          </span>
          <span className="flex items-center gap-1 text-[10.5px] text-muted-foreground">
            <Paperclip className="h-3 w-3" /> {p.attachments}
          </span>
        </div>
        <div className={`flex items-center gap-1 rounded-md px-1.5 py-0.5 text-[11px] font-semibold ${
          p.status === "Shipped" ? "bg-success/12 text-success" :
          p.dueRelative.startsWith("in 2") || p.dueRelative.startsWith("in 4") ? "bg-danger/12 text-danger" :
          "bg-secondary text-foreground"
        }`}>
          <Calendar className="h-3 w-3" />
          {p.due}
        </div>
      </div>

      {/* hover reveal cta */}
      <span className="pointer-events-none absolute bottom-3 right-4 flex translate-x-2 items-center gap-1 text-[11px] font-semibold text-primary opacity-0 transition-all duration-300 group-hover:translate-x-0 group-hover:opacity-100">
        Open <ArrowRight className="h-3 w-3" />
      </span>
    </button>
  );
}

/* ============ list view ============ */
function ProjectsList({
  projects, onOpen, onDelete,
}: {
  projects: Project[];
  onOpen: (p: Project) => void;
  onDelete: (p: Project) => void;
}) {
  return (
    <section className="mt-6 overflow-hidden rounded-2xl border border-border/70 bg-white shadow-xs">
      <div className="overflow-x-auto">
        <table className="w-full min-w-[880px] text-left">
          <thead>
            <tr className="text-[10.5px] font-semibold uppercase tracking-wider text-muted-foreground">
              <th className="py-2.5 pl-5 pr-3">Project</th>
              <th className="py-2.5 px-3">Status</th>
              <th className="py-2.5 px-3">Priority</th>
              <th className="py-2.5 px-3">Progress</th>
              <th className="py-2.5 px-3">Members</th>
              <th className="py-2.5 pl-3 pr-5">Due</th>
            </tr>
          </thead>
          <tbody>
            {projects.map((p) => (
              <tr key={p.id} onClick={() => onOpen(p)} className="cursor-pointer border-t border-border/50 text-[12.5px] transition-colors hover:bg-secondary/40">
                <td className="py-3 pl-5 pr-3">
                  <div className="flex items-center gap-2.5">
                    <span className="grid h-7 w-7 place-items-center rounded-md text-[10px] font-bold text-white" style={{ background: p.color }}>{p.key.split("-")[0].slice(0, 2)}</span>
                    <div className="min-w-0">
                      <p className="truncate font-semibold text-foreground">{p.name}</p>
                      <p className="text-[10.5px] text-muted-foreground">{p.key} · {p.description}</p>
                    </div>
                  </div>
                </td>
                <td className="px-3 py-3">
                  <span className={`inline-flex items-center gap-1 rounded-md px-1.5 py-0.5 text-[10.5px] font-semibold ${statusPillClass(p.status)}`}>
                    <span className="h-1.5 w-1.5 rounded-full bg-current" />
                    {p.status}
                  </span>
                </td>
                <td className="px-3 py-3">
                  <span className={`inline-flex items-center gap-1 rounded-md px-1.5 py-0.5 text-[10.5px] font-semibold ${priorityPillClass(p.priority)}`}>
                    <Flag className="h-2.5 w-2.5" /> {p.priority}
                  </span>
                </td>
                <td className="px-3 py-3">
                  <div className="flex items-center gap-2">
                    <div className="h-1.5 w-24 overflow-hidden rounded-full bg-secondary">
                      <div className="h-full rounded-full bg-gradient-primary" style={{ width: `${p.progress}%` }} />
                    </div>
                    <span className="text-[11px] font-medium tabular-nums text-muted-foreground">{p.progress}%</span>
                  </div>
                </td>
                <td className="px-3 py-3">
                  <div className="flex -space-x-1.5">
                    {p.members.slice(0, 3).map((m, i) => (
                      <span key={i} className="grid h-6 w-6 place-items-center rounded-full border-2 border-white text-[9.5px] font-semibold text-white" style={{ background: m.color }}>
                        {m.initials}
                      </span>
                    ))}
                    {p.members.length > 3 && (
                      <span className="grid h-6 w-6 place-items-center rounded-full border-2 border-white bg-secondary text-[9.5px] font-semibold text-muted-foreground">
                        +{p.members.length - 3}
                      </span>
                    )}
                  </div>
                </td>
                <td className="pl-3 pr-5 py-3 tabular-nums text-muted-foreground">{p.due}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}

/* ============ empty states ============ */
function NoProjectsState() {
  return (
    <div className="mt-16 flex flex-col items-center justify-center text-center">
      <div className="grid h-14 w-14 place-items-center rounded-2xl border border-border/70 bg-white shadow-xs">
        <FolderKanban className="h-6 w-6 text-muted-foreground" />
      </div>
      <h3 className="mt-4 text-[16px] font-semibold text-foreground">No projects yet</h3>
      <p className="mt-1 text-[13px] text-muted-foreground">Create your first project to get started.</p>
      <button className="mt-4 flex items-center gap-1.5 rounded-xl bg-gradient-primary px-4 py-2 text-[13px] font-semibold text-white shadow-glow transition-transform hover:scale-[1.02]">
        <Plus className="h-4 w-4" /> Create project
      </button>
    </div>
  );
}

function EmptyState({ onClear }: { onClear: () => void }) {
  return (
    <div className="mt-16 flex flex-col items-center justify-center text-center">
      <div className="grid h-14 w-14 place-items-center rounded-2xl border border-border/70 bg-white shadow-xs">
        <Search className="h-6 w-6 text-muted-foreground" />
      </div>
      <h3 className="mt-4 text-[16px] font-semibold text-foreground">No projects match your filters</h3>
      <p className="mt-1 text-[13px] text-muted-foreground">Try adjusting your search, status, or sort.</p>
      <button onClick={onClear} className="mt-4 rounded-lg border border-border/70 bg-white px-3 py-1.5 text-[12.5px] font-semibold text-foreground shadow-xs hover:bg-secondary">
        Clear filters
      </button>
    </div>
  );
}

/* ============ project drawer ============ */
function ProjectDrawer({ project: p, onClose }: { project: Project; onClose: () => void }) {
  return (
    <div className="fixed inset-0 z-50">
      <button aria-label="Close" onClick={onClose} className="absolute inset-0 bg-foreground/30 backdrop-blur-[2px] animate-fade-up" />
      <aside className="absolute right-0 top-0 h-full w-full max-w-[520px] overflow-y-auto border-l border-border/70 bg-white shadow-float animate-fade-up">
        {/* header */}
        <div className="sticky top-0 z-10 border-b border-border/70 bg-white/85 px-6 py-4 backdrop-blur-xl">
          <div className="flex items-start justify-between gap-3">
            <div className="flex min-w-0 items-center gap-3">
              <span className="grid h-10 w-10 shrink-0 place-items-center rounded-xl text-[11px] font-bold text-white shadow-xs" style={{ background: p.color }}>
                {p.key.split("-")[0].slice(0, 2)}
              </span>
              <div className="min-w-0">
                <p className="text-[10.5px] font-semibold uppercase tracking-wider text-muted-foreground">{p.key}</p>
                <h2 className="truncate text-[18px] font-semibold tracking-[-0.01em] text-foreground">{p.name}</h2>
              </div>
            </div>
            <div className="flex items-center gap-1.5">
              <button className="grid h-8 w-8 place-items-center rounded-lg border border-border/70 bg-white text-muted-foreground shadow-xs hover:bg-secondary hover:text-foreground">
                <ExternalLink className="h-3.5 w-3.5" />
              </button>
              <button onClick={onClose} className="grid h-8 w-8 place-items-center rounded-lg border border-border/70 bg-white text-muted-foreground shadow-xs hover:bg-secondary hover:text-foreground">
                <X className="h-3.5 w-3.5" />
              </button>
            </div>
          </div>
          <p className="mt-3 text-[13px] leading-relaxed text-muted-foreground">{p.description}</p>
          <div className="mt-3 flex flex-wrap items-center gap-1.5">
            <span className={`inline-flex items-center gap-1 rounded-md px-1.5 py-0.5 text-[10.5px] font-semibold ${statusPillClass(p.status)}`}>
              <span className="h-1.5 w-1.5 rounded-full bg-current" /> {p.status}
            </span>
            <span className={`inline-flex items-center gap-1 rounded-md px-1.5 py-0.5 text-[10.5px] font-semibold ${priorityPillClass(p.priority)}`}>
              <Flag className="h-2.5 w-2.5" /> {p.priority}
            </span>
            <span className="inline-flex items-center gap-1 rounded-md bg-secondary px-1.5 py-0.5 text-[10.5px] font-semibold text-foreground">
              <Calendar className="h-2.5 w-2.5" /> Due {p.due} · {p.dueRelative}
            </span>
          </div>
        </div>

        <div className="px-6 py-5">
          {/* progress */}
          <div>
            <div className="flex items-center justify-between text-[12px]">
              <span className="font-semibold text-foreground">Progress</span>
              <span className="tabular-nums text-muted-foreground">{p.tasks.done}/{p.tasks.total} · {p.progress}%</span>
            </div>
            <div className="mt-2 h-2 overflow-hidden rounded-full bg-secondary">
              <div className="h-full rounded-full" style={{ width: `${p.progress}%`, background: `linear-gradient(90deg, ${p.color}, oklch(0.78 0.14 210))` }} />
            </div>
          </div>

          {/* meta grid */}
          <div className="mt-5 grid grid-cols-2 gap-3">
            <MetaTile icon={<Users className="h-3.5 w-3.5" />} label="Team">
              <div className="flex -space-x-1.5">
                {p.members.map((m, i) => (
                  <span key={i} className="grid h-6 w-6 place-items-center rounded-full border-2 border-white text-[9.5px] font-semibold text-white" style={{ background: m.color }}>{m.initials}</span>
                ))}
              </div>
            </MetaTile>
            <MetaTile icon={<Clock className="h-3.5 w-3.5" />} label="Last activity">
              <span className="text-[13px] font-semibold text-foreground">{p.updated}</span>
            </MetaTile>
            <MetaTile icon={<MessageSquare className="h-3.5 w-3.5" />} label="Comments">
              <span className="text-[13px] font-semibold text-foreground">{p.comments}</span>
            </MetaTile>
            <MetaTile icon={<Paperclip className="h-3.5 w-3.5" />} label="Files">
              <span className="text-[13px] font-semibold text-foreground">{p.attachments}</span>
            </MetaTile>
          </div>

          {/* Milestones */}
          <div className="mt-6">
            <div className="flex items-center justify-between">
              <h3 className="text-[13px] font-semibold text-foreground">Milestones</h3>
              <button className="text-[11.5px] font-semibold text-primary hover:underline">Add</button>
            </div>
            <ul className="mt-2 space-y-1.5">
              {[
                { t: "Discovery & interviews", done: true },
                { t: "Design system prototype", done: true },
                { t: "Backend + AI copilot", done: false },
                { t: "Beta launch", done: false },
              ].map((m) => (
                <li key={m.t} className="flex items-center gap-2.5 rounded-lg border border-border/60 bg-surface/60 px-3 py-2">
                  {m.done ? <CheckCircle2 className="h-4 w-4 text-success" /> : <GitBranch className="h-4 w-4 text-muted-foreground" />}
                  <span className={`text-[12.5px] ${m.done ? "text-muted-foreground line-through" : "font-medium text-foreground"}`}>{m.t}</span>
                </li>
              ))}
            </ul>
          </div>

          <button className="mt-6 flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-primary py-2.5 text-[13px] font-semibold text-white shadow-glow transition-transform hover:scale-[1.01]">
            Open full project <ArrowRight className="h-4 w-4" />
          </button>
        </div>
      </aside>
    </div>
  );
}

function MetaTile({ icon, label, children }: { icon: React.ReactNode; label: string; children: React.ReactNode }) {
  return (
    <div className="rounded-xl border border-border/60 bg-surface/60 p-3">
      <div className="flex items-center gap-1.5 text-[10.5px] font-semibold uppercase tracking-wider text-muted-foreground">
        {icon}{label}
      </div>
      <div className="mt-2">{children}</div>
    </div>
  );
}
