import zabakuLogo from "@/assets/zabaku-logo.png.asset.json";
import { createFileRoute, Link, useRouter } from "@tanstack/react-router";
import { useState } from "react";
import { api } from "@/lib/api";
import {
  Mail, Lock, Eye, EyeOff, ArrowRight, Check, Sparkles, Bot,
  CheckCircle2, TrendingUp, Kanban, Circle,
} from "lucide-react";

import { useAuth } from "@/hooks/useAuth";
import { getWorkspaces } from "@/features/workspaces/api";

export const Route = createFileRoute("/login")({
  head: () => ({
    meta: [
      { title: "Sign in — Zabaku" },
      { name: "description", content: "Sign in to Zabaku — the AI-powered operating system for startups." },
      { property: "og:title", content: "Sign in — Zabaku" },
      { property: "og:description", content: "Sign in to Zabaku — the AI-powered operating system for startups." },
    ],
  }),
  component: LoginPage,
});

function LogoMark({ size = 28 }: { size?: number }) {
  return (
    <img src={zabakuLogo.url} alt="Zabaku" width={size} height={size} className="rounded-[10px] shadow-glow object-cover" style={{ width: size, height: size }} />
  );
}

function LoginPage() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <div className="grid min-h-screen lg:grid-cols-2">
        <LeftPanel />
        <RightPanel />
      </div>
    </div>
  );
}

