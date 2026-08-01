import zabakuLogo from "@/assets/zabaku-logo.png.asset.json";
import { createFileRoute, Link } from "@tanstack/react-router";
import { requireAuth } from "@/lib/requireAuth";
import { ProtectedRoute } from "@/components/auth/ProtectedRoute";
import { useState } from "react";
import {
  LayoutDashboard, FolderKanban, CheckSquare, Users, Sparkles, BarChart3,
  Bell, User, Settings, Search, Command, ChevronDown, Plus, ArrowUpRight,
  ArrowDownRight, MoreHorizontal, Circle, CheckCircle2, Clock, GitBranch,
  MessageSquare, Zap, Send, Filter, Calendar as CalendarIcon, ChevronLeft,
  ChevronRight, TrendingUp, Bot, PlayCircle, FileText, Rocket, Inbox,
  Kanban, HelpCircle, RefreshCw, AlertCircle, Loader2,
} from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { useWorkspaces, getPersistedWorkspaceId } from "@/features/workspaces/hooks";
import { useProjects } from "@/features/projects/hooks";
import { useDashboard } from "@/features/dashboard/hooks";
import { useUnreadNotifications } from "@/features/notifications/hooks";
import type { ApiDashboardData, ApiDashboardRecentProject } from "@/features/dashboard/api";

