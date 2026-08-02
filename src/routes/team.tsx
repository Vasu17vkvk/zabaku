import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import {
  Search,
  Plus,
  Shield,
  ShieldCheck,
  Crown,
  User as UserIcon,
  Mail,
  MoreHorizontal,
  Filter,
  ChevronDown,
  Check,
  X,
  Sparkles,
  Circle,
  Clock,
  MessageSquare,
  GitBranch,
  FileText,
  CheckCircle2,
  Users,
  Send,
  Copy,
  Link2,
  ArrowUpRight,
  Loader2,
  AlertCircle,
  RefreshCw,
  Trash2,
} from "lucide-react";

import { requireAuth } from "@/lib/requireAuth";
import { ProtectedRoute } from "@/components/auth/ProtectedRoute";
import { useWorkspaceContext } from "@/context/WorkspaceContext";
import {
  useMembers,
  useInviteMember,
  useUpdateMemberRole,
  useRemoveMember,
} from "@/features/team/hooks";
import type { ApiTeamMember } from "@/features/team/api";

export const Route = createFileRoute("/team")({
  head: () => ({
    meta: [
      { title: "Team · Zabaku" },
      {
        name: "description",
        content:
          "Manage teammates, roles, and permissions across your Zabaku workspace — with activity insights and beautiful member cards.",
      },
      { property: "og:title", content: "Team · Zabaku" },
      {
        property: "og:description",
        content: "Members, roles, permissions, and activity — one home for your team.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  beforeLoad: requireAuth,
  component: () => (
    <ProtectedRoute>
      <TeamPage />
    </ProtectedRoute>
  ),
});

/* ------------------------------- data ------------------------------- */

type Role = "Owner" | "Admin" | "Member" | "Guest";
type Status = "online" | "away" | "offline";

type Member = {
  id: string;
  name: string;
  handle: string;
  email: string;
  role: Role;
  team: string;
  title: string;
  status: Status;
  hue: number;
  projects: number;
  tasks: number;
  joined: string;
  lastActive: string;
};

const DEFAULT_MEMBERS: Member[] = [
  {
    id: "u1",
    name: "Elena Rodríguez",
    handle: "elena",
    email: "elena@zabaku.io",
    role: "Owner",
    team: "Leadership",
    title: "Co-founder & CEO",
    status: "online",
    hue: 268,
    projects: 12,
    tasks: 48,
    joined: "Jan 2024",
    lastActive: "Just now",
  },
  {
    id: "u2",
    name: "Marco Bianchi",
    handle: "marco",
    email: "marco@zabaku.io",
    role: "Admin",
    team: "Engineering",
    title: "Head of Engineering",
    status: "online",
    hue: 210,
    projects: 9,
    tasks: 63,
    joined: "Feb 2024",
    lastActive: "2 min ago",
  },
  {
    id: "u3",
    name: "Priya Sharma",
    handle: "priya",
    email: "priya@zabaku.io",
    role: "Admin",
    team: "Design",
    title: "Design Lead",
    status: "away",
    hue: 320,
    projects: 7,
    tasks: 34,
    joined: "Mar 2024",
    lastActive: "12 min ago",
  },
  {
    id: "u4",
    name: "Kai Nakamura",
    handle: "kai",
    email: "kai@zabaku.io",
    role: "Member",
    team: "Engineering",
    title: "Staff Engineer",
    status: "online",
    hue: 150,
    projects: 6,
    tasks: 41,
    joined: "Apr 2024",
    lastActive: "Just now",
  },
];

const ROLE_STYLES: Record<
  Role,
  { icon: typeof Crown; chip: string; ring: string; label: string }
> = {
  Owner: {
    icon: Crown,
    chip:
      "bg-gradient-to-r from-amber-100 to-amber-50 text-amber-800 border-amber-200/80",
    ring: "ring-amber-300/60",
    label: "Owner",
  },
  Admin: {
    icon: ShieldCheck,
    chip:
      "bg-gradient-to-r from-primary/12 to-accent/12 text-primary border-primary/25",
    ring: "ring-primary/40",
    label: "Admin",
  },
  Member: {
    icon: UserIcon,
    chip: "bg-surface-muted text-foreground/75 border-border/70",
    ring: "ring-border/60",
    label: "Member",
  },
  Guest: {
    icon: Shield,
    chip: "bg-rose-50 text-rose-700 border-rose-200/80",
    ring: "ring-rose-200/60",
    label: "Guest",
  },
};

const STATUS: Record<Status, { dot: string; label: string }> = {
  online: { dot: "bg-emerald-500", label: "Active" },
  away: { dot: "bg-amber-500", label: "Away" },
  offline: { dot: "bg-slate-400", label: "Offline" },
};

const PENDING = [
  { email: "jules@acme.co", role: "Member" as Role, sent: "2 h ago" },
  { email: "maya@northwind.io", role: "Admin" as Role, sent: "Yesterday" },
  { email: "ben@lumen.dev", role: "Guest" as Role, sent: "3 d ago" },
];

const PERMISSIONS: {
  category: string;
  items: { label: string; desc: string; roles: Record<Role, boolean> }[];
}[] = [
  {
    category: "Workspace",
    items: [
      {
        label: "Manage workspace settings",
        desc: "Rename, branding, security policies",
        roles: { Owner: true, Admin: true, Member: false, Guest: false },
      },
      {
        label: "Manage billing & plan",
        desc: "Change plan, seats, payment method",
        roles: { Owner: true, Admin: false, Member: false, Guest: false },
      },
      {
        label: "Invite & remove members",
        desc: "Send invites, revoke access",
        roles: { Owner: true, Admin: true, Member: false, Guest: false },
      },
    ],
  },
  {
    category: "Projects",
    items: [
      {
        label: "Create projects",
        desc: "Start new projects and set visibility",
        roles: { Owner: true, Admin: true, Member: true, Guest: false },
      },
      {
        label: "Delete projects",
        desc: "Archive or permanently delete",
        roles: { Owner: true, Admin: true, Member: false, Guest: false },
      },
      {
        label: "Access private projects",
        desc: "Read projects marked private by default",
        roles: { Owner: true, Admin: true, Member: false, Guest: false },
      },
    ],
  },
  {
    category: "AI & Automations",
    items: [
      {
        label: "Run AI generations",
        desc: "Prompt Zabaku AI, use templates",
        roles: { Owner: true, Admin: true, Member: true, Guest: true },
      },
      {
        label: "Manage AI templates",
        desc: "Create & publish templates for the team",
        roles: { Owner: true, Admin: true, Member: false, Guest: false },
      },
    ],
  },
];

type Activity = {
  id: string;
  user: string;
  hue: number;
  action: string;
  target: string;
  time: string;
  icon: typeof MessageSquare;
  tint: string;
};

const ACTIVITY: Activity[] = [
  {
    id: "a1",
    user: "Marco Bianchi",
    hue: 210,
    action: "merged",
    target: "PR #482 · Invoice PDF renderer",
    time: "2 min ago",
    icon: GitBranch,
    tint: "text-emerald-600 bg-emerald-50",
  },
  {
    id: "a2",
    user: "Priya Sharma",
    hue: 320,
    action: "commented on",
    target: "Zabaku 2.0 launch plan",
    time: "18 min ago",
    icon: MessageSquare,
    tint: "text-primary bg-primary/10",
  },
  {
    id: "a3",
    user: "Elena Rodríguez",
    hue: 268,
    action: "invited",
    target: "jules@acme.co as Member",
    time: "2 h ago",
    icon: Mail,
    tint: "text-rose-600 bg-rose-50",
  },
  {
    id: "a4",
    user: "Ana Costa",
    hue: 25,
    action: "completed",
    target: "12 tasks in Billing v2",
    time: "3 h ago",
    icon: CheckCircle2,
    tint: "text-amber-700 bg-amber-50",
  },
];

/* ------------------------------ helpers ----------------------------- */

function deriveHue(name?: string): number {
  if (!name) return 210;
  let hash = 0;
  for (let i = 0; i < name.length; i++) {
    hash = name.charCodeAt(i) + ((hash << 5) - hash);
  }
  return Math.abs(hash % 360);
}

function normaliseMember(raw: ApiTeamMember, idx: number): Member {
  const id = raw._id ?? raw.id ?? `u-${idx + 1}`;
  const u = typeof raw.userId === "object" ? raw.userId : raw.user ?? {};
  const name = raw.name ?? u.name ?? "Team Member";
  const handle = raw.handle ?? u.handle ?? name.toLowerCase().replace(/\s+/g, "");
  const email = raw.email ?? u.email ?? `${handle}@zabaku.io`;
  const role = (raw.role ?? "Member") as Role;
  const team = raw.team ?? u.team ?? "Engineering";
  const title = raw.title ?? u.title ?? "Software Engineer";
  const status = (raw.status ?? "online") as Status;
  const hue = raw.hue ?? u.hue ?? deriveHue(name);

  return {
    id,
    name,
    handle,
    email,
    role: ROLE_STYLES[role] ? role : "Member",
    team,
    title,
    status: STATUS[status] ? status : "online",
    hue,
    projects: raw.projects ?? 5,
    tasks: raw.tasks ?? 24,
    joined: raw.joined ?? "Jan 2024",
    lastActive: raw.lastActive ?? "Just now",
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
  size = 40,
  status,
  ring = false,
}: {
  name: string;
  hue: number;
  size?: number;
  status?: Status;
  ring?: boolean;
}) {
  const bg = `linear-gradient(135deg, oklch(0.72 0.16 ${hue}), oklch(0.5 0.2 ${
    (hue + 40) % 360
  }))`;
  const fontSize = Math.round(size * 0.36);
  return (
    <span
      className={`relative inline-flex shrink-0 items-center justify-center rounded-full font-semibold text-white ${
        ring ? "ring-2 ring-background" : ""
      }`}
      style={{ width: size, height: size, background: bg, fontSize }}
    >
      {initials(name)}
      {status ? (
        <span
          className={`absolute -bottom-0.5 -right-0.5 h-2.5 w-2.5 rounded-full ring-2 ring-surface ${STATUS[status].dot}`}
        />
      ) : null}
    </span>
  );
}

function RoleBadge({ role }: { role: Role }) {
  const s = ROLE_STYLES[role] ?? ROLE_STYLES.Member;
  const Icon = s.icon;
  return (
    <span
      className={`inline-flex items-center gap-1 rounded-full border px-2 py-0.5 text-[11px] font-semibold ${s.chip}`}
    >
      <Icon className="h-3 w-3" />
      {s.label}
    </span>
  );
}

/* ------------------------------- page ------------------------------- */

type Tab = "members" | "invites" | "permissions";

function TeamPage() {
  const { workspace, workspaceId } = useWorkspaceContext();

  const { data: rawMembers = [], isLoading, isError, error, refetch } = useMembers(workspaceId);
  const updateRoleMutation = useUpdateMemberRole(workspaceId);
  const removeMemberMutation = useRemoveMember(workspaceId);

  const [tab, setTab] = useState<Tab>("members");
  const [query, setQuery] = useState("");
  const [roleFilter, setRoleFilter] = useState<Role | "All">("All");
  const [inviteOpen, setInviteOpen] = useState(false);

  const members = useMemo<Member[]>(() => {
    return rawMembers.length > 0
      ? rawMembers.map((m, i) => normaliseMember(m, i))
      : DEFAULT_MEMBERS;
  }, [rawMembers]);

  const filtered = useMemo(
    () =>
      members.filter((m) => {
        const q = query.trim().toLowerCase();
        const passQ =
          !q ||
          m.name.toLowerCase().includes(q) ||
          m.email.toLowerCase().includes(q) ||
          m.team.toLowerCase().includes(q);
        const passR = roleFilter === "All" || m.role === roleFilter;
        return passQ && passR;
      }),
    [members, query, roleFilter],
  );

  const stats = [
    { label: "Members", value: members.length, delta: "+3 this month" },
    {
      label: "Active now",
      value: members.filter((m) => m.status === "online").length,
      delta: `${members.filter((m) => m.status === "online").length} online`,
    },
    { label: "Pending invites", value: PENDING.length, delta: "2 accepted" },
    { label: "Seats remaining", value: 12, delta: "of 25" },
  ];

  function handleUpdateRole(memberId: string, role: Role) {
    updateRoleMutation.mutate({ memberId, role });
  }

  function handleRemoveMember(memberId: string) {
    if (window.confirm("Are you sure you want to remove this member from the workspace?")) {
      removeMemberMutation.mutate(memberId);
    }
  }

  return (
    <div className="relative min-h-screen bg-background text-foreground">
      {/* ambient */}
      <div className="pointer-events-none absolute inset-0 -z-10 overflow-hidden">
        <div className="absolute -top-40 left-1/3 h-[420px] w-[700px] rounded-full bg-primary/12 blur-3xl" />
        <div className="absolute right-[-140px] top-20 h-[340px] w-[520px] rounded-full bg-accent/15 blur-3xl" />
      </div>

      <div className="mx-auto max-w-[1440px] px-6 py-8">
        {/* header */}
        <header className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              <span>Workspace</span>
              <span>·</span>
              <span className="text-foreground/70">{workspace?.name ?? "Northwind"}</span>
            </div>
            <h1 className="mt-2 text-3xl font-semibold tracking-tight sm:text-4xl">
              Team
            </h1>
            <p className="mt-1 max-w-xl text-sm text-muted-foreground">
              Manage members, assign roles, and control what your team can do across every
              project.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <div className="hidden items-center -space-x-2 rounded-full border border-border/70 bg-surface/70 px-2 py-1.5 backdrop-blur sm:flex">
              {members.slice(0, 5).map((m) => (
                <Avatar key={m.id} name={m.name} hue={m.hue} size={24} ring />
              ))}
              {members.length > 5 && (
                <span className="!ml-3 pr-1 text-xs font-medium text-muted-foreground">
                  +{members.length - 5}
                </span>
              )}
            </div>
            <button className="inline-flex items-center gap-1.5 rounded-lg border border-border/70 bg-surface px-3 py-2 text-sm font-medium text-foreground/80 transition hover:border-primary/40">
              <Link2 className="h-4 w-4" />
              Invite link
            </button>
            <button
              onClick={() => setInviteOpen(true)}
              className="inline-flex items-center gap-1.5 rounded-lg bg-gradient-to-r from-primary to-accent px-3.5 py-2 text-sm font-semibold text-white shadow-lg shadow-primary/25 transition hover:shadow-primary/40"
            >
              <Plus className="h-4 w-4" />
              Invite people
            </button>
          </div>
        </header>

        {/* Error banner */}
        {isError && (
          <div className="mt-6 flex items-center justify-between rounded-xl border border-destructive/30 bg-destructive/10 px-4 py-3 text-[12.5px] text-destructive">
            <div className="flex items-center gap-2 font-medium">
              <AlertCircle className="h-4 w-4 shrink-0" />
              <span>{error instanceof Error ? error.message : "Failed to load workspace members."}</span>
            </div>
            <button
              onClick={() => refetch()}
              className="flex items-center gap-1 rounded-md bg-destructive px-3 py-1 text-[11.5px] font-semibold text-white hover:opacity-90"
            >
              <RefreshCw className="h-3 w-3" /> Retry
            </button>
          </div>
        )}

        {/* stats */}
        <section className="mt-8 grid grid-cols-2 gap-3 sm:grid-cols-4">
          {stats.map((s) => (
            <div
              key={s.label}
              className="rounded-2xl border border-border/70 bg-surface p-4 shadow-sm"
            >
              <div className="text-xs font-medium text-muted-foreground">{s.label}</div>
              <div className="mt-1.5 flex items-baseline gap-2">
                <span className="text-2xl font-semibold tracking-tight">{s.value}</span>
                <span className="text-[11px] text-muted-foreground">{s.delta}</span>
              </div>
            </div>
          ))}
        </section>

        {/* layout */}
        <div className="mt-8 grid grid-cols-1 gap-8 xl:grid-cols-[minmax(0,1fr)_360px]">
          <div className="min-w-0">
            {/* tabs + toolbar */}
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <div className="inline-flex rounded-xl border border-border/70 bg-surface p-1">
                {(
                  [
                    { id: "members", label: `Members · ${members.length}` },
                    { id: "invites", label: `Pending · ${PENDING.length}` },
                    { id: "permissions", label: "Permissions" },
                  ] as { id: Tab; label: string }[]
                ).map((t) => (
                  <button
                    key={t.id}
                    onClick={() => setTab(t.id)}
                    className={`rounded-lg px-3 py-1.5 text-sm font-medium transition ${
                      tab === t.id
                        ? "bg-gradient-to-r from-primary to-accent text-white shadow-sm"
                        : "text-muted-foreground hover:text-foreground"
                    }`}
                  >
                    {t.label}
                  </button>
                ))}
              </div>

              {tab === "members" ? (
                <div className="flex items-center gap-2">
                  <div className="relative">
                    <Search className="pointer-events-none absolute left-2.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                    <input
                      value={query}
                      onChange={(e) => setQuery(e.target.value)}
                      placeholder="Search members"
                      className="h-9 w-56 rounded-lg border border-border/70 bg-surface pl-8 pr-3 text-sm placeholder:text-muted-foreground/70 focus:border-primary/40 focus:outline-none"
                    />
                  </div>
                  <div className="relative">
                    <select
                      value={roleFilter}
                      onChange={(e) => setRoleFilter(e.target.value as Role | "All")}
                      className="h-9 appearance-none rounded-lg border border-border/70 bg-surface pl-8 pr-8 text-sm focus:border-primary/40 focus:outline-none"
                    >
                      <option value="All">All roles</option>
                      <option value="Owner">Owner</option>
                      <option value="Admin">Admin</option>
                      <option value="Member">Member</option>
                      <option value="Guest">Guest</option>
                    </select>
                    <Filter className="pointer-events-none absolute left-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-muted-foreground" />
                    <ChevronDown className="pointer-events-none absolute right-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-muted-foreground" />
                  </div>
                </div>
              ) : null}
            </div>

            {/* tab content */}
            <div className="mt-5">
              {isLoading ? (
                <MemberGridSkeleton />
              ) : tab === "members" ? (
                <MemberGrid
                  members={filtered}
                  onUpdateRole={handleUpdateRole}
                  onRemoveMember={handleRemoveMember}
                />
              ) : null}
              {tab === "invites" ? <PendingInvites /> : null}
              {tab === "permissions" ? <PermissionsMatrix /> : null}
            </div>
          </div>

          {/* activity rail */}
          <ActivityRail />
        </div>
      </div>

      {inviteOpen ? (
        <InviteModal
          workspaceId={workspaceId}
          onClose={() => setInviteOpen(false)}
        />
      ) : null}
    </div>
  );
}

/* ---------------------------- member grid skeleton ------------------ */

function MemberGridSkeleton() {
  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
      {[1, 2, 3, 4, 5, 6].map((i) => (
        <div key={i} className="h-72 rounded-2xl border border-border/70 bg-surface p-5 animate-pulse">
          <div className="h-12 w-12 rounded-full bg-secondary/80" />
          <div className="mt-4 h-4 w-1/2 rounded bg-secondary/80" />
          <div className="mt-2 h-3 w-1/3 rounded bg-secondary/60" />
        </div>
      ))}
    </div>
  );
}

/* ---------------------------- member grid --------------------------- */

function MemberGrid({
  members,
  onUpdateRole,
  onRemoveMember,
}: {
  members: Member[];
  onUpdateRole: (id: string, role: Role) => void;
  onRemoveMember: (id: string) => void;
}) {
  if (members.length === 0) {
    return (
      <div className="rounded-2xl border border-dashed border-border/70 bg-surface/40 p-12 text-center">
        <div className="mx-auto flex h-11 w-11 items-center justify-center rounded-2xl bg-surface-muted text-muted-foreground">
          <Users className="h-5 w-5" />
        </div>
        <h3 className="mt-3 text-sm font-semibold">No members match</h3>
        <p className="mt-1 text-xs text-muted-foreground">
          Try clearing the filter or search term.
        </p>
      </div>
    );
  }
  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
      {members.map((m) => (
        <MemberCard
          key={m.id}
          m={m}
          onUpdateRole={onUpdateRole}
          onRemoveMember={onRemoveMember}
        />
      ))}
    </div>
  );
}

function MemberCard({
  m,
  onUpdateRole,
  onRemoveMember,
}: {
  m: Member;
  onUpdateRole: (id: string, role: Role) => void;
  onRemoveMember: (id: string) => void;
}) {
  const s = STATUS[m.status] ?? STATUS.online;
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <article className="group relative overflow-hidden rounded-2xl border border-border/70 bg-surface shadow-sm transition hover:-translate-y-0.5 hover:border-primary/40 hover:shadow-lg hover:shadow-primary/10">
      <div
        className="h-16 w-full"
        style={{
          background: `linear-gradient(135deg, oklch(0.94 0.05 ${m.hue}), oklch(0.9 0.07 ${
            (m.hue + 40) % 360
          }))`,
        }}
      />
      <div className="px-5 pb-5">
        <div className="-mt-8 flex items-end justify-between">
          <Avatar name={m.name} hue={m.hue} size={64} status={m.status} ring />

          <div className="relative">
            <button
              onClick={() => setMenuOpen(!menuOpen)}
              className="rounded-lg p-1.5 text-muted-foreground opacity-0 transition hover:bg-surface-muted hover:text-foreground group-hover:opacity-100"
            >
              <MoreHorizontal className="h-4 w-4" />
            </button>

            {menuOpen && (
              <div className="absolute right-0 top-8 z-20 w-44 rounded-xl border border-border/70 bg-surface p-1 shadow-lg backdrop-blur">
                <div className="px-2.5 py-1.5 text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
                  Change role
                </div>
                {(["Owner", "Admin", "Member", "Guest"] as Role[]).map((r) => (
                  <button
                    key={r}
                    onClick={() => {
                      onUpdateRole(m.id, r);
                      setMenuOpen(false);
                    }}
                    className={`flex w-full items-center justify-between rounded-lg px-2.5 py-1.5 text-xs font-medium ${
                      m.role === r ? "bg-primary/10 text-primary font-semibold" : "text-foreground hover:bg-surface-muted"
                    }`}
                  >
                    {r}
                    {m.role === r && <Check className="h-3 w-3" />}
                  </button>
                ))}
                <div className="my-1 border-t border-border/60" />
                <button
                  onClick={() => {
                    onRemoveMember(m.id);
                    setMenuOpen(false);
                  }}
                  className="flex w-full items-center gap-1.5 rounded-lg px-2.5 py-1.5 text-xs font-medium text-rose-600 hover:bg-rose-50"
                >
                  <Trash2 className="h-3.5 w-3.5" /> Remove member
                </button>
              </div>
            )}
          </div>
        </div>

        <div className="mt-3">
          <div className="flex items-center gap-2">
            <h3 className="truncate text-[15px] font-semibold">{m.name}</h3>
            <RoleBadge role={m.role} />
          </div>
          <p className="mt-0.5 text-xs text-muted-foreground">
            {m.title} · {m.team}
          </p>
        </div>

        <div className="mt-3 flex items-center gap-1.5 text-[11px] text-muted-foreground">
          <span className={`h-1.5 w-1.5 rounded-full ${s.dot}`} />
          {s.label}
          <span className="mx-1">·</span>
          <Clock className="h-3 w-3" />
          {m.lastActive}
        </div>

        <div className="mt-4 grid grid-cols-3 gap-2 rounded-xl border border-border/60 bg-surface-muted/50 p-2.5">
          <Stat label="Projects" value={m.projects} />
          <Stat label="Tasks" value={m.tasks} />
          <Stat label="Joined" value={m.joined} small />
        </div>

        <div className="mt-4 flex items-center gap-2">
          <button className="inline-flex flex-1 items-center justify-center gap-1.5 rounded-lg border border-border/70 bg-surface px-3 py-1.5 text-xs font-medium text-foreground/80 transition hover:border-primary/40">
            <MessageSquare className="h-3.5 w-3.5" />
            Message
          </button>
          <button className="inline-flex flex-1 items-center justify-center gap-1.5 rounded-lg bg-foreground px-3 py-1.5 text-xs font-medium text-background transition hover:opacity-90">
            View profile
            <ArrowUpRight className="h-3.5 w-3.5" />
          </button>
        </div>
      </div>
    </article>
  );
}

function Stat({
  label,
  value,
  small,
}: {
  label: string;
  value: string | number;
  small?: boolean;
}) {
  return (
    <div className="text-center">
      <div
        className={
          small
            ? "text-[11px] font-semibold text-foreground"
            : "text-sm font-semibold text-foreground"
        }
      >
        {value}
      </div>
      <div className="text-[10px] uppercase tracking-wider text-muted-foreground">
        {label}
      </div>
    </div>
  );
}

/* -------------------------- pending invites ------------------------- */

function PendingInvites() {
  return (
    <div className="overflow-hidden rounded-2xl border border-border/70 bg-surface">
      <div className="flex items-center justify-between border-b border-border/70 px-5 py-3">
        <div className="text-sm font-semibold">Pending invites</div>
        <button className="inline-flex items-center gap-1 text-xs font-medium text-primary hover:underline">
          Resend all
        </button>
      </div>
      <ul className="divide-y divide-border/70">
        {PENDING.map((p) => (
          <li key={p.email} className="flex items-center justify-between px-5 py-3.5">
            <div className="flex items-center gap-3">
              <span className="flex h-9 w-9 items-center justify-center rounded-full bg-surface-muted text-muted-foreground">
                <Mail className="h-4 w-4" />
              </span>
              <div>
                <div className="text-sm font-medium">{p.email}</div>
                <div className="text-[11px] text-muted-foreground">Sent {p.sent}</div>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <RoleBadge role={p.role} />
              <button className="rounded-lg border border-border/70 bg-surface px-2.5 py-1 text-xs font-medium hover:border-primary/40">
                Resend
              </button>
              <button className="rounded-lg p-1.5 text-muted-foreground hover:bg-surface-muted hover:text-foreground">
                <X className="h-4 w-4" />
              </button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}

/* -------------------------- permissions ----------------------------- */

const ROLE_ORDER: Role[] = ["Owner", "Admin", "Member", "Guest"];

function PermissionsMatrix() {
  return (
    <div className="overflow-hidden rounded-2xl border border-border/70 bg-surface">
      <div className="grid grid-cols-[minmax(0,1fr)_repeat(4,80px)] items-center gap-3 border-b border-border/70 bg-surface-muted/60 px-5 py-3">
        <div className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
          Permission
        </div>
        {ROLE_ORDER.map((r) => (
          <div key={r} className="flex justify-center">
            <RoleBadge role={r} />
          </div>
        ))}
      </div>

      <div>
        {PERMISSIONS.map((group) => (
          <div key={group.category}>
            <div className="border-b border-border/60 bg-surface-muted/30 px-5 py-2 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
              {group.category}
            </div>
            {group.items.map((item) => (
              <div
                key={item.label}
                className="grid grid-cols-[minmax(0,1fr)_repeat(4,80px)] items-center gap-3 border-b border-border/60 px-5 py-3.5 last:border-0"
              >
                <div>
                  <div className="text-sm font-medium">{item.label}</div>
                  <div className="text-[11px] text-muted-foreground">{item.desc}</div>
                </div>
                {ROLE_ORDER.map((r) => (
                  <div key={r} className="flex justify-center">
                    {item.roles[r] ? (
                      <span className="flex h-6 w-6 items-center justify-center rounded-md bg-emerald-50 text-emerald-600">
                        <Check className="h-3.5 w-3.5" />
                      </span>
                    ) : (
                      <span className="flex h-6 w-6 items-center justify-center rounded-md bg-surface-muted text-muted-foreground/60">
                        <Circle className="h-2 w-2" />
                      </span>
                    )}
                  </div>
                ))}
              </div>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}

/* --------------------------- activity rail -------------------------- */

function ActivityRail() {
  return (
    <aside className="space-y-6">
      <div className="rounded-2xl border border-border/70 bg-surface p-5">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-sm font-semibold">Recent activity</h3>
            <p className="text-[11px] text-muted-foreground">Across your team, last 24h</p>
          </div>
          <button className="rounded-md p-1.5 text-muted-foreground hover:bg-surface-muted hover:text-foreground">
            <MoreHorizontal className="h-4 w-4" />
          </button>
        </div>

        <ol className="relative mt-4 space-y-4 border-l border-border/70 pl-4">
          {ACTIVITY.map((a) => {
            const Icon = a.icon;
            return (
              <li key={a.id} className="relative">
                <span
                  className={`absolute -left-[26px] top-0 flex h-6 w-6 items-center justify-center rounded-full ring-4 ring-surface ${a.tint}`}
                >
                  <Icon className="h-3 w-3" />
                </span>
                <div className="flex items-center gap-2">
                  <Avatar name={a.user} hue={a.hue} size={20} />
                  <div className="min-w-0 text-[13px] leading-5">
                    <span className="font-semibold">{a.user}</span>{" "}
                    <span className="text-muted-foreground">{a.action}</span>{" "}
                    <span className="text-foreground/85">{a.target}</span>
                  </div>
                </div>
                <div className="mt-0.5 pl-7 text-[11px] text-muted-foreground">{a.time}</div>
              </li>
            );
          })}
        </ol>

        <button className="mt-4 w-full rounded-lg border border-border/70 bg-surface px-3 py-2 text-xs font-medium hover:border-primary/40">
          View full activity log
        </button>
      </div>

      <div className="overflow-hidden rounded-2xl border border-border/70 bg-gradient-to-br from-primary to-[oklch(0.42_0.24_285)] p-5 text-white">
        <div className="inline-flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-wider text-white/70">
          <Sparkles className="h-3.5 w-3.5" /> Team insights
        </div>
        <h3 className="mt-2 text-base font-semibold leading-snug">
          Engineering shipped 24% more this week
        </h3>
        <p className="mt-1 text-xs text-white/75">
          Priya and Kai closed the most reviews. Consider rebalancing PR load with Owen.
        </p>
        <button className="mt-4 inline-flex items-center gap-1.5 rounded-lg bg-white/15 px-3 py-1.5 text-xs font-semibold backdrop-blur hover:bg-white/25">
          See report
          <ArrowUpRight className="h-3.5 w-3.5" />
        </button>
      </div>
    </aside>
  );
}

/* ---------------------------- invite modal -------------------------- */

function InviteModal({
  workspaceId,
  onClose,
}: {
  workspaceId: string | null;
  onClose: () => void;
}) {
  const inviteMutation = useInviteMember(workspaceId);
  const [emails, setEmails] = useState("");
  const [role, setRole] = useState<Role>("Member");
  const [copied, setCopied] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const inviteLink = "https://zabaku.io/join/nrthwd-9f24e";

  async function handleSendInvites() {
    if (!emails.trim()) return;
    setErrorMsg(null);
    try {
      const list = emails.split(/[\n,]+/).map((e) => e.trim()).filter(Boolean);
      for (const email of list) {
        await inviteMutation.mutateAsync({ email, role });
      }
      onClose();
    } catch (err) {
      setErrorMsg(err instanceof Error ? err.message : "Failed to send invite(s).");
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <button
        aria-label="Close"
        onClick={onClose}
        className="absolute inset-0 bg-foreground/40 backdrop-blur-sm"
      />
      <div className="relative w-full max-w-lg overflow-hidden rounded-2xl border border-border/70 bg-surface shadow-2xl">
        <div className="flex items-center justify-between border-b border-border/70 px-5 py-4">
          <div className="flex items-center gap-2.5">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-primary to-accent text-white">
              <Send className="h-4 w-4" />
            </div>
            <div>
              <div className="text-sm font-semibold">Invite to workspace</div>
              <div className="text-[11px] text-muted-foreground">
                They'll get an email with a workspace link
              </div>
            </div>
          </div>
          <button
            onClick={onClose}
            className="rounded-lg p-1.5 text-muted-foreground hover:bg-surface-muted hover:text-foreground"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        <div className="space-y-4 px-5 py-5">
          {errorMsg && (
            <div className="rounded-lg border border-destructive/30 bg-destructive/10 px-3 py-2 text-xs text-destructive">
              {errorMsg}
            </div>
          )}

          <div>
            <label className="text-xs font-medium text-foreground/80">
              Email addresses
            </label>
            <textarea
              value={emails}
              onChange={(e) => setEmails(e.target.value)}
              rows={3}
              placeholder="ana@company.com, jordan@company.com"
              className="mt-1.5 w-full resize-none rounded-lg border border-border/70 bg-surface px-3 py-2.5 text-sm placeholder:text-muted-foreground/70 focus:border-primary/40 focus:outline-none"
            />
          </div>

          <div>
            <label className="text-xs font-medium text-foreground/80">Assign role</label>
            <div className="mt-1.5 grid grid-cols-3 gap-2">
              {(["Admin", "Member", "Guest"] as Role[]).map((r) => {
                const s = ROLE_STYLES[r];
                const Icon = s.icon;
                const active = role === r;
                return (
                  <button
                    key={r}
                    onClick={() => setRole(r)}
                    className={`flex items-start gap-2 rounded-xl border p-3 text-left transition ${
                      active
                        ? "border-primary/50 bg-primary/5 shadow-sm"
                        : "border-border/70 hover:border-primary/30"
                    }`}
                  >
                    <span
                      className={`mt-0.5 flex h-6 w-6 items-center justify-center rounded-md ${
                        active ? "bg-primary text-white" : "bg-surface-muted text-foreground/70"
                      }`}
                    >
                      <Icon className="h-3.5 w-3.5" />
                    </span>
                    <span className="min-w-0">
                      <span className="block text-[13px] font-semibold">{r}</span>
                      <span className="block text-[11px] leading-4 text-muted-foreground">
                        {r === "Admin"
                          ? "Full access except billing"
                          : r === "Member"
                            ? "Create & edit projects"
                            : "Limited read access"}
                      </span>
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          <div className="rounded-xl border border-dashed border-border/70 bg-surface-muted/40 p-3">
            <div className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
              Or share invite link
            </div>
            <div className="mt-2 flex items-center gap-2">
              <div className="flex flex-1 items-center gap-2 rounded-lg border border-border/70 bg-surface px-3 py-2 text-xs text-foreground/80">
                <Link2 className="h-3.5 w-3.5 text-muted-foreground" />
                <span className="truncate">{inviteLink}</span>
              </div>
              <button
                onClick={() => {
                  navigator.clipboard?.writeText(inviteLink);
                  setCopied(true);
                  window.setTimeout(() => setCopied(false), 1400);
                }}
                className="inline-flex items-center gap-1.5 rounded-lg border border-border/70 bg-surface px-3 py-2 text-xs font-medium hover:border-primary/40"
              >
                {copied ? <Check className="h-3.5 w-3.5" /> : <Copy className="h-3.5 w-3.5" />}
                {copied ? "Copied" : "Copy"}
              </button>
            </div>
          </div>
        </div>

        <div className="flex items-center justify-between border-t border-border/70 bg-surface-muted/40 px-5 py-3.5">
          <div className="text-[11px] text-muted-foreground">
            12 seats remaining on Team plan
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={onClose}
              className="rounded-lg border border-border/70 bg-surface px-3 py-1.5 text-sm font-medium hover:border-primary/40"
            >
              Cancel
            </button>
            <button
              onClick={handleSendInvites}
              disabled={!emails.trim() || inviteMutation.isPending}
              className="inline-flex items-center gap-1.5 rounded-lg bg-gradient-to-r from-primary to-accent px-3.5 py-1.5 text-sm font-semibold text-white shadow-md shadow-primary/25 hover:shadow-primary/40 disabled:opacity-50"
            >
              {inviteMutation.isPending ? (
                <Loader2 className="h-3.5 w-3.5 animate-spin" />
              ) : (
                <Send className="h-3.5 w-3.5" />
              )}
              Send invites
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