/* ============ LEFT — AI project management illustration ============ */
function LeftPanel() {
  return (
    <section className="relative isolate hidden overflow-hidden lg:block">
      {/* mesh gradient */}
      <div className="absolute inset-0 -z-10 bg-[oklch(0.16_0.03_265)]" />
      <div className="absolute inset-0 -z-10 opacity-90"
        style={{
          background:
            "radial-gradient(600px 500px at 15% 20%, oklch(0.55 0.22 279 / 0.7), transparent 60%),\
             radial-gradient(700px 600px at 90% 30%, oklch(0.78 0.14 210 / 0.55), transparent 60%),\
             radial-gradient(800px 700px at 40% 100%, oklch(0.6 0.2 320 / 0.45), transparent 65%)",
        }}
      />
      {/* grid */}
      <div className="absolute inset-0 -z-10 opacity-[0.08] [mask-image:radial-gradient(70%_60%_at_50%_40%,black,transparent)]">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,white_1px,transparent_1px),linear-gradient(to_bottom,white_1px,transparent_1px)] bg-[size:48px_48px]" />
      </div>
      {/* orbs */}
      <div className="pointer-events-none absolute -left-24 top-24 h-72 w-72 rounded-full bg-primary/40 blur-3xl animate-float" />
      <div className="pointer-events-none absolute right-10 bottom-24 h-80 w-80 rounded-full bg-accent/40 blur-3xl animate-float" style={{ animationDelay: "-3s" }} />

      <div className="relative flex h-full flex-col justify-between p-12 text-white">
        {/* brand */}
        <div className="flex items-center gap-2">
          <LogoMark />
          <span className="text-[16px] font-semibold tracking-tight">Zabaku</span>
        </div>

        {/* Illustration */}
        <div className="relative mx-auto my-8 w-full max-w-lg">
          <IllustrationStack />
        </div>

        {/* Quote / footer */}
        <div className="max-w-md">
          <p className="text-[22px] font-semibold leading-snug tracking-tight text-white">
            "Zabaku's AI plans our sprints better than half our PMs.
            We ship 2× faster."
          </p>
          <div className="mt-5 flex items-center gap-3">
            <span className="grid h-9 w-9 place-items-center rounded-full text-[11px] font-semibold text-white shadow-glow" style={{ background: "oklch(0.72 0.16 180)" }}>
              PS
            </span>
            <div>
              <p className="text-[13.5px] font-semibold">Priya Shah</p>
              <p className="text-[11.5px] text-white/60">CTO, Northwind</p>
            </div>
            <div className="ml-auto flex items-center gap-3 text-[11px] text-white/60">
              <span className="flex items-center gap-1.5"><span className="h-1.5 w-1.5 rounded-full bg-success" /> SOC 2</span>
              <span>GDPR</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function IllustrationStack() {
  return (
    <div className="relative h-[480px] w-full">
      {/* Kanban card - back */}
      <div className="absolute left-0 top-4 w-[300px] rotate-[-6deg] rounded-2xl border border-white/15 bg-white/10 p-4 shadow-float backdrop-blur-xl">
        <div className="mb-3 flex items-center gap-2">
          <Kanban className="h-3.5 w-3.5 text-white/80" />
          <span className="text-[11px] font-semibold text-white">Payments v2 · Sprint 14</span>
          <span className="ml-auto rounded bg-white/15 px-1.5 py-0.5 text-[9.5px] text-white/80">Live</span>
        </div>
        <div className="grid grid-cols-3 gap-1.5">
          {["Backlog", "In progress", "Done"].map((c, i) => (
            <div key={c} className="rounded-lg bg-white/10 p-1.5">
              <p className={`mb-1 text-[8.5px] font-semibold uppercase tracking-wider ${i === 1 ? "text-[oklch(0.83_0.14_210)]" : i === 2 ? "text-success" : "text-white/50"}`}>{c}</p>
              <div className="space-y-1">
                {[1, 2].map((k) => (
                  <div key={k} className="rounded-md bg-white/10 p-1.5">
                    <div className="h-1 w-full rounded bg-white/20" />
                    <div className="mt-1 h-1 w-2/3 rounded bg-white/15" />
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* AI chat card - middle */}
      <div className="absolute right-2 top-0 w-[280px] rotate-[5deg] rounded-2xl border border-white/15 bg-white/10 p-4 shadow-float backdrop-blur-xl">
        <div className="flex items-center gap-2">
          <span className="grid h-6 w-6 place-items-center rounded-md bg-gradient-primary text-white shadow-glow">
            <Bot className="h-3 w-3" />
          </span>
          <span className="text-[11.5px] font-semibold text-white">Copilot</span>
          <span className="ml-auto text-[9.5px] text-white/50">Thinking…</span>
        </div>
        <div className="mt-3 space-y-2">
          <div className="ml-auto max-w-[85%] rounded-xl rounded-tr-md bg-gradient-primary px-2.5 py-1.5 text-[10.5px] text-white">
            Plan a 3-week sprint for onboarding.
          </div>
          <div className="max-w-[90%] rounded-xl rounded-tl-md border border-white/15 bg-white/10 p-2 text-[10.5px] text-white/90">
            17 tickets across 3 tracks. Ready to create?
            <div className="mt-1.5 flex gap-1">
              <span className="rounded-md bg-gradient-primary px-1.5 py-0.5 text-[9px] font-semibold text-white">Create</span>
              <span className="rounded-md bg-white/10 px-1.5 py-0.5 text-[9px] font-medium">Refine</span>
            </div>
          </div>
        </div>
      </div>

      {/* Center hero card - AI planner */}
      <div className="absolute left-1/2 top-[180px] w-[340px] -translate-x-1/2 rounded-2xl border border-white/20 bg-white/12 p-5 shadow-float backdrop-blur-2xl">
        <div className="flex items-center gap-2">
          <span className="grid h-8 w-8 place-items-center rounded-xl bg-gradient-primary text-white shadow-glow">
            <Sparkles className="h-4 w-4" />
          </span>
          <div>
            <p className="text-[12px] font-semibold text-white">AI Project Planner</p>
            <p className="text-[10px] text-white/60">Generating milestones…</p>
          </div>
          <span className="ml-auto rounded bg-white/15 px-1.5 py-0.5 text-[9px] font-semibold text-white">GPT-5.5</span>
        </div>
        <div className="mt-4 space-y-2">
          {[
            { i: 1, t: "Discovery & user interviews", d: "3 tickets · 4 days", done: true },
            { i: 2, t: "Design system prototype", d: "6 tickets · 1 week", done: true },
            { i: 3, t: "Backend + AI copilot", d: "8 tickets · 2 weeks", done: false },
          ].map((s) => (
            <div key={s.i} className="flex items-center gap-2.5 rounded-lg bg-white/10 p-2">
              <span className="grid h-6 w-6 place-items-center rounded-md bg-gradient-primary text-[10px] font-bold text-white">{s.i}</span>
              <div className="min-w-0 flex-1">
                <p className="truncate text-[11px] font-medium text-white">{s.t}</p>
                <p className="text-[9.5px] text-white/60">{s.d}</p>
              </div>
              {s.done ? <CheckCircle2 className="h-4 w-4 text-success" /> : <Circle className="h-4 w-4 text-white/40" />}
            </div>
          ))}
        </div>
      </div>

      {/* Floating stat card */}
      <div className="absolute -bottom-2 left-4 w-[210px] rounded-2xl border border-white/15 bg-white/10 p-3 shadow-float backdrop-blur-xl animate-float">
        <div className="flex items-center gap-2">
          <span className="grid h-8 w-8 place-items-center rounded-lg bg-success/25 text-success">
            <TrendingUp className="h-4 w-4" />
          </span>
          <div>
            <p className="text-[12px] font-semibold text-white">Velocity +23%</p>
            <p className="text-[10px] text-white/60">vs. last sprint</p>
          </div>
        </div>
      </div>

      {/* Floating avatar cluster */}
      <div className="absolute -bottom-3 right-2 rounded-2xl border border-white/15 bg-white/10 p-3 shadow-float backdrop-blur-xl animate-float" style={{ animationDelay: "-2s" }}>
        <div className="flex items-center gap-2">
          <div className="flex -space-x-2">
            {["oklch(0.55 0.22 279)", "oklch(0.72 0.16 180)", "oklch(0.75 0.16 92)", "oklch(0.68 0.17 28)"].map((c, i) => (
              <span key={i} className="grid h-7 w-7 place-items-center rounded-full border-2 border-[oklch(0.16_0.03_265)] text-[10px] font-semibold text-white" style={{ background: c }}>
                {["JL", "AK", "MB", "SR"][i]}
              </span>
            ))}
          </div>
          <div>
            <p className="text-[11.5px] font-semibold text-white">4 online</p>
            <p className="text-[10px] text-white/60">editing spec.md</p>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ============ RIGHT — login card ============ */
interface LoginResponse {
  success: boolean;
  message: string;
  data: {
    user: Record<string, unknown>;
    token: string;
  };
}

function RightPanel() {
  const router = useRouter();

  const { login } = useAuth();;

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPw, setShowPw] = useState(false);
  const [remember, setRemember] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);
    setIsLoading(true);
    try {
      const res = await api<LoginResponse>("/auth/login", {
        method: "POST",
        body: { email, password },
      });

      await login(res.data.token);
      router.navigate({
        to: "/dashboard",
      });

    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Sign in failed. Please try again."
      );
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <section className="relative flex items-center justify-center overflow-hidden p-6 sm:p-10">
      {/* subtle background */}
      <div className="pointer-events-none absolute inset-0 -z-10 bg-hero opacity-70" />
      <div className="pointer-events-none absolute inset-0 -z-10 opacity-40 [mask-image:radial-gradient(60%_60%_at_50%_40%,black,transparent)]">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,oklch(0.18_0.04_265/0.06)_1px,transparent_1px),linear-gradient(to_bottom,oklch(0.18_0.04_265/0.06)_1px,transparent_1px)] bg-[size:44px_44px]" />
      </div>

      {/* mobile brand */}
      <div className="absolute left-6 top-6 flex items-center gap-2 lg:hidden">
        <LogoMark size={24} />
        <span className="text-[14.5px] font-semibold tracking-tight">Zabaku</span>
      </div>

      <div className="relative w-full max-w-[440px]">
        <div className="absolute -inset-6 -z-10 rounded-[36px] bg-gradient-primary opacity-15 blur-3xl" />

        <div className="glass rounded-3xl border border-border/70 p-8 shadow-float animate-fade-up sm:p-10">
          {/* header */}
          <div className="flex flex-col items-start">
            <div className="hidden items-center gap-2 lg:flex">
              <LogoMark size={24} />
              <span className="text-[14px] font-semibold tracking-tight">Zabaku</span>
            </div>
            <h1 className="mt-6 text-[28px] font-semibold tracking-[-0.02em] lg:mt-5">
              Welcome back
            </h1>
            <p className="mt-1.5 text-[13.5px] text-muted-foreground">
              Sign in to your workspace to keep shipping.
            </p>
          </div>

          {/* Google */}
          <button className="mt-7 flex w-full items-center justify-center gap-2.5 rounded-xl border border-border bg-surface px-4 py-2.5 text-[13.5px] font-semibold text-foreground shadow-xs transition-all hover:-translate-y-0.5 hover:shadow-soft">
            <GoogleIcon />
            Continue with Google
          </button>

          {/* divider */}
          <div className="my-6 flex items-center gap-3">
            <span className="h-px flex-1 bg-border" />
            <span className="text-[10.5px] font-medium uppercase tracking-[0.18em] text-muted-foreground">or</span>
            <span className="h-px flex-1 bg-border" />
          </div>

          {/* form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            <Field
              id="email"
              label="Email"
              icon={<Mail className="h-4 w-4" />}
              type="email"
              placeholder="you@company.com"
              autoComplete="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />

            <div>
              <div className="mb-1.5 flex items-center justify-between">
                <label htmlFor="password" className="text-[12px] font-semibold text-foreground">Password</label>
                <a href="#" className="text-[12px] font-medium text-primary hover:underline">Forgot password?</a>
              </div>
              <div className="group relative">
                <span className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-muted-foreground transition-colors group-focus-within:text-primary">
                  <Lock className="h-4 w-4" />
                </span>
                <input
                  id="password"
                  type={showPw ? "text" : "password"}
                  autoComplete="current-password"
                  placeholder="••••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="h-11 w-full rounded-xl border border-border bg-surface pl-10 pr-11 text-[13.5px] text-foreground shadow-xs outline-none transition-all placeholder:text-muted-foreground/70 focus:border-primary/60 focus:ring-4 focus:ring-primary/15"
                />
                <button
                  type="button"
                  onClick={() => setShowPw((v) => !v)}
                  className="absolute right-2 top-1/2 -translate-y-1/2 grid h-8 w-8 place-items-center rounded-lg text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground"
                  aria-label={showPw ? "Hide password" : "Show password"}
                >
                  {showPw ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>

            {/* remember */}
            <label className="flex cursor-pointer items-center gap-2.5 select-none">
              <button
                type="button"
                onClick={() => setRemember(!remember)}
                className={`grid h-4 w-4 flex-none place-items-center rounded-[5px] border transition-all ${remember
                  ? "border-transparent bg-gradient-primary shadow-glow"
                  : "border-border bg-surface"
                  }`}
                aria-pressed={remember}
              >
                {remember && <Check className="h-3 w-3 text-white" strokeWidth={3} />}
              </button>
              <span className="text-[12.5px] text-foreground/90">Remember me for 30 days</span>
            </label>

            {/* error message */}
            {error && (
              <p role="alert" className="rounded-xl border border-destructive/30 bg-destructive/10 px-4 py-3 text-[12.5px] font-medium text-destructive">
                {error}
              </p>
            )}

            {/* submit */}
            <button
              type="submit"
              disabled={isLoading}
              className="group mt-2 flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-primary px-4 py-3 text-[14px] font-semibold text-white shadow-glow transition-transform hover:scale-[1.02] active:scale-[0.99] disabled:cursor-not-allowed disabled:opacity-60 disabled:hover:scale-100"
            >
              {isLoading ? "Signing in…" : "Sign in"}
              {!isLoading && <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />}
            </button>
          </form>

          {/* register */}
          <p className="mt-6 text-center text-[13px] text-muted-foreground">
            New to Zabaku?{" "}
            <Link to="/" className="font-semibold text-primary hover:underline">
              Create an account
            </Link>
          </p>
        </div>

        <p className="mt-6 text-center text-[11.5px] text-muted-foreground">
          By continuing you agree to our{" "}
          <a href="#" className="underline underline-offset-2 hover:text-foreground">Terms</a>{" "}
          and{" "}
          <a href="#" className="underline underline-offset-2 hover:text-foreground">Privacy Policy</a>.
        </p>
      </div>
    </section>
  );
}

function Field({
  id, label, icon, type = "text", placeholder, autoComplete, value, onChange,
}: {
  id: string;
  label: string;
  icon: React.ReactNode;
  type?: string;
  placeholder?: string;
  autoComplete?: string;
  value?: string;
  onChange?: React.ChangeEventHandler<HTMLInputElement>;
}) {
  return (
    <div>
      <label htmlFor={id} className="mb-1.5 block text-[12px] font-semibold text-foreground">{label}</label>
      <div className="group relative">
        <span className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-muted-foreground transition-colors group-focus-within:text-primary">
          {icon}
        </span>
        <input
          id={id}
          type={type}
          autoComplete={autoComplete}
          placeholder={placeholder}
          value={value}
          onChange={onChange}
          className="h-11 w-full rounded-xl border border-border bg-surface pl-10 pr-4 text-[13.5px] text-foreground shadow-xs outline-none transition-all placeholder:text-muted-foreground/70 focus:border-primary/60 focus:ring-4 focus:ring-primary/15"
        />
      </div>
    </div>
  );
}

function GoogleIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 48 48" aria-hidden="true">
      <path fill="#FFC107" d="M43.6 20.5H42V20H24v8h11.3C33.9 32.4 29.4 35.5 24 35.5c-6.4 0-11.5-5.1-11.5-11.5S17.6 12.5 24 12.5c2.9 0 5.6 1.1 7.7 2.9l5.7-5.7C33.8 6.3 29.1 4.5 24 4.5 13.2 4.5 4.5 13.2 4.5 24S13.2 43.5 24 43.5 43.5 34.8 43.5 24c0-1.2-.1-2.3-.3-3.5z" />
      <path fill="#FF3D00" d="M6.3 14.7l6.6 4.8C14.7 15.9 19 12.5 24 12.5c2.9 0 5.6 1.1 7.7 2.9l5.7-5.7C33.8 6.3 29.1 4.5 24 4.5 16.3 4.5 9.7 8.9 6.3 14.7z" />
      <path fill="#4CAF50" d="M24 43.5c5 0 9.6-1.9 13.1-5l-6-4.9c-2 1.5-4.5 2.4-7.1 2.4-5.4 0-9.9-3.1-11.4-7.5l-6.5 5C9.6 39 16.2 43.5 24 43.5z" />
      <path fill="#1976D2" d="M43.6 20.5H42V20H24v8h11.3c-.8 2.2-2.2 4.1-4.1 5.5l6 4.9c-.4.4 6.3-4.6 6.3-14.4 0-1.2-.1-2.3-.3-3.5z" />
    </svg>
  );
}
