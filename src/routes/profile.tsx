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
  AlertCircle,
  RefreshCw,
} from "lucide-react";

import { requireAuth } from "@/lib/requireAuth";
import { ProtectedRoute } from "@/components/auth/ProtectedRoute";
import { useAuth } from "@/hooks/useAuth";
import { useProfile } from "@/features/profile/hooks";

export const Route = createFileRoute("/profile")({
  head: () => ({
    meta: [
      { title: "Zabaku Profile" },
      {
        name: "description",
        content:
          "Product engineer at Northwind — projects, skills, and recent activity across the Zabaku workspace.",
      },
      { property: "og:title", content: "Zabaku Profile" },
      {
        property: "og:description",
        content:
          "Product engineer building the future of AI-native SaaS at Northwind.",
      },
      { property: "og:type", content: "profile" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  beforeLoad: requireAuth,
  component: () => (
    <ProtectedRoute>
      <ProfilePage />
    </ProtectedRoute>
  ),
});

/* ------------------------------- data ------------------------------- */

const DEFAULT_USER = {
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
];

const ACHIEVEMENTS = [
  { label: "100 PRs merged", icon: Trophy },
  { label: "AI early adopter", icon: Sparkles },
  { label: "Ship streak · 21 days", icon: Zap },
  { label: "Top reviewer Q2", icon: Star },
];

const TABS = ["Overview", "Projects", "Activity", "Skills"] as const;
type Tab = (typeof TABS)[number];

function deriveHue(name?: string): number {
  if (!name) return 268;
  let hash = 0;
  for (let i = 0; i < name.length; i++) {
    hash = name.charCodeAt(i) + ((hash << 5) - hash);
  }
  return Math.abs(hash % 360);
}

/* ------------------------------- page ------------------------------- */

function ProfilePage() {
  const { user: authUser } = useAuth();
  const { data: profile, isLoading, isError, error, refetch } = useProfile();

  const [tab, setTab] = useState<Tab>("Overview");
  const [following, setFollowing] = useState(false);

  const name = profile?.name ?? authUser?.name ?? DEFAULT_USER.name;
  const email = profile?.email ?? authUser?.email ?? DEFAULT_USER.email;
  const handle = profile?.handle ?? `@${name.toLowerCase().replace(/\s+/g, "")}`;
  const role = (profile?.role as string) ?? (profile?.title as string) ?? DEFAULT_USER.role;
  const company = (profile?.team as string) ?? DEFAULT_USER.company;
  const location = (profile?.location as string) ?? DEFAULT_USER.location;
  const bio = (profile?.bio as string) ?? DEFAULT_USER.bio;
  const avatarUrl = profile?.avatarUrl;
  const hue = profile?.hue ? Number(profile.hue) : deriveHue(name);
  const initials = name.split(" ").map((n) => n[0]).join("").slice(0, 2).toUpperCase() || "ER";

  return (
    <div className="relative min-h-screen bg-background text-foreground">
      <div className="pointer-events-none absolute inset-0 -z-10 overflow-hidden">
        <div className="absolute -top-56 left-1/2 h-[520px] w-[880px] -translate-x-1/2 rounded-full bg-primary/15 blur-3xl" />
        <div className="absolute right-[-160px] top-40 h-[360px] w-[560px] rounded-full bg-accent/20 blur-3xl" />
      </div>

      <div className="mx-auto max-w-[1200px] px-6 py-8">
        {/* Error banner */}
        {isError && (
          <div className="mb-6 flex items-center justify-between rounded-xl border border-destructive/30 bg-destructive/10 px-4 py-3 text-[12.5px] text-destructive">
            <div className="flex items-center gap-2 font-medium">
              <AlertCircle className="h-4 w-4 shrink-0" />
              <span>{error instanceof Error ? error.message : "Failed to load profile."}</span>
            </div>
            <button
              onClick={() => refetch()}
              className="flex items-center gap-1 rounded-md bg-destructive px-3 py-1 text-[11.5px] font-semibold text-white hover:opacity-90"
            >
              <RefreshCw className="h-3 w-3" /> Retry
            </button>
          </div>
        )}

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
                  {avatarUrl ? (
                    <img
                      src={avatarUrl}
                      alt={name}
                      className="h-28 w-28 rounded-3xl object-cover shadow-xl ring-4 ring-surface sm:h-32 sm:w-32"
                    />
                  ) : (
                    <div
                      className="flex h-28 w-28 items-center justify-center rounded-3xl text-3xl font-bold text-white shadow-xl ring-4 ring-surface sm:h-32 sm:w-32"
                      style={{
                        background: `linear-gradient(135deg, oklch(0.72 0.16 ${hue}), oklch(0.5 0.2 ${
                          (hue + 60) % 360
                        }))`,
                      }}
                    >
                      {initials}
                    </div>
                  )}
                  <span className="absolute bottom-1.5 right-1.5 flex h-5 w-5 items-center justify-center rounded-full bg-emerald-500 ring-2 ring-surface">
                    <span className="h-1.5 w-1.5 rounded-full bg-white" />
                  </span>
                </div>

                {/* name + role */}
                <div>
                  <div className="flex flex-wrap items-center gap-2">
                    <h1 className="text-2xl font-semibold tracking-tight sm:text-3xl">
                      {name}
                    </h1>
                    <span className="rounded-full bg-primary/10 px-2.5 py-0.5 text-xs font-semibold text-primary">
                      {role}
                    </span>
                  </div>
                  <div className="mt-1 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-muted-foreground">
                    <span>{handle}</span>
                    <span>·</span>
                    <span>{company}</span>
                    <span>·</span>
                    <span className="inline-flex items-center gap-1">
                      <MapPin className="h-3 w-3" /> {location}
                    </span>
                    <span>·</span>
                    <span className="inline-flex items-center gap-1">
                      <Mail className="h-3 w-3" /> {email}
                    </span>
                  </div>
                </div>
              </div>

              {/* actions */}
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setFollowing((f) => !f)}
                  className={`inline-flex items-center gap-1.5 rounded-xl px-4 py-2 text-xs font-semibold shadow-sm transition ${
                    following
                      ? "border border-border/70 bg-surface text-foreground"
                      : "bg-gradient-to-r from-primary to-accent text-white shadow-primary/25 hover:shadow-primary/40"
                  }`}
                >
                  {following ? "Following" : "Follow"}
                </button>
                <button className="inline-flex items-center gap-1.5 rounded-xl border border-border/70 bg-surface px-3.5 py-2 text-xs font-medium text-foreground/80 hover:border-primary/40">
                  <MessageSquare className="h-3.5 w-3.5" />
                  Message
                </button>
                <button className="rounded-xl border border-border/70 bg-surface p-2 text-muted-foreground hover:border-primary/40 hover:text-foreground">
                  <Share2 className="h-4 w-4" />
                </button>
              </div>
            </div>

            {/* bio */}
            <p className="mt-5 max-w-3xl text-sm leading-relaxed text-foreground/85">
              {bio}
            </p>

            {/* tabs */}
            <div className="mt-6 flex border-b border-border/60">
              {TABS.map((t) => (
                <button
                  key={t}
                  onClick={() => setTab(t)}
                  className={`relative px-4 py-2.5 text-xs font-medium transition ${
                    tab === t
                      ? "text-primary font-semibold"
                      : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  {t}
                  {tab === t ? (
                    <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-primary to-accent" />
                  ) : null}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* stats bar */}
        <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-4">
          {STATS.map((s) => {
            const Icon = s.icon;
            return (
              <div
                key={s.label}
                className="flex items-center gap-3 rounded-2xl border border-border/70 bg-surface p-4 shadow-xs"
              >
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-primary/10 to-accent/10 text-primary">
                  <Icon className="h-5 w-5" />
                </div>
                <div>
                  <div className="text-xl font-semibold tracking-tight">{s.value}</div>
                  <div className="text-[11px] text-muted-foreground">{s.label}</div>
                </div>
              </div>
            );
          })}
        </div>

        {/* main grid */}
        <div className="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-[1fr_320px]">
          {/* left column */}
          <div className="space-y-6">
            {/* projects */}
            <section className="rounded-2xl border border-border/70 bg-surface p-6 shadow-xs">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-semibold">Active projects</h3>
                  <p className="text-[11px] text-muted-foreground">
                    Projects Elena contributes to or leads
                  </p>
                </div>
                <button className="inline-flex items-center gap-1 text-xs font-medium text-primary hover:underline">
                  View all <ChevronRight className="h-3 w-3" />
                </button>
              </div>

              <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2">
                {PROJECTS.map((p) => (
                  <div
                    key={p.name}
                    className="group relative overflow-hidden rounded-xl border border-border/70 bg-surface p-4 transition hover:-translate-y-0.5 hover:border-primary/40 hover:shadow-md"
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-2.5">
                        <span
                          className="flex h-8 w-8 items-center justify-center rounded-lg text-xs font-bold text-white shadow-xs"
                          style={{
                            background: `linear-gradient(135deg, oklch(0.68 0.18 ${p.tone}), oklch(0.5 0.2 ${(p.tone + 40) % 360}))`,
                          }}
                        >
                          {p.slug}
                        </span>
                        <div>
                          <h4 className="text-[13px] font-semibold">{p.name}</h4>
                          <span className="text-[11px] text-muted-foreground">
                            {p.role}
                          </span>
                        </div>
                      </div>
                      <span className="rounded-full bg-surface-muted px-2 py-0.5 text-[10px] font-semibold text-muted-foreground">
                        {p.status}
                      </span>
                    </div>

                    <div className="mt-4">
                      <div className="flex justify-between text-[11px] text-muted-foreground">
                        <span>Progress</span>
                        <span className="font-semibold text-foreground">
                          {p.progress}%
                        </span>
                      </div>
                      <div className="mt-1 h-1.5 w-full overflow-hidden rounded-full bg-surface-muted">
                        <div
                          className="h-full rounded-full bg-gradient-to-r from-primary to-accent transition-all duration-500"
                          style={{ width: `${p.progress}%` }}
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </section>

            {/* skills */}
            <section className="rounded-2xl border border-border/70 bg-surface p-6 shadow-xs">
              <h3 className="text-sm font-semibold">Skills & competencies</h3>
              <p className="text-[11px] text-muted-foreground">
                Self-reported and verified by peer review
              </p>

              <div className="mt-4 space-y-3">
                {SKILLS.map((sk) => (
                  <div key={sk.name}>
                    <div className="flex justify-between text-xs font-medium">
                      <span>{sk.name}</span>
                      <span className="text-muted-foreground">{sk.level}%</span>
                    </div>
                    <div className="mt-1.5 h-2 w-full overflow-hidden rounded-full bg-surface-muted">
                      <div
                        className="h-full rounded-full bg-gradient-to-r from-primary to-accent"
                        style={{ width: `${sk.level}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-5 flex flex-wrap gap-1.5 border-t border-border/60 pt-4">
                {TAGS.map((t) => (
                  <span
                    key={t}
                    className="rounded-lg border border-border/70 bg-surface-muted/60 px-2.5 py-1 text-[11px] font-medium text-foreground/80"
                  >
                    #{t}
                  </span>
                ))}
              </div>
            </section>
          </div>

          {/* right column */}
          <div className="space-y-6">
            {/* achievements */}
            <section className="rounded-2xl border border-border/70 bg-surface p-5 shadow-xs">
              <h3 className="text-sm font-semibold">Achievements</h3>
              <div className="mt-3 grid grid-cols-2 gap-2">
                {ACHIEVEMENTS.map((a) => {
                  const Icon = a.icon;
                  return (
                    <div
                      key={a.label}
                      className="flex flex-col items-center rounded-xl border border-border/60 bg-surface-muted/40 p-3 text-center"
                    >
                      <span className="flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-br from-primary/15 to-accent/15 text-primary">
                        <Icon className="h-4 w-4" />
                      </span>
                      <span className="mt-2 text-[11px] font-semibold leading-tight">
                        {a.label}
                      </span>
                    </div>
                  );
                })}
              </div>
            </section>

            {/* recent activity */}
            <section className="rounded-2xl border border-border/70 bg-surface p-5 shadow-xs">
              <h3 className="text-sm font-semibold">Recent activity</h3>
              <ol className="relative mt-4 space-y-4 border-l border-border/70 pl-4">
                {ACTIVITY.map((a) => {
                  const Icon = a.icon;
                  return (
                    <li key={a.id} className="relative">
                      <span
                        className={`absolute -left-[25px] top-0.5 flex h-5 w-5 items-center justify-center rounded-full ring-4 ring-surface ${a.tint}`}
                      >
                        <Icon className="h-2.5 w-2.5" />
                      </span>
                      <div className="text-[12.5px] leading-snug">
                        <span className="font-semibold">{a.text}</span>
                      </div>
                      <div className="text-[11px] text-muted-foreground">
                        {a.detail}
                      </div>
                      <div className="mt-0.5 text-[10px] text-muted-foreground/70">
                        {a.time}
                      </div>
                    </li>
                  );
                })}
              </ol>
            </section>

            {/* links */}
            <section className="rounded-2xl border border-border/70 bg-surface p-5 shadow-xs">
              <h3 className="text-sm font-semibold">Connect</h3>
              <div className="mt-3 space-y-2">
                {LINKS.map((l) => {
                  const Icon = l.icon;
                  return (
                    <a
                      key={l.id}
                      href={`https://${l.handle}`}
                      target="_blank"
                      rel="noreferrer"
                      className="flex items-center justify-between rounded-xl border border-border/70 bg-surface px-3 py-2 text-xs transition hover:border-primary/40"
                    >
                      <div className="flex items-center gap-2.5">
                        <span
                          className={`flex h-7 w-7 items-center justify-center rounded-lg ${l.tint}`}
                        >
                          <Icon className="h-3.5 w-3.5" />
                        </span>
                        <span className="font-medium">{l.label}</span>
                      </div>
                      <span className="text-[11px] text-muted-foreground">
                        {l.handle}
                      </span>
                    </a>
                  );
                })}
              </div>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
}