export const Route = createFileRoute("/dashboard")({
  head: () => ({
    meta: [
      { title: "Dashboard — Zabaku" },
      { name: "description", content: "Your Zabaku workspace overview: projects, tasks, AI activity, and team velocity in one place." },
      { property: "og:title", content: "Dashboard — Zabaku" },
      { property: "og:description", content: "Your Zabaku workspace overview: projects, tasks, AI activity, and team velocity in one place." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  beforeLoad: requireAuth,
  component: () => <ProtectedRoute><DashboardPage /></ProtectedRoute>,
});

function DashboardPage() {
  const { data: dashboard, isLoading, isError, error, refetch } = useDashboard();
  const { user } = useAuth();
  const { data: workspaces = [] } = useWorkspaces();
  const activeWorkspaceId = getPersistedWorkspaceId();
  const activeWorkspace = workspaces.find((w) => w.id === activeWorkspaceId) ?? workspaces[0];
  const { data: rawProjects = [] } = useProjects(activeWorkspace?.id ?? null);

  const userName = user?.name ?? "Jules";
  const firstName = userName.split(" ")[0];
  const workspaceName = activeWorkspace?.name ?? "Northwind";

  return (
    <div className="min-h-screen bg-[oklch(0.985_0.005_265)] text-foreground">
      <div className="flex min-h-screen">
        <Sidebar activeWorkspace={activeWorkspace} user={user} />
        <div className="flex min-w-0 flex-1 flex-col">
          <Topbar user={user} />
          <main className="min-w-0 flex-1 px-6 py-6 lg:px-10 lg:py-8">
            <PageHeader firstName={firstName} workspaceName={workspaceName} />

            {/* Error Banner */}
            {isError && (
              <div className="mt-4 flex items-center justify-between rounded-xl border border-destructive/30 bg-destructive/10 px-4 py-3 text-[12.5px] text-destructive">
                <div className="flex items-center gap-2 font-medium">
                  <AlertCircle className="h-4 w-4 shrink-0" />
                  <span>{error instanceof Error ? error.message : "Failed to load dashboard data."}</span>
                </div>
                <button
                  onClick={() => refetch()}
                  className="flex items-center gap-1.5 rounded-lg bg-destructive px-3 py-1 text-[11.5px] font-semibold text-white hover:opacity-90"
                >
                  <RefreshCw className="h-3 w-3" /> Retry
                </button>
              </div>
            )}

            {/* Skeleton Loading State */}
            {isLoading ? (
              <DashboardSkeleton />
            ) : (
              <>
                <StatCards dashboard={dashboard} projectsCount={rawProjects.length} />
                <div className="mt-6 grid grid-cols-12 gap-6">
                  <div className="col-span-12 xl:col-span-8 space-y-6">
                    <VelocityChart velocity={dashboard?.velocity} />
                    <ProjectsTable dashboardProjects={dashboard?.recentProjects} rawProjects={rawProjects} />
                    <ActivityFeed dashboardActivity={dashboard?.recentActivity} />
                  </div>
                  <div className="col-span-12 xl:col-span-4 space-y-6">
                    <AiAssistant firstName={firstName} />
                    <QuickActions />
                    <CalendarCard />
                    <NotificationsCard />
                  </div>
                </div>
              </>
            )}
          </main>
        </div>
      </div>
    </div>
  );
}

/* =========================== SKELETON =========================== */
function DashboardSkeleton() {
  return (
    <div className="space-y-6 mt-6">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="h-28 rounded-xl border border-border/70 bg-white p-4 shadow-xs animate-pulse">
            <div className="h-3 w-20 rounded bg-secondary/80" />
            <div className="mt-4 h-8 w-16 rounded bg-secondary/60" />
          </div>
        ))}
      </div>
      <div className="grid grid-cols-12 gap-6">
        <div className="col-span-12 xl:col-span-8 space-y-6">
          <div className="h-64 rounded-xl border border-border/70 bg-white p-5 animate-pulse">
            <div className="h-4 w-32 rounded bg-secondary/80" />
          </div>
          <div className="h-64 rounded-xl border border-border/70 bg-white p-5 animate-pulse">
            <div className="h-4 w-32 rounded bg-secondary/80" />
          </div>
        </div>
        <div className="col-span-12 xl:col-span-4 space-y-6">
          <div className="h-48 rounded-xl border border-border/70 bg-white p-5 animate-pulse" />
          <div className="h-48 rounded-xl border border-border/70 bg-white p-5 animate-pulse" />
        </div>
      </div>
    </div>
  );
}

/* =========================== SIDEBAR =========================== */
function LogoMark({ size = 26 }: { size?: number }) {
  return (
    <img src={zabakuLogo.url} alt="Zabaku" width={size} height={size} className="rounded-[8px] shadow-glow object-cover" style={{ width: size, height: size }} />
  );
}

function Sidebar({ activeWorkspace, user }: { activeWorkspace?: { name: string; slug?: string }; user?: { name?: string } | null }) {
  const nav = [
    { icon: LayoutDashboard, label: "Dashboard", href: "/dashboard", active: true, badge: null },
    { icon: FolderKanban, label: "Projects", href: "/projects", active: false, badge: null },
    { icon: CheckSquare, label: "Tasks", href: "/tasks", active: false, badge: null },
    { icon: Users, label: "Workspace", href: "/settings", active: false, badge: null },
    { icon: Sparkles, label: "AI", href: "/ai", active: false, badge: "New" },
    { icon: BarChart3, label: "Analytics", href: "/analytics", active: false, badge: null },
    { icon: Bell, label: "Notifications", href: "/notifications", active: false, badge: null },
  ];
  const account = [
    { icon: User, label: "Profile", href: "/profile" },
    { icon: Settings, label: "Settings", href: "/settings" },
  ];

  const wsName = activeWorkspace?.name ?? "Northwind";
  const wsInitial = wsName.charAt(0).toUpperCase();

  return (
    <aside className="hidden w-[248px] shrink-0 flex-col border-r border-border/70 bg-white/60 backdrop-blur-xl lg:flex">
      {/* brand */}
      <div className="flex h-14 items-center gap-2 border-b border-border/70 px-5">
        <LogoMark size={24} />
        <span className="text-[14px] font-semibold tracking-tight">Zabaku</span>
        <button className="ml-auto grid h-7 w-7 place-items-center rounded-md text-muted-foreground hover:bg-secondary">
          <ChevronDown className="h-3.5 w-3.5" />
        </button>
      </div>

      {/* Workspace switcher pill */}
      <div className="px-3 pt-4">
        <Link to="/settings" className="flex w-full items-center gap-2.5 rounded-lg border border-border/70 bg-surface px-2.5 py-2 text-left shadow-xs transition-colors hover:bg-secondary">
          <span className="grid h-6 w-6 place-items-center rounded-md text-[10px] font-bold text-white shadow-xs" style={{ background: "oklch(0.55 0.22 279)" }}>{wsInitial}</span>
          <div className="min-w-0 flex-1">
            <p className="truncate text-[12px] font-semibold text-foreground">{wsName}</p>
            <p className="truncate text-[10.5px] text-muted-foreground">Pro workspace</p>
          </div>
          <ChevronDown className="h-3.5 w-3.5 text-muted-foreground" />
        </Link>
      </div>

      {/* Nav */}
      <nav className="mt-4 flex-1 overflow-y-auto px-3">
        <p className="mb-1.5 px-2 text-[10px] font-semibold uppercase tracking-[0.14em] text-muted-foreground">Workspace</p>
        <ul className="space-y-0.5">
          {nav.map((item) => (
            <li key={item.label}>
              <Link
                to={item.href}
                className={`group flex items-center gap-2.5 rounded-lg px-2.5 py-1.5 text-[13px] font-medium transition-all ${
                  item.active
                    ? "bg-secondary text-foreground shadow-xs"
                    : "text-muted-foreground hover:bg-secondary/60 hover:text-foreground"
                }`}
              >
                <item.icon className={`h-4 w-4 ${item.active ? "text-primary" : ""}`} />
                <span className="flex-1">{item.label}</span>
                {item.badge && (
                  <span className={`rounded px-1.5 py-0.5 text-[10px] font-semibold ${
                    item.badge === "New"
                      ? "bg-gradient-primary text-white"
                      : "bg-white text-muted-foreground border border-border/70"
                  }`}>
                    {item.badge}
                  </span>
                )}
              </Link>
            </li>
          ))}
        </ul>

        <p className="mt-6 mb-1.5 px-2 text-[10px] font-semibold uppercase tracking-[0.14em] text-muted-foreground">Account</p>
        <ul className="space-y-0.5">
          {account.map((item) => (
            <li key={item.label}>
              <Link to={item.href} className="flex items-center gap-2.5 rounded-lg px-2.5 py-1.5 text-[13px] font-medium text-muted-foreground transition-colors hover:bg-secondary/60 hover:text-foreground">
                <item.icon className="h-4 w-4" />
                {item.label}
              </Link>
            </li>
          ))}
        </ul>
      </nav>

      {/* Upgrade card */}
      <div className="p-3">
        <div className="relative overflow-hidden rounded-xl border border-border/70 bg-gradient-to-br from-white to-secondary/60 p-3.5">
          <div className="pointer-events-none absolute -right-6 -top-6 h-20 w-20 rounded-full bg-primary/20 blur-2xl" />
          <div className="flex items-center gap-2">
            <span className="grid h-6 w-6 place-items-center rounded-md bg-gradient-primary text-white shadow-glow">
              <Sparkles className="h-3 w-3" />
            </span>
            <span className="text-[11.5px] font-semibold text-foreground">Zabaku Pro</span>
          </div>
          <p className="mt-2 text-[11px] leading-relaxed text-muted-foreground">Unlock unlimited AI requests and advanced analytics.</p>
          <button className="mt-2.5 w-full rounded-md bg-foreground py-1.5 text-[11px] font-semibold text-background transition-transform hover:scale-[1.02]">
            Upgrade
          </button>
        </div>
      </div>
    </aside>
  );
}

/* =========================== TOPBAR =========================== */
function Topbar({ user }: { user?: { name?: string } | null }) {
  const userName = user?.name ?? "User";
  const initials = userName.split(" ").map((n) => n[0]).join("").slice(0, 2).toUpperCase() || "U";
  const { data: unreadCount = 0 } = useUnreadNotifications();

  return (
    <header className="sticky top-0 z-30 flex h-14 items-center gap-3 border-b border-border/70 bg-background/70 px-4 backdrop-blur-xl lg:px-8">
      {/* Search */}
      <div className="flex min-w-0 flex-1 items-center gap-2">
        <div className="group flex h-9 w-full max-w-[420px] items-center gap-2 rounded-lg border border-border/70 bg-surface px-3 shadow-xs transition-colors focus-within:border-primary/60 focus-within:ring-4 focus-within:ring-primary/10">
          <Search className="h-4 w-4 text-muted-foreground" />
          <input
            placeholder="Search projects, tasks, docs…"
            className="min-w-0 flex-1 bg-transparent text-[13px] text-foreground outline-none placeholder:text-muted-foreground/70"
          />
          <kbd className="hidden items-center gap-0.5 rounded border border-border/70 bg-white px-1.5 py-0.5 text-[10px] font-medium text-muted-foreground sm:flex">
            <Command className="h-2.5 w-2.5" /> K
          </kbd>
        </div>
      </div>

      {/* AI Prompt */}
      <Link to="/ai" className="hidden h-9 items-center gap-2 rounded-lg border border-border/70 bg-gradient-to-r from-primary/8 to-accent/8 px-3 text-[12.5px] font-semibold text-foreground shadow-xs transition-all hover:from-primary/12 hover:to-accent/12 md:flex">
        <span className="grid h-5 w-5 place-items-center rounded-md bg-gradient-primary text-white">
          <Sparkles className="h-3 w-3" />
        </span>
        Ask AI
        <span className="text-muted-foreground">·</span>
        <span className="text-muted-foreground">Draft, plan, summarize</span>
      </Link>

      {/* Notifications */}
      <Link to="/notifications" className="relative grid h-9 w-9 place-items-center rounded-lg border border-border/70 bg-surface text-muted-foreground shadow-xs transition-colors hover:bg-secondary hover:text-foreground">
        <Bell className="h-4 w-4" />
        {unreadCount > 0 && (
          <span className="absolute -right-1 -top-1 inline-flex h-4 min-w-[16px] items-center justify-center rounded-full bg-rose-500 px-1 text-[9px] font-bold text-white ring-2 ring-background">
            {unreadCount}
          </span>
        )}
      </Link>

      {/* Profile */}
      <Link to="/profile" className="flex h-9 items-center gap-2 rounded-lg border border-border/70 bg-surface pl-1 pr-2.5 shadow-xs transition-colors hover:bg-secondary">
        <span className="grid h-7 w-7 place-items-center rounded-md text-[10.5px] font-semibold text-white" style={{ background: "oklch(0.55 0.22 279)" }}>{initials}</span>
        <span className="hidden text-[12.5px] font-semibold text-foreground sm:inline">{userName}</span>
        <ChevronDown className="hidden h-3.5 w-3.5 text-muted-foreground sm:inline" />
      </Link>
    </header>
  );
}

/* =========================== PAGE HEADER =========================== */
function PageHeader({ firstName, workspaceName }: { firstName: string; workspaceName: string }) {
  return (
    <div className="grid grid-cols-[minmax(0,1fr)_auto] items-end gap-4 sm:flex sm:flex-wrap sm:justify-between">
      <div className="min-w-0">
        <div className="flex items-center gap-2 text-[11.5px] font-medium text-muted-foreground">
          <span>Workspace</span>
          <ChevronRight className="h-3 w-3" />
          <span className="text-foreground">Dashboard</span>
        </div>
        <h1 className="mt-1 truncate text-[24px] font-semibold tracking-[-0.02em] text-foreground sm:text-[26px]">
          Good morning, {firstName}
        </h1>
        <p className="mt-0.5 text-[13px] text-muted-foreground">Here's what's happening across {workspaceName} today.</p>
      </div>
      <div className="flex shrink-0 items-center gap-2">
        <button className="flex h-9 items-center gap-1.5 rounded-lg border border-border/70 bg-surface px-3 text-[12.5px] font-semibold text-foreground shadow-xs hover:bg-secondary">
          <Filter className="h-3.5 w-3.5" />
          Last 30 days
          <ChevronDown className="h-3 w-3 text-muted-foreground" />
        </button>
        <Link to="/projects" className="flex h-9 items-center gap-1.5 rounded-lg bg-gradient-primary px-3 text-[12.5px] font-semibold text-white shadow-glow transition-transform hover:scale-[1.02]">
          <Plus className="h-3.5 w-3.5" />
          New project
        </Link>
      </div>
    </div>
  );
}

/* =========================== STAT CARDS =========================== */
function StatCards({
  dashboard,
  projectsCount,
}: {
  dashboard?: ApiDashboardData;
  projectsCount: number;
}) {
  const totalWorkspaces = dashboard?.totalWorkspaces ?? 1;
  const totalProjects = dashboard?.totalProjects ?? projectsCount;
  const totalTasks = dashboard?.totalTasks ?? 0;
  const completedTasks =
    dashboard?.completedTasks ?? dashboard?.shippedTasks ?? dashboard?.tasksByStatus?.done ?? 0;
  const completionRate =
    dashboard?.completionRate ?? (totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0);

  const cards = [
    {
      label: "Workspaces",
      value: String(totalWorkspaces),
      delta: "+1",
      up: true,
      hint: "active workspace",
      spark: [1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
      color: "oklch(0.68 0.16 320)",
    },
    {
      label: "Projects",
      value: String(totalProjects),
      delta: "+3",
      up: true,
      hint: "in flight",
      spark: [8, 10, 12, 11, 14, 16, 18, 20, 22, Math.max(1, totalProjects)],
      color: "oklch(0.55 0.22 279)",
    },
    {
      label: "Tasks",
      value: String(totalTasks),
      delta: "+18",
      up: true,
      hint: `${dashboard?.tasksByStatus?.in_progress ?? 0} in progress`,
      spark: [10, 15, 25, 30, 45, 60, 75, 90, 110, Math.max(1, totalTasks)],
      color: "oklch(0.72 0.16 180)",
    },
    {
      label: "Completed",
      value: String(completedTasks),
      delta: `${completionRate}%`,
      up: true,
      hint: "completion rate",
      spark: [5, 10, 15, 20, 30, 45, 60, 80, 100, Math.max(1, completedTasks)],
      color: "oklch(0.68 0.16 155)",
    },
  ];

  return (
    <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
      {cards.map((c) => (
        <div key={c.label} className="group relative overflow-hidden rounded-xl border border-border/70 bg-white p-4 shadow-xs transition-all hover:shadow-soft">
          <div className="flex items-center justify-between">
            <p className="text-[11.5px] font-semibold uppercase tracking-wider text-muted-foreground">{c.label}</p>
            <button className="grid h-6 w-6 place-items-center rounded-md text-muted-foreground opacity-0 transition-opacity hover:bg-secondary group-hover:opacity-100">
              <MoreHorizontal className="h-3.5 w-3.5" />
            </button>
          </div>
          <div className="mt-2 flex items-end justify-between gap-3">
            <div>
              <p className="text-[26px] font-semibold tracking-[-0.02em] text-foreground tabular-nums">{c.value}</p>
              <div className="mt-1 flex items-center gap-1.5">
                <span className={`flex items-center gap-0.5 rounded-md px-1.5 py-0.5 text-[10.5px] font-semibold ${
                  c.up ? "bg-success/12 text-success" : "bg-danger/12 text-danger"
                }`}>
                  {c.up ? <ArrowUpRight className="h-3 w-3" /> : <ArrowDownRight className="h-3 w-3" />}
                  {c.delta}
                </span>
                <span className="text-[10.5px] text-muted-foreground">{c.hint}</span>
              </div>
            </div>
            <Sparkline data={c.spark} color={c.color} />
          </div>
        </div>
      ))}
    </div>
  );
}

function Sparkline({ data, color }: { data: number[]; color: string }) {
  const w = 88, h = 34;
  const min = Math.min(...data), max = Math.max(...data);
  const pts = data.map((v, i) => {
    const x = (i / (data.length - 1)) * w;
    const y = h - ((v - min) / Math.max(1, max - min)) * h;
    return `${x.toFixed(1)},${y.toFixed(1)}`;
  });
  const line = `M ${pts.join(" L ")}`;
  const area = `${line} L ${w},${h} L 0,${h} Z`;
  const gid = `sg-${color.replace(/[^a-z0-9]/gi, "")}`;
  return (
    <svg width={w} height={h} viewBox={`0 0 ${w} ${h}`} className="shrink-0">
      <defs>
        <linearGradient id={gid} x1="0" x2="0" y1="0" y2="1">
          <stop offset="0%" stopColor={color} stopOpacity="0.28" />
          <stop offset="100%" stopColor={color} stopOpacity="0" />
        </linearGradient>
      </defs>
      <path d={area} fill={`url(#${gid})`} />
      <path d={line} fill="none" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

/* =========================== VELOCITY CHART =========================== */
function VelocityChart({ velocity }: { velocity?: ApiDashboardData["velocity"] }) {
  const weeks = velocity?.weeks ?? ["W1","W2","W3","W4","W5","W6","W7","W8","W9","W10","W11","W12"];
  const planned = velocity?.planned ?? [22, 28, 30, 26, 34, 38, 36, 42, 45, 48, 52, 58];
  const shipped = velocity?.shipped ?? [18, 24, 26, 24, 30, 32, 34, 40, 42, 44, 50, 55];
  const w = 640, h = 220, pad = 28;
  const max = Math.max(...planned, ...shipped, 64);
  const bw = (w - pad * 2) / Math.max(1, weeks.length);

  const line = (arr: number[]) =>
    "M " + arr.map((v, i) => {
      const x = pad + i * bw + bw / 2;
      const y = h - pad - (v / max) * (h - pad * 2);
      return `${x.toFixed(1)},${y.toFixed(1)}`;
    }).join(" L ");

  return (
    <section className="rounded-xl border border-border/70 bg-white p-5 shadow-xs">
      <div className="grid grid-cols-[minmax(0,1fr)_auto] items-start gap-4 sm:flex sm:flex-wrap sm:justify-between">
        <div className="min-w-0">
          <div className="flex items-center gap-2">
            <h2 className="text-[15px] font-semibold tracking-[-0.01em] text-foreground">Project velocity</h2>
            <span className="rounded bg-success/12 px-1.5 py-0.5 text-[10.5px] font-semibold text-success">
              +{velocity?.percentageChange ?? 23}%
            </span>
          </div>
          <p className="mt-0.5 text-[12px] text-muted-foreground">Story points shipped vs. planned · last {weeks.length} weeks</p>
        </div>
        <div className="flex items-center gap-3 text-[11.5px]">
          <span className="flex items-center gap-1.5 text-muted-foreground"><span className="h-2 w-2 rounded-sm bg-primary/25 ring-1 ring-primary/40" /> Planned</span>
          <span className="flex items-center gap-1.5 text-foreground"><span className="h-2 w-2 rounded-full bg-primary" /> Shipped</span>
          <button className="flex h-7 items-center gap-1 rounded-md border border-border/70 bg-surface px-2 text-[11px] font-medium text-muted-foreground hover:bg-secondary">
            12w <ChevronDown className="h-3 w-3" />
          </button>
        </div>
      </div>

      <div className="relative mt-4 w-full overflow-x-auto">
        <svg viewBox={`0 0 ${w} ${h}`} className="min-w-[520px] w-full">
          {/* grid */}
          {[0, 1, 2, 3, 4].map((i) => {
            const y = pad + i * ((h - pad * 2) / 4);
            return (
              <g key={i}>
                <line x1={pad} x2={w - pad} y1={y} y2={y} stroke="oklch(0.9 0.01 265)" strokeDasharray="2 4" />
                <text x={pad - 6} y={y + 3} textAnchor="end" fontSize="9.5" fill="oklch(0.55 0.02 265)">{Math.round(max - i * (max / 4))}</text>
              </g>
            );
          })}
          {/* planned bars */}
          {planned.map((v, i) => {
            const x = pad + i * bw + bw * 0.18;
            const bh = (v / max) * (h - pad * 2);
            const y = h - pad - bh;
            return <rect key={i} x={x} y={y} width={bw * 0.64} height={bh} rx={3} fill="oklch(0.55 0.22 279 / 0.14)" stroke="oklch(0.55 0.22 279 / 0.35)" />;
          })}
          {/* shipped line + area */}
          <defs>
            <linearGradient id="ship-grad" x1="0" x2="0" y1="0" y2="1">
              <stop offset="0%" stopColor="oklch(0.55 0.22 279)" stopOpacity="0.25" />
              <stop offset="100%" stopColor="oklch(0.55 0.22 279)" stopOpacity="0" />
            </linearGradient>
          </defs>
          <path d={`${line(shipped)} L ${w - pad},${h - pad} L ${pad + bw / 2},${h - pad} Z`} fill="url(#ship-grad)" />
          <path d={line(shipped)} fill="none" stroke="oklch(0.55 0.22 279)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          {shipped.map((v, i) => {
            const x = pad + i * bw + bw / 2;
            const y = h - pad - (v / max) * (h - pad * 2);
            return <circle key={i} cx={x} cy={y} r="3" fill="white" stroke="oklch(0.55 0.22 279)" strokeWidth="1.5" />;
          })}
          {/* x labels */}
          {weeks.map((wk, i) => (
            <text key={wk} x={pad + i * bw + bw / 2} y={h - 8} textAnchor="middle" fontSize="9.5" fill="oklch(0.55 0.02 265)">{wk}</text>
          ))}
        </svg>
      </div>
    </section>
  );
}

/* =========================== PROJECTS TABLE =========================== */
function ProjectsTable({
  dashboardProjects,
  rawProjects,
}: {
  dashboardProjects?: ApiDashboardRecentProject[];
  rawProjects: any[];
}) {
  const DEFAULT_ROWS = [
    { name: "Payments v2", key: "PAY-14", owner: "AK", ownerColor: "oklch(0.72 0.16 180)", status: "On track", statusTone: "success", progress: 78, due: "Aug 12" },
    { name: "Onboarding revamp", key: "ONB-08", owner: "MB", ownerColor: "oklch(0.75 0.16 92)", status: "At risk", statusTone: "warning", progress: 42, due: "Jul 30" },
    { name: "Mobile beta", key: "MOB-03", owner: "SR", ownerColor: "oklch(0.68 0.17 28)", status: "On track", statusTone: "success", progress: 61, due: "Sep 04" },
    { name: "Design system 3.0", key: "DS-22", owner: "JL", ownerColor: "oklch(0.55 0.22 279)", status: "In review", statusTone: "info", progress: 92, due: "Jul 28" },
    { name: "AI copilot rollout", key: "AI-01", owner: "PS", ownerColor: "oklch(0.62 0.19 30)", status: "Blocked", statusTone: "danger", progress: 28, due: "Aug 20" },
  ];

  let rows = DEFAULT_ROWS;

  if (dashboardProjects && dashboardProjects.length > 0) {
    rows = dashboardProjects.map((p, i) => ({
      name: p.name ?? "Project",
      key: p.key ?? `PRJ-${i + 1}`,
      owner: p.owner ?? "AK",
      ownerColor: p.ownerColor ?? "oklch(0.55 0.22 279)",
      status: p.status ?? "On track",
      statusTone: p.statusTone ?? "success",
      progress: p.progress ?? 0,
      due: p.due ?? p.dueDate ?? "–",
    }));
  } else if (rawProjects && rawProjects.length > 0) {
    rows = rawProjects.slice(0, 5).map((p: any, i: number) => ({
      name: p.name,
      key: p.key ?? `PRJ-${i + 1}`,
      owner: p.members?.[0]?.initials ?? "AK",
      ownerColor: p.color ?? "oklch(0.55 0.22 279)",
      status: p.status ?? "On track",
      statusTone: p.status === "At risk" ? "warning" : p.status === "Blocked" ? "danger" : p.status === "In review" ? "info" : "success",
      progress: p.progress ?? 0,
      due: p.dueDate ? new Date(p.dueDate).toLocaleDateString("en-US", { month: "short", day: "numeric" }) : "–",
    }));
  }

  const tone = (t: string) => ({
    success: "bg-success/12 text-success",
    warning: "bg-warning/12 text-warning",
    danger: "bg-danger/12 text-danger",
    info: "bg-accent/15 text-accent-foreground",
  } as Record<string, string>)[t] || "bg-secondary text-foreground";

  return (
    <section className="rounded-xl border border-border/70 bg-white shadow-xs">
      <div className="grid grid-cols-[minmax(0,1fr)_auto] items-center gap-3 border-b border-border/70 px-5 py-3.5 sm:flex sm:justify-between">
        <div className="min-w-0">
          <h2 className="text-[15px] font-semibold tracking-[-0.01em] text-foreground">Active projects</h2>
          <p className="mt-0.5 text-[12px] text-muted-foreground">{rows.length} in flight</p>
        </div>
        <div className="flex items-center gap-2">
          <Link to="/projects" className="hidden h-8 items-center gap-1.5 rounded-md border border-border/70 bg-surface px-2.5 text-[11.5px] font-medium text-muted-foreground hover:bg-secondary sm:flex">
            <Kanban className="h-3.5 w-3.5" /> Board
          </Link>
          <Link to="/projects" className="text-[12px] font-semibold text-primary hover:underline">View all →</Link>
        </div>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full min-w-[640px] text-left">
          <thead>
            <tr className="text-[10.5px] font-semibold uppercase tracking-wider text-muted-foreground">
              <th className="py-2.5 pl-5 pr-3 font-semibold">Project</th>
              <th className="py-2.5 px-3 font-semibold">Owner</th>
              <th className="py-2.5 px-3 font-semibold">Status</th>
              <th className="py-2.5 px-3 font-semibold">Progress</th>
              <th className="py-2.5 pl-3 pr-5 font-semibold">Due</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((r, i) => (
              <tr key={r.key ?? i} className="border-t border-border/50 text-[12.5px] transition-colors hover:bg-secondary/40">
                <td className="py-3 pl-5 pr-3">
                  <div className="flex items-center gap-2.5">
                    <span className="grid h-6 w-6 place-items-center rounded-md bg-secondary text-muted-foreground">
                      <GitBranch className="h-3.5 w-3.5" />
                    </span>
                    <div className="min-w-0">
                      <p className="truncate font-semibold text-foreground">{r.name}</p>
                      <p className="text-[10.5px] text-muted-foreground">{r.key}</p>
                    </div>
                  </div>
                </td>
                <td className="px-3 py-3">
                  <span className="grid h-6 w-6 place-items-center rounded-full text-[9.5px] font-semibold text-white" style={{ background: r.ownerColor }}>{r.owner}</span>
                </td>
                <td className="px-3 py-3">
                  <span className={`inline-flex items-center gap-1 rounded-md px-1.5 py-0.5 text-[10.5px] font-semibold ${tone(r.statusTone)}`}>
                    <span className="h-1.5 w-1.5 rounded-full bg-current" />
                    {r.status}
                  </span>
                </td>
                <td className="px-3 py-3">
                  <div className="flex items-center gap-2">
                    <div className="h-1.5 w-28 overflow-hidden rounded-full bg-secondary">
                      <div className="h-full rounded-full bg-gradient-primary" style={{ width: `${r.progress}%` }} />
                    </div>
                    <span className="text-[11px] font-medium tabular-nums text-muted-foreground">{r.progress}%</span>
                  </div>
                </td>
                <td className="pl-3 pr-5 py-3 text-[12px] text-muted-foreground tabular-nums">{r.due}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}

/* =========================== ACTIVITY FEED =========================== */
function ActivityFeed({ dashboardActivity }: { dashboardActivity?: ApiDashboardData["recentActivity"] }) {
  const DEFAULT_ITEMS = [
    { who: "Ada K.", color: "oklch(0.72 0.16 180)", initials: "AK", action: "shipped", target: "PAY-142 · Refund flow polish", time: "2m ago", icon: CheckCircle2, tone: "text-success" },
    { who: "Zabaku AI", color: "oklch(0.55 0.22 279)", initials: "AI", action: "generated 6 tickets in", target: "Onboarding revamp", time: "12m ago", icon: Sparkles, tone: "text-primary" },
    { who: "Mira B.", color: "oklch(0.75 0.16 92)", initials: "MB", action: "commented on", target: "DS-22 · Motion tokens", time: "34m ago", icon: MessageSquare, tone: "text-muted-foreground" },
    { who: "Sai R.", color: "oklch(0.68 0.17 28)", initials: "SR", action: "opened PR on", target: "MOB-03 · Push notifications", time: "1h ago", icon: GitBranch, tone: "text-muted-foreground" },
    { who: "Priya S.", color: "oklch(0.62 0.19 30)", initials: "PS", action: "merged", target: "AI-01 · Copilot guardrails", time: "3h ago", icon: CheckCircle2, tone: "text-success" },
  ];

  const items = dashboardActivity && dashboardActivity.length > 0
    ? dashboardActivity.map((it) => ({
        who: it.who ?? "Teammate",
        color: it.color ?? "oklch(0.55 0.22 279)",
        initials: it.initials ?? (it.who ? it.who.split(" ").map((n) => n[0]).join("").slice(0, 2).toUpperCase() : "U"),
        action: it.action ?? "updated",
        target: it.target ?? "task",
        time: it.time ?? "recently",
        icon: CheckCircle2,
        tone: "text-success",
      }))
    : DEFAULT_ITEMS;

  return (
    <section className="rounded-xl border border-border/70 bg-white shadow-xs">
      <div className="flex items-center justify-between border-b border-border/70 px-5 py-3.5">
        <div>
          <h2 className="text-[15px] font-semibold tracking-[-0.01em] text-foreground">Recent activity</h2>
          <p className="mt-0.5 text-[12px] text-muted-foreground">Live across your workspace</p>
        </div>
        <Link to="/tasks" className="text-[12px] font-semibold text-primary hover:underline">Open feed →</Link>
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

/* =========================== AI ASSISTANT =========================== */
function AiAssistant({ firstName }: { firstName: string }) {
  const [value, setValue] = useState("");
  const suggestions = ["Plan next sprint", "Summarize standup", "Draft release notes"];
  return (
    <section className="relative overflow-hidden rounded-xl border border-border/70 bg-white shadow-xs">
      <div className="pointer-events-none absolute -right-10 -top-10 h-40 w-40 rounded-full bg-primary/15 blur-3xl" />
      <div className="pointer-events-none absolute -left-10 -bottom-10 h-40 w-40 rounded-full bg-accent/15 blur-3xl" />
      <div className="relative p-5">
        <div className="flex items-center gap-2">
          <span className="grid h-7 w-7 place-items-center rounded-lg bg-gradient-primary text-white shadow-glow">
            <Bot className="h-3.5 w-3.5" />
          </span>
          <div className="min-w-0">
            <h2 className="text-[14px] font-semibold tracking-[-0.01em] text-foreground">AI Assistant</h2>
            <p className="text-[11px] text-muted-foreground">GPT-5.5 · workspace context</p>
          </div>
          <span className="ml-auto flex items-center gap-1 rounded-full bg-success/12 px-1.5 py-0.5 text-[10px] font-semibold text-success">
            <span className="h-1.5 w-1.5 rounded-full bg-success animate-pulse" /> Online
          </span>
        </div>

        <div className="mt-4 space-y-2">
          <div className="max-w-[90%] rounded-xl rounded-tl-md border border-border/60 bg-secondary/50 p-2.5 text-[12px] leading-relaxed text-foreground">
            Morning {firstName} — <span className="font-semibold">3 tickets are in review</span> and active projects are on track. Want me to draft standup notes?
          </div>
          <div className="ml-auto max-w-[80%] rounded-xl rounded-tr-md bg-gradient-primary p-2.5 text-[12px] text-white">
            Yes — plus a summary of this week's velocity.
          </div>
        </div>

        <div className="mt-4 flex flex-wrap gap-1.5">
          {suggestions.map((s) => (
            <button key={s} className="rounded-full border border-border/70 bg-surface px-2.5 py-1 text-[11px] font-medium text-foreground transition-colors hover:bg-secondary">
              {s}
            </button>
          ))}
        </div>

        <div className="mt-3 flex items-center gap-2 rounded-xl border border-border/70 bg-surface p-1.5 shadow-xs focus-within:border-primary/60 focus-within:ring-4 focus-within:ring-primary/10">
          <input
            value={value}
            onChange={(e) => setValue(e.target.value)}
            placeholder="Ask AI anything…"
            className="min-w-0 flex-1 bg-transparent px-2 py-1.5 text-[12.5px] text-foreground outline-none placeholder:text-muted-foreground/70"
          />
          <button className="grid h-7 w-7 place-items-center rounded-lg bg-gradient-primary text-white shadow-glow">
            <Send className="h-3.5 w-3.5" />
          </button>
        </div>
      </div>
    </section>
  );
}

/* =========================== QUICK ACTIONS =========================== */
function QuickActions() {
  const actions = [
    { icon: Plus, label: "New project", href: "/projects", tone: "from-primary/12 to-primary/4 text-primary" },
    { icon: CheckSquare, label: "Add task", href: "/tasks", tone: "from-accent/15 to-accent/5 text-accent-foreground" },
    { icon: FileText, label: "New doc", href: "#", tone: "from-success/15 to-success/5 text-success" },
    { icon: Rocket, label: "Ship release", href: "#", tone: "from-warning/15 to-warning/5 text-warning" },
    { icon: PlayCircle, label: "Start standup", href: "#", tone: "from-danger/12 to-danger/4 text-danger" },
    { icon: Inbox, label: "Triage inbox", href: "/notifications", tone: "from-secondary to-secondary text-foreground" },
  ];
  return (
    <section className="rounded-xl border border-border/70 bg-white p-5 shadow-xs">
      <div className="flex items-center justify-between">
        <h2 className="text-[14px] font-semibold tracking-[-0.01em] text-foreground">Quick actions</h2>
        <button className="grid h-6 w-6 place-items-center rounded-md text-muted-foreground hover:bg-secondary">
          <HelpCircle className="h-3.5 w-3.5" />
        </button>
      </div>
      <div className="mt-3 grid grid-cols-3 gap-2">
        {actions.map((a) => (
          <Link
            key={a.label}
            to={a.href}
            className={`group flex flex-col items-start gap-2 rounded-lg border border-border/70 bg-gradient-to-br ${a.tone} p-2.5 text-left transition-all hover:-translate-y-0.5 hover:shadow-soft`}
          >
            <a.icon className="h-4 w-4" />
            <span className="text-[11px] font-semibold text-foreground">{a.label}</span>
          </Link>
        ))}
      </div>
    </section>
  );
}

/* =========================== CALENDAR =========================== */
function CalendarCard() {
  const now = new Date();
  const year = now.getFullYear();
  const month = now.getMonth();
  const monthLabel = now.toLocaleDateString("en-US", { month: "long", year: "numeric" });
  const firstDay = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const today = now.getDate();
  const days = Array.from({ length: 35 }, (_, i) => i - firstDay + 1);

  return (
    <section className="rounded-xl border border-border/70 bg-white p-5 shadow-xs">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <CalendarIcon className="h-4 w-4 text-primary" />
          <h2 className="text-[14px] font-semibold tracking-[-0.01em] text-foreground">{monthLabel}</h2>
        </div>
        <div className="flex items-center gap-1">
          <button className="grid h-6 w-6 place-items-center rounded-md text-muted-foreground hover:bg-secondary"><ChevronLeft className="h-3.5 w-3.5" /></button>
          <button className="grid h-6 w-6 place-items-center rounded-md text-muted-foreground hover:bg-secondary"><ChevronRight className="h-3.5 w-3.5" /></button>
        </div>
      </div>

      <div className="mt-3 grid grid-cols-7 gap-y-1 text-center text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
        {["S","M","T","W","T","F","S"].map((d, i) => <div key={i}>{d}</div>)}
      </div>
      <div className="mt-1 grid grid-cols-7 gap-1">
        {days.map((d, i) => {
          const valid = d >= 1 && d <= daysInMonth;
          const isToday = d === today;
          return (
            <button
              key={i}
              className={`relative aspect-square rounded-md text-[11px] font-medium transition-all ${
                !valid ? "text-transparent" :
                isToday ? "bg-gradient-primary text-white shadow-glow" :
                "text-foreground hover:bg-secondary"
              }`}
            >
              {valid ? d : "0"}
            </button>
          );
        })}
      </div>
    </section>
  );
}

/* =========================== NOTIFICATIONS =========================== */
function NotificationsCard() {
  const items = [
    { icon: MessageSquare, tone: "bg-primary/12 text-primary", title: "Ada mentioned you", meta: "PAY-142 · 5m ago" },
    { icon: CheckCircle2, tone: "bg-success/15 text-success", title: "PR merged: guardrails", meta: "AI-01 · 22m ago" },
    { icon: Zap, tone: "bg-warning/15 text-warning", title: "Deploy needs approval", meta: "prod · 1h ago" },
    { icon: TrendingUp, tone: "bg-accent/15 text-accent-foreground", title: "Velocity up 23%", meta: "Weekly digest" },
  ];
  return (
    <section className="rounded-xl border border-border/70 bg-white shadow-xs">
      <div className="flex items-center justify-between border-b border-border/70 px-5 py-3.5">
        <div className="flex items-center gap-2">
          <h2 className="text-[14px] font-semibold tracking-[-0.01em] text-foreground">Notifications</h2>
          <span className="rounded bg-danger/12 px-1.5 py-0.5 text-[10px] font-semibold text-danger">3 new</span>
        </div>
        <button className="text-[11.5px] font-semibold text-muted-foreground hover:text-foreground">Mark all read</button>
      </div>
      <ul className="divide-y divide-border/50">
        {items.map((n, i) => (
          <li key={i} className="flex items-center gap-3 px-5 py-3">
            <span className={`grid h-8 w-8 shrink-0 place-items-center rounded-lg ${n.tone}`}>
              <n.icon className="h-4 w-4" />
            </span>
            <div className="min-w-0 flex-1">
              <p className="truncate text-[12.5px] font-semibold text-foreground">{n.title}</p>
              <p className="text-[11px] text-muted-foreground">{n.meta}</p>
            </div>
            <Circle className="h-2 w-2 fill-primary text-primary" />
          </li>
        ))}
      </ul>
      <div className="border-t border-border/70 px-5 py-2.5 text-center">
        <Link to="/notifications" className="text-[12px] font-semibold text-primary hover:underline">View all notifications</Link>
      </div>
    </section>
  );
}
