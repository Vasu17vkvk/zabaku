import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useMemo, useRef, useState } from "react";
import {
  Sparkles,
  ArrowUp,
  Paperclip,
  AtSign,
  Wand2,
  Command,
  FileText,
  ListChecks,
  Database,
  Code2,
  BookOpen,
  Rocket,
  Copy,
  Download,
  Check,
  RefreshCw,
  MoreHorizontal,
  ChevronRight,
  Clock,
  Pin,
  Bookmark,
  Zap,
  Layers,
  GitBranch,
  Share2,
  Star,
} from "lucide-react";

export const Route = createFileRoute("/ai")({
  head: () => ({
    meta: [
      { title: "AI Workspace · Zabaku" },
      {
        name: "description",
        content:
          "Zabaku AI Workspace — generate project plans, sprint plans, tasks, database schemas and API structures with a beautiful ChatGPT-meets-Notion experience.",
      },
      { property: "og:title", content: "AI Workspace · Zabaku" },
      {
        property: "og:description",
        content:
          "Prompt, generate, and iterate. Beautiful AI-generated docs, schemas and plans — right in your workspace.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: AIWorkspace,
});

/* ------------------------------- data ------------------------------- */

const TEMPLATES = [
  {
    id: "project-plan",
    label: "Project Plan",
    desc: "End-to-end plan with phases, milestones and owners.",
    icon: Rocket,
    tint: "from-orange-500/15 to-amber-400/10",
    prompt: "Generate a full project plan for launching Zabaku 2.0 in Q3 2026.",
  },
  {
    id: "sprint-plan",
    label: "Sprint Plan",
    desc: "Two-week sprint with capacity, goals and stories.",
    icon: Zap,
    tint: "from-rose-500/15 to-orange-500/10",
    prompt: "Plan a 2-week sprint for the Billing squad focused on invoices v2.",
  },
  {
    id: "tasks",
    label: "Tasks",
    desc: "Break a feature into actionable engineering tasks.",
    icon: ListChecks,
    tint: "from-emerald-500/15 to-amber-400/10",
    prompt: "Break down the OAuth login feature into engineering tasks.",
  },
  {
    id: "schema",
    label: "Database Schema",
    desc: "Postgres schema with tables, columns and relations.",
    icon: Database,
    tint: "from-amber-500/15 to-rose-400/10",
    prompt: "Design a Postgres schema for a multi-tenant SaaS with billing.",
  },
  {
    id: "api",
    label: "API Structure",
    desc: "REST or tRPC endpoints, contracts and errors.",
    icon: Code2,
    tint: "from-orange-500/15 to-orange-500/10",
    prompt: "Draft a REST API structure for a Kanban product like Zabaku.",
  },
  {
    id: "readme",
    label: "README",
    desc: "Polished README with setup, usage and badges.",
    icon: BookOpen,
    tint: "from-amber-500/15 to-rose-400/10",
    prompt: "Write a README for the Zabaku CLI in the style of Vercel docs.",
  },
] as const;

const SUGGESTIONS = [
  "Draft a launch plan for our AI Copilot",
  "Design the schema for a subscription billing model",
  "Break the checkout redesign into a 2-week sprint",
  "Summarize this week's engineering activity",
  "Write API docs for the /projects endpoint",
];

const RECENT = [
  {
    id: "r1",
    title: "Zabaku 2.0 launch plan",
    kind: "Project Plan",
    time: "2m ago",
    pinned: true,
  },
  { id: "r2", title: "Billing v2 sprint", kind: "Sprint Plan", time: "1h ago" },
  { id: "r3", title: "Workspace schema", kind: "Schema", time: "Today" },
  { id: "r4", title: "REST API — /tasks", kind: "API", time: "Yesterday" },
  { id: "r5", title: "CLI README draft", kind: "README", time: "Mon" },
  { id: "r6", title: "Onboarding tasks", kind: "Tasks", time: "Sun" },
];

/* --------------------------- typing hook --------------------------- */

function useTypewriter(text: string, speed = 8) {
  const [out, setOut] = useState("");
  const [done, setDone] = useState(false);
  useEffect(() => {
    setOut("");
    setDone(false);
    let i = 0;
    const id = window.setInterval(() => {
      i += Math.max(1, Math.round(text.length / 240));
      if (i >= text.length) {
        setOut(text);
        setDone(true);
        window.clearInterval(id);
      } else {
        setOut(text.slice(0, i));
      }
    }, speed);
    return () => window.clearInterval(id);
  }, [text, speed]);
  return { out, done };
}

/* -------------------------- markdown lite -------------------------- */

type Block =
  | { type: "h1" | "h2" | "h3" | "p"; text: string }
  | { type: "ul"; items: string[] }
  | { type: "ol"; items: string[] }
  | { type: "code"; lang: string; code: string }
  | { type: "table"; head: string[]; rows: string[][] };

function parseMarkdown(src: string): Block[] {
  const blocks: Block[] = [];
  const lines = src.split("\n");
  let i = 0;
  while (i < lines.length) {
    const line = lines[i];
    if (line.startsWith("```")) {
      const lang = line.slice(3).trim() || "text";
      const buf: string[] = [];
      i++;
      while (i < lines.length && !lines[i].startsWith("```")) {
        buf.push(lines[i]);
        i++;
      }
      i++;
      blocks.push({ type: "code", lang, code: buf.join("\n") });
      continue;
    }
    if (/^\|.+\|$/.test(line) && /^\|[-:\s|]+\|$/.test(lines[i + 1] ?? "")) {
      const head = line.split("|").slice(1, -1).map((s) => s.trim());
      i += 2;
      const rows: string[][] = [];
      while (i < lines.length && /^\|.+\|$/.test(lines[i])) {
        rows.push(lines[i].split("|").slice(1, -1).map((s) => s.trim()));
        i++;
      }
      blocks.push({ type: "table", head, rows });
      continue;
    }
    if (line.startsWith("### ")) {
      blocks.push({ type: "h3", text: line.slice(4) });
      i++;
      continue;
    }
    if (line.startsWith("## ")) {
      blocks.push({ type: "h2", text: line.slice(3) });
      i++;
      continue;
    }
    if (line.startsWith("# ")) {
      blocks.push({ type: "h1", text: line.slice(2) });
      i++;
      continue;
    }
    if (/^\s*[-*]\s+/.test(line)) {
      const items: string[] = [];
      while (i < lines.length && /^\s*[-*]\s+/.test(lines[i])) {
        items.push(lines[i].replace(/^\s*[-*]\s+/, ""));
        i++;
      }
      blocks.push({ type: "ul", items });
      continue;
    }
    if (/^\s*\d+\.\s+/.test(line)) {
      const items: string[] = [];
      while (i < lines.length && /^\s*\d+\.\s+/.test(lines[i])) {
        items.push(lines[i].replace(/^\s*\d+\.\s+/, ""));
        i++;
      }
      blocks.push({ type: "ol", items });
      continue;
    }
    if (line.trim().length === 0) {
      i++;
      continue;
    }
    const buf: string[] = [line];
    i++;
    while (
      i < lines.length &&
      lines[i].trim().length > 0 &&
      !lines[i].startsWith("#") &&
      !/^\s*[-*]\s+/.test(lines[i]) &&
      !/^\s*\d+\.\s+/.test(lines[i]) &&
      !lines[i].startsWith("```") &&
      !/^\|.+\|$/.test(lines[i])
    ) {
      buf.push(lines[i]);
      i++;
    }
    blocks.push({ type: "p", text: buf.join(" ") });
  }
  return blocks;
}

function renderInline(text: string) {
  // bold **x**, code `x`
  const parts: React.ReactNode[] = [];
  const regex = /(\*\*[^*]+\*\*|`[^`]+`)/g;
  let last = 0;
  let m: RegExpExecArray | null;
  let key = 0;
  while ((m = regex.exec(text)) !== null) {
    if (m.index > last) parts.push(text.slice(last, m.index));
    const t = m[0];
    if (t.startsWith("**")) {
      parts.push(
        <strong key={key++} className="font-semibold text-foreground">
          {t.slice(2, -2)}
        </strong>,
      );
    } else {
      parts.push(
        <code
          key={key++}
          className="rounded-md bg-muted px-1.5 py-0.5 font-mono text-[0.85em] text-foreground"
        >
          {t.slice(1, -1)}
        </code>,
      );
    }
    last = m.index + t.length;
  }
  if (last < text.length) parts.push(text.slice(last));
  return parts;
}

function Markdown({ source }: { source: string }) {
  const blocks = useMemo(() => parseMarkdown(source), [source]);
  return (
    <div className="space-y-4 text-[15px] leading-7 text-foreground/85">
      {blocks.map((b, i) => {
        switch (b.type) {
          case "h1":
            return (
              <h1 key={i} className="mt-2 text-2xl font-semibold tracking-tight text-foreground">
                {renderInline(b.text)}
              </h1>
            );
          case "h2":
            return (
              <h2 key={i} className="mt-4 text-xl font-semibold tracking-tight text-foreground">
                {renderInline(b.text)}
              </h2>
            );
          case "h3":
            return (
              <h3 key={i} className="mt-3 text-base font-semibold text-foreground">
                {renderInline(b.text)}
              </h3>
            );
          case "p":
            return <p key={i}>{renderInline(b.text)}</p>;
          case "ul":
            return (
              <ul key={i} className="space-y-1.5 pl-1">
                {b.items.map((it, k) => (
                  <li key={k} className="flex gap-2.5">
                    <span className="mt-2.5 inline-block h-1.5 w-1.5 shrink-0 rounded-full bg-primary/70" />
                    <span>{renderInline(it)}</span>
                  </li>
                ))}
              </ul>
            );
          case "ol":
            return (
              <ol key={i} className="space-y-1.5 pl-1">
                {b.items.map((it, k) => (
                  <li key={k} className="flex gap-2.5">
                    <span className="mt-0.5 inline-flex h-5 w-5 shrink-0 items-center justify-center rounded-md bg-primary/10 font-mono text-[11px] text-primary">
                      {k + 1}
                    </span>
                    <span>{renderInline(it)}</span>
                  </li>
                ))}
              </ol>
            );
          case "code":
            return <CodeBlock key={i} code={b.code} lang={b.lang} />;
          case "table":
            return (
              <div
                key={i}
                className="overflow-hidden rounded-xl border border-border/70 bg-surface"
              >
                <table className="w-full text-sm">
                  <thead className="bg-surface-muted/70">
                    <tr>
                      {b.head.map((h, k) => (
                        <th
                          key={k}
                          className="px-4 py-2.5 text-left font-medium text-foreground/70"
                        >
                          {h}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {b.rows.map((r, ri) => (
                      <tr key={ri} className="border-t border-border/60">
                        {r.map((c, ci) => (
                          <td key={ci} className="px-4 py-2.5 text-foreground/80">
                            {renderInline(c)}
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            );
        }
      })}
    </div>
  );
}

/* ----------------------------- code block ----------------------------- */

function CodeBlock({ code, lang }: { code: string; lang: string }) {
  const [copied, setCopied] = useState(false);
  return (
    <div className="overflow-hidden rounded-xl border border-border/70 bg-[oklch(0.16_0.03_265)] text-[oklch(0.94_0.01_250)] shadow-sm">
      <div className="flex items-center justify-between border-b border-white/5 px-3.5 py-2">
        <div className="flex items-center gap-2 text-xs">
          <span className="inline-flex h-2 w-2 rounded-full bg-[#ff5f57]" />
          <span className="inline-flex h-2 w-2 rounded-full bg-[#febc2e]" />
          <span className="inline-flex h-2 w-2 rounded-full bg-[#28c840]" />
          <span className="ml-2 font-mono text-white/50">{lang}</span>
        </div>
        <button
          onClick={() => {
            navigator.clipboard?.writeText(code);
            setCopied(true);
            window.setTimeout(() => setCopied(false), 1400);
          }}
          className="inline-flex items-center gap-1.5 rounded-md px-2 py-1 text-xs text-white/60 transition hover:bg-white/5 hover:text-white"
        >
          {copied ? <Check className="h-3.5 w-3.5" /> : <Copy className="h-3.5 w-3.5" />}
          {copied ? "Copied" : "Copy"}
        </button>
      </div>
      <pre className="overflow-x-auto p-4 font-mono text-[13px] leading-6">
        <code>{code}</code>
      </pre>
    </div>
  );
}

/* --------------------------- sample outputs --------------------------- */

const OUTPUTS: Record<string, { title: string; kind: string; content: string }> = {
  "project-plan": {
    title: "Zabaku 2.0 — Launch Plan",
    kind: "Project Plan",
    content: `# Zabaku 2.0 — Launch Plan
A cross-functional plan to ship the next generation of the AI operating system.

## Objectives
- Ship **Zabaku 2.0** on **Sep 24, 2026**
- Grow activated workspaces by **35%** in Q4
- Reach **NPS 55+** across paid customers

## Phases
### 1. Discovery (Weeks 1–2)
- Customer interviews with 20 design partners
- Competitive teardown vs Linear, Notion AI, Height
- Success metrics locked with leadership

### 2. Build (Weeks 3–8)
- Ship AI Planner, Copilot v2, and multiplayer docs
- Weekly demos every Friday
- Instrumentation with product analytics

### 3. Launch (Weeks 9–10)
- Press embargo, changelog, launch video
- Waitlist onboarding wave 1 → 3
- Enable pricing plans on billing infra

## Milestones
| Milestone | Owner | Date | Status |
| --- | --- | --- | --- |
| Design lock | Priya | Aug 04 | On track |
| Beta open | Marco | Aug 21 | On track |
| GA launch | Elena | Sep 24 | Planned |

## Risks
- **Model latency** on long documents — mitigate with streaming + caching.
- **Onboarding drop-off** — build interactive tour before beta.`,
  },
  "sprint-plan": {
    title: "Billing squad — Sprint 42",
    kind: "Sprint Plan",
    content: `# Sprint 42 — Billing squad
Two-week sprint focused on **Invoices v2** and Stripe reconciliation.

## Goals
1. Ship invoice PDF renderer
2. Backfill 12 months of usage records
3. Reduce failed payments by 20%

## Capacity
- 5 engineers · 8 working days · **72 story points**

## Stories
- **BIL-421** — Invoice PDF renderer *(8 pts, Ana)*
- **BIL-423** — Reconcile Stripe events *(5 pts, Owen)*
- **BIL-427** — Retry ladder for failed cards *(8 pts, Kai)*
- **BIL-431** — Admin billing timeline *(5 pts, Priya)*

## Definition of Done
- Feature-flagged and rolled out to 10% of workspaces
- Dashboards updated with new metrics
- Runbook committed to the on-call repo`,
  },
  tasks: {
    title: "OAuth Login — Task Breakdown",
    kind: "Tasks",
    content: `# OAuth Login — Task Breakdown

## Backend
- Add provider table and encrypted token store
- Implement \`/auth/callback\` handler with PKCE
- Rotate refresh tokens on every use

## Frontend
- Build "Continue with Google" and "Continue with GitHub"
- Handle error states (canceled, denied, network)
- Persist workspace selection across sessions

## QA
- E2E across Chrome, Safari, Firefox
- Verify session invalidation on password reset

\`\`\`ts
export async function exchangeCode(code: string, verifier: string) {
  const res = await fetch("/auth/callback", {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify({ code, verifier }),
  });
  if (!res.ok) throw new Error("oauth_exchange_failed");
  return res.json() as Promise<{ token: string; workspaceId: string }>;
}
\`\`\``,
  },
  schema: {
    title: "Multi-tenant SaaS — Postgres Schema",
    kind: "Database Schema",
    content: `# Multi-tenant SaaS — Postgres Schema

## Overview
A workspace-scoped schema with row-level security and Stripe-backed billing.

## Tables
| Table | Purpose |
| --- | --- |
| \`workspaces\` | Top-level tenant boundary |
| \`users\` | Global identities |
| \`memberships\` | Join table with role |
| \`projects\` | Belongs to workspace |
| \`subscriptions\` | One per workspace |

\`\`\`sql
create table workspaces (
  id uuid primary key default gen_random_uuid(),
  slug text unique not null,
  name text not null,
  created_at timestamptz default now()
);

create table memberships (
  workspace_id uuid references workspaces(id) on delete cascade,
  user_id uuid references users(id) on delete cascade,
  role text check (role in ('owner','admin','member')) not null,
  primary key (workspace_id, user_id)
);

create table subscriptions (
  workspace_id uuid primary key references workspaces(id) on delete cascade,
  stripe_customer text not null,
  plan text not null,
  seats int not null default 1,
  renews_at timestamptz
);
\`\`\``,
  },
  api: {
    title: "Zabaku REST API",
    kind: "API Structure",
    content: `# Zabaku REST API

## Conventions
- Base URL: \`https://api.zabaku.com/v1\`
- Auth via \`Authorization: Bearer <token>\`
- All responses JSON, ISO-8601 timestamps

## Resources
- \`/projects\` — list, create, update, archive
- \`/tasks\` — with query filters and cursor pagination
- \`/ai/generate\` — streaming completions

\`\`\`http
GET /v1/projects?status=active&limit=20
Authorization: Bearer sk_live_...
\`\`\`

\`\`\`json
{
  "data": [
    { "id": "prj_01H...", "name": "Zabaku 2.0", "status": "active" }
  ],
  "next_cursor": "eyJpZCI6..."
}
\`\`\`

## Errors
| Code | Meaning |
| --- | --- |
| \`400\` | Invalid parameters |
| \`401\` | Missing or invalid token |
| \`429\` | Rate limited — retry with backoff |`,
  },
  readme: {
    title: "Zabaku CLI — README",
    kind: "README",
    content: `# Zabaku CLI
The command line for shipping with Zabaku.

## Install
\`\`\`bash
npm i -g @zabaku/cli
zabaku login
\`\`\`

## Usage
- \`zabaku init\` — connect a repo to a workspace
- \`zabaku ship\` — draft release notes from commits
- \`zabaku plan\` — generate a sprint plan from open issues

## Features
- Beautiful terminal UI
- Works with GitHub, GitLab and Bitbucket
- Streams AI output token-by-token`,
  },
};

function outputFor(prompt: string) {
  const p = prompt.toLowerCase();
  if (p.includes("sprint")) return OUTPUTS["sprint-plan"];
  if (p.includes("schema") || p.includes("database")) return OUTPUTS.schema;
  if (p.includes("api")) return OUTPUTS.api;
  if (p.includes("readme")) return OUTPUTS.readme;
  if (p.includes("task") || p.includes("break")) return OUTPUTS.tasks;
  return OUTPUTS["project-plan"];
}

/* -------------------------------- page -------------------------------- */

type ResultCard = {
  id: string;
  prompt: string;
  title: string;
  kind: string;
  content: string;
  pinned?: boolean;
};

function AIWorkspace() {
  const [prompt, setPrompt] = useState("");
  const [results, setResults] = useState<ResultCard[]>([]);
  const [streamingId, setStreamingId] = useState<string | null>(null);
  const textareaRef = useRef<HTMLTextAreaElement | null>(null);
  const feedRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    textareaRef.current?.focus();
  }, []);

  useEffect(() => {
    if (feedRef.current) {
      feedRef.current.scrollTo({ top: feedRef.current.scrollHeight, behavior: "smooth" });
    }
  }, [results.length, streamingId]);

  function submit(p: string) {
    const text = p.trim();
    if (!text) return;
    const o = outputFor(text);
    const card: ResultCard = {
      id: `res_${Date.now()}`,
      prompt: text,
      title: o.title,
      kind: o.kind,
      content: o.content,
    };
    setResults((r) => [...r, card]);
    setStreamingId(card.id);
    setPrompt("");
  }

  function runTemplate(id: string) {
    const t = TEMPLATES.find((x) => x.id === id);
    if (!t) return;
    submit(t.prompt);
  }

  return (
    <div className="relative min-h-screen bg-background text-foreground">
      {/* ambient background */}
      <div className="pointer-events-none absolute inset-0 -z-10 overflow-hidden">
        <div className="absolute -top-40 left-1/2 h-[520px] w-[900px] -translate-x-1/2 rounded-full bg-primary/15 blur-3xl" />
        <div className="absolute right-[-120px] top-40 h-[380px] w-[520px] rounded-full bg-accent/20 blur-3xl" />
        <div
          className="absolute inset-0 opacity-[0.35]"
          style={{
            backgroundImage:
              "radial-gradient(circle at 1px 1px, oklch(0.85 0.02 250 / 0.35) 1px, transparent 0)",
            backgroundSize: "22px 22px",
          }}
        />
      </div>

      <div className="mx-auto grid max-w-[1440px] grid-cols-1 gap-8 px-6 py-8 lg:grid-cols-[280px_minmax(0,1fr)_320px]">
        {/* left rail */}
        <aside className="hidden lg:block">
          <div className="sticky top-8 space-y-6">
            <div className="flex items-center gap-2.5">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-primary to-accent text-white shadow-lg shadow-primary/25">
                <Sparkles className="h-4.5 w-4.5" />
              </div>
              <div>
                <div className="text-sm font-semibold tracking-tight">Zabaku AI</div>
                <div className="text-xs text-muted-foreground">Workspace · Northwind</div>
              </div>
            </div>

            <button
              onClick={() => {
                setResults([]);
                textareaRef.current?.focus();
              }}
              className="group flex w-full items-center justify-between rounded-xl border border-border/70 bg-surface px-3.5 py-2.5 text-sm font-medium shadow-sm transition hover:border-primary/40 hover:shadow-md"
            >
              <span className="inline-flex items-center gap-2">
                <Wand2 className="h-4 w-4 text-primary" />
                New generation
              </span>
              <span className="inline-flex items-center gap-1 rounded-md border border-border/70 bg-surface-muted px-1.5 py-0.5 font-mono text-[10px] text-muted-foreground">
                <Command className="h-3 w-3" />
                N
              </span>
            </button>

            <div>
              <div className="mb-2 flex items-center justify-between px-1">
                <span className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
                  Recent
                </span>
                <button className="text-[11px] text-muted-foreground hover:text-foreground">
                  View all
                </button>
              </div>
              <ul className="space-y-0.5">
                {RECENT.map((r) => (
                  <li key={r.id}>
                    <button className="group flex w-full items-start gap-2.5 rounded-lg px-2.5 py-2 text-left transition hover:bg-surface">
                      <span className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-md bg-surface-muted text-muted-foreground group-hover:text-primary">
                        {r.pinned ? <Pin className="h-3.5 w-3.5" /> : <Clock className="h-3.5 w-3.5" />}
                      </span>
                      <span className="min-w-0 flex-1">
                        <span className="block truncate text-[13px] font-medium">
                          {r.title}
                        </span>
                        <span className="mt-0.5 flex items-center gap-1.5 text-[11px] text-muted-foreground">
                          <span className="inline-block h-1 w-1 rounded-full bg-muted-foreground/50" />
                          {r.kind}
                          <span className="ml-auto">{r.time}</span>
                        </span>
                      </span>
                    </button>
                  </li>
                ))}
              </ul>
            </div>

            <div className="rounded-2xl border border-border/70 bg-gradient-to-br from-primary/8 to-accent/8 p-4">
              <div className="flex items-center gap-2 text-[11px] font-semibold uppercase tracking-wider text-primary">
                <Star className="h-3.5 w-3.5" />
                Pro tips
              </div>
              <p className="mt-2 text-xs leading-5 text-muted-foreground">
                Press{" "}
                <kbd className="rounded bg-surface px-1.5 py-0.5 font-mono text-[10px]">/</kbd>{" "}
                to insert a template, or{" "}
                <kbd className="rounded bg-surface px-1.5 py-0.5 font-mono text-[10px]">
                  @
                </kbd>{" "}
                to mention a project.
              </p>
            </div>
          </div>
        </aside>

        {/* main */}
        <main className="min-w-0">
          {/* header */}
          <div className="mb-6 flex items-center justify-between">
            <div>
              <div className="inline-flex items-center gap-2 rounded-full border border-border/70 bg-surface/60 px-3 py-1 text-[11px] font-medium text-muted-foreground backdrop-blur">
                <span className="relative flex h-1.5 w-1.5">
                  <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-70" />
                  <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-emerald-500" />
                </span>
                GPT-5.5 · Online
              </div>
              <h1 className="mt-3 text-3xl font-semibold tracking-tight sm:text-4xl">
                AI Workspace
              </h1>
              <p className="mt-1 text-sm text-muted-foreground">
                Draft plans, schemas and docs — beautifully, in seconds.
              </p>
            </div>
            <div className="hidden items-center gap-2 sm:flex">
              <button className="inline-flex items-center gap-1.5 rounded-lg border border-border/70 bg-surface px-3 py-1.5 text-sm text-foreground/80 transition hover:border-primary/40">
                <Share2 className="h-3.5 w-3.5" />
                Share
              </button>
              <button className="inline-flex items-center gap-1.5 rounded-lg border border-border/70 bg-surface px-3 py-1.5 text-sm text-foreground/80 transition hover:border-primary/40">
                <Layers className="h-3.5 w-3.5" />
                Library
              </button>
            </div>
          </div>

          {/* prompt box */}
          <div className="group relative overflow-hidden rounded-3xl border border-border/70 bg-surface/80 shadow-[0_20px_60px_-20px_oklch(0.53_0.22_279_/_0.25)] backdrop-blur-xl">
            <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-primary/50 to-transparent" />
            <div className="relative p-5">
              <div className="mb-3 flex items-center gap-2">
                <div className="inline-flex h-7 items-center gap-1.5 rounded-full bg-gradient-to-r from-primary to-accent px-2.5 text-[11px] font-semibold text-white">
                  <Sparkles className="h-3 w-3" />
                  Ask Zabaku
                </div>
                <span className="text-xs text-muted-foreground">
                  Draft anything — a plan, schema, sprint or doc
                </span>
              </div>
              <textarea
                ref={textareaRef}
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && !e.shiftKey) {
                    e.preventDefault();
                    submit(prompt);
                  }
                }}
                placeholder="e.g. Plan a two-week sprint for the billing squad, or design a schema for a multi-tenant SaaS…"
                rows={3}
                className="w-full resize-none bg-transparent text-[15px] leading-6 text-foreground placeholder:text-muted-foreground/70 focus:outline-none"
              />
              <div className="mt-2 flex items-end justify-between gap-3">
                <div className="flex flex-wrap items-center gap-1.5">
                  <ToolChip icon={Paperclip} label="Attach" />
                  <ToolChip icon={AtSign} label="Mention" />
                  <ToolChip icon={GitBranch} label="Context" />
                  <ToolChip icon={Command} label="Templates" hint="/" />
                </div>
                <button
                  onClick={() => submit(prompt)}
                  disabled={!prompt.trim()}
                  className="group/btn inline-flex h-10 items-center gap-2 rounded-xl bg-gradient-to-r from-primary to-accent px-4 text-sm font-semibold text-white shadow-lg shadow-primary/25 transition hover:shadow-primary/40 disabled:opacity-40 disabled:shadow-none"
                >
                  Generate
                  <span className="inline-flex h-6 w-6 items-center justify-center rounded-lg bg-white/15 transition group-hover/btn:translate-x-0.5">
                    <ArrowUp className="h-3.5 w-3.5" />
                  </span>
                </button>
              </div>
            </div>
          </div>

          {/* suggestions */}
          <div className="mt-4 flex flex-wrap gap-2">
            {SUGGESTIONS.map((s) => (
              <button
                key={s}
                onClick={() => setPrompt(s)}
                className="group inline-flex items-center gap-1.5 rounded-full border border-border/70 bg-surface/70 px-3 py-1.5 text-xs text-foreground/80 backdrop-blur transition hover:border-primary/40 hover:bg-surface hover:text-foreground"
              >
                <Sparkles className="h-3 w-3 text-primary/80" />
                {s}
              </button>
            ))}
          </div>

          {/* templates */}
          <section className="mt-10">
            <div className="mb-3 flex items-end justify-between">
              <div>
                <h2 className="text-lg font-semibold tracking-tight">Templates</h2>
                <p className="text-sm text-muted-foreground">
                  One click to generate — the model fills in the details.
                </p>
              </div>
              <button className="inline-flex items-center gap-1 text-xs font-medium text-muted-foreground hover:text-foreground">
                Browse library <ChevronRight className="h-3.5 w-3.5" />
              </button>
            </div>
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {TEMPLATES.map((t) => {
                const Icon = t.icon;
                return (
                  <button
                    key={t.id}
                    onClick={() => runTemplate(t.id)}
                    className="group relative overflow-hidden rounded-2xl border border-border/70 bg-surface p-4 text-left transition hover:-translate-y-0.5 hover:border-primary/40 hover:shadow-lg hover:shadow-primary/10"
                  >
                    <div
                      className={`absolute inset-0 bg-gradient-to-br ${t.tint} opacity-0 transition group-hover:opacity-100`}
                    />
                    <div className="relative flex items-start gap-3">
                      <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-primary/15 to-accent/15 text-primary">
                        <Icon className="h-4.5 w-4.5" />
                      </div>
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center justify-between">
                          <div className="text-sm font-semibold">{t.label}</div>
                          <ChevronRight className="h-4 w-4 text-muted-foreground opacity-0 transition group-hover:translate-x-0.5 group-hover:opacity-100" />
                        </div>
                        <p className="mt-0.5 text-xs leading-5 text-muted-foreground">
                          {t.desc}
                        </p>
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>
          </section>

          {/* results feed */}
          <section ref={feedRef} className="mt-10 space-y-6">
            {results.length === 0 ? (
              <EmptyState />
            ) : (
              results.map((r) => (
                <ResultCardView
                  key={r.id}
                  card={r}
                  streaming={streamingId === r.id}
                  onDone={() => setStreamingId(null)}
                />
              ))
            )}
          </section>
        </main>

        {/* right rail */}
        <aside className="hidden lg:block">
          <div className="sticky top-8 space-y-6">
            <div className="rounded-2xl border border-border/70 bg-surface p-4">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
                  This month
                </span>
                <span className="text-[11px] text-muted-foreground">Team · 5</span>
              </div>
              <div className="mt-3 flex items-baseline gap-1.5">
                <span className="text-3xl font-semibold tracking-tight">1,284</span>
                <span className="text-xs text-muted-foreground">AI requests</span>
              </div>
              <div className="mt-3 grid grid-cols-12 gap-1">
                {Array.from({ length: 24 }).map((_, i) => (
                  <span
                    key={i}
                    className="h-8 rounded-md bg-gradient-to-t from-primary/10 to-primary/40"
                    style={{ opacity: 0.35 + Math.random() * 0.65 }}
                  />
                ))}
              </div>
              <div className="mt-3 flex items-center justify-between text-[11px] text-muted-foreground">
                <span>Jul 1</span>
                <span>Jul 24</span>
              </div>
            </div>

            <div className="rounded-2xl border border-border/70 bg-surface p-4">
              <div className="mb-3 flex items-center justify-between">
                <span className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
                  Saved
                </span>
                <Bookmark className="h-3.5 w-3.5 text-muted-foreground" />
              </div>
              <ul className="space-y-2 text-sm">
                {[
                  "Launch narrative — Zabaku 2.0",
                  "Q4 roadmap themes",
                  "Support macros v3",
                ].map((s) => (
                  <li
                    key={s}
                    className="flex items-center gap-2 rounded-lg px-2 py-1.5 hover:bg-surface-muted"
                  >
                    <span className="h-1.5 w-1.5 rounded-full bg-accent" />
                    <span className="truncate">{s}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="overflow-hidden rounded-2xl border border-border/70 bg-gradient-to-br from-primary to-[oklch(0.42_0.24_285)] p-5 text-white">
              <div className="flex items-center gap-2 text-[11px] font-semibold uppercase tracking-wider text-white/70">
                <Sparkles className="h-3.5 w-3.5" />
                Zabaku Pro
              </div>
              <h3 className="mt-2 text-lg font-semibold leading-tight">
                Unlimited generations + long-context planning
              </h3>
              <p className="mt-1 text-xs text-white/70">
                Ship 3× faster with the model tuned for product teams.
              </p>
              <button className="mt-4 inline-flex items-center gap-1.5 rounded-lg bg-white/15 px-3 py-1.5 text-xs font-semibold backdrop-blur hover:bg-white/25">
                Upgrade
                <ChevronRight className="h-3.5 w-3.5" />
              </button>
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
}

/* ------------------------------ pieces ------------------------------ */

function ToolChip({
  icon: Icon,
  label,
  hint,
}: {
  icon: typeof Paperclip;
  label: string;
  hint?: string;
}) {
  return (
    <button className="inline-flex items-center gap-1.5 rounded-lg border border-transparent px-2 py-1 text-xs text-muted-foreground transition hover:border-border/70 hover:bg-surface-muted hover:text-foreground">
      <Icon className="h-3.5 w-3.5" />
      {label}
      {hint ? (
        <kbd className="ml-1 rounded bg-surface-muted px-1 py-0.5 font-mono text-[10px]">
          {hint}
        </kbd>
      ) : null}
    </button>
  );
}

function EmptyState() {
  return (
    <div className="rounded-2xl border border-dashed border-border/70 bg-surface/40 p-10 text-center">
      <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-primary/15 to-accent/15 text-primary">
        <Sparkles className="h-5 w-5" />
      </div>
      <h3 className="mt-3 text-base font-semibold">Your generations will appear here</h3>
      <p className="mx-auto mt-1 max-w-md text-sm text-muted-foreground">
        Pick a template or write a prompt — Zabaku streams results into beautiful, editable
        cards.
      </p>
    </div>
  );
}

function ResultCardView({
  card,
  streaming,
  onDone,
}: {
  card: ResultCard;
  streaming: boolean;
  onDone: () => void;
}) {
  const { out, done } = useTypewriter(card.content, 6);
  useEffect(() => {
    if (done && streaming) onDone();
  }, [done, streaming, onDone]);

  const source = streaming ? out : card.content;

  return (
    <article className="group overflow-hidden rounded-2xl border border-border/70 bg-surface shadow-sm transition hover:shadow-md">
      {/* header */}
      <header className="flex items-center justify-between border-b border-border/70 bg-gradient-to-r from-surface to-surface-muted/60 px-5 py-3">
        <div className="flex min-w-0 items-center gap-3">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-primary to-accent text-white shadow-sm">
            <Sparkles className="h-4 w-4" />
          </div>
          <div className="min-w-0">
            <div className="flex items-center gap-2">
              <h3 className="truncate text-sm font-semibold">{card.title}</h3>
              <span className="rounded-full border border-border/70 bg-surface px-2 py-0.5 text-[10px] font-medium text-muted-foreground">
                {card.kind}
              </span>
              {streaming && !done ? (
                <span className="inline-flex items-center gap-1 rounded-full bg-primary/10 px-2 py-0.5 text-[10px] font-medium text-primary">
                  <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-primary" />
                  Generating
                </span>
              ) : null}
            </div>
            <p className="mt-0.5 truncate text-xs text-muted-foreground">
              Prompt · {card.prompt}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-1">
          <IconBtn label="Regenerate" icon={RefreshCw} />
          <IconBtn label="Copy" icon={Copy} onClick={() => navigator.clipboard?.writeText(card.content)} />
          <IconBtn label="Export" icon={Download} primary />
          <IconBtn label="More" icon={MoreHorizontal} />
        </div>
      </header>

      {/* body */}
      <div className="px-5 py-5 sm:px-7">
        <Markdown source={source} />
        {streaming && !done ? (
          <span className="ml-0.5 inline-block h-4 w-1.5 translate-y-0.5 animate-pulse bg-primary" />
        ) : null}
      </div>

      {/* footer */}
      <footer className="flex items-center justify-between border-t border-border/70 bg-surface-muted/50 px-5 py-2.5 text-xs text-muted-foreground">
        <div className="flex items-center gap-3">
          <span className="inline-flex items-center gap-1.5">
            <Sparkles className="h-3 w-3 text-primary" />
            Zabaku GPT-5.5
          </span>
          <span>·</span>
          <span>{card.content.length.toLocaleString()} chars</span>
          <span>·</span>
          <span>{Math.max(1, Math.round(card.content.split(/\s+/).length / 220))} min read</span>
        </div>
        <div className="flex items-center gap-2">
          <button className="rounded-md px-2 py-1 hover:bg-surface">Insert into doc</button>
          <button className="rounded-md px-2 py-1 hover:bg-surface">Save to library</button>
        </div>
      </footer>
    </article>
  );
}

function IconBtn({
  icon: Icon,
  label,
  onClick,
  primary,
}: {
  icon: typeof Copy;
  label: string;
  onClick?: () => void;
  primary?: boolean;
}) {
  return (
    <button
      onClick={onClick}
      title={label}
      className={
        primary
          ? "inline-flex items-center gap-1.5 rounded-lg bg-gradient-to-r from-primary to-accent px-3 py-1.5 text-xs font-semibold text-white shadow-sm transition hover:shadow-md"
          : "inline-flex h-8 w-8 items-center justify-center rounded-lg text-muted-foreground transition hover:bg-surface-muted hover:text-foreground"
      }
    >
      <Icon className="h-3.5 w-3.5" />
      {primary ? <span>Export</span> : null}
    </button>
  );
}
