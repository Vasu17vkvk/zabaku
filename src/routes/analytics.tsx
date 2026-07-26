import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import {
  ArrowUpRight,
  ArrowDownRight,
  Sparkles,
  Download,
  Calendar,
  ChevronDown,
  Filter,
  MoreHorizontal,
  Folder,
  ListChecks,
  CheckCircle2,
  Zap,
  Bot,
  Clock,
  Users,
  TrendingUp,
} from "lucide-react";

export const Route = createFileRoute("/analytics")({
  head: () => ({
    meta: [
      { title: "Analytics · Zabaku" },
      {
        name: "description",
        content:
          "Track projects, tasks, completion rate, velocity and AI usage across your Zabaku workspace with a beautiful, real-time analytics dashboard.",
      },
      { property: "og:title", content: "Analytics · Zabaku" },
      {
        property: "og:description",
        content:
          "Beautiful, real-time analytics for product teams — projects, tasks, velocity, and AI usage in one place.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: AnalyticsPage,
});

/* ------------------------------- data ------------------------------- */

const RANGES = ["7d", "30d", "90d", "12m"] as const;
type Range = (typeof RANGES)[number];

const STATS = [
  {
    label: "Active projects",
    value: 42,
    delta: 12.4,
    up: true,
    icon: Folder,
    spark: [12, 18, 14, 22, 26, 24, 30, 34, 32, 38, 36, 42],
    tint: "from-orange-500/15 to-amber-400/10",
    accent: "text-primary",
  },
  {
    label: "Tasks completed",
    value: "1,284",
    delta: 8.9,
    up: true,
    icon: ListChecks,
    spark: [180, 220, 200, 260, 240, 300, 340, 320, 380, 400, 420, 460],
    tint: "from-emerald-500/15 to-amber-400/10",
    accent: "text-emerald-600",
  },
  {
    label: "Completion rate",
    value: "87.3%",
    delta: 3.1,
    up: true,
    icon: CheckCircle2,
    spark: [72, 74, 71, 76, 78, 80, 79, 82, 84, 83, 86, 87],
    tint: "from-amber-500/15 to-rose-400/10",
    accent: "text-amber-600",
  },
  {
    label: "Team velocity",
    value: "128 pts",
    delta: -2.4,
    up: false,
    icon: Zap,
    spark: [88, 96, 92, 110, 122, 118, 130, 126, 134, 128, 132, 128],
    tint: "from-rose-500/15 to-orange-500/10",
    accent: "text-rose-600",
  },
  {
    label: "AI requests",
    value: "24.8K",
    delta: 42.6,
    up: true,
    icon: Bot,
    spark: [800, 1100, 1400, 1700, 2100, 2400, 2900, 3200, 3600, 3900, 4300, 4800],
    tint: "from-orange-500/15 to-amber-400/10",
    accent: "text-orange-600",
  },
] as const;

// 12 weeks
const VELOCITY = [
  { w: "W1", planned: 96, shipped: 84 },
  { w: "W2", planned: 104, shipped: 92 },
  { w: "W3", planned: 100, shipped: 96 },
  { w: "W4", planned: 112, shipped: 108 },
  { w: "W5", planned: 118, shipped: 102 },
  { w: "W6", planned: 124, shipped: 120 },
  { w: "W7", planned: 118, shipped: 116 },
  { w: "W8", planned: 130, shipped: 122 },
  { w: "W9", planned: 128, shipped: 132 },
  { w: "W10", planned: 134, shipped: 126 },
  { w: "W11", planned: 138, shipped: 134 },
  { w: "W12", planned: 132, shipped: 128 },
];

// 30 days
const AI_USAGE = Array.from({ length: 30 }, (_, i) => {
  const base = 400 + i * 22;
  const noise = Math.sin(i * 0.7) * 120 + Math.cos(i * 0.3) * 80;
  return Math.max(120, Math.round(base + noise));
});

const TASK_DIST = [
  { label: "Feature", value: 42, color: "oklch(0.55 0.22 279)" },
  { label: "Bug", value: 21, color: "oklch(0.66 0.22 27)" },
  { label: "Chore", value: 18, color: "oklch(0.72 0.16 190)" },
  { label: "Design", value: 12, color: "oklch(0.7 0.18 320)" },
  { label: "Docs", value: 7, color: "oklch(0.75 0.14 145)" },
];

const TOP_PROJECTS = [
  { name: "Zabaku 2.0", velocity: 96, hue: 268, done: 128, total: 160 },
  { name: "Billing v2", velocity: 78, hue: 210, done: 84, total: 112 },
  { name: "AI Copilot", velocity: 72, hue: 320, done: 62, total: 90 },
  { name: "Docs revamp", velocity: 54, hue: 150, done: 41, total: 78 },
  { name: "Onboarding", velocity: 48, hue: 45, done: 36, total: 74 },
];

const TOP_CONTRIBUTORS = [
  { name: "Marco Bianchi", hue: 210, tasks: 84, delta: "+22%" },
  { name: "Priya Sharma", hue: 320, tasks: 71, delta: "+18%" },
  { name: "Kai Nakamura", hue: 150, tasks: 63, delta: "+14%" },
  { name: "Ana Costa", hue: 25, tasks: 58, delta: "+9%" },
  { name: "Sofia Lindqvist", hue: 290, tasks: 47, delta: "+6%" },
];

/* ----------------------------- helpers ----------------------------- */

function initials(name: string) {
  return name
    .split(" ")
    .map((n) => n[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();
}

function Avatar({ name, hue, size = 28 }: { name: string; hue: number; size?: number }) {
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

/* ------------------------- svg chart helpers ----------------------- */

function buildPath(values: number[], w: number, h: number, pad = 4) {
  const min = Math.min(...values);
  const max = Math.max(...values);
  const span = max - min || 1;
  const step = (w - pad * 2) / (values.length - 1);
  return values
    .map((v, i) => {
      const x = pad + i * step;
      const y = pad + (h - pad * 2) * (1 - (v - min) / span);
      return `${i === 0 ? "M" : "L"} ${x.toFixed(2)} ${y.toFixed(2)}`;
    })
    .join(" ");
}

function Sparkline({ data, className }: { data: number[] | readonly number[]; className?: string }) {
  const w = 120;
  const h = 40;
  const values = [...data];
  const path = buildPath(values, w, h);
  const area = `${path} L ${w - 4} ${h - 4} L 4 ${h - 4} Z`;
  return (
    <svg viewBox={`0 0 ${w} ${h}`} className={className} preserveAspectRatio="none">
      <defs>
        <linearGradient id="spark-fill" x1="0" x2="0" y1="0" y2="1">
          <stop offset="0%" stopColor="currentColor" stopOpacity="0.35" />
          <stop offset="100%" stopColor="currentColor" stopOpacity="0" />
        </linearGradient>
      </defs>
      <path d={area} fill="url(#spark-fill)" />
      <path d={path} fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
    </svg>
  );
}

/* -------------------------------- page ------------------------------- */

function AnalyticsPage() {
  const [range, setRange] = useState<Range>("30d");

  return (
    <div className="relative min-h-screen bg-background text-foreground">
      <div className="pointer-events-none absolute inset-0 -z-10 overflow-hidden">
        <div className="absolute -top-40 left-1/3 h-[520px] w-[900px] rounded-full bg-primary/12 blur-3xl" />
        <div className="absolute right-[-140px] top-40 h-[380px] w-[520px] rounded-full bg-accent/15 blur-3xl" />
      </div>

      <div className="mx-auto max-w-[1440px] px-6 py-8">
        {/* header */}
        <header className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <div className="text-xs text-muted-foreground">
              Workspace · <span className="text-foreground/70">Northwind</span>
            </div>
            <h1 className="mt-2 text-3xl font-semibold tracking-tight sm:text-4xl">
              Analytics
            </h1>
            <p className="mt-1 max-w-xl text-sm text-muted-foreground">
              Real-time signal on how your team ships — projects, tasks, velocity, and AI usage.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <div className="inline-flex items-center rounded-lg border border-border/70 bg-surface p-0.5">
              {RANGES.map((r) => (
                <button
                  key={r}
                  onClick={() => setRange(r)}
                  className={`rounded-md px-2.5 py-1 text-xs font-medium transition ${
                    range === r
                      ? "bg-foreground text-background"
                      : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  {r}
                </button>
              ))}
            </div>
            <button className="inline-flex items-center gap-1.5 rounded-lg border border-border/70 bg-surface px-3 py-1.5 text-sm text-foreground/80 hover:border-primary/40">
              <Calendar className="h-3.5 w-3.5" />
              Jun 24 – Jul 24
              <ChevronDown className="h-3.5 w-3.5 text-muted-foreground" />
            </button>
            <button className="inline-flex items-center gap-1.5 rounded-lg border border-border/70 bg-surface px-3 py-1.5 text-sm text-foreground/80 hover:border-primary/40">
              <Filter className="h-3.5 w-3.5" />
              Filters
            </button>
            <button className="inline-flex items-center gap-1.5 rounded-lg bg-gradient-to-r from-primary to-accent px-3 py-1.5 text-sm font-semibold text-white shadow-md shadow-primary/25 hover:shadow-primary/40">
              <Download className="h-3.5 w-3.5" />
              Export
            </button>
          </div>
        </header>

        {/* stat cards */}
        <section className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-5">
          {STATS.map((s) => (
            <StatCard key={s.label} s={s} />
          ))}
        </section>

        {/* main grid */}
        <section className="mt-8 grid grid-cols-1 gap-5 xl:grid-cols-3">
          <div className="xl:col-span-2">
            <VelocityBarChart />
          </div>
          <div>
            <TaskDistributionPie />
          </div>

          <div className="xl:col-span-2">
            <AIUsageAreaChart />
          </div>
          <div>
            <TopProjectsCard />
          </div>

          <div className="xl:col-span-2">
            <CompletionLineChart />
          </div>
          <div>
            <TopContributorsCard />
          </div>
        </section>
      </div>
    </div>
  );
}

/* ------------------------------ stat card ---------------------------- */

function StatCard({ s }: { s: (typeof STATS)[number] }) {
  const Icon = s.icon;
  return (
    <article className="group relative overflow-hidden rounded-2xl border border-border/70 bg-surface p-5 shadow-sm transition hover:-translate-y-0.5 hover:border-primary/40 hover:shadow-lg hover:shadow-primary/10">
      <div
        className={`absolute inset-0 bg-gradient-to-br ${s.tint} opacity-0 transition group-hover:opacity-100`}
      />
      <div className="relative">
        <div className="flex items-center justify-between">
          <span
            className={`flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-primary/12 to-accent/12 ${s.accent}`}
          >
            <Icon className="h-4 w-4" />
          </span>
          <span
            className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[11px] font-semibold ${
              s.up
                ? "bg-emerald-50 text-emerald-700"
                : "bg-rose-50 text-rose-700"
            }`}
          >
            {s.up ? (
              <ArrowUpRight className="h-3 w-3" />
            ) : (
              <ArrowDownRight className="h-3 w-3" />
            )}
            {Math.abs(s.delta)}%
          </span>
        </div>
        <div className="mt-4 text-2xl font-semibold tracking-tight">{s.value}</div>
        <div className="mt-0.5 text-xs text-muted-foreground">{s.label}</div>
        <div className={`mt-3 h-10 ${s.accent}`}>
          <Sparkline data={s.spark} className="h-full w-full" />
        </div>
      </div>
    </article>
  );
}

/* --------------------- 1. bar chart · velocity ---------------------- */

function VelocityBarChart() {
  const w = 720;
  const h = 260;
  const padL = 36;
  const padR = 16;
  const padT = 20;
  const padB = 30;
  const max = Math.max(...VELOCITY.flatMap((v) => [v.planned, v.shipped])) * 1.15;
  const bandW = (w - padL - padR) / VELOCITY.length;
  const barW = bandW * 0.32;
  const [hover, setHover] = useState<number | null>(null);

  return (
    <ChartCard
      title="Team velocity"
      subtitle="Planned vs shipped story points, last 12 weeks"
      icon={Zap}
      legend={[
        { color: "oklch(0.53 0.22 279)", label: "Planned" },
        { color: "oklch(0.83 0.14 210)", label: "Shipped" },
      ]}
    >
      <svg viewBox={`0 0 ${w} ${h}`} className="h-[260px] w-full">
        <defs>
          <linearGradient id="planned-grad" x1="0" x2="0" y1="0" y2="1">
            <stop offset="0%" stopColor="oklch(0.6 0.2 279)" />
            <stop offset="100%" stopColor="oklch(0.55 0.22 279)" stopOpacity="0.85" />
          </linearGradient>
          <linearGradient id="shipped-grad" x1="0" x2="0" y1="0" y2="1">
            <stop offset="0%" stopColor="oklch(0.85 0.14 210)" />
            <stop offset="100%" stopColor="oklch(0.72 0.16 200)" stopOpacity="0.9" />
          </linearGradient>
        </defs>
        {/* grid */}
        {[0, 0.25, 0.5, 0.75, 1].map((t) => {
          const y = padT + (h - padT - padB) * t;
          const v = Math.round(max * (1 - t));
          return (
            <g key={t}>
              <line
                x1={padL}
                x2={w - padR}
                y1={y}
                y2={y}
                stroke="currentColor"
                strokeOpacity="0.08"
              />
              <text
                x={padL - 8}
                y={y + 3}
                textAnchor="end"
                className="fill-muted-foreground text-[10px]"
              >
                {v}
              </text>
            </g>
          );
        })}
        {/* bars */}
        {VELOCITY.map((v, i) => {
          const cx = padL + bandW * i + bandW / 2;
          const plannedH = ((h - padT - padB) * v.planned) / max;
          const shippedH = ((h - padT - padB) * v.shipped) / max;
          const isHover = hover === i;
          return (
            <g
              key={v.w}
              onMouseEnter={() => setHover(i)}
              onMouseLeave={() => setHover(null)}
            >
              <rect
                x={cx - barW - 2}
                y={h - padB - plannedH}
                width={barW}
                height={plannedH}
                rx={4}
                fill="url(#planned-grad)"
                opacity={hover === null || isHover ? 1 : 0.55}
              />
              <rect
                x={cx + 2}
                y={h - padB - shippedH}
                width={barW}
                height={shippedH}
                rx={4}
                fill="url(#shipped-grad)"
                opacity={hover === null || isHover ? 1 : 0.55}
              />
              <text
                x={cx}
                y={h - 10}
                textAnchor="middle"
                className="fill-muted-foreground text-[10px]"
              >
                {v.w}
              </text>
              {isHover ? (
                <g>
                  <rect
                    x={cx - 44}
                    y={h - padB - Math.max(plannedH, shippedH) - 46}
                    width={88}
                    height={38}
                    rx={8}
                    fill="oklch(0.18 0.04 265)"
                  />
                  <text
                    x={cx}
                    y={h - padB - Math.max(plannedH, shippedH) - 30}
                    textAnchor="middle"
                    className="fill-white text-[10px] font-semibold"
                  >
                    {v.w}
                  </text>
                  <text
                    x={cx}
                    y={h - padB - Math.max(plannedH, shippedH) - 17}
                    textAnchor="middle"
                    className="fill-white/80 text-[10px]"
                  >
                    {v.shipped} / {v.planned} pts
                  </text>
                </g>
              ) : null}
            </g>
          );
        })}
      </svg>
    </ChartCard>
  );
}

/* --------------------- 2. area chart · AI usage --------------------- */

function AIUsageAreaChart() {
  const w = 720;
  const h = 260;
  const padL = 36;
  const padR = 16;
  const padT = 20;
  const padB = 30;
  const max = Math.max(...AI_USAGE) * 1.1;
  const step = (w - padL - padR) / (AI_USAGE.length - 1);
  const points = AI_USAGE.map((v, i) => [
    padL + i * step,
    padT + (h - padT - padB) * (1 - v / max),
  ]);
  const line = points
    .map(([x, y], i) => `${i === 0 ? "M" : "L"} ${x.toFixed(2)} ${y.toFixed(2)}`)
    .join(" ");
  const area = `${line} L ${w - padR} ${h - padB} L ${padL} ${h - padB} Z`;
  const total = AI_USAGE.reduce((a, b) => a + b, 0);

  return (
    <ChartCard
      title="AI usage"
      subtitle="Daily AI generations across your workspace"
      icon={Bot}
      right={
        <div className="text-right">
          <div className="text-lg font-semibold">{total.toLocaleString()}</div>
          <div className="text-[11px] text-muted-foreground">requests · last 30d</div>
        </div>
      }
    >
      <svg viewBox={`0 0 ${w} ${h}`} className="h-[260px] w-full">
        <defs>
          <linearGradient id="ai-area" x1="0" x2="0" y1="0" y2="1">
            <stop offset="0%" stopColor="oklch(0.55 0.22 279)" stopOpacity="0.5" />
            <stop offset="60%" stopColor="oklch(0.72 0.16 210)" stopOpacity="0.2" />
            <stop offset="100%" stopColor="oklch(0.72 0.16 210)" stopOpacity="0" />
          </linearGradient>
          <linearGradient id="ai-stroke" x1="0" x2="1" y1="0" y2="0">
            <stop offset="0%" stopColor="oklch(0.55 0.22 279)" />
            <stop offset="100%" stopColor="oklch(0.75 0.14 200)" />
          </linearGradient>
        </defs>
        {[0, 0.25, 0.5, 0.75, 1].map((t) => {
          const y = padT + (h - padT - padB) * t;
          return (
            <line
              key={t}
              x1={padL}
              x2={w - padR}
              y1={y}
              y2={y}
              stroke="currentColor"
              strokeOpacity="0.08"
            />
          );
        })}
        <path d={area} fill="url(#ai-area)" />
        <path d={line} fill="none" stroke="url(#ai-stroke)" strokeWidth="2.5" strokeLinecap="round" />
        {points.filter((_, i) => i % 5 === 0).map(([x, y], i) => (
          <circle key={i} cx={x} cy={y} r={3} fill="oklch(0.55 0.22 279)" />
        ))}
        {[0, 7, 14, 21, 29].map((i) => {
          const x = padL + i * step;
          return (
            <text
              key={i}
              x={x}
              y={h - 10}
              textAnchor="middle"
              className="fill-muted-foreground text-[10px]"
            >
              {`Jun ${25 + i > 30 ? i - 5 : 25 + i}`.replace(/Jun (3[1-9]|[4-9])/, (_, d) => `Jul ${Number(d) - 30}`)}
            </text>
          );
        })}
      </svg>
    </ChartCard>
  );
}

/* --------------------- 3. line chart · completion ------------------- */

function CompletionLineChart() {
  const w = 720;
  const h = 240;
  const padL = 36;
  const padR = 16;
  const padT = 20;
  const padB = 30;
  const seriesA = [64, 68, 71, 70, 75, 78, 80, 79, 82, 84, 83, 87]; // this quarter
  const seriesB = [58, 60, 62, 65, 66, 68, 70, 71, 72, 74, 75, 76]; // last quarter
  const max = 100;
  const step = (w - padL - padR) / (seriesA.length - 1);
  const toPath = (arr: number[]) =>
    arr
      .map((v, i) => {
        const x = padL + i * step;
        const y = padT + (h - padT - padB) * (1 - v / max);
        return `${i === 0 ? "M" : "L"} ${x.toFixed(2)} ${y.toFixed(2)}`;
      })
      .join(" ");

  return (
    <ChartCard
      title="Completion rate"
      subtitle="Percentage of tasks closed on time"
      icon={CheckCircle2}
      legend={[
        { color: "oklch(0.55 0.22 279)", label: "This quarter" },
        { color: "oklch(0.72 0.03 253)", label: "Last quarter", dashed: true },
      ]}
    >
      <svg viewBox={`0 0 ${w} ${h}`} className="h-[240px] w-full">
        {[0, 0.25, 0.5, 0.75, 1].map((t) => {
          const y = padT + (h - padT - padB) * t;
          const v = Math.round(max * (1 - t));
          return (
            <g key={t}>
              <line
                x1={padL}
                x2={w - padR}
                y1={y}
                y2={y}
                stroke="currentColor"
                strokeOpacity="0.08"
              />
              <text
                x={padL - 8}
                y={y + 3}
                textAnchor="end"
                className="fill-muted-foreground text-[10px]"
              >
                {v}%
              </text>
            </g>
          );
        })}
        <path
          d={toPath(seriesB)}
          fill="none"
          stroke="oklch(0.72 0.03 253)"
          strokeWidth="2"
          strokeDasharray="4 4"
        />
        <path
          d={toPath(seriesA)}
          fill="none"
          stroke="oklch(0.55 0.22 279)"
          strokeWidth="2.5"
          strokeLinecap="round"
        />
        {seriesA.map((v, i) => {
          const x = padL + i * step;
          const y = padT + (h - padT - padB) * (1 - v / max);
          return <circle key={i} cx={x} cy={y} r={3.5} fill="oklch(0.55 0.22 279)" stroke="white" strokeWidth="1.5" />;
        })}
        {["W1", "W2", "W3", "W4", "W5", "W6", "W7", "W8", "W9", "W10", "W11", "W12"].map(
          (l, i) => (
            <text
              key={l}
              x={padL + i * step}
              y={h - 10}
              textAnchor="middle"
              className="fill-muted-foreground text-[10px]"
            >
              {l}
            </text>
          ),
        )}
      </svg>
    </ChartCard>
  );
}

/* --------------------- 4. pie · task distribution ------------------- */

function TaskDistributionPie() {
  const size = 220;
  const r = 90;
  const cx = size / 2;
  const cy = size / 2;
  const total = TASK_DIST.reduce((a, b) => a + b.value, 0);
  const [hover, setHover] = useState<number | null>(null);

  const slices = useMemo(() => {
    let acc = 0;
    return TASK_DIST.map((t) => {
      const start = (acc / total) * Math.PI * 2 - Math.PI / 2;
      acc += t.value;
      const end = (acc / total) * Math.PI * 2 - Math.PI / 2;
      const large = end - start > Math.PI ? 1 : 0;
      const x1 = cx + r * Math.cos(start);
      const y1 = cy + r * Math.sin(start);
      const x2 = cx + r * Math.cos(end);
      const y2 = cy + r * Math.sin(end);
      const path = `M ${cx} ${cy} L ${x1} ${y1} A ${r} ${r} 0 ${large} 1 ${x2} ${y2} Z`;
      return { ...t, path };
    });
  }, [total]);

  return (
    <ChartCard title="Task distribution" subtitle="By type · last 30 days" icon={ListChecks}>
      <div className="flex items-center gap-6">
        <div className="relative shrink-0">
          <svg viewBox={`0 0 ${size} ${size}`} className="h-[220px] w-[220px]">
            {slices.map((s, i) => (
              <path
                key={s.label}
                d={s.path}
                fill={s.color}
                opacity={hover === null || hover === i ? 1 : 0.4}
                onMouseEnter={() => setHover(i)}
                onMouseLeave={() => setHover(null)}
                className="transition-opacity"
              />
            ))}
            <circle cx={cx} cy={cy} r={54} fill="var(--surface)" />
            <text
              x={cx}
              y={cy - 4}
              textAnchor="middle"
              className="fill-foreground text-lg font-semibold"
            >
              {hover === null ? total : TASK_DIST[hover].value}
            </text>
            <text
              x={cx}
              y={cy + 14}
              textAnchor="middle"
              className="fill-muted-foreground text-[10px] uppercase tracking-wider"
            >
              {hover === null ? "total" : TASK_DIST[hover].label}
            </text>
          </svg>
        </div>
        <ul className="flex-1 space-y-2.5">
          {TASK_DIST.map((t, i) => {
            const pct = Math.round((t.value / total) * 100);
            return (
              <li
                key={t.label}
                onMouseEnter={() => setHover(i)}
                onMouseLeave={() => setHover(null)}
                className="group"
              >
                <div className="flex items-center justify-between text-xs">
                  <span className="inline-flex items-center gap-2">
                    <span
                      className="h-2.5 w-2.5 rounded-sm"
                      style={{ background: t.color }}
                    />
                    <span className="font-medium">{t.label}</span>
                  </span>
                  <span className="text-muted-foreground">
                    {t.value} · <span className="font-semibold text-foreground">{pct}%</span>
                  </span>
                </div>
                <div className="mt-1 h-1.5 overflow-hidden rounded-full bg-surface-muted">
                  <div
                    className="h-full rounded-full transition-all"
                    style={{ width: `${pct}%`, background: t.color }}
                  />
                </div>
              </li>
            );
          })}
        </ul>
      </div>
    </ChartCard>
  );
}

/* ------------------------- side cards ------------------------------- */

function TopProjectsCard() {
  const max = Math.max(...TOP_PROJECTS.map((p) => p.velocity));
  return (
    <ChartCard title="Top projects" subtitle="By velocity this month" icon={TrendingUp}>
      <ul className="space-y-3.5">
        {TOP_PROJECTS.map((p) => {
          const pct = Math.round((p.velocity / max) * 100);
          return (
            <li key={p.name}>
              <div className="flex items-center justify-between text-xs">
                <span className="flex items-center gap-2">
                  <span
                    className="h-2.5 w-2.5 rounded-full"
                    style={{ background: `oklch(0.6 0.2 ${p.hue})` }}
                  />
                  <span className="font-medium">{p.name}</span>
                </span>
                <span className="text-muted-foreground">
                  {p.done}/{p.total} ·{" "}
                  <span className="font-semibold text-foreground">{p.velocity} pts</span>
                </span>
              </div>
              <div className="mt-1.5 h-2 overflow-hidden rounded-full bg-surface-muted">
                <div
                  className="h-full rounded-full"
                  style={{
                    width: `${pct}%`,
                    background: `linear-gradient(90deg, oklch(0.7 0.16 ${p.hue}), oklch(0.55 0.22 ${
                      (p.hue + 20) % 360
                    }))`,
                  }}
                />
              </div>
            </li>
          );
        })}
      </ul>
    </ChartCard>
  );
}

function TopContributorsCard() {
  return (
    <ChartCard title="Top contributors" subtitle="By tasks closed" icon={Users}>
      <ul className="space-y-3">
        {TOP_CONTRIBUTORS.map((c, i) => (
          <li
            key={c.name}
            className="flex items-center justify-between rounded-xl border border-transparent px-2 py-2 transition hover:border-border/70 hover:bg-surface-muted/60"
          >
            <div className="flex items-center gap-3">
              <span className="w-5 text-center text-xs font-semibold text-muted-foreground">
                {i + 1}
              </span>
              <Avatar name={c.name} hue={c.hue} size={32} />
              <div>
                <div className="text-[13px] font-medium">{c.name}</div>
                <div className="text-[11px] text-muted-foreground">
                  <Clock className="mr-1 inline h-3 w-3" /> Active today
                </div>
              </div>
            </div>
            <div className="text-right">
              <div className="text-sm font-semibold">{c.tasks}</div>
              <div className="text-[11px] font-medium text-emerald-600">{c.delta}</div>
            </div>
          </li>
        ))}
      </ul>
    </ChartCard>
  );
}

/* ------------------------- chart card shell ------------------------- */

function ChartCard({
  title,
  subtitle,
  icon: Icon,
  legend,
  right,
  children,
}: {
  title: string;
  subtitle?: string;
  icon: typeof Sparkles;
  legend?: { color: string; label: string; dashed?: boolean }[];
  right?: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <div className="h-full rounded-2xl border border-border/70 bg-surface p-5 shadow-sm">
      <div className="mb-4 flex items-start justify-between gap-3">
        <div className="flex items-start gap-3">
          <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-primary/12 to-accent/12 text-primary">
            <Icon className="h-4 w-4" />
          </span>
          <div>
            <h3 className="text-sm font-semibold">{title}</h3>
            {subtitle ? (
              <p className="text-[11px] text-muted-foreground">{subtitle}</p>
            ) : null}
          </div>
        </div>
        <div className="flex items-center gap-3">
          {legend ? (
            <div className="hidden items-center gap-3 sm:flex">
              {legend.map((l) => (
                <span
                  key={l.label}
                  className="inline-flex items-center gap-1.5 text-[11px] text-muted-foreground"
                >
                  <span
                    className="h-2 w-4 rounded-full"
                    style={{
                      background: l.dashed
                        ? `repeating-linear-gradient(90deg, ${l.color} 0 4px, transparent 4px 8px)`
                        : l.color,
                    }}
                  />
                  {l.label}
                </span>
              ))}
            </div>
          ) : null}
          {right}
          <button className="rounded-md p-1.5 text-muted-foreground hover:bg-surface-muted hover:text-foreground">
            <MoreHorizontal className="h-4 w-4" />
          </button>
        </div>
      </div>
      {children}
    </div>
  );
}
