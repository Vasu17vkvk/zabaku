import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import {
  User,
  Palette,
  Bell,
  Building2,
  Shield,
  Sparkles,
  CreditCard,
  Plug,
  Search,
  Check,
  ChevronRight,
  Upload,
  Camera,
  Sun,
  Moon,
  Monitor,
  Mail,
  MessageSquare,
  Smartphone,
  Key,
  Trash2,
  Github,
  Slack,
  Figma,
  Globe,
  ArrowUpRight,
  Zap,
  Download,
  Plus,
} from "lucide-react";

export const Route = createFileRoute("/settings")({
  head: () => ({
    meta: [
      { title: "Settings · Zabaku" },
      {
        name: "description",
        content:
          "Manage your Zabaku profile, workspace, security, AI, billing and integrations from one place.",
      },
      { property: "og:title", content: "Settings · Zabaku" },
      {
        property: "og:description",
        content:
          "One place to configure your Zabaku account, workspace and integrations.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: SettingsPage,
});

/* ------------------------------ nav data ---------------------------- */

type SectionId =
  | "profile"
  | "appearance"
  | "notifications"
  | "workspace"
  | "security"
  | "ai"
  | "billing"
  | "integrations";

const NAV: {
  id: SectionId;
  label: string;
  icon: typeof User;
  desc: string;
}[] = [
  { id: "profile", label: "Profile", icon: User, desc: "Personal info" },
  { id: "appearance", label: "Appearance", icon: Palette, desc: "Theme & density" },
  { id: "notifications", label: "Notifications", icon: Bell, desc: "Email, push, digest" },
  { id: "workspace", label: "Workspace", icon: Building2, desc: "Team & branding" },
  { id: "security", label: "Security", icon: Shield, desc: "Password & 2FA" },
  { id: "ai", label: "AI", icon: Sparkles, desc: "Copilot & models" },
  { id: "billing", label: "Billing", icon: CreditCard, desc: "Plan & invoices" },
  { id: "integrations", label: "Integrations", icon: Plug, desc: "Connected apps" },
];

/* --------------------------------- page ----------------------------- */

function SettingsPage() {
  const [active, setActive] = useState<SectionId>("profile");
  const [query, setQuery] = useState("");

  const current = NAV.find((n) => n.id === active)!;

  return (
    <div className="relative min-h-screen bg-background text-foreground">
      <div className="pointer-events-none absolute inset-0 -z-10 overflow-hidden">
        <div className="absolute -top-40 left-1/3 h-[420px] w-[720px] rounded-full bg-primary/10 blur-3xl" />
        <div className="absolute right-[-140px] top-40 h-[320px] w-[520px] rounded-full bg-accent/15 blur-3xl" />
      </div>

      <div className="mx-auto max-w-[1240px] px-6 py-8">
        <header className="mb-6 flex flex-col gap-1 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-muted-foreground">
              Zabaku · Workspace
            </p>
            <h1 className="mt-1 text-3xl font-semibold tracking-tight">Settings</h1>
            <p className="mt-1 text-sm text-muted-foreground">
              Manage account, workspace, and everything connected to your Zabaku.
            </p>
          </div>
          <div className="flex items-center gap-2">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-50 px-2.5 py-1 text-[11px] font-semibold text-emerald-700">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
              All changes saved
            </span>
          </div>
        </header>

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-[260px_1fr]">
          {/* Sidebar */}
          <aside className="rounded-2xl border border-border/70 bg-surface p-3 shadow-sm lg:sticky lg:top-6 lg:self-start">
            <div className="relative mb-2">
              <Search className="pointer-events-none absolute left-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-muted-foreground" />
              <input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search settings"
                className="h-8 w-full rounded-lg border border-border/70 bg-surface-muted/40 pl-7 pr-2 text-xs placeholder:text-muted-foreground/70 focus:border-primary/40 focus:outline-none"
              />
            </div>
            <nav className="space-y-0.5">
              {NAV.filter((n) =>
                query
                  ? `${n.label} ${n.desc}`
                      .toLowerCase()
                      .includes(query.toLowerCase())
                  : true,
              ).map((n) => {
                const Icon = n.icon;
                const isActive = active === n.id;
                return (
                  <button
                    key={n.id}
                    onClick={() => setActive(n.id)}
                    className={`group flex w-full items-center gap-2.5 rounded-lg px-2.5 py-2 text-left text-[13px] transition ${
                      isActive
                        ? "bg-gradient-to-r from-primary/10 to-accent/10 text-foreground shadow-sm"
                        : "text-foreground/80 hover:bg-surface-muted"
                    }`}
                  >
                    <span
                      className={`flex h-7 w-7 items-center justify-center rounded-md ${
                        isActive
                          ? "bg-gradient-to-br from-primary to-accent text-white"
                          : "bg-surface-muted text-muted-foreground group-hover:text-foreground"
                      }`}
                    >
                      <Icon className="h-3.5 w-3.5" />
                    </span>
                    <span className="min-w-0 flex-1">
                      <span className="block truncate font-medium">
                        {n.label}
                      </span>
                      <span className="block truncate text-[10.5px] text-muted-foreground">
                        {n.desc}
                      </span>
                    </span>
                    <ChevronRight
                      className={`h-3 w-3 transition ${
                        isActive
                          ? "text-primary opacity-100"
                          : "opacity-0 group-hover:opacity-60"
                      }`}
                    />
                  </button>
                );
              })}
            </nav>

            <div className="mt-3 rounded-xl border border-border/60 bg-gradient-to-br from-primary/5 to-accent/5 p-3">
              <div className="flex items-center gap-2 text-[12px] font-semibold">
                <Zap className="h-3.5 w-3.5 text-primary" />
                Zabaku Pro
              </div>
              <p className="mt-1 text-[11px] text-muted-foreground">
                Unlock AI planner, unlimited seats, and priority support.
              </p>
              <button className="mt-2 w-full rounded-md bg-foreground py-1.5 text-[11px] font-semibold text-background hover:opacity-90">
                Upgrade
              </button>
            </div>
          </aside>

          {/* Content */}
          <div className="min-w-0">
            <div className="mb-4 flex items-center gap-2 text-xs text-muted-foreground">
              <span>Settings</span>
              <ChevronRight className="h-3 w-3" />
              <span className="font-medium text-foreground">
                {current.label}
              </span>
            </div>

            {active === "profile" && <ProfileSection />}
            {active === "appearance" && <AppearanceSection />}
            {active === "notifications" && <NotificationsSection />}
            {active === "workspace" && <WorkspaceSection />}
            {active === "security" && <SecuritySection />}
            {active === "ai" && <AISection />}
            {active === "billing" && <BillingSection />}
            {active === "integrations" && <IntegrationsSection />}
          </div>
        </div>
      </div>
    </div>
  );
}

/* ---------------------------- primitives ---------------------------- */

function Panel({
  title,
  description,
  children,
  action,
}: {
  title: string;
  description?: string;
  children: React.ReactNode;
  action?: React.ReactNode;
}) {
  return (
    <section className="mb-5 rounded-2xl border border-border/70 bg-surface shadow-sm">
      <header className="flex items-start justify-between gap-4 border-b border-border/60 px-6 py-4">
        <div>
          <h2 className="text-[15px] font-semibold tracking-tight">{title}</h2>
          {description ? (
            <p className="mt-0.5 text-[12.5px] text-muted-foreground">
              {description}
            </p>
          ) : null}
        </div>
        {action}
      </header>
      <div className="px-6 py-5">{children}</div>
    </section>
  );
}

function Field({
  label,
  hint,
  children,
}: {
  label: string;
  hint?: string;
  children: React.ReactNode;
}) {
  return (
    <label className="block">
      <div className="flex items-center justify-between">
        <span className="text-[12px] font-medium text-foreground/85">
          {label}
        </span>
        {hint ? (
          <span className="text-[11px] text-muted-foreground">{hint}</span>
        ) : null}
      </div>
      <div className="mt-1.5">{children}</div>
    </label>
  );
}

function Input(props: React.InputHTMLAttributes<HTMLInputElement>) {
  return (
    <input
      {...props}
      className={`h-9 w-full rounded-lg border border-border/70 bg-surface px-3 text-sm placeholder:text-muted-foreground/70 focus:border-primary/50 focus:outline-none focus:ring-2 focus:ring-primary/15 ${
        props.className ?? ""
      }`}
    />
  );
}
function Textarea(props: React.TextareaHTMLAttributes<HTMLTextAreaElement>) {
  return (
    <textarea
      rows={3}
      {...props}
      className={`w-full rounded-lg border border-border/70 bg-surface px-3 py-2 text-sm placeholder:text-muted-foreground/70 focus:border-primary/50 focus:outline-none focus:ring-2 focus:ring-primary/15 ${
        props.className ?? ""
      }`}
    />
  );
}
function Select({
  value,
  onChange,
  children,
}: {
  value: string;
  onChange: (v: string) => void;
  children: React.ReactNode;
}) {
  return (
    <select
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className="h-9 w-full rounded-lg border border-border/70 bg-surface px-3 text-sm focus:border-primary/50 focus:outline-none focus:ring-2 focus:ring-primary/15"
    >
      {children}
    </select>
  );
}
function Toggle({
  checked,
  onChange,
}: {
  checked: boolean;
  onChange: (v: boolean) => void;
}) {
  return (
    <button
      type="button"
      onClick={() => onChange(!checked)}
      className={`relative inline-flex h-5 w-9 shrink-0 items-center rounded-full transition ${
        checked ? "bg-gradient-to-r from-primary to-accent" : "bg-border"
      }`}
    >
      <span
        className={`inline-block h-4 w-4 transform rounded-full bg-white shadow ring-1 ring-black/5 transition ${
          checked ? "translate-x-4" : "translate-x-0.5"
        }`}
      />
    </button>
  );
}
function Row({
  title,
  desc,
  children,
}: {
  title: string;
  desc?: string;
  children: React.ReactNode;
}) {
  return (
    <div className="flex items-start justify-between gap-6 py-3 first:pt-0 last:pb-0">
      <div className="min-w-0 flex-1">
        <div className="text-[13px] font-medium">{title}</div>
        {desc ? (
          <div className="mt-0.5 text-[12px] text-muted-foreground">{desc}</div>
        ) : null}
      </div>
      <div className="shrink-0">{children}</div>
    </div>
  );
}
function FormFooter({
  onSave,
  onCancel,
}: {
  onSave?: () => void;
  onCancel?: () => void;
}) {
  return (
    <div className="mt-6 flex items-center justify-end gap-2 border-t border-border/60 pt-4">
      <button
        onClick={onCancel}
        className="rounded-lg border border-border/70 bg-surface px-3.5 py-2 text-sm font-medium hover:border-primary/40"
      >
        Cancel
      </button>
      <button
        onClick={onSave}
        className="inline-flex items-center gap-1.5 rounded-lg bg-gradient-to-r from-primary to-accent px-3.5 py-2 text-sm font-semibold text-white shadow-md shadow-primary/25 hover:shadow-primary/40"
      >
        <Check className="h-3.5 w-3.5" />
        Save changes
      </button>
    </div>
  );
}

/* ------------------------------ sections ---------------------------- */

function ProfileSection() {
  return (
    <>
      <Panel
        title="Profile"
        description="This is how others will see you on Zabaku."
      >
        <div className="flex items-center gap-4 rounded-xl border border-border/60 bg-surface-muted/40 p-4">
          <div className="relative">
            <div
              className="flex h-16 w-16 items-center justify-center rounded-2xl text-lg font-bold text-white shadow-md"
              style={{
                background:
                  "linear-gradient(135deg, oklch(0.72 0.16 268), oklch(0.5 0.2 320))",
              }}
            >
              ER
            </div>
            <span className="absolute -bottom-1 -right-1 flex h-6 w-6 items-center justify-center rounded-full bg-primary text-white ring-2 ring-surface">
              <Camera className="h-3 w-3" />
            </span>
          </div>
          <div className="min-w-0 flex-1">
            <div className="text-sm font-semibold">Elena Rodríguez</div>
            <div className="text-xs text-muted-foreground">
              PNG or JPG, up to 2 MB. Square images work best.
            </div>
            <div className="mt-2 flex gap-2">
              <button className="inline-flex items-center gap-1.5 rounded-md border border-border/70 bg-surface px-2.5 py-1 text-[11px] font-medium hover:border-primary/40">
                <Upload className="h-3 w-3" /> Upload new
              </button>
              <button className="rounded-md px-2.5 py-1 text-[11px] font-medium text-rose-600 hover:bg-rose-50">
                Remove
              </button>
            </div>
          </div>
        </div>

        <div className="mt-5 grid grid-cols-1 gap-4 sm:grid-cols-2">
          <Field label="Full name">
            <Input defaultValue="Elena Rodríguez" />
          </Field>
          <Field label="Display name" hint="Shown in comments and @mentions">
            <Input defaultValue="Elena" />
          </Field>
          <Field label="Email">
            <Input type="email" defaultValue="elena@northwind.io" />
          </Field>
          <Field label="Role">
            <Input defaultValue="Senior Product Engineer" />
          </Field>
          <Field label="Timezone">
            <Select value="cet" onChange={() => {}}>
              <option value="cet">Europe / Madrid (GMT+1)</option>
              <option value="pst">America / Los Angeles (GMT-8)</option>
              <option value="jst">Asia / Tokyo (GMT+9)</option>
            </Select>
          </Field>
          <Field label="Language">
            <Select value="en" onChange={() => {}}>
              <option value="en">English</option>
              <option value="es">Español</option>
              <option value="fr">Français</option>
              <option value="de">Deutsch</option>
            </Select>
          </Field>
        </div>
        <div className="mt-4">
          <Field label="Bio" hint="Max 240 chars">
            <Textarea
              defaultValue="Product engineer building AI-native SaaS. Previously at Linear and Vercel."
            />
          </Field>
        </div>
        <FormFooter />
      </Panel>

      <Panel
        title="Danger zone"
        description="Irreversible actions on your Zabaku account."
      >
        <div className="flex items-center justify-between gap-4 rounded-xl border border-rose-200/70 bg-rose-50/40 p-4">
          <div>
            <div className="text-[13px] font-semibold text-rose-700">
              Delete account
            </div>
            <div className="mt-0.5 text-[12px] text-rose-700/80">
              Permanently delete your account and all associated data.
            </div>
          </div>
          <button className="inline-flex items-center gap-1.5 rounded-lg border border-rose-300 bg-white px-3 py-1.5 text-sm font-semibold text-rose-700 hover:bg-rose-100">
            <Trash2 className="h-3.5 w-3.5" />
            Delete account
          </button>
        </div>
      </Panel>
    </>
  );
}

function AppearanceSection() {
  const [theme, setTheme] = useState<"light" | "dark" | "system">("system");
  const [accent, setAccent] = useState("indigo");
  const accents = [
    { id: "indigo", hue: 268 },
    { id: "cyan", hue: 200 },
    { id: "rose", hue: 350 },
    { id: "emerald", hue: 150 },
    { id: "amber", hue: 60 },
    { id: "violet", hue: 300 },
  ];
  const [density, setDensity] = useState("comfortable");

  return (
    <>
      <Panel title="Theme" description="Choose how Zabaku looks to you.">
        <div className="grid grid-cols-3 gap-3">
          {(
            [
              { id: "light", icon: Sun, label: "Light" },
              { id: "dark", icon: Moon, label: "Dark" },
              { id: "system", icon: Monitor, label: "System" },
            ] as const
          ).map((t) => {
            const Icon = t.icon;
            const active = theme === t.id;
            return (
              <button
                key={t.id}
                onClick={() => setTheme(t.id)}
                className={`group overflow-hidden rounded-xl border transition ${
                  active
                    ? "border-primary/60 ring-2 ring-primary/25"
                    : "border-border/70 hover:border-primary/40"
                }`}
              >
                <div
                  className={`aspect-[16/8] w-full ${
                    t.id === "light"
                      ? "bg-gradient-to-br from-white to-neutral-100"
                      : t.id === "dark"
                        ? "bg-gradient-to-br from-neutral-900 to-neutral-800"
                        : "bg-gradient-to-r from-white via-white to-neutral-900"
                  } relative`}
                >
                  <div className="absolute left-3 top-3 flex gap-1">
                    <span className="h-1.5 w-1.5 rounded-full bg-rose-400" />
                    <span className="h-1.5 w-1.5 rounded-full bg-amber-400" />
                    <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
                  </div>
                  <div
                    className={`absolute bottom-3 left-3 right-3 h-2 rounded ${
                      t.id === "dark" ? "bg-white/20" : "bg-black/10"
                    }`}
                  />
                </div>
                <div className="flex items-center justify-between px-3 py-2">
                  <div className="flex items-center gap-1.5 text-[12px] font-medium">
                    <Icon className="h-3.5 w-3.5" />
                    {t.label}
                  </div>
                  {active ? (
                    <span className="flex h-4 w-4 items-center justify-center rounded-full bg-primary text-white">
                      <Check className="h-2.5 w-2.5" />
                    </span>
                  ) : null}
                </div>
              </button>
            );
          })}
        </div>
      </Panel>

      <Panel title="Accent color" description="Used across highlights and CTAs.">
        <div className="flex flex-wrap gap-3">
          {accents.map((a) => (
            <button
              key={a.id}
              onClick={() => setAccent(a.id)}
              className={`h-9 w-9 rounded-full ring-offset-2 ring-offset-surface transition ${
                accent === a.id ? "ring-2 ring-foreground" : ""
              }`}
              style={{
                background: `linear-gradient(135deg, oklch(0.72 0.18 ${a.hue}), oklch(0.5 0.22 ${
                  (a.hue + 40) % 360
                }))`,
              }}
              title={a.id}
            />
          ))}
        </div>
      </Panel>

      <Panel
        title="Interface"
        description="Density and typography preferences."
      >
        <Row title="Density" desc="Adjust spacing across the app.">
          <div className="inline-flex rounded-lg border border-border/70 bg-surface p-0.5">
            {["compact", "comfortable", "spacious"].map((d) => (
              <button
                key={d}
                onClick={() => setDensity(d)}
                className={`rounded-md px-3 py-1 text-[11px] font-medium capitalize ${
                  density === d
                    ? "bg-foreground text-background"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                {d}
              </button>
            ))}
          </div>
        </Row>
        <div className="h-px bg-border/60" />
        <Row title="Reduce motion" desc="Minimize non-essential animations.">
          <ToggleStateful />
        </Row>
        <div className="h-px bg-border/60" />
        <Row title="Show grid guides" desc="Overlay layout guides on hover.">
          <ToggleStateful />
        </Row>
      </Panel>
    </>
  );
}

function ToggleStateful({ defaultOn = false }: { defaultOn?: boolean }) {
  const [on, setOn] = useState(defaultOn);
  return <Toggle checked={on} onChange={setOn} />;
}

function NotificationsSection() {
  return (
    <>
      <Panel
        title="Notification channels"
        description="Choose where you want to receive updates."
      >
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
          <ChannelCard icon={Mail} label="Email" desc="elena@northwind.io" />
          <ChannelCard
            icon={MessageSquare}
            label="In-app"
            desc="Toast + inbox"
            defaultOn
          />
          <ChannelCard icon={Smartphone} label="Mobile push" desc="iOS · Android" />
        </div>
      </Panel>

      <Panel
        title="What to notify me about"
        description="Fine-tune per event type."
      >
        <Row
          title="Mentions"
          desc="Someone @mentions you in a comment or doc."
        >
          <div className="flex items-center gap-2">
            <ChannelPill on label="Email" />
            <ChannelPill on label="Push" />
            <ChannelPill on label="In-app" />
          </div>
        </Row>
        <div className="h-px bg-border/60" />
        <Row title="Reviews" desc="You're asked to review a PR.">
          <div className="flex items-center gap-2">
            <ChannelPill on label="Email" />
            <ChannelPill label="Push" />
            <ChannelPill on label="In-app" />
          </div>
        </Row>
        <div className="h-px bg-border/60" />
        <Row title="AI updates" desc="Zabaku AI finishes a request for you.">
          <div className="flex items-center gap-2">
            <ChannelPill label="Email" />
            <ChannelPill on label="Push" />
            <ChannelPill on label="In-app" />
          </div>
        </Row>
        <div className="h-px bg-border/60" />
        <Row title="Weekly digest" desc="Every Monday at 9:00 AM.">
          <ToggleStateful defaultOn />
        </Row>
      </Panel>
    </>
  );
}

function ChannelCard({
  icon: Icon,
  label,
  desc,
  defaultOn = false,
}: {
  icon: typeof Mail;
  label: string;
  desc: string;
  defaultOn?: boolean;
}) {
  const [on, setOn] = useState(defaultOn);
  return (
    <button
      onClick={() => setOn((v) => !v)}
      className={`flex items-start gap-3 rounded-xl border p-4 text-left transition ${
        on
          ? "border-primary/40 bg-gradient-to-br from-primary/[0.05] to-accent/[0.05]"
          : "border-border/70 hover:border-primary/40"
      }`}
    >
      <span
        className={`flex h-9 w-9 items-center justify-center rounded-lg ${
          on
            ? "bg-gradient-to-br from-primary to-accent text-white"
            : "bg-surface-muted text-muted-foreground"
        }`}
      >
        <Icon className="h-4 w-4" />
      </span>
      <div className="min-w-0 flex-1">
        <div className="text-[13px] font-semibold">{label}</div>
        <div className="truncate text-[11px] text-muted-foreground">{desc}</div>
      </div>
      <Toggle checked={on} onChange={setOn} />
    </button>
  );
}
function ChannelPill({ label, on = false }: { label: string; on?: boolean }) {
  const [active, setActive] = useState(on);
  return (
    <button
      onClick={() => setActive((v) => !v)}
      className={`inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-[11px] font-medium transition ${
        active
          ? "bg-primary/10 text-primary"
          : "bg-surface-muted text-muted-foreground hover:text-foreground"
      }`}
    >
      {active ? <Check className="h-3 w-3" /> : null}
      {label}
    </button>
  );
}

function WorkspaceSection() {
  return (
    <>
      <Panel
        title="Workspace"
        description="Details visible to everyone in your workspace."
      >
        <div className="flex items-center gap-4 rounded-xl border border-border/60 bg-surface-muted/40 p-4">
          <div
            className="flex h-14 w-14 items-center justify-center rounded-2xl text-lg font-bold text-white shadow-md"
            style={{
              background:
                "linear-gradient(135deg, oklch(0.62 0.22 268), oklch(0.7 0.18 200))",
            }}
          >
            N
          </div>
          <div className="flex-1">
            <div className="text-sm font-semibold">Northwind</div>
            <div className="text-xs text-muted-foreground">
              zabaku.dev/northwind · 24 members
            </div>
          </div>
          <button className="inline-flex items-center gap-1.5 rounded-md border border-border/70 bg-surface px-2.5 py-1 text-[11px] font-medium hover:border-primary/40">
            <Upload className="h-3 w-3" /> Change logo
          </button>
        </div>

        <div className="mt-5 grid grid-cols-1 gap-4 sm:grid-cols-2">
          <Field label="Workspace name">
            <Input defaultValue="Northwind" />
          </Field>
          <Field label="Workspace URL" hint="zabaku.dev/…">
            <Input defaultValue="northwind" />
          </Field>
          <Field label="Industry">
            <Select value="saas" onChange={() => {}}>
              <option value="saas">SaaS</option>
              <option value="agency">Agency</option>
              <option value="fintech">Fintech</option>
            </Select>
          </Field>
          <Field label="Team size">
            <Select value="21-50" onChange={() => {}}>
              <option>1-10</option>
              <option>11-20</option>
              <option>21-50</option>
              <option>50+</option>
            </Select>
          </Field>
        </div>
        <FormFooter />
      </Panel>

      <Panel
        title="Members"
        description="Invite teammates or manage roles."
        action={
          <button className="inline-flex items-center gap-1.5 rounded-lg bg-foreground px-3 py-1.5 text-xs font-semibold text-background hover:opacity-90">
            <Plus className="h-3 w-3" /> Invite people
          </button>
        }
      >
        <div className="divide-y divide-border/60">
          {[
            { name: "Elena Rodríguez", email: "elena@northwind.io", role: "Owner", hue: 268 },
            { name: "Priya Sharma", email: "priya@northwind.io", role: "Admin", hue: 320 },
            { name: "Kai Nakamura", email: "kai@northwind.io", role: "Member", hue: 150 },
            { name: "Marco Bianchi", email: "marco@northwind.io", role: "Member", hue: 210 },
          ].map((m) => (
            <div key={m.email} className="flex items-center gap-3 py-3">
              <span
                className="flex h-8 w-8 items-center justify-center rounded-full text-[11px] font-semibold text-white"
                style={{
                  background: `linear-gradient(135deg, oklch(0.72 0.16 ${m.hue}), oklch(0.5 0.2 ${
                    (m.hue + 40) % 360
                  }))`,
                }}
              >
                {m.name
                  .split(" ")
                  .map((n) => n[0])
                  .join("")}
              </span>
              <div className="min-w-0 flex-1">
                <div className="text-[13px] font-medium">{m.name}</div>
                <div className="truncate text-[11px] text-muted-foreground">
                  {m.email}
                </div>
              </div>
              <Select value={m.role} onChange={() => {}}>
                <option>Owner</option>
                <option>Admin</option>
                <option>Member</option>
                <option>Guest</option>
              </Select>
            </div>
          ))}
        </div>
      </Panel>
    </>
  );
}

function SecuritySection() {
  return (
    <>
      <Panel
        title="Password"
        description="Use a strong, unique password."
      >
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <Field label="Current password">
            <Input type="password" defaultValue="••••••••••" />
          </Field>
          <div />
          <Field label="New password">
            <Input type="password" placeholder="At least 12 characters" />
          </Field>
          <Field label="Confirm new password">
            <Input type="password" />
          </Field>
        </div>
        <FormFooter />
      </Panel>

      <Panel
        title="Two-factor authentication"
        description="Add an extra layer of security to your account."
      >
        <Row
          title="Authenticator app"
          desc="Use apps like 1Password or Authy for time-based codes."
        >
          <ToggleStateful defaultOn />
        </Row>
        <div className="h-px bg-border/60" />
        <Row title="SMS backup" desc="Fallback codes to your phone.">
          <ToggleStateful />
        </Row>
        <div className="h-px bg-border/60" />
        <Row title="Passkeys" desc="Sign in with Touch ID / Face ID.">
          <button className="inline-flex items-center gap-1.5 rounded-md border border-border/70 bg-surface px-2.5 py-1 text-[11px] font-medium hover:border-primary/40">
            <Key className="h-3 w-3" /> Add passkey
          </button>
        </Row>
      </Panel>

      <Panel
        title="Active sessions"
        description="Devices currently signed into your account."
      >
        <div className="divide-y divide-border/60">
          {[
            { device: "MacBook Pro · Chrome", place: "Barcelona, ES · now", current: true },
            { device: "iPhone 15 · Zabaku app", place: "Barcelona, ES · 2 h ago" },
            { device: "Windows · Firefox", place: "Berlin, DE · 3 d ago" },
          ].map((s) => (
            <div key={s.device} className="flex items-center gap-3 py-3">
              <span className="flex h-8 w-8 items-center justify-center rounded-full bg-surface-muted">
                <Monitor className="h-3.5 w-3.5 text-muted-foreground" />
              </span>
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2 text-[13px] font-medium">
                  {s.device}
                  {s.current ? (
                    <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-1.5 text-[10px] font-semibold text-emerald-700">
                      <span className="h-1 w-1 rounded-full bg-emerald-500" />
                      This device
                    </span>
                  ) : null}
                </div>
                <div className="text-[11px] text-muted-foreground">{s.place}</div>
              </div>
              {!s.current ? (
                <button className="text-[11px] font-medium text-rose-600 hover:underline">
                  Sign out
                </button>
              ) : null}
            </div>
          ))}
        </div>
      </Panel>
    </>
  );
}

function AISection() {
  return (
    <>
      <Panel
        title="Copilot"
        description="How Zabaku AI shows up while you work."
      >
        <Row title="Enable Copilot" desc="Suggestions across tasks, docs and PRs.">
          <ToggleStateful defaultOn />
        </Row>
        <div className="h-px bg-border/60" />
        <Row title="Autocomplete in editor" desc="Inline suggestions as you type.">
          <ToggleStateful defaultOn />
        </Row>
        <div className="h-px bg-border/60" />
        <Row title="Voice mode" desc="Talk to Zabaku with Whisper transcription.">
          <ToggleStateful />
        </Row>
      </Panel>

      <Panel
        title="Default model"
        description="Used by AI Workspace and Copilot."
      >
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
          {[
            { id: "zbk-fast", name: "Zabaku Fast", desc: "Best for quick tasks", tag: "Included" },
            { id: "zbk-pro", name: "Zabaku Pro", desc: "Balanced reasoning", tag: "Recommended" },
            { id: "zbk-max", name: "Zabaku Max", desc: "Deep reasoning · slower", tag: "Pro plan" },
          ].map((m, i) => (
            <button
              key={m.id}
              className={`rounded-xl border p-4 text-left transition ${
                i === 1
                  ? "border-primary/40 bg-gradient-to-br from-primary/[0.05] to-accent/[0.05] ring-2 ring-primary/15"
                  : "border-border/70 hover:border-primary/40"
              }`}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-gradient-to-br from-primary to-accent text-white">
                    <Sparkles className="h-3.5 w-3.5" />
                  </span>
                  <div className="text-[13px] font-semibold">{m.name}</div>
                </div>
                <span className="rounded-full bg-surface-muted px-2 py-0.5 text-[10px] font-medium text-muted-foreground">
                  {m.tag}
                </span>
              </div>
              <p className="mt-2 text-[11.5px] text-muted-foreground">{m.desc}</p>
            </button>
          ))}
        </div>
      </Panel>

      <Panel
        title="Data & privacy"
        description="Control how your data is used to improve Zabaku AI."
      >
        <Row
          title="Use my content to improve AI"
          desc="Prompts and responses may be reviewed."
        >
          <ToggleStateful />
        </Row>
        <div className="h-px bg-border/60" />
        <Row title="Redact PII in prompts" desc="Automatically mask emails and names.">
          <ToggleStateful defaultOn />
        </Row>
        <div className="h-px bg-border/60" />
        <Row title="Response length" desc="How verbose AI answers should be.">
          <Select value="balanced" onChange={() => {}}>
            <option value="concise">Concise</option>
            <option value="balanced">Balanced</option>
            <option value="detailed">Detailed</option>
          </Select>
        </Row>
      </Panel>
    </>
  );
}

function BillingSection() {
  return (
    <>
      <Panel
        title="Current plan"
        action={
          <button className="inline-flex items-center gap-1.5 rounded-lg bg-gradient-to-r from-primary to-accent px-3 py-1.5 text-xs font-semibold text-white shadow-md shadow-primary/25 hover:shadow-primary/40">
            Upgrade plan <ArrowUpRight className="h-3 w-3" />
          </button>
        }
      >
        <div className="rounded-2xl border border-primary/30 bg-gradient-to-r from-primary/[0.06] to-accent/[0.06] p-5">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <div className="flex items-center gap-2">
                <span className="rounded-full bg-primary/10 px-2 py-0.5 text-[11px] font-semibold text-primary">
                  Team
                </span>
                <div className="text-lg font-semibold">$29 / seat · month</div>
              </div>
              <p className="mt-1 text-xs text-muted-foreground">
                24 seats · renews Feb 12, 2026
              </p>
            </div>
            <div className="text-right">
              <div className="text-2xl font-semibold tabular-nums">$696</div>
              <div className="text-[11px] text-muted-foreground">next invoice</div>
            </div>
          </div>
          <div className="mt-4 h-1.5 overflow-hidden rounded-full bg-surface">
            <div className="h-full w-[68%] rounded-full bg-gradient-to-r from-primary to-accent" />
          </div>
          <div className="mt-2 flex items-center justify-between text-[11px] text-muted-foreground">
            <span>AI credits used</span>
            <span className="tabular-nums">6,842 / 10,000</span>
          </div>
        </div>
      </Panel>

      <Panel title="Payment method">
        <div className="flex items-center justify-between rounded-xl border border-border/60 bg-surface-muted/40 p-4">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-14 items-center justify-center rounded-md bg-gradient-to-br from-neutral-900 to-neutral-700 text-[10px] font-bold text-white">
              VISA
            </div>
            <div>
              <div className="text-[13px] font-semibold">
                Visa ending in 4242
              </div>
              <div className="text-[11px] text-muted-foreground">
                Expires 08 / 2028 · Elena Rodríguez
              </div>
            </div>
          </div>
          <button className="rounded-md border border-border/70 bg-surface px-2.5 py-1 text-[11px] font-medium hover:border-primary/40">
            Update
          </button>
        </div>
      </Panel>

      <Panel
        title="Invoices"
        action={
          <button className="inline-flex items-center gap-1.5 rounded-md border border-border/70 bg-surface px-2.5 py-1 text-[11px] font-medium hover:border-primary/40">
            <Download className="h-3 w-3" /> Export all
          </button>
        }
      >
        <div className="overflow-hidden rounded-xl border border-border/60">
          <table className="w-full text-sm">
            <thead className="bg-surface-muted/60 text-[11px] uppercase tracking-wider text-muted-foreground">
              <tr>
                <th className="px-4 py-2 text-left font-medium">Date</th>
                <th className="px-4 py-2 text-left font-medium">Description</th>
                <th className="px-4 py-2 text-right font-medium">Amount</th>
                <th className="px-4 py-2 text-right font-medium">Status</th>
                <th className="px-4 py-2" />
              </tr>
            </thead>
            <tbody className="divide-y divide-border/60">
              {[
                ["Jan 12, 2026", "Team plan · 24 seats", "$696.00", "Paid"],
                ["Dec 12, 2025", "Team plan · 22 seats", "$638.00", "Paid"],
                ["Nov 12, 2025", "Team plan · 20 seats", "$580.00", "Paid"],
              ].map((r) => (
                <tr key={r[0]} className="text-[13px]">
                  <td className="px-4 py-2.5 text-muted-foreground">{r[0]}</td>
                  <td className="px-4 py-2.5">{r[1]}</td>
                  <td className="px-4 py-2.5 text-right tabular-nums">{r[2]}</td>
                  <td className="px-4 py-2.5 text-right">
                    <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2 py-0.5 text-[10px] font-semibold text-emerald-700">
                      <span className="h-1 w-1 rounded-full bg-emerald-500" />
                      {r[3]}
                    </span>
                  </td>
                  <td className="px-4 py-2.5 text-right">
                    <button className="text-muted-foreground hover:text-foreground">
                      <Download className="h-3.5 w-3.5" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Panel>
    </>
  );
}

function IntegrationsSection() {
  const items = [
    {
      id: "github",
      name: "GitHub",
      desc: "Sync issues, PRs and commits",
      icon: Github,
      tint: "bg-neutral-900 text-white",
      connected: true,
    },
    {
      id: "slack",
      name: "Slack",
      desc: "Deliver alerts to channels",
      icon: Slack,
      tint: "bg-rose-500 text-white",
      connected: true,
    },
    {
      id: "figma",
      name: "Figma",
      desc: "Embed frames in specs",
      icon: Figma,
      tint: "bg-orange-500 text-white",
      connected: false,
    },
    {
      id: "linear",
      name: "Linear",
      desc: "Two-way task sync",
      icon: Globe,
      tint: "bg-orange-600 text-white",
      connected: false,
    },
    {
      id: "notion",
      name: "Notion",
      desc: "Import docs and roadmaps",
      icon: Globe,
      tint: "bg-neutral-800 text-white",
      connected: false,
    },
    {
      id: "vercel",
      name: "Vercel",
      desc: "Deploy previews on PRs",
      icon: Globe,
      tint: "bg-black text-white",
      connected: true,
    },
  ];
  return (
    <>
      <Panel
        title="Connected apps"
        description="Extend Zabaku with the tools you already use."
      >
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          {items.map((i) => {
            const Icon = i.icon;
            return (
              <div
                key={i.id}
                className="group flex items-center gap-3 rounded-xl border border-border/70 bg-surface p-4 transition hover:-translate-y-0.5 hover:border-primary/40 hover:shadow-md"
              >
                <span
                  className={`flex h-10 w-10 items-center justify-center rounded-xl ${i.tint}`}
                >
                  <Icon className="h-4 w-4" />
                </span>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2">
                    <div className="text-[13px] font-semibold">{i.name}</div>
                    {i.connected ? (
                      <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-1.5 py-0.5 text-[10px] font-semibold text-emerald-700">
                        <span className="h-1 w-1 rounded-full bg-emerald-500" />
                        Connected
                      </span>
                    ) : null}
                  </div>
                  <div className="truncate text-[11px] text-muted-foreground">
                    {i.desc}
                  </div>
                </div>
                <button
                  className={`rounded-md px-2.5 py-1 text-[11px] font-medium ${
                    i.connected
                      ? "border border-border/70 bg-surface hover:border-primary/40"
                      : "bg-foreground text-background hover:opacity-90"
                  }`}
                >
                  {i.connected ? "Manage" : "Connect"}
                </button>
              </div>
            );
          })}
        </div>
      </Panel>

      <Panel
        title="Developer"
        description="Personal API keys and webhooks."
        action={
          <button className="inline-flex items-center gap-1.5 rounded-lg bg-foreground px-3 py-1.5 text-xs font-semibold text-background hover:opacity-90">
            <Plus className="h-3 w-3" /> New key
          </button>
        }
      >
        <div className="divide-y divide-border/60">
          {[
            { name: "Personal · CLI", key: "zbk_live_9a8f••••••••3c1e", used: "2h ago" },
            { name: "Zapier automation", key: "zbk_live_pk_47••••••••bb90", used: "3d ago" },
          ].map((k) => (
            <div key={k.name} className="flex items-center gap-3 py-3">
              <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-surface-muted">
                <Key className="h-3.5 w-3.5 text-muted-foreground" />
              </span>
              <div className="min-w-0 flex-1">
                <div className="text-[13px] font-medium">{k.name}</div>
                <div className="truncate font-mono text-[11px] text-muted-foreground">
                  {k.key}
                </div>
              </div>
              <span className="text-[11px] text-muted-foreground">
                Used {k.used}
              </span>
              <button className="rounded-md p-1.5 text-muted-foreground hover:bg-surface-muted hover:text-rose-600">
                <Trash2 className="h-3.5 w-3.5" />
              </button>
            </div>
          ))}
        </div>
      </Panel>
    </>
  );
}
