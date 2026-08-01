import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import {
  Bell,
  CheckCheck,
  Search,
  Filter,
  MessageSquare,
  GitPullRequest,
  UserPlus,
  Sparkles,
  CheckCircle2,
  AlertTriangle,
  Calendar,
  AtSign,
  Star,
  Archive,
  Trash2,
  Settings,
  ChevronDown,
  MoreHorizontal,
  ArrowUpRight,
  Zap,
  FileText,
  Loader2,
  RefreshCw,
  AlertCircle,
} from "lucide-react";

import { requireAuth } from "@/lib/requireAuth";
import { ProtectedRoute } from "@/components/auth/ProtectedRoute";
import {
  useNotifications,
  useUnreadNotifications,
  useMarkNotificationAsRead,
} from "@/features/notifications/hooks";
import type { ApiNotification } from "@/features/notifications/api";

export const Route = createFileRoute("/notifications")({
  head: () => ({
    meta: [
      { title: "Notifications · Zabaku" },
      {
        name: "description",
        content:
          "One inbox for mentions, reviews, AI updates, and project activity — grouped by day, beautifully organized.",
      },
      { property: "og:title", content: "Notifications · Zabaku" },
      {
        property: "og:description",
        content:
          "Everything happening across your Zabaku workspace, grouped by day and easy to triage.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  beforeLoad: requireAuth,
  component: () => (
    <ProtectedRoute>
      <NotificationsPage />
    </ProtectedRoute>
  ),
});

/* ------------------------------- data ------------------------------- */

type Kind =
  | "mention"
  | "review"
  | "comment"
  | "invite"
  | "ai"
  | "success"
  | "warning"
  | "event"
  | "doc";

type Group = "Today" | "Yesterday" | "This Week" | "Earlier";

type Notification = {
  id: string;
  group: Group;
  kind: Kind;
  actor: { name: string; hue: number };
  title: string;
  body: string;
  project?: string;
  time: string;
  read: boolean;
  starred?: boolean;
  actions?: { primary?: string; secondary?: string };
  entityRef?: {
    type?: string;
    id?: string;
    projectId?: string;
    taskId?: string;
    url?: string;
  };
};

const DEFAULT_NOTIFS: Notification[] = [
  {
    id: "n1",
    group: "Today",
    kind: "mention",
    actor: { name: "Priya Sharma", hue: 320 },
    title: "mentioned you in Zabaku 2.0 launch plan",
    body: "@elena can you review the risks section before we send this to leadership? I updated the milestone dates.",
    project: "Zabaku 2.0",
    time: "2 min ago",
    read: false,
    actions: { primary: "Reply", secondary: "Open doc" },
    entityRef: { taskId: "1" },
  },
  {
    id: "n2",
    group: "Today",
    kind: "review",
    actor: { name: "Marco Bianchi", hue: 210 },
    title: "requested your review on PR #482",
    body: "Invoice PDF renderer — 24 files changed, 812 additions, 96 deletions.",
    project: "Billing v2",
    time: "18 min ago",
    read: false,
    actions: { primary: "Review", secondary: "View diff" },
    entityRef: { projectId: "1" },
  },
  {
    id: "n3",
    group: "Today",
    kind: "ai",
    actor: { name: "Zabaku AI", hue: 268 },
    title: "generated a sprint plan for Billing squad",
    body: "72 story points across 5 engineers — includes reconciliation, PDF renderer, and retry ladder.",
    project: "Billing v2",
    time: "42 min ago",
    read: false,
    starred: true,
    actions: { primary: "Open result" },
  },
  {
    id: "n4",
    group: "Today",
    kind: "success",
    actor: { name: "Kai Nakamura", hue: 150 },
    title: "shipped Dashboard redesign v2",
    body: "Rolled out to 100% of workspaces at 9:14 AM — no incidents reported.",
    project: "Zabaku 2.0",
    time: "1 h ago",
    read: true,
  },
  {
    id: "n5",
    group: "Today",
    kind: "invite",
    actor: { name: "Elena Rodríguez", hue: 268 },
    title: "invited 3 teammates to Northwind",
    body: "jules@acme.co, maya@northwind.io, ben@lumen.dev — 2 accepted, 1 pending.",
    time: "3 h ago",
    read: true,
  },
  {
    id: "n6",
    group: "Yesterday",
    kind: "comment",
    actor: { name: "Ana Costa", hue: 25 },
    title: "commented on OAuth login task",
    body: "Nice work on the PKCE flow — one small concern about how we handle the canceled state on Safari.",
    project: "Auth",
    time: "Yesterday, 4:12 PM",
    read: true,
    actions: { primary: "Reply" },
  },
  {
    id: "n7",
    group: "Yesterday",
    kind: "warning",
    actor: { name: "Zabaku", hue: 20 },
    title: "Deploy #218 warning",
    body: "Bundle size grew by 8.4% on the /dashboard route. Threshold: 5%.",
    project: "Zabaku 2.0",
    time: "Yesterday, 2:03 PM",
    read: false,
    actions: { primary: "Investigate" },
  },
];

const KIND_META: Record<
  Kind,
  { icon: typeof MessageSquare; tint: string; label: string }
> = {
  mention: { icon: AtSign, tint: "text-primary bg-primary/10", label: "Mention" },
  review: {
    icon: GitPullRequest,
    tint: "text-emerald-700 bg-emerald-50",
    label: "Review",
  },
  comment: { icon: MessageSquare, tint: "text-sky-700 bg-orange-50", label: "Comment" },
  invite: { icon: UserPlus, tint: "text-rose-700 bg-rose-50", label: "Invite" },
  ai: { icon: Sparkles, tint: "text-orange-700 bg-orange-50", label: "AI" },
  success: {
    icon: CheckCircle2,
    tint: "text-emerald-700 bg-emerald-50",
    label: "Shipped",
  },
  warning: {
    icon: AlertTriangle,
    tint: "text-amber-700 bg-amber-50",
    label: "Warning",
  },
  event: { icon: Calendar, tint: "text-amber-700 bg-amber-50", label: "Event" },
  doc: { icon: FileText, tint: "text-amber-700 bg-amber-50", label: "Doc" },
};

const FILTERS = [
  { id: "all", label: "All" },
  { id: "unread", label: "Unread" },
  { id: "mention", label: "Mentions" },
  { id: "review", label: "Reviews" },
  { id: "ai", label: "AI" },
  { id: "starred", label: "Starred" },
] as const;
type FilterId = (typeof FILTERS)[number]["id"];

/* ------------------------------ helpers ----------------------------- */

function deriveHue(name?: string): number {
  if (!name) return 210;
  let hash = 0;
  for (let i = 0; i < name.length; i++) {
    hash = name.charCodeAt(i) + ((hash << 5) - hash);
  }
  return Math.abs(hash % 360);
}

function deriveGroup(iso?: string, fallbackGroup?: string): Group {
  if (fallbackGroup && ["Today", "Yesterday", "This Week", "Earlier"].includes(fallbackGroup)) {
    return fallbackGroup as Group;
  }
  if (!iso) return "Today";
  const date = new Date(iso);
  if (isNaN(date.getTime())) return "Today";
  const diffDays = Math.floor((Date.now() - date.getTime()) / 86_400_000);
  if (diffDays < 1) return "Today";
  if (diffDays < 2) return "Yesterday";
  if (diffDays < 7) return "This Week";
  return "Earlier";
}

function formatTimeAgo(iso?: string, timeStr?: string): string {
  if (timeStr) return timeStr;
  if (!iso) return "just now";
  const date = new Date(iso);
  if (isNaN(date.getTime())) return iso;
  const diffSec = Math.floor((Date.now() - date.getTime()) / 1000);
  if (diffSec < 60) return "just now";
  const mins = Math.floor(diffSec / 60);
  if (mins < 60) return `${mins} min ago`;
  const hours = Math.floor(mins / 60);
  if (hours < 24) return `${hours} h ago`;
  const days = Math.floor(hours / 24);
  if (days < 7) return `${days} d ago`;
  return date.toLocaleDateString("en-US", { month: "short", day: "numeric" });
}

function normaliseNotification(n: ApiNotification, idx: number): Notification {
  const id = n._id ?? n.id ?? `n-${idx}`;
  const actorName = n.actor?.name ?? "Teammate";
  const hue = n.actor?.hue ?? deriveHue(actorName);
  const read = n.read ?? n.isRead ?? false;
  const rawKind = (n.kind ?? "mention").toLowerCase() as Kind;

  return {
    id,
    group: deriveGroup(n.createdAt, n.group),
    kind: KIND_META[rawKind] ? rawKind : "mention",
    actor: { name: actorName, hue },
    title: n.title,
    body: n.body ?? n.message ?? n.description ?? "",
    project: n.project ?? n.projectName,
    time: formatTimeAgo(n.createdAt, n.time),
    read,
    starred: n.starred,
    actions: n.actions,
    entityRef: n.entityRef ?? {
      projectId: n.projectId,
      taskId: n.taskId,
      url: n.targetUrl ?? n.link,
    },
  };
}

function initials(name: string) {
  return name
    .split(" ")
    .map((n) => n[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();
}

function Avatar({
  name,
  hue,
  size = 36,
  brand,
}: {
  name: string;
  hue: number;
  size?: number;
  brand?: boolean;
}) {
  if (brand) {
    return (
      <span
        className="inline-flex shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-primary to-accent text-white shadow-sm"
        style={{ width: size, height: size }}
      >
        <Sparkles className="h-4 w-4" />
      </span>
    );
  }
  return (
    <span
      className="inline-flex shrink-0 items-center justify-center rounded-full font-semibold text-white"
      style={{
        width: size,
        height: size,
        fontSize: Math.round(size * 0.36),
        background: `linear-gradient(135deg, oklch(0.72 0.16 ${hue}), oklch(0.5 0.2 ${
          (hue + 40) % 360
        }))`,
      }}
    >
      {initials(name)}
    </span>
  );
}

/* -------------------------------- page ------------------------------- */

function NotificationsPage() {
  const navigate = useNavigate();
  const { data: rawNotifs = [], isLoading, isError, error, refetch } = useNotifications();
  const { data: serverUnreadCount } = useUnreadNotifications();
  const markAsReadMutation = useMarkNotificationAsRead();

  const [filter, setFilter] = useState<FilterId>("all");
  const [query, setQuery] = useState("");
  const [localStars, setLocalStars] = useState<Record<string, boolean>>({});
  const [localRemoved, setLocalRemoved] = useState<Set<string>>(new Set());

  // Normalise backend notifications with fallback
  const items = useMemo<Notification[]>(() => {
    const list = rawNotifs.length > 0
      ? rawNotifs.map((n, i) => normaliseNotification(n, i))
      : DEFAULT_NOTIFS;

    return list
      .filter((n) => !localRemoved.has(n.id))
      .map((n) => (localStars[n.id] !== undefined ? { ...n, starred: localStars[n.id] } : n));
  }, [rawNotifs, localRemoved, localStars]);

  const unreadCount = serverUnreadCount ?? items.filter((n) => !n.read).length;

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return items.filter((n) => {
      if (filter === "unread" && n.read) return false;
      if (filter === "starred" && !n.starred) return false;
      if (filter !== "all" && filter !== "unread" && filter !== "starred") {
        if (n.kind !== filter) return false;
      }
      if (
        q &&
        !`${n.title} ${n.body} ${n.actor.name} ${n.project ?? ""}`
          .toLowerCase()
          .includes(q)
      )
        return false;
      return true;
    });
  }, [items, filter, query]);

  const groups: Group[] = ["Today", "Yesterday", "This Week", "Earlier"];
  const byGroup = groups
    .map((g) => ({ group: g, list: filtered.filter((n) => n.group === g) }))
    .filter((g) => g.list.length > 0);

  function markAllRead() {
    items.filter((n) => !n.read).forEach((n) => {
      markAsReadMutation.mutate(n.id);
    });
  }

  function toggleRead(id: string) {
    const item = items.find((n) => n.id === id);
    if (item && !item.read) {
      markAsReadMutation.mutate(id);
    }
  }

  function toggleStar(id: string) {
    setLocalStars((prev) => ({ ...prev, [id]: !prev[id] }));
  }

  function remove(id: string) {
    setLocalRemoved((prev) => new Set(prev).add(id));
  }

  function handleCardClick(n: Notification) {
    if (!n.read) {
      markAsReadMutation.mutate(n.id);
    }

    if (n.entityRef?.taskId) {
      navigate({ to: "/tasks" });
    } else if (n.entityRef?.projectId) {
      navigate({ to: "/projects" });
    } else if (n.entityRef?.url) {
      if (n.entityRef.url.startsWith("/")) {
        navigate({ to: n.entityRef.url as any });
      } else {
        window.open(n.entityRef.url, "_blank");
      }
    }
  }

  return (
    <div className="relative min-h-screen bg-background text-foreground">
      <div className="pointer-events-none absolute inset-0 -z-10 overflow-hidden">
        <div className="absolute -top-40 left-1/3 h-[440px] w-[720px] rounded-full bg-primary/12 blur-3xl" />
        <div className="absolute right-[-140px] top-40 h-[340px] w-[520px] rounded-full bg-accent/15 blur-3xl" />
      </div>

      <div className="mx-auto max-w-[1200px] px-6 py-8">
        {/* header */}
        <header className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
          <div className="flex items-start gap-4">
            <div className="relative flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-primary to-accent text-white shadow-lg shadow-primary/25">
              <Bell className="h-5 w-5" />
              {unreadCount > 0 ? (
                <span className="absolute -right-1 -top-1 inline-flex h-5 min-w-[20px] items-center justify-center rounded-full bg-rose-500 px-1 text-[10px] font-bold text-white ring-2 ring-background">
                  {unreadCount}
                </span>
              ) : null}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-3xl font-semibold tracking-tight sm:text-[32px]">
                  Notifications
                </h1>
                {unreadCount > 0 ? (
                  <span className="inline-flex items-center gap-1 rounded-full bg-primary/10 px-2 py-0.5 text-[11px] font-semibold text-primary">
                    <span className="h-1.5 w-1.5 rounded-full bg-primary" />
                    {unreadCount} unread
                  </span>
                ) : null}
              </div>
              <p className="mt-1 text-sm text-muted-foreground">
                Everything happening across your workspace — grouped by day.
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <div className="relative">
              <Search className="pointer-events-none absolute left-2.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search notifications"
                className="h-9 w-64 rounded-lg border border-border/70 bg-surface pl-8 pr-3 text-sm placeholder:text-muted-foreground/70 focus:border-primary/40 focus:outline-none"
              />
            </div>
            <button className="inline-flex items-center gap-1.5 rounded-lg border border-border/70 bg-surface px-3 py-1.5 text-sm text-foreground/80 hover:border-primary/40">
              <Filter className="h-3.5 w-3.5" />
              Filters
              <ChevronDown className="h-3.5 w-3.5 text-muted-foreground" />
            </button>
            <button
              onClick={markAllRead}
              disabled={unreadCount === 0 || markAsReadMutation.isPending}
              className="inline-flex items-center gap-1.5 rounded-lg bg-gradient-to-r from-primary to-accent px-3.5 py-1.5 text-sm font-semibold text-white shadow-md shadow-primary/25 transition hover:shadow-primary/40 disabled:opacity-40 disabled:shadow-none"
            >
              {markAsReadMutation.isPending ? (
                <Loader2 className="h-3.5 w-3.5 animate-spin" />
              ) : (
                <CheckCheck className="h-3.5 w-3.5" />
              )}
              Mark all as read
            </button>
            <button className="rounded-lg border border-border/70 bg-surface p-2 text-muted-foreground hover:border-primary/40 hover:text-foreground">
              <Settings className="h-4 w-4" />
            </button>
          </div>
        </header>

        {/* Error banner */}
        {isError && (
          <div className="mt-6 flex items-center justify-between rounded-xl border border-destructive/30 bg-destructive/10 px-4 py-3 text-[12.5px] text-destructive">
            <div className="flex items-center gap-2 font-medium">
              <AlertCircle className="h-4 w-4 shrink-0" />
              <span>{error instanceof Error ? error.message : "Failed to load notifications."}</span>
            </div>
            <button
              onClick={() => refetch()}
              className="flex items-center gap-1 rounded-md bg-destructive px-3 py-1 text-[11.5px] font-semibold text-white hover:opacity-90"
            >
              <RefreshCw className="h-3 w-3" /> Retry
            </button>
          </div>
        )}

        {/* filter chips */}
        <div className="mt-6 flex flex-wrap items-center gap-1.5 rounded-2xl border border-border/70 bg-surface/70 p-1.5 backdrop-blur">
          {FILTERS.map((f) => {
            const count =
              f.id === "all"
                ? items.length
                : f.id === "unread"
                  ? unreadCount
                  : f.id === "starred"
                    ? items.filter((n) => n.starred).length
                    : items.filter((n) => n.kind === f.id).length;
            const active = filter === f.id;
            return (
              <button
                key={f.id}
                onClick={() => setFilter(f.id)}
                className={`inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-medium transition ${
                  active
                    ? "bg-foreground text-background shadow-sm"
                    : "text-muted-foreground hover:bg-surface hover:text-foreground"
                }`}
              >
                {f.label}
                <span
                  className={`inline-flex h-4 min-w-[16px] items-center justify-center rounded-full px-1 text-[10px] font-semibold ${
                    active
                      ? "bg-white/20 text-background"
                      : "bg-surface-muted text-muted-foreground"
                  }`}
                >
                  {count}
                </span>
              </button>
            );
          })}
        </div>

        {/* groups */}
        <section className="mt-8 space-y-8">
          {isLoading ? (
            <NotificationSkeleton />
          ) : byGroup.length === 0 ? (
            <EmptyState />
          ) : (
            byGroup.map((g) => (
              <GroupSection
                key={g.group}
                group={g.group}
                list={g.list}
                onToggleRead={toggleRead}
                onToggleStar={toggleStar}
                onRemove={remove}
                onCardClick={handleCardClick}
              />
            ))
          )}
        </section>

        {/* footer */}
        <footer className="mt-10 flex flex-col items-center justify-between gap-3 rounded-2xl border border-border/70 bg-surface p-4 text-xs text-muted-foreground sm:flex-row">
          <div className="inline-flex items-center gap-2">
            <Zap className="h-3.5 w-3.5 text-primary" />
            Real-time updates on · notifications also appear in your email digest
          </div>
          <a className="inline-flex items-center gap-1 font-medium text-primary hover:underline">
            Manage preferences <ArrowUpRight className="h-3 w-3" />
          </a>
        </footer>
      </div>
    </div>
  );
}

/* --------------------------- skeleton --------------------------- */

function NotificationSkeleton() {
  return (
    <div className="space-y-4">
      {[1, 2, 3, 4].map((i) => (
        <div key={i} className="h-20 rounded-2xl border border-border/60 bg-surface p-4 animate-pulse flex items-center gap-4">
          <div className="h-10 w-10 rounded-full bg-secondary/80 shrink-0" />
          <div className="flex-1 space-y-2">
            <div className="h-3.5 w-1/3 rounded bg-secondary/80" />
            <div className="h-3 w-2/3 rounded bg-secondary/60" />
          </div>
        </div>
      ))}
    </div>
  );
}

/* --------------------------- group section --------------------------- */

function GroupSection({
  group,
  list,
  onToggleRead,
  onToggleStar,
  onRemove,
  onCardClick,
}: {
  group: Group;
  list: Notification[];
  onToggleRead: (id: string) => void;
  onToggleStar: (id: string) => void;
  onRemove: (id: string) => void;
  onCardClick: (n: Notification) => void;
}) {
  const unread = list.filter((n) => !n.read).length;
  return (
    <div>
      <div className="sticky top-0 z-10 -mx-2 mb-3 flex items-center gap-3 bg-background/70 px-2 py-1.5 backdrop-blur">
        <h2 className="text-[11px] font-semibold uppercase tracking-[0.14em] text-muted-foreground">
          {group}
        </h2>
        <span className="h-px flex-1 bg-border/60" />
        <span className="text-[11px] text-muted-foreground">
          {list.length} {list.length === 1 ? "item" : "items"}
          {unread > 0 ? (
            <>
              {" · "}
              <span className="font-semibold text-primary">{unread} new</span>
            </>
          ) : null}
        </span>
      </div>
      <ul className="space-y-2">
        {list.map((n) => (
          <NotificationCard
            key={n.id}
            n={n}
            onToggleRead={onToggleRead}
            onToggleStar={onToggleStar}
            onRemove={onRemove}
            onCardClick={onCardClick}
          />
        ))}
      </ul>
    </div>
  );
}

/* --------------------------- notif card ----------------------------- */

function NotificationCard({
  n,
  onToggleRead,
  onToggleStar,
  onRemove,
  onCardClick,
}: {
  n: Notification;
  onToggleRead: (id: string) => void;
  onToggleStar: (id: string) => void;
  onRemove: (id: string) => void;
  onCardClick: (n: Notification) => void;
}) {
  const meta = KIND_META[n.kind];
  const Icon = meta.icon;
  const isBrand = n.actor.name === "Zabaku AI" || n.actor.name === "Zabaku";

  return (
    <li
      onClick={() => onCardClick(n)}
      className={`group relative cursor-pointer overflow-hidden rounded-2xl border transition ${
        n.read
          ? "border-border/60 bg-surface"
          : "border-primary/30 bg-gradient-to-r from-primary/[0.04] to-accent/[0.04] shadow-sm"
      } hover:-translate-y-0.5 hover:border-primary/40 hover:shadow-md`}
    >
      {!n.read ? (
        <span className="absolute inset-y-0 left-0 w-[3px] bg-gradient-to-b from-primary to-accent" />
      ) : null}

      <div className="flex items-start gap-4 px-4 py-4 sm:px-5">
        {/* avatar + kind badge */}
        <div className="relative">
          <Avatar name={n.actor.name} hue={n.actor.hue} brand={isBrand} size={40} />
          <span
            className={`absolute -bottom-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full ring-2 ring-surface ${meta.tint}`}
          >
            <Icon className="h-2.5 w-2.5" />
          </span>
        </div>

        {/* content */}
        <div className="min-w-0 flex-1">
          <div className="flex items-start justify-between gap-3">
            <div className="min-w-0">
              <div className="flex flex-wrap items-center gap-x-1.5 gap-y-1 text-[13px] leading-5">
                {!n.read ? (
                  <span className="mr-0.5 inline-block h-1.5 w-1.5 rounded-full bg-primary" />
                ) : null}
                <span className="font-semibold">{n.actor.name}</span>
                <span className="text-foreground/85">{n.title}</span>
                {n.project ? (
                  <span className="ml-1 inline-flex items-center gap-1 rounded-md bg-surface-muted px-1.5 py-0.5 text-[11px] font-medium text-foreground/70">
                    <span
                      className="h-1.5 w-1.5 rounded-full"
                      style={{
                        background: `oklch(0.6 0.2 ${n.actor.hue})`,
                      }}
                    />
                    {n.project}
                  </span>
                ) : null}
              </div>
              <p className="mt-1 line-clamp-2 text-[13px] leading-5 text-muted-foreground">
                {n.body}
              </p>
              <div className="mt-2 flex flex-wrap items-center gap-2">
                <span className="inline-flex items-center gap-1 text-[11px] text-muted-foreground">
                  <span className={`inline-flex h-4 items-center gap-1 rounded-full px-1.5 text-[10px] font-semibold ${meta.tint}`}>
                    <Icon className="h-2.5 w-2.5" />
                    {meta.label}
                  </span>
                </span>
                <span className="text-[11px] text-muted-foreground">{n.time}</span>

                {n.actions?.primary ? (
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onCardClick(n);
                    }}
                    className="ml-1 inline-flex items-center gap-1 rounded-md bg-foreground px-2.5 py-1 text-[11px] font-semibold text-background transition hover:opacity-90"
                  >
                    {n.actions.primary}
                    <ArrowUpRight className="h-3 w-3" />
                  </button>
                ) : null}
                {n.actions?.secondary ? (
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                    }}
                    className="inline-flex items-center gap-1 rounded-md border border-border/70 bg-surface px-2.5 py-1 text-[11px] font-medium hover:border-primary/40"
                  >
                    {n.actions.secondary}
                  </button>
                ) : null}
              </div>
            </div>

            {/* row actions */}
            <div className="flex items-center gap-0.5 opacity-0 transition group-hover:opacity-100" onClick={(e) => e.stopPropagation()}>
              <IconAction
                title={n.starred ? "Unstar" : "Star"}
                onClick={() => onToggleStar(n.id)}
              >
                <Star
                  className={`h-3.5 w-3.5 ${
                    n.starred ? "fill-amber-400 text-amber-500" : ""
                  }`}
                />
              </IconAction>
              <IconAction
                title={n.read ? "Mark as unread" : "Mark as read"}
                onClick={() => onToggleRead(n.id)}
              >
                <CheckCheck className="h-3.5 w-3.5" />
              </IconAction>
              <IconAction title="Archive" onClick={() => onRemove(n.id)}>
                <Archive className="h-3.5 w-3.5" />
              </IconAction>
              <IconAction title="Delete" onClick={() => onRemove(n.id)}>
                <Trash2 className="h-3.5 w-3.5" />
              </IconAction>
              <IconAction title="More">
                <MoreHorizontal className="h-3.5 w-3.5" />
              </IconAction>
            </div>
          </div>
        </div>
      </div>
    </li>
  );
}

function IconAction({
  children,
  title,
  onClick,
}: {
  children: React.ReactNode;
  title: string;
  onClick?: () => void;
}) {
  return (
    <button
      title={title}
      onClick={(e) => {
        e.stopPropagation();
        onClick?.();
      }}
      className="inline-flex h-7 w-7 items-center justify-center rounded-md text-muted-foreground transition hover:bg-surface-muted hover:text-foreground"
    >
      {children}
    </button>
  );
}

function EmptyState() {
  return (
    <div className="rounded-2xl border border-dashed border-border/70 bg-surface/40 p-14 text-center">
      <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-primary/15 to-accent/15 text-primary">
        <CheckCheck className="h-5 w-5" />
      </div>
      <h3 className="mt-3 text-base font-semibold">You're all caught up</h3>
      <p className="mx-auto mt-1 max-w-md text-sm text-muted-foreground">
        Nothing new here — mentions, reviews and AI updates will show up as they happen.
      </p>
    </div>
  );
}
