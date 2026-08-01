import { createFileRoute } from "@tanstack/react-router";
import { useState, useEffect } from "react";
import { useQueryClient } from "@tanstack/react-query";
import {
  useWorkspaces,
  useUpdateWorkspace,
  useDeleteWorkspace,
  getPersistedWorkspaceId,
  persistWorkspaceId,
} from "@/features/workspaces/hooks";
import {
  useProfile,
  useUpdateProfile,
  useUploadAvatar,
  useChangePassword,
  useUpdatePreferences,
} from "@/features/profile/hooks";
import { useAuth } from "@/hooks/useAuth";

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
  Loader2,
  AlertCircle,
  RefreshCw,
} from "lucide-react";

import { requireAuth } from "@/lib/requireAuth";
import { ProtectedRoute } from "@/components/auth/ProtectedRoute";

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
  beforeLoad: requireAuth,
  component: () => (
    <ProtectedRoute>
      <SettingsPage />
    </ProtectedRoute>
  ),
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

          <div className="relative mt-3 sm:mt-0">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-muted-foreground" />
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search settings"
              className="h-9 w-60 rounded-lg border border-border/70 bg-surface pl-8 pr-3 text-sm placeholder:text-muted-foreground/70 focus:border-primary/50 focus:outline-none"
            />
          </div>
        </header>

        <div className="grid grid-cols-1 gap-8 lg:grid-cols-[240px_1fr]">
          {/* Nav sidebar */}
          <aside className="space-y-1">
            {NAV.filter(
              (n) =>
                !query ||
                n.label.toLowerCase().includes(query.toLowerCase()) ||
                n.desc.toLowerCase().includes(query.toLowerCase())
            ).map((n) => {
              const Icon = n.icon;
              const isSelected = active === n.id;
              return (
                <button
                  key={n.id}
                  onClick={() => setActive(n.id)}
                  className={`flex w-full items-center gap-3 rounded-xl px-3.5 py-2.5 text-left transition ${
                    isSelected
                      ? "bg-gradient-to-r from-primary to-accent text-white shadow-md shadow-primary/20 font-semibold"
                      : "text-muted-foreground hover:bg-surface hover:text-foreground"
                  }`}
                >
                  <Icon className="h-4 w-4 shrink-0" />
                  <div className="min-w-0 flex-1">
                    <div className="text-xs">{n.label}</div>
                    <div
                      className={`truncate text-[10px] ${
                        isSelected ? "text-white/80" : "text-muted-foreground/70"
                      }`}
                    >
                      {n.desc}
                    </div>
                  </div>
                </button>
              );
            })}

            <div className="mt-6 rounded-2xl border border-border/70 bg-surface/50 p-4 backdrop-blur">
              <div className="flex items-center gap-2 text-xs font-semibold text-foreground">
                <Sparkles className="h-3.5 w-3.5 text-primary" />
                Team plan · Active
              </div>
              <p className="mt-1 text-[11px] text-muted-foreground">
                12 of 25 seats used. Next invoice on March 1, 2026.
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
              <span className="font-medium text-foreground">{current.label}</span>
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
            <p className="mt-0.5 text-[12.5px] text-muted-foreground">{description}</p>
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
        <span className="text-[12px] font-medium text-foreground/85">{label}</span>
        {hint ? <span className="text-[11px] text-muted-foreground">{hint}</span> : null}
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
        {desc ? <div className="mt-0.5 text-[12px] text-muted-foreground">{desc}</div> : null}
      </div>
      <div className="shrink-0">{children}</div>
    </div>
  );
}

function FormFooter({
  onSave,
  onCancel,
  loading = false,
}: {
  onSave?: () => void;
  onCancel?: () => void;
  loading?: boolean;
}) {
  return (
    <div className="mt-6 flex items-center justify-end gap-2 border-t border-border/60 pt-4">
      <button
        onClick={onCancel}
        disabled={loading}
        className="rounded-lg border border-border/70 bg-surface px-3.5 py-2 text-sm font-medium hover:border-primary/40 disabled:opacity-60"
      >
        Cancel
      </button>
      <button
        onClick={onSave}
        disabled={loading}
        className="inline-flex items-center gap-1.5 rounded-lg bg-gradient-to-r from-primary to-accent px-3.5 py-2 text-sm font-semibold text-white shadow-md shadow-primary/25 hover:shadow-primary/40 disabled:cursor-not-allowed disabled:opacity-60"
      >
        {loading ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Check className="h-3.5 w-3.5" />}
        {loading ? "Saving…" : "Save changes"}
      </button>
    </div>
  );
}

