import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import {
  Sparkles,
  Search,
  Bell,
  Check,
  X,
  ChevronDown,
  ChevronRight,
  Plus,
  ArrowRight,
  ArrowUpRight,
  Info,
  AlertTriangle,
  CheckCircle2,
  XCircle,
  Loader2,
  Copy,
  Home,
  FolderKanban,
  CheckSquare,
  BarChart3,
  Settings,
  MoreHorizontal,
  Filter,
  Download,
  Trash2,
  Pencil,
  Mail,
  Lock,
  Eye,
  Github,
  FileText,
  Inbox,
  WifiOff,
  RefreshCw,
} from "lucide-react";

export const Route = createFileRoute("/design-system")({
  head: () => ({
    meta: [
      { title: "Design System · Zabaku" },
      {
        name: "description",
        content:
          "The complete Zabaku design system — color, typography, spacing, and every component used to build a scalable AI-native SaaS.",
      },
      { property: "og:title", content: "Design System · Zabaku" },
      {
        property: "og:description",
        content:
          "Colors, typography, spacing, buttons, inputs, cards, tables, charts, and more — the reusable building blocks of Zabaku.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: DesignSystemPage,
});

/* --------------------------- section index -------------------------- */

const SECTIONS = [
  { id: "foundations", label: "Foundations" },
  { id: "color", label: "Color" },
  { id: "typography", label: "Typography" },
  { id: "spacing", label: "Spacing" },
  { id: "icons", label: "Icons" },
  { id: "buttons", label: "Buttons" },
  { id: "inputs", label: "Inputs" },
  { id: "cards", label: "Cards" },
  { id: "tables", label: "Tables" },
  { id: "avatars", label: "Avatars" },
  { id: "badges", label: "Badges & Tags" },
  { id: "progress", label: "Progress" },
  { id: "charts", label: "Charts" },
  { id: "dropdowns", label: "Dropdowns" },
  { id: "nav", label: "Navigation" },
  { id: "sidebar", label: "Sidebar" },
  { id: "topbar", label: "Topbar" },
  { id: "empty", label: "Empty states" },
  { id: "loading", label: "Loading states" },
  { id: "errors", label: "Error states" },
  { id: "modals", label: "Modals" },
  { id: "tooltips", label: "Tooltips" },
  { id: "toasts", label: "Notifications" },
  { id: "skeleton", label: "Skeletons" },
];

/* ------------------------------- page ------------------------------- */

function DesignSystemPage() {
  return (
    <div className="relative min-h-screen bg-background text-foreground">
      <div className="pointer-events-none absolute inset-0 -z-10 overflow-hidden">
        <div className="absolute -top-40 left-1/3 h-[440px] w-[760px] rounded-full bg-primary/10 blur-3xl" />
        <div className="absolute right-[-140px] top-40 h-[340px] w-[540px] rounded-full bg-accent/15 blur-3xl" />
      </div>

      <div className="mx-auto max-w-[1240px] px-6 py-10">
        <PageHeader />

        <div className="mt-8 grid grid-cols-1 gap-8 lg:grid-cols-[220px_1fr]">
          {/* TOC */}
          <aside className="lg:sticky lg:top-6 lg:self-start">
            <div className="rounded-2xl border border-border/70 bg-surface p-2">
              <p className="px-2 pb-2 pt-1 text-[10px] font-semibold uppercase tracking-[0.14em] text-muted-foreground">
                Contents
              </p>
              <nav className="max-h-[70vh] space-y-0.5 overflow-auto pr-1">
                {SECTIONS.map((s) => (
                  <a
                    key={s.id}
                    href={`#${s.id}`}
                    className="block rounded-md px-2 py-1.5 text-[12.5px] text-foreground/80 transition hover:bg-surface-muted hover:text-foreground"
                  >
                    {s.label}
                  </a>
                ))}
              </nav>
            </div>
          </aside>

          {/* content */}
          <div className="min-w-0 space-y-14">
            <FoundationsSection />
            <ColorSection />
            <TypographySection />
            <SpacingSection />
            <IconsSection />
            <ButtonsSection />
            <InputsSection />
            <CardsSection />
            <TablesSection />
            <AvatarsSection />
            <BadgesSection />
            <ProgressSection />
            <ChartsSection />
            <DropdownsSection />
            <NavSection />
            <SidebarSection />
            <TopbarSection />
            <EmptyStatesSection />
            <LoadingStatesSection />
            <ErrorStatesSection />
            <ModalsSection />
            <TooltipsSection />
            <ToastsSection />
            <SkeletonSection />
          </div>
        </div>

        <footer className="mt-16 border-t border-border/60 pt-6 text-xs text-muted-foreground">
          Zabaku Design System · v2.0 · Auto-layout, variants, and tokens tuned
          for scalable AI-native SaaS.
        </footer>
      </div>
    </div>
  );
}

/* ----------------------------- header ------------------------------ */

function PageHeader() {
  return (
    <header className="rounded-3xl border border-border/70 bg-gradient-to-br from-primary/[0.08] via-surface to-accent/[0.08] p-8 shadow-sm">
      <div className="flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <span className="inline-flex items-center gap-1.5 rounded-full border border-primary/30 bg-primary/10 px-2.5 py-1 text-[11px] font-semibold text-primary">
            <Sparkles className="h-3 w-3" />
            Design System · v2.0
          </span>
          <h1 className="mt-4 text-4xl font-semibold tracking-tight sm:text-5xl">
            Zabaku Design System
          </h1>
          <p className="mt-3 max-w-2xl text-[15px] leading-6 text-muted-foreground">
            The complete visual language and component library behind Zabaku —
            tokens, primitives, and patterns tuned for a scalable AI-native
            SaaS.
          </p>
        </div>
        <div className="grid grid-cols-3 gap-3 text-center sm:text-left">
          {[
            { k: "Tokens", v: "180+" },
            { k: "Components", v: "60+" },
            { k: "Patterns", v: "24" },
          ].map((s) => (
            <div
              key={s.k}
              className="rounded-2xl border border-border/60 bg-surface/70 px-4 py-3 backdrop-blur"
            >
              <div className="text-2xl font-semibold tabular-nums">{s.v}</div>
              <div className="text-[11px] uppercase tracking-wider text-muted-foreground">
                {s.k}
              </div>
            </div>
          ))}
        </div>
      </div>
    </header>
  );
}

/* --------------------------- primitives ---------------------------- */

function Section({
  id,
  eyebrow,
  title,
  desc,
  children,
}: {
  id: string;
  eyebrow: string;
  title: string;
  desc: string;
  children: React.ReactNode;
}) {
  return (
    <section id={id} className="scroll-mt-6">
      <div className="mb-5 flex items-end justify-between gap-6">
        <div>
          <p className="text-[10.5px] font-semibold uppercase tracking-[0.14em] text-primary">
            {eyebrow}
          </p>
          <h2 className="mt-1.5 text-2xl font-semibold tracking-tight">
            {title}
          </h2>
          <p className="mt-1 max-w-2xl text-[13.5px] text-muted-foreground">
            {desc}
          </p>
        </div>
      </div>
      {children}
    </section>
  );
}

function Card({
  children,
  className = "",
  title,
}: {
  children: React.ReactNode;
  className?: string;
  title?: string;
}) {
  return (
    <div
      className={`rounded-2xl border border-border/70 bg-surface p-5 shadow-sm ${className}`}
    >
      {title ? (
        <div className="mb-4 text-[11px] font-semibold uppercase tracking-[0.12em] text-muted-foreground">
          {title}
        </div>
      ) : null}
      {children}
    </div>
  );
}

/* --------------------------- Foundations --------------------------- */

function FoundationsSection() {
  const principles = [
    {
      title: "Calm density",
      desc: "Show a lot, feel like a little. Compact controls balanced with breathable whitespace.",
      icon: BarChart3,
    },
    {
      title: "Craft in motion",
      desc: "Micro-animations under 200ms. Ease-out for entrances, spring for direct manipulation.",
      icon: Sparkles,
    },
    {
      title: "AI-native surfaces",
      desc: "Every list, table and drawer can host AI suggestions without feeling bolted on.",
      icon: Sparkles,
    },
    {
      title: "Keyboard-first",
      desc: "⌘K everywhere, focus rings visible, tab order deliberate, no click-only paths.",
      icon: CheckSquare,
    },
  ];
  return (
    <Section
      id="foundations"
      eyebrow="Principles"
      title="Foundations"
      desc="The four beliefs that guide every component decision."
    >
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {principles.map((p) => {
          const Icon = p.icon;
          return (
            <div
              key={p.title}
              className="rounded-2xl border border-border/70 bg-surface p-5 transition hover:-translate-y-0.5 hover:border-primary/40 hover:shadow-md"
            >
              <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-primary to-accent text-white">
                <Icon className="h-4 w-4" />
              </span>
              <div className="mt-3 text-[14px] font-semibold">{p.title}</div>
              <p className="mt-1 text-[12.5px] text-muted-foreground">
                {p.desc}
              </p>
            </div>
          );
        })}
      </div>
    </Section>
  );
}

/* ------------------------------ Color ------------------------------ */

function ColorSection() {
  const brand = [
    { name: "Primary", token: "--primary", hue: 268, val: "oklch(.6 .22 268)" },
    { name: "Accent", token: "--accent", hue: 200, val: "oklch(.75 .18 200)" },
  ];
  const semantic = [
    { name: "Success", tone: "emerald", swatch: "#10b981" },
    { name: "Warning", tone: "amber", swatch: "#f59e0b" },
    { name: "Danger", tone: "rose", swatch: "#f43f5e" },
    { name: "Info", tone: "sky", swatch: "#0ea5e9" },
  ];
  const scale = [50, 100, 200, 300, 400, 500, 600, 700, 800, 900].map((n) => n);

  return (
    <Section
      id="color"
      eyebrow="Tokens"
      title="Color palette"
      desc="OKLCH-first with mapped semantic aliases. Every token below is available via CSS variables."
    >
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        <Card title="Brand">
          <div className="grid grid-cols-2 gap-3">
            {brand.map((b) => (
              <div
                key={b.name}
                className="overflow-hidden rounded-xl border border-border/60"
              >
                <div
                  className="h-24"
                  style={{
                    background: `linear-gradient(135deg, oklch(0.7 0.18 ${b.hue}), oklch(0.5 0.22 ${
                      (b.hue + 40) % 360
                    }))`,
                  }}
                />
                <div className="flex items-center justify-between px-3 py-2">
                  <div>
                    <div className="text-[12.5px] font-semibold">{b.name}</div>
                    <div className="font-mono text-[10.5px] text-muted-foreground">
                      {b.token}
                    </div>
                  </div>
                  <button className="text-muted-foreground hover:text-foreground">
                    <Copy className="h-3.5 w-3.5" />
                  </button>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-4 grid grid-cols-10 overflow-hidden rounded-lg border border-border/60">
            {scale.map((n, i) => (
              <div
                key={n}
                title={`primary-${n}`}
                className="h-8"
                style={{
                  background: `oklch(${0.98 - i * 0.08} ${0.05 + i * 0.02} 268)`,
                }}
              />
            ))}
          </div>
          <p className="mt-2 text-[11px] text-muted-foreground">
            10-step tonal ramp derived from --primary
          </p>
        </Card>

        <Card title="Semantic">
          <div className="grid grid-cols-2 gap-3">
            {semantic.map((s) => (
              <div
                key={s.name}
                className="flex items-center gap-3 rounded-xl border border-border/60 bg-surface-muted/30 p-3"
              >
                <span
                  className="h-10 w-10 rounded-lg"
                  style={{ background: s.swatch }}
                />
                <div className="flex-1">
                  <div className="text-[12.5px] font-semibold">{s.name}</div>
                  <div className="font-mono text-[10.5px] text-muted-foreground">
                    --{s.tone}-500
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-4 grid grid-cols-4 gap-2">
            {[
              { l: "Background", c: "oklch(1 0 0)" },
              { l: "Surface", c: "oklch(0.985 0.005 268)" },
              { l: "Muted", c: "oklch(0.96 0.01 268)" },
              { l: "Foreground", c: "oklch(0.15 0.01 268)" },
            ].map((n) => (
              <div key={n.l} className="text-center">
                <div
                  className="mb-1 h-14 rounded-lg border border-border/60"
                  style={{ background: n.c }}
                />
                <div className="text-[10.5px] font-medium">{n.l}</div>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </Section>
  );
}

/* --------------------------- Typography ---------------------------- */

function TypographySection() {
  const scale = [
    { name: "Display", cls: "text-5xl font-semibold tracking-tight", meta: "48 / 56 · semibold" },
    { name: "H1", cls: "text-4xl font-semibold tracking-tight", meta: "36 / 44" },
    { name: "H2", cls: "text-2xl font-semibold tracking-tight", meta: "24 / 32" },
    { name: "H3", cls: "text-lg font-semibold", meta: "18 / 26" },
    { name: "Body", cls: "text-[14px] leading-6", meta: "14 / 24" },
    { name: "Caption", cls: "text-xs text-muted-foreground", meta: "12 / 18" },
  ];
  return (
    <Section
      id="typography"
      eyebrow="Type"
      title="Typography"
      desc="Inter across the product on an 8-point grid. Numeric UI uses tabular-nums."
    >
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-[1fr_320px]">
        <Card>
          <div className="divide-y divide-border/60">
            {scale.map((s) => (
              <div
                key={s.name}
                className="grid grid-cols-[100px_1fr_auto] items-baseline gap-4 py-4 first:pt-0 last:pb-0"
              >
                <div className="text-[11px] font-medium uppercase tracking-wider text-muted-foreground">
                  {s.name}
                </div>
                <div className={s.cls}>The quick brown fox jumps</div>
                <div className="font-mono text-[10.5px] text-muted-foreground">
                  {s.meta}
                </div>
              </div>
            ))}
          </div>
        </Card>

        <Card title="Font family">
          <div className="rounded-xl bg-gradient-to-br from-primary/[0.05] to-accent/[0.05] p-5">
            <div className="text-5xl font-semibold tracking-tight">Aa</div>
            <div className="mt-2 text-[13px] font-semibold">Inter Variable</div>
            <div className="text-[11px] text-muted-foreground">
              400 · 500 · 600 · 700 · 800
            </div>
          </div>
          <div className="mt-3 rounded-lg bg-surface-muted/40 p-3 font-mono text-[11px] leading-5 text-foreground/80">
            font-feature-settings:
            <br />
            "cv11", "ss01", "ss03", "tnum";
          </div>
        </Card>
      </div>
    </Section>
  );
}

/* ----------------------------- Spacing ----------------------------- */

function SpacingSection() {
  const spaces = [
    { n: 1, px: 4 },
    { n: 2, px: 8 },
    { n: 3, px: 12 },
    { n: 4, px: 16 },
    { n: 5, px: 20 },
    { n: 6, px: 24 },
    { n: 8, px: 32 },
    { n: 10, px: 40 },
    { n: 12, px: 48 },
    { n: 16, px: 64 },
  ];
  return (
    <Section
      id="spacing"
      eyebrow="Layout"
      title="Spacing scale"
      desc="8-point grid with 4-point half-steps for icon buttons and micro paddings."
    >
      <Card>
        <div className="space-y-3">
          {spaces.map((s) => (
            <div key={s.n} className="grid grid-cols-[80px_1fr_80px] items-center gap-4">
              <div className="font-mono text-[11px] text-muted-foreground">
                space-{s.n}
              </div>
              <div className="h-2 rounded-full bg-gradient-to-r from-primary to-accent" style={{ width: s.px * 4 }} />
              <div className="text-right font-mono text-[11px] text-muted-foreground">
                {s.px}px
              </div>
            </div>
          ))}
        </div>
      </Card>
    </Section>
  );
}

/* ------------------------------ Icons ------------------------------ */

function IconsSection() {
  const iconSet = [
    Home,
    FolderKanban,
    CheckSquare,
    Sparkles,
    BarChart3,
    Bell,
    Settings,
    Search,
    Plus,
    Mail,
    Lock,
    Eye,
    Filter,
    Download,
    Trash2,
    Pencil,
    Github,
    FileText,
    Inbox,
    Info,
  ];
  return (
    <Section
      id="icons"
      eyebrow="Iconography"
      title="Icons"
      desc="Lucide, 1.75px stroke, aligned to a 20px optical grid."
    >
      <Card>
        <div className="grid grid-cols-4 gap-3 sm:grid-cols-6 md:grid-cols-8 lg:grid-cols-10">
          {iconSet.map((Icon, i) => (
            <div
              key={i}
              className="group flex aspect-square flex-col items-center justify-center gap-1 rounded-xl border border-border/60 bg-surface-muted/30 transition hover:border-primary/40 hover:bg-surface"
            >
              <Icon className="h-5 w-5 text-foreground/80 transition group-hover:text-primary" strokeWidth={1.75} />
            </div>
          ))}
        </div>
        <div className="mt-4 flex items-center gap-4 rounded-xl bg-surface-muted/40 p-3 text-[12px]">
          <div className="flex items-center gap-2">
            <Sparkles className="h-3.5 w-3.5" strokeWidth={1.5} />
            <span className="text-muted-foreground">1.5 · thin</span>
          </div>
          <div className="flex items-center gap-2">
            <Sparkles className="h-3.5 w-3.5" strokeWidth={1.75} />
            <span className="text-muted-foreground">1.75 · default</span>
          </div>
          <div className="flex items-center gap-2">
            <Sparkles className="h-3.5 w-3.5" strokeWidth={2.25} />
            <span className="text-muted-foreground">2.25 · emphasis</span>
          </div>
        </div>
      </Card>
    </Section>
  );
}

/* ----------------------------- Buttons ----------------------------- */

function ButtonsSection() {
  const variants = [
    { name: "Primary", cls: "bg-gradient-to-r from-primary to-accent text-white shadow-md shadow-primary/25 hover:shadow-primary/40" },
    { name: "Secondary", cls: "bg-foreground text-background hover:opacity-90" },
    { name: "Outline", cls: "border border-border/70 bg-surface hover:border-primary/40" },
    { name: "Ghost", cls: "text-foreground hover:bg-surface-muted" },
    { name: "Danger", cls: "bg-rose-600 text-white hover:bg-rose-700" },
  ];
  const sizes = [
    { name: "sm", cls: "px-2.5 py-1 text-xs" },
    { name: "md", cls: "px-3.5 py-2 text-sm" },
    { name: "lg", cls: "px-5 py-2.5 text-[15px]" },
  ];
  return (
    <Section
      id="buttons"
      eyebrow="Actions"
      title="Buttons"
      desc="5 variants × 3 sizes × states. Icon-only variants keep 40×40 touch targets."
    >
      <Card>
        <div className="space-y-6">
          <div>
            <div className="mb-2 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
              Variants
            </div>
            <div className="flex flex-wrap gap-2">
              {variants.map((v) => (
                <button
                  key={v.name}
                  className={`inline-flex items-center gap-1.5 rounded-lg px-3.5 py-2 text-sm font-semibold transition ${v.cls}`}
                >
                  {v.name}
                  <ArrowRight className="h-3.5 w-3.5" />
                </button>
              ))}
            </div>
          </div>

          <div>
            <div className="mb-2 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
              Sizes
            </div>
            <div className="flex flex-wrap items-center gap-2">
              {sizes.map((s) => (
                <button
                  key={s.name}
                  className={`inline-flex items-center gap-1.5 rounded-lg bg-gradient-to-r from-primary to-accent font-semibold text-white shadow-md shadow-primary/25 ${s.cls}`}
                >
                  Size {s.name}
                </button>
              ))}
            </div>
          </div>

          <div>
            <div className="mb-2 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
              States
            </div>
            <div className="flex flex-wrap items-center gap-2">
              <button className="rounded-lg bg-gradient-to-r from-primary to-accent px-3.5 py-2 text-sm font-semibold text-white shadow-md">
                Default
              </button>
              <button className="rounded-lg bg-gradient-to-r from-primary to-accent px-3.5 py-2 text-sm font-semibold text-white shadow-lg ring-2 ring-primary/30">
                Hover
              </button>
              <button
                disabled
                className="rounded-lg bg-gradient-to-r from-primary to-accent px-3.5 py-2 text-sm font-semibold text-white opacity-40"
              >
                Disabled
              </button>
              <button className="inline-flex items-center gap-1.5 rounded-lg bg-gradient-to-r from-primary to-accent px-3.5 py-2 text-sm font-semibold text-white">
                <Loader2 className="h-3.5 w-3.5 animate-spin" />
                Loading
              </button>
            </div>
          </div>

          <div>
            <div className="mb-2 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
              Icon buttons
            </div>
            <div className="flex flex-wrap items-center gap-2">
              <button className="flex h-9 w-9 items-center justify-center rounded-lg bg-gradient-to-r from-primary to-accent text-white shadow-md" aria-label="Add">
                <Plus className="h-4 w-4" />
              </button>
              <button className="flex h-9 w-9 items-center justify-center rounded-lg border border-border/70 bg-surface hover:border-primary/40" aria-label="Filter">
                <Filter className="h-4 w-4" />
              </button>
              <button className="flex h-9 w-9 items-center justify-center rounded-lg text-muted-foreground hover:bg-surface-muted hover:text-foreground" aria-label="More">
                <MoreHorizontal className="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>
      </Card>
    </Section>
  );
}

/* ------------------------------ Inputs ----------------------------- */

function InputsSection() {
  return (
    <Section
      id="inputs"
      eyebrow="Forms"
      title="Inputs"
      desc="Text, email, password, search, textarea, select, checkbox, radio, switch, and segmented."
    >
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        <Card title="Text fields">
          <div className="space-y-4">
            <FieldRow label="Full name">
              <input
                defaultValue="Elena Rodríguez"
                className="h-9 w-full rounded-lg border border-border/70 bg-surface px-3 text-sm focus:border-primary/50 focus:outline-none focus:ring-2 focus:ring-primary/15"
              />
            </FieldRow>
            <FieldRow label="Email" icon={<Mail className="h-3.5 w-3.5" />}>
              <input
                type="email"
                defaultValue="elena@northwind.io"
                className="h-9 w-full rounded-lg border border-border/70 bg-surface pl-8 pr-3 text-sm focus:border-primary/50 focus:outline-none focus:ring-2 focus:ring-primary/15"
              />
            </FieldRow>
            <FieldRow label="Password" icon={<Lock className="h-3.5 w-3.5" />}>
              <input
                type="password"
                defaultValue="supersecret"
                className="h-9 w-full rounded-lg border border-border/70 bg-surface pl-8 pr-3 text-sm focus:border-primary/50 focus:outline-none focus:ring-2 focus:ring-primary/15"
              />
            </FieldRow>
            <FieldRow label="Error" error="Enter a valid email">
              <input
                defaultValue="not-an-email"
                className="h-9 w-full rounded-lg border border-rose-400 bg-rose-50/30 px-3 text-sm focus:outline-none focus:ring-2 focus:ring-rose-200"
              />
            </FieldRow>
          </div>
        </Card>

        <Card title="Controls">
          <div className="space-y-5">
            <div className="grid grid-cols-2 gap-3">
              <ControlItem
                label="Checkbox"
                control={
                  <input
                    type="checkbox"
                    defaultChecked
                    className="h-4 w-4 rounded border-border text-primary focus:ring-primary/40"
                  />
                }
              />
              <ControlItem
                label="Radio"
                control={
                  <input
                    type="radio"
                    defaultChecked
                    name="r"
                    className="h-4 w-4 border-border text-primary focus:ring-primary/40"
                  />
                }
              />
              <ControlItem label="Switch" control={<Switch />} />
              <ControlItem
                label="Select"
                control={
                  <select className="h-8 w-full rounded-md border border-border/70 bg-surface px-2 text-xs">
                    <option>Option A</option>
                    <option>Option B</option>
                  </select>
                }
              />
            </div>

            <div>
              <div className="mb-1.5 text-[11px] font-medium text-foreground/85">
                Segmented
              </div>
              <div className="inline-flex rounded-lg border border-border/70 bg-surface p-0.5">
                {["Day", "Week", "Month"].map((s, i) => (
                  <button
                    key={s}
                    className={`rounded-md px-3 py-1 text-[11px] font-medium ${
                      i === 1
                        ? "bg-foreground text-background"
                        : "text-muted-foreground"
                    }`}
                  >
                    {s}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <div className="mb-1.5 text-[11px] font-medium text-foreground/85">
                Search
              </div>
              <div className="relative">
                <Search className="pointer-events-none absolute left-2.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <input
                  placeholder="Search anything…"
                  className="h-9 w-full rounded-lg border border-border/70 bg-surface pl-8 pr-16 text-sm focus:border-primary/50 focus:outline-none focus:ring-2 focus:ring-primary/15"
                />
                <span className="pointer-events-none absolute right-2 top-1/2 -translate-y-1/2 rounded border border-border/70 bg-surface-muted px-1.5 py-0.5 font-mono text-[10px] text-muted-foreground">
                  ⌘K
                </span>
              </div>
            </div>
          </div>
        </Card>
      </div>
    </Section>
  );
}
function FieldRow({
  label,
  hint,
  error,
  icon,
  children,
}: {
  label: string;
  hint?: string;
  error?: string;
  icon?: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <div>
      <div className="flex items-center justify-between">
        <label className="text-[11.5px] font-medium text-foreground/85">
          {label}
        </label>
        {hint ? (
          <span className="text-[11px] text-muted-foreground">{hint}</span>
        ) : null}
      </div>
      <div className="relative mt-1">
        {icon ? (
          <span className="pointer-events-none absolute left-2.5 top-1/2 -translate-y-1/2 text-muted-foreground">
            {icon}
          </span>
        ) : null}
        {children}
      </div>
      {error ? (
        <p className="mt-1 text-[11px] text-rose-600">{error}</p>
      ) : null}
    </div>
  );
}
function ControlItem({ label, control }: { label: string; control: React.ReactNode }) {
  return (
    <div className="flex items-center justify-between rounded-lg border border-border/60 bg-surface-muted/30 px-3 py-2">
      <span className="text-[12px]">{label}</span>
      {control}
    </div>
  );
}
function Switch() {
  const [on, setOn] = useState(true);
  return (
    <button
      onClick={() => setOn((v) => !v)}
      className={`relative inline-flex h-5 w-9 items-center rounded-full transition ${
        on ? "bg-gradient-to-r from-primary to-accent" : "bg-border"
      }`}
    >
      <span
        className={`inline-block h-4 w-4 rounded-full bg-white shadow transition ${
          on ? "translate-x-4" : "translate-x-0.5"
        }`}
      />
    </button>
  );
}

/* ------------------------------ Cards ------------------------------ */

function CardsSection() {
  return (
    <Section
      id="cards"
      eyebrow="Surfaces"
      title="Cards"
      desc="Base, interactive, stat, and highlight variants."
    >
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <div className="rounded-2xl border border-border/70 bg-surface p-4 shadow-sm">
          <div className="text-[11px] font-medium uppercase tracking-wider text-muted-foreground">
            Base
          </div>
          <div className="mt-2 text-[13px]">Neutral container for content.</div>
        </div>
        <div className="group cursor-pointer rounded-2xl border border-border/70 bg-surface p-4 shadow-sm transition hover:-translate-y-0.5 hover:border-primary/40 hover:shadow-md">
          <div className="text-[11px] font-medium uppercase tracking-wider text-muted-foreground">
            Interactive
          </div>
          <div className="mt-2 flex items-center justify-between text-[13px]">
            Hover me
            <ArrowUpRight className="h-3.5 w-3.5 opacity-0 transition group-hover:translate-x-0.5 group-hover:opacity-100 group-hover:text-primary" />
          </div>
        </div>
        <div className="rounded-2xl border border-border/70 bg-surface p-4 shadow-sm">
          <div className="flex items-center justify-between">
            <div className="text-[11px] font-medium uppercase tracking-wider text-muted-foreground">
              Stat
            </div>
            <span className="rounded-full bg-emerald-50 px-1.5 text-[10px] font-semibold text-emerald-700">
              +12%
            </span>
          </div>
          <div className="mt-2 text-2xl font-semibold tabular-nums">2,431</div>
          <div className="text-[11px] text-muted-foreground">Tasks done</div>
        </div>
        <div className="rounded-2xl border border-primary/30 bg-gradient-to-br from-primary/[0.08] via-surface to-accent/[0.08] p-4 shadow-sm">
          <div className="flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-wider text-primary">
            <Sparkles className="h-3 w-3" /> Highlight
          </div>
          <div className="mt-2 text-[13px]">AI-first surfaces stand out.</div>
        </div>
      </div>
    </Section>
  );
}

/* ------------------------------ Tables ----------------------------- */

function TablesSection() {
  const rows = [
    { name: "Zabaku 2.0", owner: "Elena", status: "In progress", value: "72%" },
    { name: "Billing v2", owner: "Marco", status: "In review", value: "54%" },
    { name: "Onboarding v3", owner: "Sofia", status: "Planning", value: "22%" },
    { name: "AI Copilot", owner: "Kai", status: "Shipped", value: "100%" },
  ];
  return (
    <Section
      id="tables"
      eyebrow="Data"
      title="Tables"
      desc="High-density, sortable, with status pills and inline actions."
    >
      <Card>
        <div className="overflow-hidden rounded-xl border border-border/60">
          <table className="w-full text-[13px]">
            <thead className="bg-surface-muted/60 text-[10.5px] uppercase tracking-wider text-muted-foreground">
              <tr>
                <th className="w-6 px-3 py-2">
                  <input type="checkbox" />
                </th>
                <th className="px-3 py-2 text-left font-medium">Project</th>
                <th className="px-3 py-2 text-left font-medium">Owner</th>
                <th className="px-3 py-2 text-left font-medium">Status</th>
                <th className="px-3 py-2 text-right font-medium">Progress</th>
                <th className="px-3 py-2" />
              </tr>
            </thead>
            <tbody className="divide-y divide-border/60">
              {rows.map((r) => (
                <tr key={r.name} className="hover:bg-surface-muted/30">
                  <td className="px-3 py-2.5">
                    <input type="checkbox" />
                  </td>
                  <td className="px-3 py-2.5 font-medium">{r.name}</td>
                  <td className="px-3 py-2.5 text-muted-foreground">{r.owner}</td>
                  <td className="px-3 py-2.5">
                    <StatusPill s={r.status} />
                  </td>
                  <td className="px-3 py-2.5 text-right tabular-nums">{r.value}</td>
                  <td className="px-3 py-2.5 text-right">
                    <button className="text-muted-foreground hover:text-foreground">
                      <MoreHorizontal className="h-4 w-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </Section>
  );
}
function StatusPill({ s }: { s: string }) {
  const map: Record<string, { tint: string; dot: string }> = {
    Shipped: { tint: "text-emerald-700 bg-emerald-50", dot: "bg-emerald-500" },
    "In review": { tint: "text-amber-700 bg-amber-50", dot: "bg-amber-500" },
    Planning: { tint: "text-sky-700 bg-orange-50", dot: "bg-orange-500" },
    "In progress": { tint: "text-primary bg-primary/10", dot: "bg-primary" },
  };
  const m = map[s] ?? map["In progress"];
  return (
    <span className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[10.5px] font-semibold ${m.tint}`}>
      <span className={`h-1.5 w-1.5 rounded-full ${m.dot}`} />
      {s}
    </span>
  );
}

/* ------------------------------ Avatars ---------------------------- */

function AvatarsSection() {
  const people = [
    { n: "EL", h: 268 },
    { n: "PS", h: 320 },
    { n: "KN", h: 150 },
    { n: "MB", h: 210 },
    { n: "SF", h: 30 },
  ];
  return (
    <Section
      id="avatars"
      eyebrow="Identity"
      title="Avatars"
      desc="Solid, gradient, initials, image, presence, and stacked groups."
    >
      <Card>
        <div className="space-y-6">
          <div>
            <div className="mb-2 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
              Sizes
            </div>
            <div className="flex items-end gap-3">
              {[6, 8, 10, 12, 16].map((s) => (
                <div key={s} className="flex flex-col items-center gap-1">
                  <span
                    className="flex items-center justify-center rounded-full text-white font-semibold"
                    style={{
                      width: s * 4,
                      height: s * 4,
                      fontSize: s * 1.6,
                      background:
                        "linear-gradient(135deg, oklch(0.72 0.16 268), oklch(0.5 0.2 320))",
                    }}
                  >
                    E
                  </span>
                  <span className="text-[10px] text-muted-foreground">
                    {s * 4}px
                  </span>
                </div>
              ))}
            </div>
          </div>

          <div>
            <div className="mb-2 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
              Presence
            </div>
            <div className="flex items-center gap-4">
              {[
                { color: "bg-emerald-500", label: "Online" },
                { color: "bg-amber-500", label: "Away" },
                { color: "bg-rose-500", label: "Busy" },
                { color: "bg-neutral-400", label: "Offline" },
              ].map((p) => (
                <div key={p.label} className="flex flex-col items-center gap-1">
                  <div className="relative">
                    <span
                      className="flex h-10 w-10 items-center justify-center rounded-full text-white font-semibold"
                      style={{
                        background:
                          "linear-gradient(135deg, oklch(0.72 0.16 210), oklch(0.5 0.2 260))",
                      }}
                    >
                      A
                    </span>
                    <span className={`absolute -bottom-0.5 -right-0.5 h-3 w-3 rounded-full ring-2 ring-surface ${p.color}`} />
                  </div>
                  <span className="text-[10px] text-muted-foreground">
                    {p.label}
                  </span>
                </div>
              ))}
            </div>
          </div>

          <div>
            <div className="mb-2 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
              Stacked group
            </div>
            <div className="flex -space-x-2">
              {people.map((p) => (
                <span
                  key={p.n}
                  className="flex h-9 w-9 items-center justify-center rounded-full text-[11px] font-semibold text-white ring-2 ring-surface"
                  style={{
                    background: `linear-gradient(135deg, oklch(0.72 0.16 ${p.h}), oklch(0.5 0.2 ${
                      (p.h + 40) % 360
                    }))`,
                  }}
                >
                  {p.n}
                </span>
              ))}
              <span className="flex h-9 w-9 items-center justify-center rounded-full bg-surface-muted text-[11px] font-semibold ring-2 ring-surface">
                +12
              </span>
            </div>
          </div>
        </div>
      </Card>
    </Section>
  );
}

/* --------------------------- Badges & Tags ------------------------- */

function BadgesSection() {
  const badges = [
    { l: "Default", cls: "bg-surface-muted text-foreground/80" },
    { l: "Primary", cls: "bg-primary/10 text-primary" },
    { l: "Success", cls: "bg-emerald-50 text-emerald-700" },
    { l: "Warning", cls: "bg-amber-50 text-amber-700" },
    { l: "Danger", cls: "bg-rose-50 text-rose-700" },
    { l: "Info", cls: "bg-orange-50 text-sky-700" },
    { l: "AI", cls: "bg-gradient-to-r from-primary to-accent text-white" },
  ];
  const tags = ["react", "typescript", "design-systems", "AI", "OKLCH", "motion"];
  return (
    <Section
      id="badges"
      eyebrow="Status"
      title="Badges & tags"
      desc="Semantic pills for status and freeform tags for content classification."
    >
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        <Card title="Badges">
          <div className="flex flex-wrap gap-2">
            {badges.map((b) => (
              <span
                key={b.l}
                className={`inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-[11px] font-semibold ${b.cls}`}
              >
                {b.l === "AI" ? <Sparkles className="h-3 w-3" /> : null}
                {b.l}
              </span>
            ))}
          </div>
          <div className="mt-4 flex flex-wrap gap-2">
            <span className="inline-flex items-center gap-1 rounded-md bg-emerald-500 px-1.5 py-0.5 text-[10px] font-bold text-white">
              NEW
            </span>
            <span className="inline-flex items-center gap-1 rounded-md bg-primary px-1.5 py-0.5 text-[10px] font-bold text-white">
              BETA
            </span>
            <span className="inline-flex h-4 min-w-[16px] items-center justify-center rounded-full bg-rose-500 px-1 text-[9px] font-bold text-white">
              3
            </span>
          </div>
        </Card>

        <Card title="Tags">
          <div className="flex flex-wrap gap-1.5">
            {tags.map((t) => (
              <span
                key={t}
                className="inline-flex items-center gap-1 rounded-full border border-border/70 bg-surface-muted/60 px-2.5 py-1 text-[11px] font-medium text-foreground/80 hover:bg-surface"
              >
                #{t}
                <button className="text-muted-foreground hover:text-rose-600">
                  <X className="h-2.5 w-2.5" />
                </button>
              </span>
            ))}
          </div>
        </Card>
      </div>
    </Section>
  );
}

/* ----------------------------- Progress ---------------------------- */

function ProgressSection() {
  return (
    <Section
      id="progress"
      eyebrow="Feedback"
      title="Progress"
      desc="Linear, segmented, circular, and skeleton spinners."
    >
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
        <Card title="Linear">
          <div className="space-y-4">
            {[24, 62, 88].map((v) => (
              <div key={v}>
                <div className="flex items-center justify-between text-[11px]">
                  <span className="text-foreground/85">Task {v}%</span>
                  <span className="tabular-nums text-muted-foreground">{v}%</span>
                </div>
                <div className="mt-1.5 h-1.5 overflow-hidden rounded-full bg-surface-muted">
                  <div
                    className="h-full rounded-full bg-gradient-to-r from-primary to-accent"
                    style={{ width: `${v}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </Card>
        <Card title="Segmented">
          <div className="flex gap-1">
            {Array.from({ length: 10 }).map((_, i) => (
              <span
                key={i}
                className={`h-2 flex-1 rounded-full ${
                  i < 7
                    ? "bg-gradient-to-r from-primary to-accent"
                    : "bg-surface-muted"
                }`}
              />
            ))}
          </div>
          <p className="mt-3 text-[11px] text-muted-foreground">
            7 of 10 steps complete
          </p>
        </Card>
        <Card title="Circular">
          <div className="flex items-center gap-4">
            <CircleProgress pct={72} />
            <CircleProgress pct={38} hue={200} />
            <CircleProgress pct={100} hue={150} />
          </div>
        </Card>
      </div>
    </Section>
  );
}
function CircleProgress({ pct, hue = 268 }: { pct: number; hue?: number }) {
  const r = 20;
  const c = 2 * Math.PI * r;
  return (
    <div className="relative flex h-16 w-16 items-center justify-center">
      <svg className="absolute inset-0 -rotate-90" viewBox="0 0 52 52">
        <circle cx="26" cy="26" r={r} strokeWidth="4" className="fill-none stroke-border" />
        <circle
          cx="26"
          cy="26"
          r={r}
          strokeWidth="4"
          strokeLinecap="round"
          className="fill-none"
          stroke={`oklch(0.6 0.22 ${hue})`}
          strokeDasharray={c}
          strokeDashoffset={c - (c * pct) / 100}
        />
      </svg>
      <span className="text-[11px] font-semibold tabular-nums">{pct}%</span>
    </div>
  );
}

/* ------------------------------ Charts ----------------------------- */

function ChartsSection() {
  const bars = [30, 52, 41, 68, 74, 90, 82];
  const line = [24, 36, 30, 48, 52, 60, 58, 72, 78, 84];
  return (
    <Section
      id="charts"
      eyebrow="Data viz"
      title="Charts"
      desc="Bar, area, sparkline, and donut — reusable primitives for dashboards."
    >
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
        <Card title="Bar">
          <div className="flex h-32 items-end gap-1.5">
            {bars.map((v, i) => (
              <div
                key={i}
                className="flex-1 rounded-t bg-gradient-to-t from-primary to-accent"
                style={{ height: `${v}%`, opacity: 0.55 + i * 0.06 }}
              />
            ))}
          </div>
        </Card>
        <Card title="Area">
          <svg viewBox="0 0 200 100" className="h-32 w-full">
            <defs>
              <linearGradient id="a" x1="0" x2="0" y1="0" y2="1">
                <stop offset="0" stopColor="oklch(0.6 0.22 268)" stopOpacity="0.6" />
                <stop offset="1" stopColor="oklch(0.6 0.22 268)" stopOpacity="0" />
              </linearGradient>
            </defs>
            <path
              d={buildPath(line, 200, 100, true)}
              fill="url(#a)"
            />
            <path
              d={buildPath(line, 200, 100, false)}
              fill="none"
              stroke="oklch(0.6 0.22 268)"
              strokeWidth="2"
            />
          </svg>
        </Card>
        <Card title="Donut">
          <div className="flex items-center gap-4">
            <Donut />
            <ul className="text-[12px] text-foreground/85 space-y-1">
              <li className="flex items-center gap-1.5">
                <span className="h-2 w-2 rounded-full bg-primary" /> Done · 62%
              </li>
              <li className="flex items-center gap-1.5">
                <span className="h-2 w-2 rounded-full bg-accent" /> In progress · 24%
              </li>
              <li className="flex items-center gap-1.5">
                <span className="h-2 w-2 rounded-full bg-rose-400" /> Blocked · 8%
              </li>
              <li className="flex items-center gap-1.5">
                <span className="h-2 w-2 rounded-full bg-surface-muted" /> Todo · 6%
              </li>
            </ul>
          </div>
        </Card>
      </div>
    </Section>
  );
}
function buildPath(vals: number[], w: number, h: number, closed: boolean) {
  const step = w / (vals.length - 1);
  const max = Math.max(...vals);
  const pts = vals.map((v, i) => [i * step, h - (v / max) * (h - 10) - 5]);
  const d = pts.map((p, i) => `${i === 0 ? "M" : "L"} ${p[0]} ${p[1]}`).join(" ");
  return closed ? `${d} L ${w} ${h} L 0 ${h} Z` : d;
}
function Donut() {
  const seg = [62, 24, 8, 6];
  const colors = ["oklch(0.6 0.22 268)", "oklch(0.75 0.18 200)", "oklch(0.65 0.2 20)", "oklch(0.9 0.02 268)"];
  let cum = 0;
  const total = 100;
  const r = 30;
  const c = 2 * Math.PI * r;
  return (
    <svg viewBox="0 0 80 80" className="h-24 w-24 -rotate-90">
      {seg.map((v, i) => {
        const dash = (v / total) * c;
        const offset = c - (cum / total) * c;
        cum += v;
        return (
          <circle
            key={i}
            cx="40"
            cy="40"
            r={r}
            fill="none"
            stroke={colors[i]}
            strokeWidth="14"
            strokeDasharray={`${dash} ${c - dash}`}
            strokeDashoffset={offset}
          />
        );
      })}
    </svg>
  );
}

/* ---------------------------- Dropdowns ---------------------------- */

function DropdownsSection() {
  return (
    <Section
      id="dropdowns"
      eyebrow="Overlays"
      title="Dropdowns"
      desc="Menus, selects, and command menus with keyboard shortcuts."
    >
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        <Card>
          <div className="relative inline-block">
            <button className="inline-flex items-center gap-1.5 rounded-lg border border-border/70 bg-surface px-3 py-2 text-sm font-medium hover:border-primary/40">
              Actions
              <ChevronDown className="h-3.5 w-3.5" />
            </button>
            <div className="mt-2 w-56 rounded-xl border border-border/70 bg-surface p-1 shadow-lg">
              {[
                { l: "Edit project", icon: Pencil, k: "E" },
                { l: "Duplicate", icon: Copy, k: "D" },
                { l: "Export CSV", icon: Download, k: "⇧X" },
                { l: "Delete", icon: Trash2, danger: true, k: "⌫" },
              ].map((i) => {
                const Icon = i.icon;
                return (
                  <button
                    key={i.l}
                    className={`flex w-full items-center justify-between rounded-md px-2 py-1.5 text-[13px] transition ${
                      i.danger
                        ? "text-rose-600 hover:bg-rose-50"
                        : "text-foreground/85 hover:bg-surface-muted"
                    }`}
                  >
                    <span className="flex items-center gap-2">
                      <Icon className="h-3.5 w-3.5" />
                      {i.l}
                    </span>
                    <span className="rounded border border-border/70 bg-surface-muted px-1 font-mono text-[9px] text-muted-foreground">
                      {i.k}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>
        </Card>

        <Card title="Command menu">
          <div className="rounded-xl border border-border/70 bg-surface shadow-lg">
            <div className="flex items-center gap-2 border-b border-border/60 px-3 py-2">
              <Search className="h-4 w-4 text-muted-foreground" />
              <input
                placeholder="Type a command…"
                className="w-full bg-transparent text-[13px] focus:outline-none"
              />
              <span className="rounded border border-border/70 bg-surface-muted px-1 py-0.5 font-mono text-[10px] text-muted-foreground">
                ⌘K
              </span>
            </div>
            <div className="p-1">
              <div className="px-2 py-1 text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
                Suggestions
              </div>
              {[
                { l: "Create new task", icon: Plus },
                { l: "Ask AI…", icon: Sparkles },
                { l: "Go to Projects", icon: FolderKanban },
              ].map((i) => {
                const Icon = i.icon;
                return (
                  <button
                    key={i.l}
                    className="flex w-full items-center gap-2 rounded-md px-2 py-1.5 text-[13px] text-foreground/85 hover:bg-surface-muted"
                  >
                    <Icon className="h-3.5 w-3.5 text-muted-foreground" />
                    {i.l}
                  </button>
                );
              })}
            </div>
          </div>
        </Card>
      </div>
    </Section>
  );
}

/* ---------------------------- Navigation --------------------------- */

function NavSection() {
  return (
    <Section
      id="nav"
      eyebrow="Wayfinding"
      title="Navigation"
      desc="Tabs, breadcrumbs, and pagination."
    >
      <div className="space-y-4">
        <Card title="Tabs">
          <div className="flex items-center gap-1 rounded-2xl border border-border/70 bg-surface p-1">
            {["Overview", "Tasks", "Members", "Files", "Activity"].map((t, i) => (
              <button
                key={t}
                className={`rounded-lg px-3.5 py-1.5 text-sm font-medium transition ${
                  i === 0
                    ? "bg-foreground text-background shadow-sm"
                    : "text-muted-foreground hover:bg-surface-muted"
                }`}
              >
                {t}
              </button>
            ))}
          </div>
        </Card>
        <Card title="Breadcrumbs">
          <nav className="flex items-center gap-1.5 text-[13px] text-muted-foreground">
            <a className="hover:text-foreground">Workspace</a>
            <ChevronRight className="h-3 w-3" />
            <a className="hover:text-foreground">Projects</a>
            <ChevronRight className="h-3 w-3" />
            <span className="font-semibold text-foreground">Zabaku 2.0</span>
          </nav>
        </Card>
        <Card title="Pagination">
          <div className="flex items-center justify-center gap-1">
            <button className="rounded-md border border-border/70 bg-surface px-2 py-1 text-xs hover:border-primary/40">
              ‹ Prev
            </button>
            {[1, 2, 3, 4, 5].map((n) => (
              <button
                key={n}
                className={`h-7 w-7 rounded-md text-xs font-medium ${
                  n === 2
                    ? "bg-foreground text-background"
                    : "text-muted-foreground hover:bg-surface-muted"
                }`}
              >
                {n}
              </button>
            ))}
            <span className="text-muted-foreground">…</span>
            <button className="h-7 w-7 rounded-md text-xs text-muted-foreground hover:bg-surface-muted">
              12
            </button>
            <button className="rounded-md border border-border/70 bg-surface px-2 py-1 text-xs hover:border-primary/40">
              Next ›
            </button>
          </div>
        </Card>
      </div>
    </Section>
  );
}

/* ----------------------------- Sidebar ----------------------------- */

function SidebarSection() {
  const items = [
    { l: "Dashboard", i: Home, active: true },
    { l: "Projects", i: FolderKanban },
    { l: "Tasks", i: CheckSquare, badge: "12" },
    { l: "AI", i: Sparkles },
    { l: "Analytics", i: BarChart3 },
    { l: "Settings", i: Settings },
  ];
  return (
    <Section
      id="sidebar"
      eyebrow="Chrome"
      title="Sidebar"
      desc="Compact left rail with active state, badges, and workspace switcher."
    >
      <Card>
        <div className="max-w-[280px] rounded-2xl border border-border/70 bg-surface-muted/30 p-3">
          <div className="mb-3 flex items-center gap-2 rounded-lg border border-border/60 bg-surface p-2">
            <span className="flex h-8 w-8 items-center justify-center rounded-md bg-gradient-to-br from-primary to-accent text-[11px] font-bold text-white">
              N
            </span>
            <div className="flex-1 text-[12px] font-semibold">Northwind</div>
            <ChevronDown className="h-3.5 w-3.5 text-muted-foreground" />
          </div>
          <nav className="space-y-0.5">
            {items.map((it) => {
              const Icon = it.i;
              return (
                <button
                  key={it.l}
                  className={`flex w-full items-center gap-2.5 rounded-lg px-2.5 py-1.5 text-[13px] ${
                    it.active
                      ? "bg-gradient-to-r from-primary/10 to-accent/10 text-foreground shadow-sm"
                      : "text-foreground/80 hover:bg-surface"
                  }`}
                >
                  <Icon className="h-3.5 w-3.5" />
                  <span className="flex-1 text-left">{it.l}</span>
                  {it.badge ? (
                    <span className="rounded-full bg-primary/10 px-1.5 text-[10px] font-semibold text-primary">
                      {it.badge}
                    </span>
                  ) : null}
                </button>
              );
            })}
          </nav>
        </div>
      </Card>
    </Section>
  );
}

/* ------------------------------ Topbar ----------------------------- */

function TopbarSection() {
  return (
    <Section
      id="topbar"
      eyebrow="Chrome"
      title="Topbar"
      desc="Search, AI prompt, notifications, and profile menu."
    >
      <Card>
        <div className="flex items-center gap-3 rounded-xl border border-border/70 bg-surface p-2">
          <div className="relative flex-1">
            <Search className="pointer-events-none absolute left-2.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <input
              placeholder="Search projects, tasks, docs…"
              className="h-9 w-full rounded-lg bg-surface-muted/40 pl-8 pr-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary/15"
            />
          </div>
          <button className="inline-flex items-center gap-1.5 rounded-full bg-gradient-to-r from-primary to-accent px-3 py-1.5 text-xs font-semibold text-white shadow-md shadow-primary/25">
            <Sparkles className="h-3 w-3" /> Ask AI
          </button>
          <button className="relative flex h-9 w-9 items-center justify-center rounded-lg text-muted-foreground hover:bg-surface-muted">
            <Bell className="h-4 w-4" />
            <span className="absolute right-1.5 top-1.5 h-2 w-2 rounded-full bg-rose-500" />
          </button>
          <span
            className="flex h-8 w-8 items-center justify-center rounded-full text-[11px] font-semibold text-white"
            style={{
              background:
                "linear-gradient(135deg, oklch(0.72 0.16 268), oklch(0.5 0.2 320))",
            }}
          >
            ER
          </span>
        </div>
      </Card>
    </Section>
  );
}

/* --------------------------- Empty states --------------------------- */

function EmptyStatesSection() {
  return (
    <Section
      id="empty"
      eyebrow="States"
      title="Empty states"
      desc="Friendly, actionable placeholders for zero-data contexts."
    >
      <Card>
        <div className="rounded-2xl border border-dashed border-border/70 bg-surface/40 p-12 text-center">
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-primary/15 to-accent/15 text-primary">
            <Inbox className="h-5 w-5" />
          </div>
          <h3 className="mt-3 text-base font-semibold">No tasks yet</h3>
          <p className="mx-auto mt-1 max-w-md text-sm text-muted-foreground">
            Create your first task or let Zabaku AI plan a sprint from your
            objectives.
          </p>
          <div className="mt-4 flex justify-center gap-2">
            <button className="inline-flex items-center gap-1.5 rounded-lg bg-foreground px-3 py-1.5 text-sm font-semibold text-background">
              <Plus className="h-3.5 w-3.5" /> New task
            </button>
            <button className="inline-flex items-center gap-1.5 rounded-lg bg-gradient-to-r from-primary to-accent px-3 py-1.5 text-sm font-semibold text-white">
              <Sparkles className="h-3.5 w-3.5" /> Plan with AI
            </button>
          </div>
        </div>
      </Card>
    </Section>
  );
}

/* -------------------------- Loading states ------------------------- */

function LoadingStatesSection() {
  return (
    <Section
      id="loading"
      eyebrow="States"
      title="Loading states"
      desc="Spinners, progress toasts, and shimmer overlays."
    >
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
        <Card title="Spinner">
          <div className="flex items-center justify-center gap-4 py-6">
            <Loader2 className="h-4 w-4 animate-spin text-primary" />
            <Loader2 className="h-6 w-6 animate-spin text-primary" />
            <Loader2 className="h-10 w-10 animate-spin text-primary" />
          </div>
        </Card>
        <Card title="Progress toast">
          <div className="flex items-center gap-3 rounded-xl border border-border/60 bg-surface p-3 shadow-md">
            <Loader2 className="h-4 w-4 animate-spin text-primary" />
            <div className="min-w-0 flex-1">
              <div className="text-[12.5px] font-semibold">Uploading assets</div>
              <div className="mt-1 h-1 overflow-hidden rounded-full bg-surface-muted">
                <div className="h-full w-[64%] rounded-full bg-gradient-to-r from-primary to-accent" />
              </div>
            </div>
            <span className="text-[11px] tabular-nums text-muted-foreground">
              64%
            </span>
          </div>
        </Card>
        <Card title="Dots">
          <div className="flex items-center justify-center gap-1 py-6">
            {[0, 150, 300].map((d) => (
              <span
                key={d}
                className="h-2 w-2 animate-bounce rounded-full bg-primary"
                style={{ animationDelay: `${d}ms` }}
              />
            ))}
          </div>
        </Card>
      </div>
    </Section>
  );
}

/* --------------------------- Error states -------------------------- */

function ErrorStatesSection() {
  return (
    <Section
      id="errors"
      eyebrow="States"
      title="Error states"
      desc="Inline errors, banners, and full-page fallbacks."
    >
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        <Card title="Banner">
          <div className="rounded-xl border border-rose-200 bg-rose-50/60 p-3">
            <div className="flex items-start gap-2">
              <XCircle className="mt-0.5 h-4 w-4 shrink-0 text-rose-600" />
              <div className="text-[12.5px]">
                <div className="font-semibold text-rose-700">
                  Failed to save changes
                </div>
                <p className="mt-0.5 text-rose-700/80">
                  Something went wrong. Retry or check your connection.
                </p>
              </div>
              <button className="ml-auto inline-flex items-center gap-1 rounded-md border border-rose-300 bg-white px-2 py-0.5 text-[11px] font-semibold text-rose-700">
                <RefreshCw className="h-3 w-3" /> Retry
              </button>
            </div>
          </div>

          <div className="mt-3 rounded-xl border border-amber-200 bg-amber-50/60 p-3">
            <div className="flex items-start gap-2">
              <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0 text-amber-600" />
              <div className="text-[12.5px]">
                <div className="font-semibold text-amber-700">
                  Bundle size grew by 8.4%
                </div>
                <p className="mt-0.5 text-amber-700/80">
                  Above the 5% threshold — investigate before shipping.
                </p>
              </div>
            </div>
          </div>
        </Card>

        <Card title="Full page">
          <div className="rounded-2xl border border-dashed border-border/70 bg-surface/40 p-8 text-center">
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-rose-50 text-rose-600">
              <WifiOff className="h-5 w-5" />
            </div>
            <h3 className="mt-3 text-base font-semibold">You're offline</h3>
            <p className="mx-auto mt-1 max-w-sm text-sm text-muted-foreground">
              Reconnect to keep collaborating in real-time. Your changes will
              sync automatically.
            </p>
            <button className="mt-4 inline-flex items-center gap-1.5 rounded-lg bg-foreground px-3 py-1.5 text-sm font-semibold text-background">
              <RefreshCw className="h-3.5 w-3.5" /> Retry connection
            </button>
          </div>
        </Card>
      </div>
    </Section>
  );
}

/* ------------------------------ Modals ----------------------------- */

function ModalsSection() {
  return (
    <Section
      id="modals"
      eyebrow="Overlays"
      title="Modals & drawers"
      desc="Confirmation, form, and right-side drawer patterns."
    >
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        <Card title="Confirmation modal">
          <div className="relative overflow-hidden rounded-2xl bg-neutral-900/50 p-6">
            <div className="mx-auto max-w-sm rounded-2xl border border-border/70 bg-surface p-5 shadow-2xl">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-rose-50 text-rose-600">
                <Trash2 className="h-4 w-4" />
              </div>
              <h3 className="mt-3 text-[15px] font-semibold">Delete project?</h3>
              <p className="mt-1 text-[12.5px] text-muted-foreground">
                This permanently deletes Zabaku 2.0 and all its tasks. This
                cannot be undone.
              </p>
              <div className="mt-4 flex items-center justify-end gap-2">
                <button className="rounded-md border border-border/70 bg-surface px-3 py-1.5 text-xs font-medium">
                  Cancel
                </button>
                <button className="rounded-md bg-rose-600 px-3 py-1.5 text-xs font-semibold text-white">
                  Delete
                </button>
              </div>
            </div>
          </div>
        </Card>

        <Card title="Right drawer">
          <div className="relative h-56 overflow-hidden rounded-2xl border border-border/60 bg-surface-muted/30">
            <div className="absolute inset-y-0 right-0 w-[70%] rounded-l-2xl border-l border-border/70 bg-surface p-4 shadow-2xl">
              <div className="flex items-center justify-between">
                <div className="text-[13px] font-semibold">Task details</div>
                <button className="text-muted-foreground hover:text-foreground">
                  <X className="h-4 w-4" />
                </button>
              </div>
              <p className="mt-2 text-[11.5px] text-muted-foreground">
                Slide-in panel with focus trap and Esc-to-close.
              </p>
              <div className="mt-3 space-y-2">
                <div className="h-2 w-3/4 rounded bg-surface-muted" />
                <div className="h-2 w-1/2 rounded bg-surface-muted" />
                <div className="h-2 w-2/3 rounded bg-surface-muted" />
              </div>
            </div>
          </div>
        </Card>
      </div>
    </Section>
  );
}

/* ----------------------------- Tooltips ---------------------------- */

function TooltipsSection() {
  return (
    <Section
      id="tooltips"
      eyebrow="Overlays"
      title="Tooltips & popovers"
      desc="Contextual explainers with 4-side anchoring."
    >
      <Card>
        <div className="grid grid-cols-2 gap-8 py-8 sm:grid-cols-4">
          {[
            { side: "Top", cls: "-top-9 left-1/2 -translate-x-1/2", arrow: "bottom-[-3px] left-1/2 -translate-x-1/2" },
            { side: "Bottom", cls: "top-9 left-1/2 -translate-x-1/2", arrow: "top-[-3px] left-1/2 -translate-x-1/2" },
            { side: "Left", cls: "top-1/2 -left-2 -translate-x-full -translate-y-1/2", arrow: "right-[-3px] top-1/2 -translate-y-1/2" },
            { side: "Right", cls: "top-1/2 -right-2 translate-x-full -translate-y-1/2", arrow: "left-[-3px] top-1/2 -translate-y-1/2" },
          ].map((t) => (
            <div key={t.side} className="relative mx-auto">
              <button className="rounded-lg border border-border/70 bg-surface px-3 py-1.5 text-xs">
                {t.side}
              </button>
              <div className={`absolute ${t.cls} rounded-md bg-neutral-900 px-2 py-1 text-[10.5px] font-medium text-white shadow-lg`}>
                Save changes
                <span className={`absolute ${t.arrow} h-1.5 w-1.5 rotate-45 bg-neutral-900`} />
              </div>
            </div>
          ))}
        </div>
      </Card>
    </Section>
  );
}

/* ---------------------------- Toasts ------------------------------- */

function ToastsSection() {
  const toasts = [
    { icon: CheckCircle2, tint: "text-emerald-600", title: "Deployed to production", body: "v2.4.1 · 24 changes" },
    { icon: AlertTriangle, tint: "text-amber-600", title: "Rate limit near", body: "82% of hourly quota" },
    { icon: XCircle, tint: "text-rose-600", title: "Sync failed", body: "Retrying in 5s…" },
    { icon: Sparkles, tint: "text-primary", title: "AI finished planning", body: "72 story points across 5 engineers" },
  ];
  return (
    <Section
      id="toasts"
      eyebrow="Feedback"
      title="Notification components"
      desc="Toasts, inline alerts, and info callouts."
    >
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
        {toasts.map((t) => {
          const Icon = t.icon;
          return (
            <div
              key={t.title}
              className="flex items-start gap-3 rounded-xl border border-border/70 bg-surface p-3 shadow-md"
            >
              <Icon className={`mt-0.5 h-4 w-4 ${t.tint}`} />
              <div className="min-w-0 flex-1">
                <div className="text-[12.5px] font-semibold">{t.title}</div>
                <div className="text-[11.5px] text-muted-foreground">
                  {t.body}
                </div>
              </div>
              <button className="text-muted-foreground hover:text-foreground">
                <X className="h-3.5 w-3.5" />
              </button>
            </div>
          );
        })}
      </div>

      <div className="mt-4 flex items-start gap-2 rounded-xl border border-primary/30 bg-primary/[0.06] p-3">
        <Info className="mt-0.5 h-4 w-4 text-primary" />
        <div className="text-[12.5px]">
          <span className="font-semibold">Pro tip.</span>{" "}
          <span className="text-foreground/80">
            Press ⌘/ anywhere to open the command menu.
          </span>
        </div>
      </div>
    </Section>
  );
}

/* --------------------------- Skeletons ----------------------------- */

function SkeletonSection() {
  return (
    <Section
      id="skeleton"
      eyebrow="Loading"
      title="Skeleton components"
      desc="Shimmer placeholders that match the shape of loaded content."
    >
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
        <Card title="Text block">
          <div className="space-y-2">
            <Sk className="h-3 w-1/3" />
            <Sk className="h-3 w-full" />
            <Sk className="h-3 w-11/12" />
            <Sk className="h-3 w-8/12" />
          </div>
        </Card>
        <Card title="List row">
          <div className="space-y-3">
            {[0, 1, 2].map((i) => (
              <div key={i} className="flex items-center gap-3">
                <Sk className="h-9 w-9 rounded-full" />
                <div className="flex-1 space-y-1.5">
                  <Sk className="h-3 w-1/3" />
                  <Sk className="h-3 w-2/3" />
                </div>
              </div>
            ))}
          </div>
        </Card>
        <Card title="Card">
          <Sk className="mb-3 aspect-video w-full rounded-lg" />
          <Sk className="mb-2 h-3 w-2/3" />
          <Sk className="h-3 w-1/2" />
        </Card>
      </div>
    </Section>
  );
}
function Sk({ className = "" }: { className?: string }) {
  return (
    <div
      className={`relative overflow-hidden rounded bg-surface-muted ${className}`}
    >
      <span className="absolute inset-0 -translate-x-full animate-[shimmer_1.6s_infinite] bg-gradient-to-r from-transparent via-white/60 to-transparent" />
    </div>
  );
}
