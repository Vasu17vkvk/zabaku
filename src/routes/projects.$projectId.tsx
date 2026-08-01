import { createFileRoute, Link } from "@tanstack/react-router";
import { requireAuth } from "@/lib/requireAuth";
import { ProtectedRoute } from "@/components/auth/ProtectedRoute";
import { useState } from "react";
import {
  ArrowLeft, Star, Share2, MoreHorizontal, Sparkles, Play, Pause,
  LayoutGrid, ListChecks, Users, FolderOpen, Flag, Activity, Settings as SettingsIcon,
  Calendar, Clock, CheckCircle2, Circle, MessageSquare, Paperclip, Plus,
  ChevronRight, GitBranch, FileText, Image as ImageIcon, Film, Download,
  Search, Filter, ArrowUpRight, TrendingUp, AlertTriangle, Bot, Send,
  Mail, Shield, Bell, Trash2, Eye,
} from "lucide-react";

export const Route = createFileRoute("/projects/$projectId")({
  head: ({ params }) => ({
    meta: [
      { title: `${prettyName(params.projectId)} — Zabaku` },
      { name: "description", content: `Overview, tasks, milestones and activity for the ${prettyName(params.projectId)} project in Zabaku.` },
      { property: "og:title", content: `${prettyName(params.projectId)} — Zabaku` },
      { property: "og:description", content: `Overview, tasks, milestones and activity for the ${prettyName(params.projectId)} project in Zabaku.` },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  beforeLoad: requireAuth,
  component: () => <ProtectedRoute><ProjectDetailsPage /></ProtectedRoute>,
});

function prettyName(id: string) {
  return id.replace(/-/g, " ").replace(/\b\w/g, (c) => c.toUpperCase()) || "Project";
}

/* ============ page ============ */
type TabKey = "overview" | "tasks" | "members" | "files" | "milestones" | "activity" | "settings";

function ProjectDetailsPage() {
  const { projectId } = Route.useParams();
  const [tab, setTab] = useState<TabKey>("overview");

  const project = {
    key: "PAY-14",
    name: "Payments v2",
    slug: projectId,
    description: "Refunds, invoicing, and multi-currency checkout — with a redesigned failure recovery flow and native support for four new payment providers.",
    color: "oklch(0.55 0.22 279)",
    accent: "oklch(0.78 0.14 210)",
    progress: 78,
    status: "On track" as const,
    priority: "High" as const,
    startDate: "May 06",
    dueDate: "Aug 12",
    dueRelative: "in 17 days",
    tasks: { done: 42, total: 54 },
    comments: 128,
    attachments: 34,
    updated: "2 minutes ago",
    members: [
      { initials: "AK", name: "Ada Kim", role: "Engineering lead", color: "oklch(0.72 0.16 180)" },
      { initials: "JL", name: "Jules Laurent", role: "Product", color: "oklch(0.55 0.22 279)" },
      { initials: "MB", name: "Mira Basu", role: "Design", color: "oklch(0.75 0.16 92)" },
      { initials: "SR", name: "Sai Reddy", role: "Engineering", color: "oklch(0.68 0.17 28)" },
      { initials: "PS", name: "Priya Shah", role: "CTO", color: "oklch(0.62 0.19 30)" },
    ],
  };

  return (
    <div className="min-h-screen bg-[oklch(0.985_0.005_265)] text-foreground">
      <main className="mx-auto max-w-[1400px] px-6 py-8 lg:px-10 lg:py-10">
        <BackBar />
        <SummaryHeader project={project} />
        <MetricStrip project={project} />
        <TabsBar tab={tab} setTab={setTab} />
        <div className="mt-6">
          {tab === "overview" && <OverviewTab project={project} />}
          {tab === "tasks" && <TasksTab />}
          {tab === "members" && <MembersTab members={project.members} />}
          {tab === "files" && <FilesTab />}
          {tab === "milestones" && <MilestonesTab />}
          {tab === "activity" && <ActivityTab />}
          {tab === "settings" && <SettingsTab />}
        </div>
      </main>
    </div>
  );
}

/* ============ back / breadcrumb ============ */
function BackBar() {
  return (
    <div className="flex items-center justify-between gap-3">
      <Link to="/projects" className="group flex items-center gap-1.5 text-[12.5px] font-medium text-muted-foreground transition-colors hover:text-foreground">
        <ArrowLeft className="h-3.5 w-3.5 transition-transform group-hover:-translate-x-0.5" />
        All projects
      </Link>
      <div className="flex items-center gap-1.5 text-[11.5px] font-medium text-muted-foreground">
        <span>Workspace</span><ChevronRight className="h-3 w-3" />
        <Link to="/projects" className="hover:text-foreground">Projects</Link>
        <ChevronRight className="h-3 w-3" />
        <span className="text-foreground">Payments v2</span>
      </div>
    </div>
  );
}

/* ============ summary header ============ */
type ProjectShape = ReturnType<typeof getShape>;
function getShape() {
  return {
    key: "", name: "", slug: "", description: "", color: "", accent: "",
    progress: 0, status: "On track" as const, priority: "High" as const,
    startDate: "", dueDate: "", dueRelative: "",
    tasks: { done: 0, total: 0 }, comments: 0, attachments: 0, updated: "",
    members: [] as { initials: string; name: string; role: string; color: string }[],
  };
}

function SummaryHeader({ project: p }: { project: ProjectShape }) {
  return (
    <section className="relative mt-5 overflow-hidden rounded-3xl border border-border/70 bg-white shadow-xs">
      {/* gradient wash */}
      <div
        className="absolute inset-x-0 top-0 h-40 opacity-90"
        style={{
          background: `radial-gradient(600px 220px at 12% 0%, ${p.color}22, transparent 60%), radial-gradient(600px 240px at 90% 0%, ${p.accent}22, transparent 60%)`,
        }}
      />
      <div className="relative p-6 lg:p-8">
        <div className="grid grid-cols-[minmax(0,1fr)_auto] items-start gap-4 sm:flex sm:flex-wrap sm:items-center sm:justify-between">
          <div className="flex min-w-0 items-start gap-4">
            <span
              className="grid h-14 w-14 shrink-0 place-items-center rounded-2xl text-[13px] font-bold text-white shadow-glow"
              style={{ background: `linear-gradient(135deg, ${p.color}, ${p.accent})` }}
            >
              {p.key.split("-")[0]}
            </span>
            <div className="min-w-0">
              <div className="flex flex-wrap items-center gap-1.5 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
                <span>{p.key}</span>
                <span>·</span>
                <span className="inline-flex items-center gap-1 rounded-md bg-success/12 px-1.5 py-0.5 text-success">
                  <span className="h-1.5 w-1.5 rounded-full bg-success" /> {p.status}
                </span>
                <span className="inline-flex items-center gap-1 rounded-md bg-warning/15 px-1.5 py-0.5 text-warning">
                  <Flag className="h-2.5 w-2.5" /> {p.priority}
                </span>
                <span className="inline-flex items-center gap-1 rounded-md bg-gradient-primary px-1.5 py-0.5 text-white">
                  <Sparkles className="h-2.5 w-2.5" /> AI-assisted
                </span>
              </div>
              <h1 className="mt-1.5 truncate text-[28px] font-semibold tracking-[-0.02em] text-foreground sm:text-[32px]">{p.name}</h1>
              <p className="mt-1.5 max-w-2xl text-[13.5px] leading-relaxed text-muted-foreground">{p.description}</p>
            </div>
          </div>

          <div className="flex shrink-0 items-center gap-2">
            <button className="grid h-9 w-9 place-items-center rounded-lg border border-border/70 bg-white text-muted-foreground shadow-xs hover:bg-secondary hover:text-foreground">
              <Star className="h-4 w-4" />
            </button>
            <button className="grid h-9 w-9 place-items-center rounded-lg border border-border/70 bg-white text-muted-foreground shadow-xs hover:bg-secondary hover:text-foreground">
              <Share2 className="h-4 w-4" />
            </button>
            <button className="flex h-9 items-center gap-1.5 rounded-lg border border-border/70 bg-white px-3 text-[12.5px] font-semibold text-foreground shadow-xs hover:bg-secondary">
              <Bot className="h-3.5 w-3.5 text-primary" /> Ask AI
            </button>
            <button className="flex h-9 items-center gap-1.5 rounded-lg bg-gradient-primary px-3 text-[12.5px] font-semibold text-white shadow-glow transition-transform hover:scale-[1.02]">
              <Plus className="h-3.5 w-3.5" /> New task
            </button>
            <button className="grid h-9 w-9 place-items-center rounded-lg border border-border/70 bg-white text-muted-foreground shadow-xs hover:bg-secondary hover:text-foreground">
              <MoreHorizontal className="h-4 w-4" />
            </button>
          </div>
        </div>

        {/* progress + timeline */}
        <div className="mt-7 grid grid-cols-1 gap-6 lg:grid-cols-[minmax(0,1.4fr)_minmax(0,1fr)]">
          <div>
            <div className="flex items-center justify-between text-[12px]">
              <span className="font-semibold text-foreground">Overall progress</span>
              <span className="tabular-nums text-muted-foreground">
                <span className="font-semibold text-foreground">{p.tasks.done}</span>/{p.tasks.total} tasks · {p.progress}%
              </span>
            </div>
            <div className="mt-2 h-2.5 overflow-hidden rounded-full bg-secondary">
              <div
                className="h-full rounded-full"
                style={{
                  width: `${p.progress}%`,
                  background: `linear-gradient(90deg, ${p.color}, ${p.accent})`,
                }}
              />
            </div>
            {/* mini timeline */}
            <div className="relative mt-6">
              <div className="mb-2 flex items-center justify-between text-[10.5px] font-semibold uppercase tracking-wider text-muted-foreground">
                <span>{p.startDate}</span>
                <span>{p.dueDate}</span>
              </div>
              <div className="relative h-2 rounded-full bg-secondary">
                <div className="absolute inset-y-0 left-0 rounded-full" style={{ width: "62%", background: `linear-gradient(90deg, ${p.color}, ${p.accent})` }} />
                {[
                  { l: 12, done: true, t: "Kickoff" },
                  { l: 34, done: true, t: "Design freeze" },
                  { l: 58, done: true, t: "API cutover" },
                  { l: 78, done: false, t: "Beta" },
                  { l: 100, done: false, t: "GA" },
                ].map((m, i) => (
                  <div key={i} className="absolute -top-1 -translate-x-1/2" style={{ left: `${m.l}%` }}>
                    <span className={`grid h-4 w-4 place-items-center rounded-full border-2 ${m.done ? "border-white bg-primary" : "border-primary bg-white"}`}>
                      {m.done && <CheckCircle2 className="h-2.5 w-2.5 text-white" />}
                    </span>
                    <span className="absolute left-1/2 top-5 -translate-x-1/2 whitespace-nowrap text-[10px] font-medium text-muted-foreground">{m.t}</span>
                  </div>
                ))}
                {/* today marker */}
                <div className="absolute -top-3 -translate-x-1/2" style={{ left: "62%" }}>
                  <div className="h-8 w-[2px] rounded bg-foreground/80" />
                  <span className="absolute left-1/2 -top-4 -translate-x-1/2 rounded bg-foreground px-1.5 py-0.5 text-[9px] font-semibold text-background">Today</span>
                </div>
              </div>
            </div>
          </div>

          {/* Team + due */}
          <div className="grid grid-cols-2 gap-3">
            <div className="rounded-xl border border-border/60 bg-surface/60 p-3.5">
              <p className="text-[10.5px] font-semibold uppercase tracking-wider text-muted-foreground">Team</p>
              <div className="mt-2 flex items-center gap-2">
                <div className="flex -space-x-1.5">
                  {p.members.slice(0, 4).map((m, i) => (
                    <span key={i} className="grid h-7 w-7 place-items-center rounded-full border-2 border-white text-[10px] font-semibold text-white" style={{ background: m.color }}>{m.initials}</span>
                  ))}
                  {p.members.length > 4 && (
                    <span className="grid h-7 w-7 place-items-center rounded-full border-2 border-white bg-secondary text-[10px] font-semibold text-muted-foreground">+{p.members.length - 4}</span>
                  )}
                </div>
                <button className="ml-1 grid h-7 w-7 place-items-center rounded-full border border-dashed border-border text-muted-foreground hover:bg-secondary hover:text-foreground">
                  <Plus className="h-3.5 w-3.5" />
                </button>
              </div>
              <p className="mt-2 text-[11px] text-muted-foreground">{p.members.length} contributors</p>
            </div>
            <div className="rounded-xl border border-border/60 bg-surface/60 p-3.5">
              <p className="text-[10.5px] font-semibold uppercase tracking-wider text-muted-foreground">Due</p>
              <p className="mt-2 flex items-center gap-1.5 text-[16px] font-semibold text-foreground">
                <Calendar className="h-4 w-4 text-primary" /> {p.dueDate}
              </p>
              <p className="mt-1 text-[11px] text-muted-foreground">{p.dueRelative} · last update {p.updated}</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ============ metric strip ============ */
function MetricStrip({ project: p }: { project: ProjectShape }) {
  const items = [
    { label: "Open tasks", value: `${p.tasks.total - p.tasks.done}`, delta: "-6", up: false, hint: "this week", icon: ListChecks, tone: "text-primary" },
    { label: "Velocity", value: "+23%", delta: "+4%", up: true, hint: "vs last sprint", icon: TrendingUp, tone: "text-success" },
    { label: "Blockers", value: "3", delta: "+1", up: false, hint: "needs triage", icon: AlertTriangle, tone: "text-danger" },
    { label: "Files", value: `${p.attachments}`, delta: "+8", up: true, hint: "this week", icon: FolderOpen, tone: "text-accent-foreground" },
  ];
  return (
    <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-4">
      {items.map((it) => (
        <div key={it.label} className="rounded-xl border border-border/70 bg-white p-3.5 shadow-xs">
          <div className="flex items-center gap-2">
            <span className="grid h-7 w-7 place-items-center rounded-lg bg-secondary/60">
              <it.icon className={`h-3.5 w-3.5 ${it.tone}`} />
            </span>
            <p className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">{it.label}</p>
          </div>
          <div className="mt-2 flex items-end justify-between">
            <p className="text-[22px] font-semibold tracking-[-0.02em] tabular-nums text-foreground">{it.value}</p>
            <span className={`text-[10.5px] font-semibold ${it.up ? "text-success" : "text-danger"}`}>{it.delta}</span>
          </div>
          <p className="mt-0.5 text-[10.5px] text-muted-foreground">{it.hint}</p>
        </div>
      ))}
    </div>
  );
}

/* ============ tabs ============ */
function TabsBar({ tab, setTab }: { tab: TabKey; setTab: (t: TabKey) => void }) {
  const tabs: { key: TabKey; label: string; icon: any; count?: number | string }[] = [
    { key: "overview", label: "Overview", icon: LayoutGrid },
    { key: "tasks", label: "Tasks", icon: ListChecks, count: 54 },
    { key: "members", label: "Members", icon: Users, count: 5 },
    { key: "files", label: "Files", icon: FolderOpen, count: 34 },
    { key: "milestones", label: "Milestones", icon: Flag, count: 5 },
    { key: "activity", label: "Activity", icon: Activity },
    { key: "settings", label: "Settings", icon: SettingsIcon },
  ];
  return (
    <div className="mt-8 border-b border-border/70">
      <div className="flex items-center gap-1 overflow-x-auto">
        {tabs.map((t) => {
          const active = tab === t.key;
          return (
            <button
              key={t.key}
              onClick={() => setTab(t.key)}
              className={`group relative flex shrink-0 items-center gap-1.5 px-3 py-2.5 text-[12.5px] font-semibold transition-colors ${
                active ? "text-foreground" : "text-muted-foreground hover:text-foreground"
              }`}
            >
              <t.icon className={`h-3.5 w-3.5 ${active ? "text-primary" : ""}`} />
              {t.label}
              {t.count !== undefined && (
                <span className={`rounded px-1.5 py-0.5 text-[10px] font-semibold ${active ? "bg-primary/12 text-primary" : "bg-secondary text-muted-foreground"}`}>
                  {t.count}
                </span>
              )}
              {active && <span className="absolute inset-x-2 -bottom-px h-[2px] rounded-t bg-gradient-primary" />}
            </button>
          );
        })}
      </div>
    </div>
  );
}

/* ============ OVERVIEW ============ */
function OverviewTab({ project: p }: { project: ProjectShape }) {
  return (
    <div className="grid grid-cols-12 gap-6">
      {/* left column */}
      <div className="col-span-12 xl:col-span-8 space-y-6">
        <BurndownCard color={p.color} accent={p.accent} />
        <TasksPreview />
        <RecentActivity />
      </div>

      {/* right column */}
      <div className="col-span-12 xl:col-span-4 space-y-6">
        <MembersRail members={p.members} />
        <UpcomingMilestones />
        <AiSummary />
      </div>
    </div>
  );
}

function BurndownCard({ color, accent }: { color: string; accent: string }) {
  const w = 640, h = 220, pad = 28;
  const days = 21;
  const ideal = Array.from({ length: days }, (_, i) => 54 - (54 / (days - 1)) * i);
  const actual = [54, 53, 50, 49, 46, 44, 42, 41, 38, 36, 34, 33, 30, 27, 25, 22, 20, 18, 16, 14, 12];
  const max = 60;
  const bw = (w - pad * 2) / (days - 1);
  const toXY = (arr: number[]) => arr.map((v, i) => {
    const x = pad + i * bw;
    const y = h - pad - (v / max) * (h - pad * 2);
    return `${x.toFixed(1)},${y.toFixed(1)}`;
  }).join(" L ");

  return (
    <section className="rounded-2xl border border-border/70 bg-white p-5 shadow-xs">
      <div className="grid grid-cols-[minmax(0,1fr)_auto] items-start gap-3 sm:flex sm:justify-between">
        <div>
          <h2 className="text-[15px] font-semibold tracking-[-0.01em]">Burndown</h2>
          <p className="mt-0.5 text-[12px] text-muted-foreground">Remaining work over the current sprint · 3 days ahead of plan</p>
        </div>
        <div className="flex items-center gap-3 text-[11.5px]">
          <span className="flex items-center gap-1.5 text-muted-foreground"><span className="h-[2px] w-3 rounded bg-muted-foreground/60" /> Ideal</span>
          <span className="flex items-center gap-1.5 text-foreground"><span className="h-2 w-2 rounded-full" style={{ background: color }} /> Actual</span>
        </div>
      </div>
      <div className="mt-4 w-full overflow-x-auto">
        <svg viewBox={`0 0 ${w} ${h}`} className="w-full min-w-[520px]">
          <defs>
            <linearGradient id="bd-grad" x1="0" x2="0" y1="0" y2="1">
              <stop offset="0%" stopColor={color} stopOpacity="0.25" />
              <stop offset="100%" stopColor={color} stopOpacity="0" />
            </linearGradient>
          </defs>
          {[0, 1, 2, 3, 4].map((i) => {
            const y = pad + i * ((h - pad * 2) / 4);
            return (
              <g key={i}>
                <line x1={pad} x2={w - pad} y1={y} y2={y} stroke="oklch(0.9 0.01 265)" strokeDasharray="2 4" />
                <text x={pad - 6} y={y + 3} textAnchor="end" fontSize="9.5" fill="oklch(0.55 0.02 265)">{Math.round(max - i * (max / 4))}</text>
              </g>
            );
          })}
          {/* ideal line */}
          <path d={`M ${toXY(ideal)}`} fill="none" stroke="oklch(0.62 0.02 265)" strokeWidth="1.25" strokeDasharray="4 4" />
          {/* actual */}
          <path d={`M ${toXY(actual)} L ${w - pad},${h - pad} L ${pad},${h - pad} Z`} fill="url(#bd-grad)" />
          <path d={`M ${toXY(actual)}`} fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          {/* end dot */}
          {(() => {
            const last = actual[actual.length - 1];
            const x = pad + (actual.length - 1) * bw;
            const y = h - pad - (last / max) * (h - pad * 2);
            return (
              <g>
                <circle cx={x} cy={y} r="8" fill={accent} fillOpacity="0.2" />
                <circle cx={x} cy={y} r="3.5" fill="white" stroke={color} strokeWidth="2" />
              </g>
            );
          })()}
        </svg>
      </div>
    </section>
  );
}

function TasksPreview() {
  const cols = [
    {
      title: "In progress", tone: "bg-primary", count: 8,
      items: [
        { key: "PAY-142", title: "Refund flow polish", who: "AK", color: "oklch(0.72 0.16 180)", priority: "High" as const },
        { key: "PAY-149", title: "Currency picker states", who: "MB", color: "oklch(0.75 0.16 92)", priority: "Medium" as const },
        { key: "PAY-151", title: "Idempotency keys audit", who: "SR", color: "oklch(0.68 0.17 28)", priority: "Urgent" as const },
      ],
    },
    {
      title: "In review", tone: "bg-accent", count: 5,
      items: [
        { key: "PAY-137", title: "Webhook retries UX", who: "JL", color: "oklch(0.55 0.22 279)", priority: "High" as const },
        { key: "PAY-140", title: "Invoice PDF template", who: "MB", color: "oklch(0.75 0.16 92)", priority: "Medium" as const },
      ],
    },
    {
      title: "Done", tone: "bg-success", count: 42,
      items: [
        { key: "PAY-131", title: "Multi-currency schema", who: "AK", color: "oklch(0.72 0.16 180)", priority: "High" as const },
        { key: "PAY-125", title: "Failure recovery flow", who: "SR", color: "oklch(0.68 0.17 28)", priority: "Urgent" as const },
      ],
    },
  ];
  return (
    <section className="rounded-2xl border border-border/70 bg-white p-5 shadow-xs">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-[15px] font-semibold tracking-[-0.01em]">Tasks</h2>
          <p className="mt-0.5 text-[12px] text-muted-foreground">Snapshot of the active sprint</p>
        </div>
        <button className="text-[12px] font-semibold text-primary hover:underline">Open board →</button>
      </div>
      <div className="mt-4 grid grid-cols-1 gap-3 md:grid-cols-3">
        {cols.map((c) => (
          <div key={c.title} className="rounded-xl border border-border/60 bg-secondary/30 p-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1.5 text-[11px] font-semibold text-foreground">
                <span className={`h-1.5 w-1.5 rounded-full ${c.tone}`} />
                {c.title}
                <span className="rounded bg-white px-1.5 py-0.5 text-[10px] font-semibold text-muted-foreground">{c.count}</span>
              </div>
              <button className="grid h-5 w-5 place-items-center rounded text-muted-foreground hover:bg-white">
                <Plus className="h-3 w-3" />
              </button>
            </div>
            <div className="mt-2 space-y-2">
              {c.items.map((it) => (
                <div key={it.key} className="cursor-pointer rounded-lg border border-border/60 bg-white p-2.5 shadow-xs transition-all hover:-translate-y-0.5 hover:shadow-soft">
                  <div className="flex items-center gap-1.5 text-[9.5px] font-semibold uppercase tracking-wider text-muted-foreground">
                    <span>{it.key}</span>
                    <span className={`ml-auto rounded px-1 py-[1px] text-[9px] font-semibold ${
                      it.priority === "Urgent" ? "bg-danger/12 text-danger" :
                      it.priority === "High" ? "bg-warning/15 text-warning" : "bg-accent/15 text-accent-foreground"
                    }`}>{it.priority}</span>
                  </div>
                  <p className="mt-1 text-[12px] font-medium text-foreground">{it.title}</p>
                  <div className="mt-2 flex items-center gap-1.5">
                    <span className="grid h-5 w-5 place-items-center rounded-full text-[9px] font-semibold text-white" style={{ background: it.color }}>{it.who}</span>
                    <span className="ml-auto flex items-center gap-2 text-[10px] text-muted-foreground">
                      <span className="flex items-center gap-0.5"><MessageSquare className="h-2.5 w-2.5" />3</span>
                      <span className="flex items-center gap-0.5"><Paperclip className="h-2.5 w-2.5" />1</span>
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

function RecentActivity() {
  const items = [
    { who: "Ada K.", initials: "AK", color: "oklch(0.72 0.16 180)", action: "shipped", target: "PAY-142 · Refund flow polish", time: "2m ago", icon: CheckCircle2, tone: "text-success" },
    { who: "Zabaku AI", initials: "AI", color: "oklch(0.55 0.22 279)", action: "generated 6 tickets under", target: "Beta launch milestone", time: "18m ago", icon: Sparkles, tone: "text-primary" },
    { who: "Mira B.", initials: "MB", color: "oklch(0.75 0.16 92)", action: "commented on", target: "PAY-140 · Invoice PDF template", time: "42m ago", icon: MessageSquare, tone: "text-muted-foreground" },
    { who: "Sai R.", initials: "SR", color: "oklch(0.68 0.17 28)", action: "opened PR on", target: "PAY-151 · Idempotency keys audit", time: "1h ago", icon: GitBranch, tone: "text-muted-foreground" },
    { who: "Jules L.", initials: "JL", color: "oklch(0.55 0.22 279)", action: "moved", target: "Beta launch → In progress", time: "2h ago", icon: ArrowUpRight, tone: "text-primary" },
  ];
  return (
    <section className="rounded-2xl border border-border/70 bg-white shadow-xs">
      <div className="flex items-center justify-between border-b border-border/70 px-5 py-3.5">
        <div>
          <h2 className="text-[15px] font-semibold tracking-[-0.01em]">Recent activity</h2>
          <p className="mt-0.5 text-[12px] text-muted-foreground">Live changes across this project</p>
        </div>
        <button className="text-[12px] font-semibold text-primary hover:underline">Full feed →</button>
      </div>
      <ul className="divide-y divide-border/50">
        {items.map((it, i) => (
          <li key={i} className="flex items-start gap-3 px-5 py-3.5">
            <span className="grid h-8 w-8 shrink-0 place-items-center rounded-full text-[10.5px] font-semibold text-white" style={{ background: it.color }}>{it.initials}</span>
            <div className="min-w-0 flex-1">
              <p className="text-[12.5px] text-foreground">
                <span className="font-semibold">{it.who}</span>
                <span className="text-muted-foreground"> {it.action} </span>
                <span className="font-medium">{it.target}</span>
              </p>
              <p className="mt-0.5 flex items-center gap-1.5 text-[11px] text-muted-foreground">
                <it.icon className={`h-3 w-3 ${it.tone}`} />
                {it.time}
              </p>
            </div>
          </li>
        ))}
      </ul>
    </section>
  );
}

function MembersRail({ members }: { members: ProjectShape["members"] }) {
  return (
    <section className="rounded-2xl border border-border/70 bg-white p-5 shadow-xs">
      <div className="flex items-center justify-between">
        <h2 className="text-[14px] font-semibold tracking-[-0.01em]">Team</h2>
        <button className="grid h-6 w-6 place-items-center rounded-md text-muted-foreground hover:bg-secondary">
          <Plus className="h-3.5 w-3.5" />
        </button>
      </div>
      <ul className="mt-3 space-y-2.5">
        {members.map((m) => (
          <li key={m.initials} className="flex items-center gap-3">
            <span className="grid h-8 w-8 shrink-0 place-items-center rounded-full text-[10.5px] font-semibold text-white" style={{ background: m.color }}>{m.initials}</span>
            <div className="min-w-0 flex-1">
              <p className="truncate text-[12.5px] font-semibold text-foreground">{m.name}</p>
              <p className="truncate text-[10.5px] text-muted-foreground">{m.role}</p>
            </div>
            <span className="h-1.5 w-1.5 rounded-full bg-success" />
          </li>
        ))}
      </ul>
    </section>
  );
}

function UpcomingMilestones() {
  const items = [
    { t: "Beta launch", date: "Aug 04", pct: 62, tone: "text-primary" },
    { t: "Provider integration", date: "Aug 09", pct: 38, tone: "text-accent-foreground" },
    { t: "GA release", date: "Aug 12", pct: 12, tone: "text-warning" },
  ];
  return (
    <section className="rounded-2xl border border-border/70 bg-white p-5 shadow-xs">
      <div className="flex items-center justify-between">
        <h2 className="text-[14px] font-semibold tracking-[-0.01em]">Upcoming milestones</h2>
        <button className="text-[11.5px] font-semibold text-primary hover:underline">All</button>
      </div>
      <ul className="mt-3 space-y-3">
        {items.map((m) => (
          <li key={m.t}>
            <div className="flex items-center justify-between text-[12.5px]">
              <div className="flex items-center gap-1.5">
                <Flag className={`h-3.5 w-3.5 ${m.tone}`} />
                <span className="font-semibold text-foreground">{m.t}</span>
              </div>
              <span className="text-[11px] tabular-nums text-muted-foreground">{m.date}</span>
            </div>
            <div className="mt-1.5 h-1.5 overflow-hidden rounded-full bg-secondary">
              <div className="h-full rounded-full bg-gradient-primary" style={{ width: `${m.pct}%` }} />
            </div>
          </li>
        ))}
      </ul>
    </section>
  );
}

function AiSummary() {
  const [input, setInput] = useState("");
  return (
    <section className="relative overflow-hidden rounded-2xl border border-border/70 bg-white p-5 shadow-xs">
      <div className="pointer-events-none absolute -right-8 -top-8 h-32 w-32 rounded-full bg-primary/15 blur-3xl" />
      <div className="flex items-center gap-2">
        <span className="grid h-7 w-7 place-items-center rounded-lg bg-gradient-primary text-white shadow-glow">
          <Bot className="h-3.5 w-3.5" />
        </span>
        <h2 className="text-[14px] font-semibold tracking-[-0.01em]">AI summary</h2>
        <span className="ml-auto rounded-full bg-success/12 px-1.5 py-0.5 text-[10px] font-semibold text-success">Live</span>
      </div>
      <p className="relative mt-3 text-[12.5px] leading-relaxed text-foreground">
        <span className="font-semibold">You're 3 days ahead</span> of the ideal burndown. Two tickets are blocked on provider approvals — I can draft a chase email or reassign to Priya.
      </p>
      <div className="mt-3 flex flex-wrap gap-1.5">
        {["Draft update", "Assign blockers", "Summarize week"].map((s) => (
          <button key={s} className="rounded-full border border-border/70 bg-surface px-2.5 py-1 text-[11px] font-medium text-foreground hover:bg-secondary">{s}</button>
        ))}
      </div>
      <div className="mt-3 flex items-center gap-2 rounded-xl border border-border/70 bg-surface p-1.5 shadow-xs focus-within:border-primary/60 focus-within:ring-4 focus-within:ring-primary/10">
        <input value={input} onChange={(e) => setInput(e.target.value)} placeholder="Ask about this project…" className="min-w-0 flex-1 bg-transparent px-2 py-1.5 text-[12.5px] outline-none placeholder:text-muted-foreground/70" />
        <button className="grid h-7 w-7 place-items-center rounded-lg bg-gradient-primary text-white shadow-glow"><Send className="h-3.5 w-3.5" /></button>
      </div>
    </section>
  );
}

/* ============ TASKS TAB ============ */
function TasksTab() {
  const rows = [
    { key: "PAY-151", title: "Idempotency keys audit", assignee: "SR", color: "oklch(0.68 0.17 28)", status: "In progress", priority: "Urgent", due: "Jul 28", est: "8h" },
    { key: "PAY-149", title: "Currency picker states", assignee: "MB", color: "oklch(0.75 0.16 92)", status: "In progress", priority: "Medium", due: "Jul 30", est: "5h" },
    { key: "PAY-142", title: "Refund flow polish", assignee: "AK", color: "oklch(0.72 0.16 180)", status: "In review", priority: "High", due: "Jul 27", est: "3h" },
    { key: "PAY-140", title: "Invoice PDF template", assignee: "MB", color: "oklch(0.75 0.16 92)", status: "In review", priority: "Medium", due: "Aug 02", est: "6h" },
    { key: "PAY-137", title: "Webhook retries UX", assignee: "JL", color: "oklch(0.55 0.22 279)", status: "In review", priority: "High", due: "Jul 26", est: "4h" },
    { key: "PAY-131", title: "Multi-currency schema", assignee: "AK", color: "oklch(0.72 0.16 180)", status: "Done", priority: "High", due: "Jul 20", est: "12h" },
  ];
  const tone = (s: string) => ({
    "In progress": "bg-primary/12 text-primary",
    "In review": "bg-accent/15 text-accent-foreground",
    "Done": "bg-success/12 text-success",
  } as Record<string, string>)[s];
  const pri = (p: string) => ({
    "Urgent": "bg-danger/12 text-danger",
    "High": "bg-warning/15 text-warning",
    "Medium": "bg-accent/15 text-accent-foreground",
  } as Record<string, string>)[p];

  return (
    <section className="rounded-2xl border border-border/70 bg-white shadow-xs">
      <div className="grid grid-cols-[minmax(0,1fr)_auto] items-center gap-3 border-b border-border/70 px-5 py-3 sm:flex sm:justify-between">
        <div className="flex min-w-0 items-center gap-2">
          <div className="flex h-9 w-full max-w-[280px] items-center gap-2 rounded-lg border border-border/70 bg-surface px-3">
            <Search className="h-3.5 w-3.5 text-muted-foreground" />
            <input placeholder="Search tasks" className="min-w-0 flex-1 bg-transparent text-[12.5px] outline-none placeholder:text-muted-foreground/70" />
          </div>
          <button className="flex h-9 items-center gap-1.5 rounded-lg border border-border/70 bg-white px-2.5 text-[12px] font-semibold hover:bg-secondary">
            <Filter className="h-3.5 w-3.5" /> Filter
          </button>
        </div>
        <button className="flex h-9 items-center gap-1.5 rounded-lg bg-gradient-primary px-3 text-[12.5px] font-semibold text-white shadow-glow hover:scale-[1.02]">
          <Plus className="h-3.5 w-3.5" /> New task
        </button>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full min-w-[820px] text-left">
          <thead>
            <tr className="text-[10.5px] font-semibold uppercase tracking-wider text-muted-foreground">
              <th className="py-2.5 pl-5 pr-3">Task</th>
              <th className="py-2.5 px-3">Assignee</th>
              <th className="py-2.5 px-3">Status</th>
              <th className="py-2.5 px-3">Priority</th>
              <th className="py-2.5 px-3">Due</th>
              <th className="py-2.5 pl-3 pr-5">Estimate</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((r) => (
              <tr key={r.key} className="border-t border-border/50 text-[12.5px] transition-colors hover:bg-secondary/40">
                <td className="py-3 pl-5 pr-3">
                  <div className="flex items-center gap-2.5">
                    <Circle className="h-3.5 w-3.5 text-muted-foreground" />
                    <div>
                      <p className="font-semibold text-foreground">{r.title}</p>
                      <p className="text-[10.5px] text-muted-foreground">{r.key}</p>
                    </div>
                  </div>
                </td>
                <td className="px-3 py-3">
                  <span className="grid h-6 w-6 place-items-center rounded-full text-[9.5px] font-semibold text-white" style={{ background: r.color }}>{r.assignee}</span>
                </td>
                <td className="px-3 py-3"><span className={`inline-flex items-center gap-1 rounded-md px-1.5 py-0.5 text-[10.5px] font-semibold ${tone(r.status)}`}><span className="h-1.5 w-1.5 rounded-full bg-current" />{r.status}</span></td>
                <td className="px-3 py-3"><span className={`inline-flex items-center gap-1 rounded-md px-1.5 py-0.5 text-[10.5px] font-semibold ${pri(r.priority)}`}><Flag className="h-2.5 w-2.5" />{r.priority}</span></td>
                <td className="px-3 py-3 tabular-nums text-muted-foreground">{r.due}</td>
                <td className="pl-3 pr-5 py-3 tabular-nums text-muted-foreground">{r.est}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}

/* ============ MEMBERS TAB ============ */
function MembersTab({ members }: { members: ProjectShape["members"] }) {
  return (
    <section className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
      {members.map((m) => (
        <div key={m.initials} className="group rounded-2xl border border-border/70 bg-white p-5 shadow-xs transition-all hover:-translate-y-0.5 hover:shadow-soft">
          <div className="flex items-center gap-3">
            <span className="grid h-11 w-11 place-items-center rounded-full text-[13px] font-semibold text-white shadow-xs" style={{ background: m.color }}>{m.initials}</span>
            <div className="min-w-0">
              <p className="truncate text-[14px] font-semibold text-foreground">{m.name}</p>
              <p className="truncate text-[11.5px] text-muted-foreground">{m.role}</p>
            </div>
            <span className="ml-auto flex items-center gap-1 rounded-full bg-success/12 px-1.5 py-0.5 text-[10px] font-semibold text-success"><span className="h-1.5 w-1.5 rounded-full bg-success" />Online</span>
          </div>
          <div className="mt-4 grid grid-cols-3 gap-2 text-center">
            {[{ l: "Tasks", v: "12" }, { l: "Reviews", v: "5" }, { l: "Comments", v: "34" }].map((s) => (
              <div key={s.l} className="rounded-lg border border-border/60 bg-surface/60 py-2">
                <p className="text-[15px] font-semibold text-foreground tabular-nums">{s.v}</p>
                <p className="text-[10px] text-muted-foreground">{s.l}</p>
              </div>
            ))}
          </div>
          <div className="mt-4 flex items-center gap-2">
            <button className="flex h-8 flex-1 items-center justify-center gap-1.5 rounded-lg border border-border/70 bg-white text-[11.5px] font-semibold hover:bg-secondary">
              <Mail className="h-3 w-3" /> Message
            </button>
            <button className="grid h-8 w-8 place-items-center rounded-lg border border-border/70 bg-white text-muted-foreground hover:bg-secondary hover:text-foreground">
              <MoreHorizontal className="h-3.5 w-3.5" />
            </button>
          </div>
        </div>
      ))}
      {/* invite card */}
      <button className="grid place-items-center rounded-2xl border-2 border-dashed border-border/80 bg-white/40 p-5 text-center transition-colors hover:border-primary/50 hover:bg-white">
        <span className="grid h-10 w-10 place-items-center rounded-full bg-gradient-primary text-white shadow-glow">
          <Plus className="h-4 w-4" />
        </span>
        <p className="mt-3 text-[13px] font-semibold text-foreground">Invite a teammate</p>
        <p className="mt-0.5 text-[11.5px] text-muted-foreground">Free during your 14-day trial</p>
      </button>
    </section>
  );
}

/* ============ FILES TAB ============ */
function FilesTab() {
  const files = [
    { name: "payments-v2-spec.md", size: "184 KB", who: "JL", color: "oklch(0.55 0.22 279)", type: "doc", updated: "2h ago" },
    { name: "checkout-mocks-v3.fig", size: "42 MB", who: "MB", color: "oklch(0.75 0.16 92)", type: "image", updated: "5h ago" },
    { name: "provider-comparison.pdf", size: "1.2 MB", who: "AK", color: "oklch(0.72 0.16 180)", type: "doc", updated: "yesterday" },
    { name: "refund-flow-demo.mp4", size: "18 MB", who: "SR", color: "oklch(0.68 0.17 28)", type: "video", updated: "yesterday" },
    { name: "invoice-template.pdf", size: "640 KB", who: "MB", color: "oklch(0.75 0.16 92)", type: "doc", updated: "2d ago" },
    { name: "webhook-schema.json", size: "12 KB", who: "AK", color: "oklch(0.72 0.16 180)", type: "doc", updated: "3d ago" },
  ];
  const icon = (t: string) => t === "image" ? ImageIcon : t === "video" ? Film : FileText;
  const tint = (t: string) => t === "image" ? "bg-accent/15 text-accent-foreground" : t === "video" ? "bg-danger/12 text-danger" : "bg-primary/12 text-primary";
  return (
    <section>
      <div className="mb-4 flex items-center justify-between">
        <p className="text-[12.5px] text-muted-foreground"><span className="font-semibold text-foreground">34 files</span> · 2.4 GB used</p>
        <div className="flex items-center gap-2">
          <button className="flex h-9 items-center gap-1.5 rounded-lg border border-border/70 bg-white px-2.5 text-[12px] font-semibold hover:bg-secondary">
            <Filter className="h-3.5 w-3.5" /> Type
          </button>
          <button className="flex h-9 items-center gap-1.5 rounded-lg bg-gradient-primary px-3 text-[12.5px] font-semibold text-white shadow-glow hover:scale-[1.02]">
            <Plus className="h-3.5 w-3.5" /> Upload
          </button>
        </div>
      </div>
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-3">
        {files.map((f) => {
          const Icon = icon(f.type);
          return (
            <div key={f.name} className="group flex items-center gap-3 rounded-xl border border-border/70 bg-white p-3.5 shadow-xs transition-all hover:-translate-y-0.5 hover:shadow-soft">
              <span className={`grid h-11 w-11 shrink-0 place-items-center rounded-xl ${tint(f.type)}`}>
                <Icon className="h-5 w-5" />
              </span>
              <div className="min-w-0 flex-1">
                <p className="truncate text-[13px] font-semibold text-foreground">{f.name}</p>
                <p className="text-[11px] text-muted-foreground">{f.size} · {f.updated}</p>
              </div>
              <span className="grid h-6 w-6 shrink-0 place-items-center rounded-full text-[9.5px] font-semibold text-white" style={{ background: f.color }}>{f.who}</span>
              <button className="grid h-8 w-8 shrink-0 place-items-center rounded-lg text-muted-foreground opacity-0 transition-opacity hover:bg-secondary hover:text-foreground group-hover:opacity-100">
                <Download className="h-3.5 w-3.5" />
              </button>
            </div>
          );
        })}
      </div>
    </section>
  );
}

/* ============ MILESTONES TAB ============ */
function MilestonesTab() {
  const items = [
    { t: "Kickoff", date: "May 06", done: true, pct: 100, desc: "Team assembled, scope locked." },
    { t: "Design freeze", date: "Jun 04", done: true, pct: 100, desc: "All flows approved by design + product." },
    { t: "API cutover", date: "Jun 28", done: true, pct: 100, desc: "New payments API in staging with backwards compatibility." },
    { t: "Beta launch", date: "Aug 04", done: false, pct: 62, desc: "Rollout to design partners with weekly feedback loops." },
    { t: "GA release", date: "Aug 12", done: false, pct: 12, desc: "Public launch, marketing site, and switchover to v2 default." },
  ];
  return (
    <section className="rounded-2xl border border-border/70 bg-white p-6 shadow-xs">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-[15px] font-semibold tracking-[-0.01em]">Milestones</h2>
          <p className="mt-0.5 text-[12px] text-muted-foreground">The path to GA · 3 of 5 complete</p>
        </div>
        <button className="flex h-9 items-center gap-1.5 rounded-lg border border-border/70 bg-white px-2.5 text-[12px] font-semibold hover:bg-secondary">
          <Plus className="h-3.5 w-3.5" /> Add milestone
        </button>
      </div>
      <ol className="relative mt-6 border-l-2 border-border/60 pl-6">
        {items.map((m, i) => (
          <li key={m.t} className={`relative pb-6 ${i === items.length - 1 ? "pb-0" : ""}`}>
            <span className={`absolute -left-[33px] top-0 grid h-6 w-6 place-items-center rounded-full border-4 border-background ${m.done ? "bg-gradient-primary shadow-glow" : "bg-white ring-2 ring-border"}`}>
              {m.done ? <CheckCircle2 className="h-3 w-3 text-white" /> : <Circle className="h-2 w-2 text-muted-foreground" />}
            </span>
            <div className="flex flex-wrap items-center gap-2">
              <h3 className="text-[14px] font-semibold text-foreground">{m.t}</h3>
              <span className="inline-flex items-center gap-1 rounded bg-secondary px-1.5 py-0.5 text-[10.5px] font-semibold text-muted-foreground">
                <Calendar className="h-2.5 w-2.5" /> {m.date}
              </span>
              {m.done && <span className="rounded bg-success/12 px-1.5 py-0.5 text-[10.5px] font-semibold text-success">Complete</span>}
            </div>
            <p className="mt-1 text-[12.5px] text-muted-foreground">{m.desc}</p>
            {!m.done && (
              <div className="mt-2 flex items-center gap-2">
                <div className="h-1.5 w-48 overflow-hidden rounded-full bg-secondary">
                  <div className="h-full rounded-full bg-gradient-primary" style={{ width: `${m.pct}%` }} />
                </div>
                <span className="text-[11px] tabular-nums text-muted-foreground">{m.pct}%</span>
              </div>
            )}
          </li>
        ))}
      </ol>
    </section>
  );
}

/* ============ ACTIVITY TAB ============ */
function ActivityTab() {
  const groups = [
    {
      day: "Today",
      items: [
        { who: "Ada K.", initials: "AK", color: "oklch(0.72 0.16 180)", action: "shipped", target: "PAY-142 · Refund flow polish", time: "2m ago", icon: CheckCircle2, tone: "text-success" },
        { who: "Zabaku AI", initials: "AI", color: "oklch(0.55 0.22 279)", action: "generated 6 tickets under", target: "Beta launch milestone", time: "18m ago", icon: Sparkles, tone: "text-primary" },
        { who: "Mira B.", initials: "MB", color: "oklch(0.75 0.16 92)", action: "commented on", target: "PAY-140 · Invoice PDF template", time: "42m ago", icon: MessageSquare, tone: "text-muted-foreground" },
      ],
    },
    {
      day: "Yesterday",
      items: [
        { who: "Sai R.", initials: "SR", color: "oklch(0.68 0.17 28)", action: "opened PR on", target: "PAY-151 · Idempotency keys audit", time: "16h ago", icon: GitBranch, tone: "text-muted-foreground" },
        { who: "Jules L.", initials: "JL", color: "oklch(0.55 0.22 279)", action: "moved", target: "Beta launch → In progress", time: "22h ago", icon: ArrowUpRight, tone: "text-primary" },
      ],
    },
  ];
  return (
    <section className="rounded-2xl border border-border/70 bg-white p-5 shadow-xs">
      {groups.map((g) => (
        <div key={g.day} className="mb-6 last:mb-0">
          <p className="mb-2 text-[10.5px] font-semibold uppercase tracking-wider text-muted-foreground">{g.day}</p>
          <ul className="space-y-3">
            {g.items.map((it, i) => (
              <li key={i} className="flex items-start gap-3 rounded-xl border border-border/60 bg-surface/40 p-3">
                <span className="grid h-8 w-8 shrink-0 place-items-center rounded-full text-[10.5px] font-semibold text-white" style={{ background: it.color }}>{it.initials}</span>
                <div className="min-w-0 flex-1">
                  <p className="text-[12.5px] text-foreground"><span className="font-semibold">{it.who}</span> <span className="text-muted-foreground">{it.action}</span> <span className="font-medium">{it.target}</span></p>
                  <p className="mt-0.5 flex items-center gap-1.5 text-[11px] text-muted-foreground">
                    <it.icon className={`h-3 w-3 ${it.tone}`} />{it.time}
                  </p>
                </div>
              </li>
            ))}
          </ul>
        </div>
      ))}
    </section>
  );
}

/* ============ SETTINGS TAB ============ */
function SettingsTab() {
  const [name, setName] = useState("Payments v2");
  const [privacy, setPrivacy] = useState<"workspace" | "private">("workspace");
  const [notify, setNotify] = useState(true);
  return (
    <div className="grid grid-cols-12 gap-6">
      <div className="col-span-12 space-y-5 xl:col-span-8">
        <Panel title="General" description="Basic information about this project.">
          <div className="grid gap-4 sm:grid-cols-2">
            <FormField label="Project name">
              <input value={name} onChange={(e) => setName(e.target.value)} className="h-10 w-full rounded-lg border border-border bg-surface px-3 text-[13px] outline-none focus:border-primary/60 focus:ring-4 focus:ring-primary/15" />
            </FormField>
            <FormField label="Key">
              <input defaultValue="PAY" className="h-10 w-full rounded-lg border border-border bg-surface px-3 text-[13px] outline-none focus:border-primary/60 focus:ring-4 focus:ring-primary/15" />
            </FormField>
          </div>
          <FormField label="Description">
            <textarea rows={3} defaultValue="Refunds, invoicing, and multi-currency checkout." className="w-full rounded-lg border border-border bg-surface px-3 py-2 text-[13px] outline-none focus:border-primary/60 focus:ring-4 focus:ring-primary/15" />
          </FormField>
        </Panel>

        <Panel title="Privacy" description="Control who can see this project.">
          <div className="grid gap-2 sm:grid-cols-2">
            {[
              { k: "workspace", label: "Workspace", desc: "Everyone at Northwind can view.", icon: Users },
              { k: "private", label: "Private", desc: "Invite-only for a specific team.", icon: Shield },
            ].map((o) => {
              const active = privacy === (o.k as any);
              return (
                <button
                  key={o.k}
                  onClick={() => setPrivacy(o.k as any)}
                  className={`flex items-start gap-3 rounded-xl border p-3.5 text-left transition-all ${
                    active ? "border-primary/50 bg-primary/5 ring-4 ring-primary/10" : "border-border/70 bg-white hover:bg-secondary/40"
                  }`}
                >
                  <span className={`grid h-8 w-8 shrink-0 place-items-center rounded-lg ${active ? "bg-gradient-primary text-white shadow-glow" : "bg-secondary text-muted-foreground"}`}>
                    <o.icon className="h-4 w-4" />
                  </span>
                  <div className="min-w-0">
                    <p className="text-[13px] font-semibold text-foreground">{o.label}</p>
                    <p className="text-[11.5px] text-muted-foreground">{o.desc}</p>
                  </div>
                </button>
              );
            })}
          </div>
        </Panel>

        <Panel title="Notifications" description="Digest sent to project owners.">
          <div className="flex items-center justify-between rounded-xl border border-border/60 bg-surface/60 p-3.5">
            <div className="flex items-center gap-3">
              <Bell className="h-4 w-4 text-primary" />
              <div>
                <p className="text-[13px] font-semibold text-foreground">Weekly project digest</p>
                <p className="text-[11.5px] text-muted-foreground">Summary every Monday at 9:00 AM.</p>
              </div>
            </div>
            <button
              onClick={() => setNotify(!notify)}
              className={`relative h-6 w-11 rounded-full transition-colors ${notify ? "bg-gradient-primary shadow-glow" : "bg-secondary"}`}
              aria-pressed={notify}
            >
              <span className={`absolute top-0.5 h-5 w-5 rounded-full bg-white shadow-xs transition-all ${notify ? "left-[22px]" : "left-0.5"}`} />
            </button>
          </div>
        </Panel>

        <Panel title="Danger zone" description="These actions are permanent." tone="danger">
          <div className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-danger/25 bg-danger/5 p-4">
            <div className="flex items-center gap-3">
              <span className="grid h-9 w-9 place-items-center rounded-lg bg-danger/12 text-danger"><Trash2 className="h-4 w-4" /></span>
              <div>
                <p className="text-[13px] font-semibold text-foreground">Archive this project</p>
                <p className="text-[11.5px] text-muted-foreground">Hidden from lists · restore anytime within 30 days.</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <button className="flex h-9 items-center gap-1.5 rounded-lg border border-border/70 bg-white px-3 text-[12.5px] font-semibold hover:bg-secondary">
                <Eye className="h-3.5 w-3.5" /> Archive
              </button>
              <button className="flex h-9 items-center gap-1.5 rounded-lg bg-danger px-3 text-[12.5px] font-semibold text-white hover:opacity-90">
                <Trash2 className="h-3.5 w-3.5" /> Delete
              </button>
            </div>
          </div>
        </Panel>
      </div>

      <aside className="col-span-12 xl:col-span-4">
        <div className="sticky top-6 space-y-3 rounded-2xl border border-border/70 bg-white p-5 shadow-xs">
          <p className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">Automation</p>
          {[
            { t: "Auto-archive tasks", d: "When 'Done' for 30 days", on: true, icon: Play },
            { t: "AI status updates", d: "Weekly digest by Zabaku AI", on: true, icon: Sparkles },
            { t: "Auto-pause overdue", d: "Snooze if >7 days late", on: false, icon: Pause },
          ].map((a) => (
            <div key={a.t} className="flex items-center gap-3 rounded-xl border border-border/60 bg-surface/50 p-3">
              <span className="grid h-7 w-7 shrink-0 place-items-center rounded-lg bg-secondary text-foreground"><a.icon className="h-3.5 w-3.5" /></span>
              <div className="min-w-0 flex-1">
                <p className="truncate text-[12.5px] font-semibold text-foreground">{a.t}</p>
                <p className="truncate text-[11px] text-muted-foreground">{a.d}</p>
              </div>
              <div className={`h-2 w-2 rounded-full ${a.on ? "bg-success" : "bg-border"}`} />
            </div>
          ))}
          <button className="mt-2 flex w-full items-center justify-center gap-1.5 rounded-xl border border-dashed border-border/80 bg-white/60 py-2 text-[12px] font-semibold text-foreground hover:border-primary/50 hover:bg-white">
            <Plus className="h-3.5 w-3.5" /> Add automation
          </button>

          <div className="mt-4 flex items-center gap-1.5 rounded-lg bg-secondary/60 px-3 py-2 text-[11px] text-muted-foreground">
            <Clock className="h-3 w-3" /> Last saved 2 minutes ago
          </div>
        </div>
      </aside>
    </div>
  );
}

function Panel({ title, description, tone, children }: { title: string; description: string; tone?: "danger"; children: React.ReactNode }) {
  return (
    <section className={`rounded-2xl border bg-white p-6 shadow-xs ${tone === "danger" ? "border-danger/30" : "border-border/70"}`}>
      <div className="mb-4">
        <h3 className="text-[14.5px] font-semibold tracking-[-0.01em] text-foreground">{title}</h3>
        <p className="mt-0.5 text-[12px] text-muted-foreground">{description}</p>
      </div>
      <div className="space-y-4">{children}</div>
    </section>
  );
}
function FormField({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-[11.5px] font-semibold text-foreground">{label}</span>
      {children}
    </label>
  );
}