/* ------------------------------ sections ---------------------------- */

function ProfileSection() {
  const { user: authUser } = useAuth();
  const { data: profile, isLoading } = useProfile();
  const updateProfile = useUpdateProfile();
  const uploadAvatar = useUploadAvatar();

  const [name, setName] = useState("");
  const [handle, setHandle] = useState("");
  const [email, setEmail] = useState("");
  const [title, setTitle] = useState("");
  const [team, setTeam] = useState("");
  const [bio, setBio] = useState("");
  const [msg, setMsg] = useState<{ type: "success" | "error"; text: string } | null>(null);

  useEffect(() => {
    setName(profile?.name ?? authUser?.name ?? "Elena Rodríguez");
    setHandle(profile?.handle ?? "elena");
    setEmail(profile?.email ?? authUser?.email ?? "elena@northwind.io");
    setTitle((profile?.title as string) ?? "Senior Product Engineer");
    setTeam((profile?.team as string) ?? "Engineering");
    setBio((profile?.bio as string) ?? "Product engineer building AI-native SaaS.");
  }, [profile, authUser]);

  async function handleSave() {
    setMsg(null);
    try {
      await updateProfile.mutateAsync({ name, handle, email, title, team, bio });
      setMsg({ type: "success", text: "Profile updated successfully!" });
    } catch (err) {
      setMsg({ type: "error", text: err instanceof Error ? err.message : "Failed to update profile." });
    }
  }

  async function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (file) {
      setMsg(null);
      try {
        await uploadAvatar.mutateAsync(file);
        setMsg({ type: "success", text: "Avatar updated successfully!" });
      } catch (err) {
        setMsg({ type: "error", text: err instanceof Error ? err.message : "Failed to upload avatar." });
      }
    }
  }

  const avatarUrl = profile?.avatarUrl;
  const initials = name.split(" ").map((n) => n[0]).join("").slice(0, 2).toUpperCase() || "ER";

  return (
    <>
      <Panel title="Profile" description="This is how others will see you on Zabaku.">
        {msg && (
          <div
            className={`mb-4 flex items-center gap-2 rounded-lg px-3.5 py-2.5 text-xs font-medium ${
              msg.type === "success"
                ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                : "bg-destructive/10 text-destructive border border-destructive/30"
            }`}
          >
            <AlertCircle className="h-4 w-4 shrink-0" />
            {msg.text}
          </div>
        )}

        <div className="flex items-center gap-4 rounded-xl border border-border/60 bg-surface-muted/40 p-4">
          <div className="relative">
            {avatarUrl ? (
              <img src={avatarUrl} alt={name} className="h-16 w-16 rounded-2xl object-cover shadow-md" />
            ) : (
              <div
                className="flex h-16 w-16 items-center justify-center rounded-2xl text-lg font-bold text-white shadow-md"
                style={{ background: "linear-gradient(135deg, oklch(0.72 0.16 268), oklch(0.5 0.2 320))" }}
              >
                {initials}
              </div>
            )}
            <span className="absolute -bottom-1 -right-1 flex h-6 w-6 items-center justify-center rounded-full bg-primary text-white ring-2 ring-surface">
              <Camera className="h-3 w-3" />
            </span>
          </div>
          <div className="min-w-0 flex-1">
            <div className="text-sm font-semibold">{name}</div>
            <div className="text-xs text-muted-foreground">
              PNG or JPG, up to 2 MB. Square images work best.
            </div>
            <div className="mt-2 flex gap-2">
              <label className="inline-flex cursor-pointer items-center gap-1.5 rounded-md border border-border/70 bg-surface px-2.5 py-1 text-[11px] font-medium hover:border-primary/40">
                <Upload className="h-3 w-3" />
                {uploadAvatar.isPending ? "Uploading…" : "Upload new"}
                <input type="file" accept="image/*" className="hidden" onChange={handleFileChange} />
              </label>
              <button
                onClick={() => updateProfile.mutate({ avatarUrl: "" })}
                className="rounded-md px-2.5 py-1 text-[11px] font-medium text-rose-600 hover:bg-rose-50"
              >
                Remove
              </button>
            </div>
          </div>
        </div>

        <div className="mt-5 grid grid-cols-1 gap-4 sm:grid-cols-2">
          <Field label="Full name">
            <Input value={name} onChange={(e) => setName(e.target.value)} />
          </Field>
          <Field label="Display handle" hint="Shown in @mentions">
            <Input value={handle} onChange={(e) => setHandle(e.target.value)} />
          </Field>
          <Field label="Email">
            <Input type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
          </Field>
          <Field label="Job title">
            <Input value={title} onChange={(e) => setTitle(e.target.value)} />
          </Field>
          <Field label="Team / Department">
            <Input value={team} onChange={(e) => setTeam(e.target.value)} />
          </Field>
          <Field label="Timezone">
            <Input defaultValue="Europe/Madrid (GMT+1)" readOnly className="bg-surface-muted/50" />
          </Field>
        </div>

        <div className="mt-4">
          <Field label="Bio" hint="Brief summary for your profile card">
            <Textarea value={bio} onChange={(e) => setBio(e.target.value)} />
          </Field>
        </div>

        <FormFooter onSave={handleSave} loading={updateProfile.isPending} />
      </Panel>
    </>
  );
}

