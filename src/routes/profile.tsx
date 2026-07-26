import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import {
  MapPin,
  Mail,
  Link as LinkIcon,
  Github,
  Linkedin,
  Globe,
  Twitter,
  Pencil,
  Share2,
  MessageSquare,
  Sparkles,
  CheckCircle2,
  GitPullRequest,
  GitCommit,
  MessageCircle,
  FileText,
  Calendar,
  Trophy,
  Zap,
  Clock,
  ArrowUpRight,
  Star,
  Users,
  Layers,
  Activity as ActivityIcon,
  ChevronRight,
} from "lucide-react";

export const Route = createFileRoute("/profile")({
  head: () => ({
    meta: [
      { title: "Elena Rodríguez · Zabaku Profile" },
      {
        name: "description",
        content:
          "Product engineer at Northwind — projects, skills, and recent activity across the Zabaku workspace.",
      },
      { property: "og:title", content: "Elena Rodríguez · Zabaku Profile" },
      {
        property: "og:description",
        content:
          "Product engineer building the future of AI-native SaaS at Northwind.",
      },
      { property: "og:type", content: "profile" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: ProfilePage,
});

/* ------------------------------- data ------------------------------- */

const USER = {
  name: "Elena Rodríguez",
  handle: "@elena",
  role: "Senior Product Engineer",
  company: "Northwind",
  location: "Barcelona, Spain",
  email: "elena@northwind.io",
  pronouns: "she/her",
  timezone: "GMT+1 · 14:32 local",
  bio: "Product engineer building AI-native SaaS. Previously at Linear and Vercel. I care deeply about interface craft, keyboard-first UX, and the small details that make software feel alive.",
  hue: 268,
};

const STATS = [
  { label: "Projects", value: "24", icon: Layers },
  { label: "Tasks shipped", value: "312", icon: CheckCircle2 },
  { label: "Reviews", value: "148", icon: GitPullRequest },
  { label: "Followers", value: "1.2k", icon: Users },
];

const SKILLS = [
  { name: "Product design", level: 96 },
  { name: "React & TypeScript", level: 92 },
  { name: "Design systems", level: 88 },
  { name: "Motion / interaction", level: 84 },
  { name: "AI / LLM tooling", level: 78 },
  { name: "Rust", level: 44 },
];

const TAGS = [
  "AI-native",
  "Design systems",
  "React",
  "TypeScript",
  "Motion",
  "Figma",
  "Rust",
  "Postgres",
  "Edge",
  "OKLCH",
];

const PROJECTS = [
  {
    name: "Zabaku 2.0",
    slug: "ZBK",
    role: "Lead engineer",
    status: "In progress",
    progress: 72,
    tone: 268,
    members: 8,
  },
  {
    name: "Billing v2",
    slug: "BIL",
    role: "Contributor",
    status: "In review",
    progress: 54,
    tone: 210,
    members: 5,
  },
  {
    name: "Onboarding v3",
    slug: "ONB",
    role: "Designer",
    status: "Planning",
    progress: 22,
    tone: 320,
    members: 4,
  },
  {
    name: "AI Copilot",
    slug: "AIC",
    role: "Owner",
    status: "Shipped",
    progress: 100,
    tone: 150,
    members: 6,
  },
];

const LINKS = [
  {
    id: "github",
    label: "GitHub",
    handle: "github.com/elena",
    icon: Github,
    tint: "bg-neutral-900 text-white",
  },
  {
    id: "linkedin",
    label: "LinkedIn",
    handle: "linkedin.com/in/elena",
    icon: Linkedin,
    tint: "bg-orange-600 text-white",
  },
  {
    id: "portfolio",
    label: "Portfolio",
    handle: "elena.design",
    icon: Globe,
    tint: "bg-gradient-to-br from-primary to-accent text-white",
  },
  {
    id: "twitter",
    label: "Twitter / X",
    handle: "@elenarod",
    icon: Twitter,
    tint: "bg-neutral-800 text-white",
  },
];

const ACTIVITY = [
  {
    id: "a1",
    kind: "commit",
    text: "pushed 12 commits to Zabaku 2.0",
    detail: "feat/dashboard-widgets · main",
    time: "12 min ago",
    icon: GitCommit,
    tint: "text-emerald-700 bg-emerald-50",
  },
  {
    id: "a2",
    kind: "review",
    text: "reviewed PR #482 in Billing v2",
    detail: "Approved · Left 6 comments on invoice renderer",
    time: "1 h ago",
    icon: GitPullRequest,
    tint: "text-sky-700 bg-orange-50",
  },
  {
    id: "a3",
    kind: "task",
    text: "completed Onboarding wizard mock — v3",
    detail: "Onboarding v3 · design",
    time: "3 h ago",
    icon: CheckCircle2,
    tint: "text-primary bg-primary/10",
  },
  {
    id: "a4",
    kind: "ai",
    text: "generated 24 sprint tasks with Zabaku AI",
    detail: "Billing v2 · sprint 42",
    time: "Yesterday",
    icon: Sparkles,
    tint: "text-orange-700 bg-orange-50",
  },
  {
    id: "a5",
    kind: "comment",
    text: "commented on OAuth login spec",
    detail: "\"Let's use PKCE + short-lived refresh tokens.\"",
    time: "Yesterday",
    icon: MessageCircle,
    tint: "text-rose-700 bg-rose-50",
  },
  {
    id: "a6",
    kind: "doc",
    text: "shared a doc: Design system 2.0",
    detail: "Zabaku 2.0 · public",
    time: "Mon",
    icon: FileText,
    tint: "text-amber-700 bg-amber-50",
  },
];

const ACHIEVEMENTS = [
  { label: "100 PRs merged", icon: Trophy },
  { label: "AI early adopter", icon: Sparkles },
  { label: "Ship streak · 21 days", icon: Zap },
  { label: "Top reviewer Q2", icon: Star },
];

const TABS = ["Overview", "Projects", "Activity", "Skills"] as const;
type Tab = (typeof TABS)[number];

/* ------------------------------- page ------------------------------- */

function ProfilePage() {
  const [tab, setTab] = useState<Tab>("Overview");
  const [following, setFollowing] = useState(false);

  return (
    <div className="relative min-h-screen bg-background text-foreground">
      <div className="pointer-events-none absolute inset-0 -z-10 overflow-hidden">
        <div className="absolute -top-56 left-1/2 h-[520px] w-[880px] -translate-x-1/2 rounded-full bg-primary/15 blur-3xl" />
        <div className="absolute right-[-160px] top-40 h-[360px] w-[560px] rounded-full bg-accent/20 blur-3xl" />
      </div>

      <div className="mx-auto max-w-[1200px] px-6 py-8">
        {/* Cover + header */}
        <div className="relative overflow-hidden rounded-3xl border border-border/70 bg-surface shadow-sm">
          <div className="relative h-40 sm:h-48">
            <div
              className="absolute inset-0"
              style={{
                background:
                  "linear-gradient(135deg, oklch(0.62 0.22 268) 0%, oklch(0.72 0.18 320) 55%, oklch(0.78 0.17 200) 100%)",
              }}
            />
            <div
              className="absolute inset-0 opacity-40 mix-blend-overlay"
              style={{
                backgroundImage:
                  "radial-gradient(circle at 20% 30%, rgba(255,255,255,0.6) 0, transparent 40%), radial-gradient(circle at 80% 60%, rgba(0,0,0,0.35) 0, transparent 45%)",
              }}
            />
            <svg
              className="absolute inset-0 h-full w-full opacity-[0.18]"
              viewBox="0 0 800 200"
              preserveAspectRatio="none"
            >
              <defs>
                <pattern id="grid" width="24" height="24" patternUnits="userSpaceOnUse">
                  <path d="M24 0H0V24" fill="none" stroke="white" strokeWidth="0.6" />
                </pattern>
              </defs>
              <rect width="100%" height="100%" fill="url(#grid)" />
            </svg>
          </div>

          <div className="px-6 pb-6 sm:px-8 sm:pb-8">
            <div className="flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
              <div className="flex flex-col gap-4 sm:flex-row sm:items-end">
                {/* avatar */}
                <div className="relative -mt-14 sm:-mt-16">
                  <div
                    className="flex h-28 w-28 items-center justify-center rounded-3xl text-3xl font-bold text-white shadow-xl ring-4 ring-surface sm:h-32 sm:w-32"
                    style={{
                      background: `linear-gradient(135deg, oklch(0.72 0.16 ${USER.hue}), oklch(0.5 0.2 ${
                        (USER.hue + 60) % 360
                      }))`,
                    }}
                  >
                    ER
                  </div>
                  <span className="absolute bottom-1.5 right-1.5 flex h-5 w-5 items-center justify-center rounded-full bg-emerald-500 ring-2 ring-surface">
                    <span className="h-1.5 w-1.5 rounded-full bg-white" />
                  </span>
                </div>

                <div className="min-w-0">
                  <div className="flex flex-wrap items-center gap-2">
                    <h1 className="text-2xl font-semibold tracking-tight sm:text-[28px]">
                      {USER.name}
                    </h1>
                    <span
                      title="Verified"
                      className="inline-flex h-5 w-5 items-center justify-center rounded-full bg-primary text-white"
                    >
                      <CheckCircle2 className="h-3 w-3" />
                    </span>
                    <span className="inline-flex items-center gap-1 rounded-full bg-primary/10 px-2 py-0.5 text-[11px] font-semibold text-primary">
                      Pro
                    </span>
                    <span className="text-sm text-muted-foreground">
                      {USER.handle} · {USER.pronouns}
                    </span>
                  </div>
                  <p className="mt-1 text-[15px] text-foreground/85">
                    {USER.role} at{" "}
                    <span className="font-semibold">{USER.company}</span>
                  </p>
                  <div className="mt-2 flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-muted-foreground">
                    <span className="inline-flex items-center gap-1">
                      <MapPin className="h-3.5 w-3.5" /> {USER.location}
                    </span>
                    <span className="inline-flex items-center gap-1">
                      <Mail className="h-3.5 w-3.5" /> {USER.email}
                    </span>
                    <span className="inline-flex items-center gap-1">
                      <Clock className="h-3.5 w-3.5" /> {USER.timezone}
                    </span>
                  </div>
                </div>
              </div>

              {/* actions */}
              <div className="flex flex-wrap items-center gap-2">
                <button
                  onClick={() => setFollowing((f) => !f)}
                  className={`inline-flex items-center gap-1.5 rounded-lg px-3.5 py-2 text-sm font-semibold transition ${
                    following
                      ? "border border-border/70 bg-surface text-foreground hover:border-primary/40"
                      : "bg-foreground text-background hover:opacity-90"
                  }`}
                >
                  {following ? "Following" : "Follow"}
                </button>
                <button className="inline-flex items-center gap-1.5 rounded-lg border border-border/70 bg-surface px-3.5 py-2 text-sm font-medium hover:border-primary/40">
                  <MessageSquare className="h-3.5 w-3.5" />
                  Message
                </button>
                <button className="rounded-lg border border-border/70 bg-surface p-2 text-muted-foreground hover:border-primary/40 hover:text-foreground">
                  <Share2 className="h-4 w-4" />
                </button>
                <button className="inline-flex items-center gap-1.5 rounded-lg bg-gradient-to-r from-primary to-accent px-3.5 py-2 text-sm font-semibold text-white shadow-md shadow-primary/25 transition hover:shadow-primary/40">
                  <Pencil className="h-3.5 w-3.5" />
                  Edit profile
                </button>
              </div>
            </div>

            {/* bio */}
            <p className="mt-6 max-w-3xl text-[14px] leading-6 text-foreground/85">
              {USER.bio}
            </p>

            {/* stats strip */}
            <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-4">
              {STATS.map((s) => {
                const Icon = s.icon;
                return (
                  <div
                    key={s.label}
                    className="rounded-2xl border border-border/60 bg-surface-muted/40 p-4"
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-[11px] font-medium uppercase tracking-wider text-muted-foreground">
                        {s.label}
                      </span>
                      <Icon className="h-3.5 w-3.5 text-muted-foreground" />
                    </div>
                    <div className="mt-2 text-2xl font-semibold tracking-tight">
                      {s.value}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="mt-6 flex items-center gap-1 rounded-2xl border border-border/70 bg-surface p-1">
          {TABS.map((t) => {
            const active = tab === t;
            return (
              <button
                key={t}
                onClick={() => setTab(t)}
                className={`rounded-lg px-3.5 py-1.5 text-sm font-medium transition ${
                  active
                    ? "bg-foreground text-background shadow-sm"
                    : "text-muted-foreground hover:bg-surface-muted hover:text-foreground"
                }`}
              >
                {t}
              </button>
            );
          })}
          <span className="ml-auto pr-2 text-[11px] text-muted-foreground">
            Member since Jan 2024
          </span>
        </div>

        {/* Content */}
        <div className="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-3">
          {/* Left column */}
          <div className="space-y-6 lg:col-span-2">
            {/* Skills */}
            <Panel
              title="Skills & expertise"
              icon={<Sparkles className="h-4 w-4 text-primary" />}
              action={
                <button className="text-xs font-medium text-primary hover:underline">
                  Manage
                </button>
              }
            >
              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                {SKILLS.map((s) => (
                  <div key={s.name}>
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-medium text-foreground/85">
                        {s.name}
                      </span>
                      <span className="tabular-nums text-muted-foreground">
                        {s.level}%
                      </span>
                    </div>
                    <div className="mt-1.5 h-1.5 overflow-hidden rounded-full bg-surface-muted">
                      <div
                        className="h-full rounded-full bg-gradient-to-r from-primary to-accent"
                        style={{ width: `${s.level}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
              <div className="mt-5 flex flex-wrap gap-1.5">
                {TAGS.map((tag) => (
                  <span
                    key={tag}
                    className="inline-flex items-center rounded-full border border-border/70 bg-surface-muted/60 px-2.5 py-1 text-[11px] font-medium text-foreground/80"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </Panel>

            {/* Projects */}
            <Panel
              title="Projects"
              icon={<Layers className="h-4 w-4 text-primary" />}
              action={
                <a className="inline-flex items-center gap-1 text-xs font-medium text-primary hover:underline">
                  View all <ChevronRight className="h-3 w-3" />
                </a>
              }
            >
              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                {PROJECTS.map((p) => (
                  <ProjectCard key={p.slug} p={p} />
                ))}
              </div>
            </Panel>

            {/* Recent Activity */}
            <Panel
              title="Recent activity"
              icon={<ActivityIcon className="h-4 w-4 text-primary" />}
              action={
                <a className="text-xs font-medium text-primary hover:underline">
                  See all
                </a>
              }
            >
              <ul className="relative space-y-4 pl-6">
                <span className="absolute left-[11px] top-1 bottom-1 w-px bg-gradient-to-b from-primary/40 via-border to-transparent" />
                {ACTIVITY.map((a) => {
                  const Icon = a.icon;
                  return (
                    <li key={a.id} className="relative">
                      <span
                        className={`absolute -left-6 top-0.5 flex h-6 w-6 items-center justify-center rounded-full ring-2 ring-surface ${a.tint}`}
                      >
                        <Icon className="h-3 w-3" />
                      </span>
                      <div className="rounded-xl border border-border/60 bg-surface-muted/30 px-3 py-2.5 transition hover:border-primary/40">
                        <div className="flex items-start justify-between gap-3">
                          <div className="min-w-0">
                            <p className="text-[13px] leading-5">
                              <span className="font-semibold">Elena</span>{" "}
                              <span className="text-foreground/80">{a.text}</span>
                            </p>
                            <p className="mt-0.5 text-[12px] text-muted-foreground">
                              {a.detail}
                            </p>
                          </div>
                          <span className="shrink-0 text-[11px] text-muted-foreground">
                            {a.time}
                          </span>
                        </div>
                      </div>
                    </li>
                  );
                })}
              </ul>
            </Panel>
          </div>

          {/* Right column */}
          <div className="space-y-6">
            {/* Links */}
            <Panel
              title="Links"
              icon={<LinkIcon className="h-4 w-4 text-primary" />}
            >
              <ul className="space-y-2">
                {LINKS.map((l) => {
                  const Icon = l.icon;
                  return (
                    <li key={l.id}>
                      <a
                        className="group flex items-center gap-3 rounded-xl border border-border/60 bg-surface-muted/30 px-3 py-2.5 transition hover:-translate-y-0.5 hover:border-primary/40 hover:bg-surface"
                        href="#"
                      >
                        <span
                          className={`flex h-9 w-9 items-center justify-center rounded-lg ${l.tint}`}
                        >
                          <Icon className="h-4 w-4" />
                        </span>
                        <div className="min-w-0 flex-1">
                          <div className="text-[13px] font-semibold">
                            {l.label}
                          </div>
                          <div className="truncate text-[11px] text-muted-foreground">
                            {l.handle}
                          </div>
                        </div>
                        <ArrowUpRight className="h-3.5 w-3.5 text-muted-foreground transition group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-primary" />
                      </a>
                    </li>
                  );
                })}
              </ul>
            </Panel>

            {/* Achievements */}
            <Panel
              title="Achievements"
              icon={<Trophy className="h-4 w-4 text-primary" />}
            >
              <div className="grid grid-cols-2 gap-2">
                {ACHIEVEMENTS.map((a) => {
                  const Icon = a.icon;
                  return (
                    <div
                      key={a.label}
                      className="flex flex-col items-center gap-2 rounded-xl border border-border/60 bg-gradient-to-b from-surface to-surface-muted/40 p-3 text-center"
                    >
                      <span className="flex h-9 w-9 items-center justify-center rounded-full bg-gradient-to-br from-primary/15 to-accent/15 text-primary">
                        <Icon className="h-4 w-4" />
                      </span>
                      <span className="text-[11px] font-medium leading-tight text-foreground/85">
                        {a.label}
                      </span>
                    </div>
                  );
                })}
              </div>
            </Panel>

            {/* Contribution heatmap */}
            <Panel
              title="Contributions"
              icon={<Calendar className="h-4 w-4 text-primary" />}
              action={
                <span className="text-[11px] text-muted-foreground">
                  Last 12 weeks
                </span>
              }
            >
              <Heatmap />
              <div className="mt-3 flex items-center justify-between text-[11px] text-muted-foreground">
                <span>
                  <span className="font-semibold text-foreground">412</span>{" "}
                  contributions
                </span>
                <div className="flex items-center gap-1">
                  <span>Less</span>
                  {[0.12, 0.25, 0.45, 0.7, 1].map((o, i) => (
                    <span
                      key={i}
                      className="h-2.5 w-2.5 rounded-sm bg-primary"
                      style={{ opacity: o }}
                    />
                  ))}
                  <span>More</span>
                </div>
              </div>
            </Panel>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ---------------------------- primitives ---------------------------- */

function Panel({
  title,
  icon,
  action,
  children,
}: {
  title: string;
  icon?: React.ReactNode;
  action?: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <section className="rounded-2xl border border-border/70 bg-surface p-5 shadow-sm">
      <header className="mb-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          {icon}
          <h2 className="text-sm font-semibold tracking-tight">{title}</h2>
        </div>
        {action}
      </header>
      {children}
    </section>
  );
}

function ProjectCard({
  p,
}: {
  p: (typeof PROJECTS)[number];
}) {
  const statusTint =
    p.status === "Shipped"
      ? "text-emerald-700 bg-emerald-50"
      : p.status === "In review"
        ? "text-amber-700 bg-amber-50"
        : p.status === "Planning"
          ? "text-sky-700 bg-orange-50"
          : "text-primary bg-primary/10";
  return (
    <a
      className="group relative overflow-hidden rounded-2xl border border-border/60 bg-surface-muted/30 p-4 transition hover:-translate-y-0.5 hover:border-primary/40 hover:bg-surface hover:shadow-md"
      href="#"
    >
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-3">
          <div
            className="flex h-10 w-10 items-center justify-center rounded-xl text-[11px] font-bold text-white"
            style={{
              background: `linear-gradient(135deg, oklch(0.7 0.18 ${p.tone}), oklch(0.5 0.2 ${
                (p.tone + 40) % 360
              }))`,
            }}
          >
            {p.slug}
          </div>
          <div>
            <div className="text-[14px] font-semibold">{p.name}</div>
            <div className="text-[11px] text-muted-foreground">{p.role}</div>
          </div>
        </div>
        <span
          className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[10px] font-semibold ${statusTint}`}
        >
          <span
            className="h-1.5 w-1.5 rounded-full"
            style={{
              background:
                p.status === "Shipped"
                  ? "oklch(0.65 0.18 150)"
                  : p.status === "In review"
                    ? "oklch(0.7 0.17 60)"
                    : p.status === "Planning"
                      ? "oklch(0.65 0.14 220)"
                      : "oklch(0.6 0.2 268)",
            }}
          />
          {p.status}
        </span>
      </div>
      <div className="mt-4">
        <div className="flex items-center justify-between text-[11px] text-muted-foreground">
          <span>Progress</span>
          <span className="tabular-nums">{p.progress}%</span>
        </div>
        <div className="mt-1 h-1.5 overflow-hidden rounded-full bg-surface-muted">
          <div
            className="h-full rounded-full"
            style={{
              width: `${p.progress}%`,
              background: `linear-gradient(90deg, oklch(0.7 0.18 ${p.tone}), oklch(0.55 0.22 ${
                (p.tone + 40) % 360
              }))`,
            }}
          />
        </div>
      </div>
      <div className="mt-3 flex items-center justify-between text-[11px] text-muted-foreground">
        <div className="flex -space-x-1.5">
          {Array.from({ length: Math.min(p.members, 4) }).map((_, i) => (
            <span
              key={i}
              className="inline-block h-5 w-5 rounded-full ring-2 ring-surface"
              style={{
                background: `linear-gradient(135deg, oklch(0.75 0.14 ${(p.tone + i * 40) % 360}), oklch(0.55 0.2 ${
                  (p.tone + 20 + i * 40) % 360
                }))`,
              }}
            />
          ))}
          {p.members > 4 ? (
            <span className="inline-flex h-5 items-center justify-center rounded-full bg-surface-muted px-1.5 text-[9px] font-semibold ring-2 ring-surface">
              +{p.members - 4}
            </span>
          ) : null}
        </div>
        <span className="inline-flex items-center gap-1 text-primary opacity-0 transition group-hover:opacity-100">
          Open <ArrowUpRight className="h-3 w-3" />
        </span>
      </div>
    </a>
  );
}

function Heatmap() {
  // Deterministic pseudo-random pattern
  const cells = Array.from({ length: 12 * 7 }).map((_, i) => {
    const v = Math.abs(Math.sin(i * 12.9898) * 43758.5453) % 1;
    return v;
  });
  return (
    <div className="grid grid-flow-col grid-rows-7 gap-1">
      {cells.map((v, i) => {
        const level = v < 0.2 ? 0 : v < 0.4 ? 1 : v < 0.65 ? 2 : v < 0.85 ? 3 : 4;
        const opacity = [0.08, 0.22, 0.42, 0.68, 1][level];
        return (
          <span
            key={i}
            className="h-3 w-3 rounded-[3px] bg-primary transition hover:scale-125"
            style={{ opacity }}
            title={`${Math.round(v * 12)} contributions`}
          />
        );
      })}
    </div>
  );
}