function AppearanceSection() {
  const updatePreferences = useUpdatePreferences();
  const [theme, setTheme] = useState<"light" | "dark" | "system">("system");
  const [accent, setAccent] = useState("violet");
  const [density, setDensity] = useState("comfortable");

  const themes: { id: "light" | "dark" | "system"; label: string; icon: typeof Sun }[] = [
    { id: "light", label: "Light", icon: Sun },
    { id: "dark", label: "Dark", icon: Moon },
    { id: "system", label: "System", icon: Monitor },
  ];

  const accents = [
    { id: "violet", hue: 268 },
    { id: "emerald", hue: 150 },
    { id: "amber", hue: 45 },
    { id: "rose", hue: 340 },
    { id: "sky", hue: 210 },
  ];

  function handleThemeChange(t: "light" | "dark" | "system") {
    setTheme(t);
    updatePreferences.mutate({ theme: t });
  }

  return (
    <>
      <Panel title="Theme" description="Select or sync with your system preference.">
        <div className="grid grid-cols-3 gap-3">
          {themes.map((t) => {
            const Icon = t.icon;
            const active = theme === t.id;
            return (
              <button
                key={t.id}
                onClick={() => handleThemeChange(t.id)}
                className={`overflow-hidden rounded-xl border p-1 text-left transition ${
                  active
                    ? "border-primary bg-primary/5 ring-2 ring-primary/20"
                    : "border-border/70 hover:border-primary/40"
                }`}
              >
                <div
                  className={`relative h-20 rounded-lg border ${
                    t.id === "dark" ? "bg-slate-900 border-slate-800" : "bg-slate-50 border-slate-200"
                  }`}
                >
                  <div className="absolute left-2 top-2 flex items-center gap-1.5">
                    <span className="h-2 w-2 rounded-full bg-primary" />
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

      <Panel title="Interface" description="Density and typography preferences.">
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
      </Panel>
    </>
  );
}

function NotificationsSection() {
  const updatePreferences = useUpdatePreferences();
  const [emailNotifs, setEmailNotifs] = useState(true);
  const [pushNotifs, setPushNotifs] = useState(false);

  return (
    <>
      <Panel title="Notification channels" description="Choose where you want to receive updates.">
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
          <button
            onClick={() => {
              setEmailNotifs(!emailNotifs);
              updatePreferences.mutate({ emailNotifications: !emailNotifs });
            }}
            className={`flex items-start gap-3 rounded-xl border p-4 text-left transition ${
              emailNotifs
                ? "border-primary/40 bg-gradient-to-br from-primary/[0.05] to-accent/[0.05]"
                : "border-border/70 hover:border-primary/40"
            }`}
          >
            <span
              className={`flex h-9 w-9 items-center justify-center rounded-lg ${
                emailNotifs
                  ? "bg-gradient-to-br from-primary to-accent text-white"
                  : "bg-surface-muted text-muted-foreground"
              }`}
            >
              <Mail className="h-4 w-4" />
            </span>
            <div className="min-w-0 flex-1">
              <div className="text-[13px] font-semibold">Email</div>
              <div className="truncate text-[11px] text-muted-foreground">Direct inbox</div>
            </div>
            <Toggle checked={emailNotifs} onChange={setEmailNotifs} />
          </button>

          <button
            onClick={() => {
              setPushNotifs(!pushNotifs);
              updatePreferences.mutate({ pushNotifications: !pushNotifs });
            }}
            className={`flex items-start gap-3 rounded-xl border p-4 text-left transition ${
              pushNotifs
                ? "border-primary/40 bg-gradient-to-br from-primary/[0.05] to-accent/[0.05]"
                : "border-border/70 hover:border-primary/40"
            }`}
          >
            <span
              className={`flex h-9 w-9 items-center justify-center rounded-lg ${
                pushNotifs
                  ? "bg-gradient-to-br from-primary to-accent text-white"
                  : "bg-surface-muted text-muted-foreground"
              }`}
            >
              <Smartphone className="h-4 w-4" />
            </span>
            <div className="min-w-0 flex-1">
              <div className="text-[13px] font-semibold">Mobile push</div>
              <div className="truncate text-[11px] text-muted-foreground">iOS · Android</div>
            </div>
            <Toggle checked={pushNotifs} onChange={setPushNotifs} />
          </button>
        </div>
      </Panel>
    </>
  );
}

function WorkspaceSection() {
  const { data: workspaces = [], isLoading, isError, error } = useWorkspaces();
  const updateWorkspace = useUpdateWorkspace();
  const deleteWorkspace = useDeleteWorkspace();

  const [activeId, setActiveId] = useState<string>(() => getPersistedWorkspaceId() ?? "");
  const active = workspaces.find((w) => w.id === activeId) ?? workspaces[0];

  const [name, setName] = useState("");
  const [slug, setSlug] = useState("");
  const [industry, setIndustry] = useState("");
  const [teamSize, setTeamSize] = useState("");

  useEffect(() => {
    if (active) {
      setName(active.name ?? "");
      setSlug(active.slug ?? "");
      setIndustry((active.industry as string) ?? "saas");
      setTeamSize((active.teamSize as string) ?? "11-50");
      if (!activeId || activeId !== active.id) {
        setActiveId(active.id);
        persistWorkspaceId(active.id);
      }
    }
  }, [active]);

  function handleSave() {
    if (!active) return;
    updateWorkspace.mutate({
      workspaceId: active.id,
      input: { name, slug, industry, teamSize },
    });
  }

  if (isLoading) {
    return (
      <Panel title="Workspace">
        <div className="py-12 text-center text-sm text-muted-foreground">Loading workspace…</div>
      </Panel>
    );
  }

  if (isError || !active) {
    return (
      <Panel title="Workspace">
        <div className="py-12 text-center text-sm text-muted-foreground">
          {error instanceof Error ? error.message : "No workspaces found."}
        </div>
      </Panel>
    );
  }

  const initial = active.name ? active.name.charAt(0).toUpperCase() : "W";

  return (
    <>
      <Panel title="Workspace" description="Details visible to everyone in your workspace.">
        <div className="flex items-center gap-4 rounded-xl border border-border/60 bg-surface-muted/40 p-4">
          <div
            className="flex h-14 w-14 items-center justify-center rounded-2xl text-lg font-bold text-white shadow-md"
            style={{ background: "linear-gradient(135deg, oklch(0.62 0.22 268), oklch(0.7 0.18 200))" }}
          >
            {initial}
          </div>
          <div className="flex-1">
            <div className="text-sm font-semibold">{active.name}</div>
            <div className="text-xs text-muted-foreground">
              {active.slug ? `zabaku.dev/${active.slug as string}` : ""}
            </div>
          </div>
        </div>

        <div className="mt-5 grid grid-cols-1 gap-4 sm:grid-cols-2">
          <Field label="Workspace name">
            <Input value={name} onChange={(e) => setName(e.target.value)} />
          </Field>
          <Field label="Workspace URL" hint="zabaku.dev/…">
            <Input value={slug} onChange={(e) => setSlug(e.target.value)} />
          </Field>
        </div>

        <FormFooter onSave={handleSave} loading={updateWorkspace.isPending} />
      </Panel>
    </>
  );
}

function SecuritySection() {
  const changePassword = useChangePassword();
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [msg, setMsg] = useState<{ type: "success" | "error"; text: string } | null>(null);

  async function handlePasswordSave() {
    setMsg(null);
    if (!currentPassword || !newPassword) {
      setMsg({ type: "error", text: "Please enter your current and new password." });
      return;
    }
    if (newPassword !== confirmPassword) {
      setMsg({ type: "error", text: "New passwords do not match." });
      return;
    }
    try {
      await changePassword.mutateAsync({ currentPassword, newPassword });
      setMsg({ type: "success", text: "Password changed successfully!" });
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
    } catch (err) {
      setMsg({ type: "error", text: err instanceof Error ? err.message : "Failed to change password." });
    }
  }

  return (
    <>
      <Panel title="Password" description="Use a strong, unique password.">
        {msg && (
          <div
            className={`mb-4 flex items-center gap-2 rounded-lg px-3.5 py-2.5 text-xs font-medium ${
              msg.type === "success"
                ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                : "bg-destructive/10 text-destructive border border-destructive/30"
            }`}
          >
            <AlertCircle className="h-4 w-4 shrink-0" />
            {msg.text}
          </div>
        )}

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <Field label="Current password">
            <Input
              type="password"
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
            />
          </Field>
          <div />
          <Field label="New password">
            <Input
              type="password"
              placeholder="At least 8 characters"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
            />
          </Field>
          <Field label="Confirm new password">
            <Input
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
            />
          </Field>
        </div>
        <FormFooter onSave={handlePasswordSave} loading={changePassword.isPending} />
      </Panel>
    </>
  );
}

function AISection() {
  return (
    <Panel title="Copilot" description="How Zabaku AI shows up while you work.">
      <Row title="Enable Copilot" desc="Suggestions across tasks, docs and PRs.">
        <Toggle checked={true} onChange={() => {}} />
      </Row>
    </Panel>
  );
}

function BillingSection() {
  return (
    <Panel title="Plan" description="Manage your current subscription.">
      <div className="flex items-center justify-between rounded-xl border border-border/70 bg-surface-muted/40 p-4">
        <div>
          <div className="text-sm font-semibold">Team Plan</div>
          <div className="text-xs text-muted-foreground">$29 / member / month</div>
        </div>
        <button className="rounded-lg bg-primary px-3.5 py-1.5 text-xs font-semibold text-white">
          Manage Plan
        </button>
      </div>
    </Panel>
  );
}

function IntegrationsSection() {
  return (
    <Panel title="Connected Apps" description="Manage third-party integrations.">
      <div className="space-y-3">
        {[{ name: "GitHub", desc: "Sync repositories and pull requests" }, { name: "Slack", desc: "Send notifications to channels" }].map((app) => (
          <div key={app.name} className="flex items-center justify-between rounded-xl border border-border/70 p-3">
            <div>
              <div className="text-xs font-semibold">{app.name}</div>
              <div className="text-[11px] text-muted-foreground">{app.desc}</div>
            </div>
            <button className="rounded-md border border-border/70 bg-surface px-2.5 py-1 text-xs font-medium">
              Configure
            </button>
          </div>
        ))}
      </div>
    </Panel>
  );
}
