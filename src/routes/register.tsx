import zabakuLogo from "@/assets/zabaku-logo.png.asset.json";
import { createFileRoute, Link, useRouter } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { api } from "@/lib/api";
import {
  Mail, Lock, User, Eye, EyeOff, ArrowRight, Check, Sparkles,
  Rocket, Users, Zap, Shield,
} from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { getWorkspaces } from "@/features/workspaces/api";

export const Route = createFileRoute("/register")({
  head: () => ({
    meta: [
      { title: "Create your workspace — Zabaku" },
      { name: "description", content: "Create your Zabaku workspace and start shipping with the AI operating system for startups." },
      { property: "og:title", content: "Create your workspace — Zabaku" },
      { property: "og:description", content: "Create your Zabaku workspace and start shipping with the AI operating system for startups." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: RegisterPage,
});

function LogoMark({ size = 28 }: { size?: number }) {
  return (
    <img src={zabakuLogo.url} alt="Zabaku" width={size} height={size} className="rounded-[10px] shadow-glow object-cover" style={{ width: size, height: size }} />
  );
}

function RegisterPage() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <div className="grid min-h-screen lg:grid-cols-[1.05fr_1fr]">
        <LeftPanel />
        <RightPanel />
      </div>
    </div>
  );
}

/* =============== LEFT — soft illustration + benefits =============== */
function LeftPanel() {
  return (
    <section className="relative isolate hidden overflow-hidden lg:block">
      {/* Soft pastel wash */}
      <div className="absolute inset-0 -z-10" style={{ background: "oklch(0.985 0.008 265)" }} />
      <div
        className="absolute inset-0 -z-10"
        style={{
          background:
            "radial-gradient(700px 550px at 12% 10%, oklch(0.9 0.08 279 / 0.55), transparent 60%),\
             radial-gradient(650px 550px at 95% 20%, oklch(0.92 0.09 210 / 0.55), transparent 60%),\
             radial-gradient(700px 600px at 60% 100%, oklch(0.94 0.07 330 / 0.5), transparent 65%)",
        }}
      />
      {/* soft grid */}
      <div className="absolute inset-0 -z-10 opacity-[0.06] [mask-image:radial-gradient(70%_60%_at_50%_45%,black,transparent)]">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,oklch(0.2_0.05_265)_1px,transparent_1px),linear-gradient(to_bottom,oklch(0.2_0.05_265)_1px,transparent_1px)] bg-[size:52px_52px]" />
      </div>
      {/* orbs */}
      <div className="pointer-events-none absolute -left-24 top-20 h-80 w-80 rounded-full bg-primary/25 blur-3xl animate-float" />
      <div className="pointer-events-none absolute right-0 bottom-10 h-96 w-96 rounded-full bg-accent/25 blur-3xl animate-float" style={{ animationDelay: "-4s" }} />

      <div className="relative flex h-full flex-col justify-between px-16 py-14">
        {/* brand */}
        <div className="flex items-center gap-2">
          <LogoMark />
          <span className="text-[16px] font-semibold tracking-tight">Zabaku</span>
        </div>

        {/* Illustration */}
        <div className="mx-auto w-full max-w-[520px]">
          <SoftIllustration />

          <div className="mt-12">
            <h2 className="text-[32px] font-semibold tracking-[-0.02em] text-foreground">
              A calmer way to ship.
            </h2>
            <p className="mt-3 max-w-md text-[15px] leading-relaxed text-muted-foreground">
              Set up your workspace in under a minute. Invite the team, plug in your
              tools, and let the AI take care of the busywork.
            </p>

            <ul className="mt-8 grid gap-4">
              {[
                { icon: <Rocket className="h-4 w-4" />, t: "Launch in 60 seconds", d: "Templates for product, ops, and design teams." },
                { icon: <Users className="h-4 w-4" />, t: "Invite unlimited teammates", d: "Free during your 14-day trial." },
                { icon: <Shield className="h-4 w-4" />, t: "SOC 2 & GDPR ready", d: "Enterprise-grade from day one." },
              ].map((b) => (
                <li key={b.t} className="flex items-start gap-3">
                  <span className="grid h-9 w-9 flex-none place-items-center rounded-xl border border-border/70 bg-white/70 text-primary shadow-xs backdrop-blur">
                    {b.icon}
                  </span>
                  <div>
                    <p className="text-[13.5px] font-semibold text-foreground">{b.t}</p>
                    <p className="text-[12.5px] text-muted-foreground">{b.d}</p>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* footer trust */}
        <div className="flex items-center gap-4 text-[11.5px] text-muted-foreground">
          <span className="flex items-center gap-1.5"><span className="h-1.5 w-1.5 rounded-full bg-success" /> All systems normal</span>
          <span>·</span>
          <span>Trusted by 12,000+ teams</span>
        </div>
      </div>
    </section>
  );
}

function SoftIllustration() {
  return (
    <div className="relative h-[280px] w-full">
      {/* Big soft blob card */}
      <div className="absolute left-1/2 top-4 h-[240px] w-[420px] -translate-x-1/2 rounded-[36px] border border-white/70 bg-white/60 shadow-float backdrop-blur-xl" />

      {/* Workspace card */}
      <div className="absolute left-6 top-10 w-[240px] rotate-[-4deg] rounded-2xl border border-border/60 bg-white/90 p-4 shadow-float">
        <div className="flex items-center gap-2">
          <span className="grid h-7 w-7 place-items-center rounded-lg bg-gradient-primary text-white shadow-glow">
            <Sparkles className="h-3.5 w-3.5" />
          </span>
          <div>
            <p className="text-[11.5px] font-semibold text-foreground">Northwind HQ</p>
            <p className="text-[10px] text-muted-foreground">Workspace · 12 members</p>
          </div>
        </div>
        <div className="mt-3 space-y-1.5">
          {[
            { c: "oklch(0.55 0.22 279)", t: "Product roadmap" },
            { c: "oklch(0.72 0.16 180)", t: "Design system" },
            { c: "oklch(0.75 0.16 92)", t: "Growth sprint" },
          ].map((r) => (
            <div key={r.t} className="flex items-center gap-2 rounded-lg bg-secondary/60 px-2 py-1.5">
              <span className="h-2 w-2 rounded-full" style={{ background: r.c }} />
              <span className="text-[11px] font-medium text-foreground">{r.t}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Invite card */}
      <div className="absolute right-4 top-2 w-[220px] rotate-[5deg] rounded-2xl border border-border/60 bg-white/90 p-4 shadow-float">
        <p className="text-[11px] font-semibold text-foreground">Invite your team</p>
        <p className="mt-0.5 text-[10px] text-muted-foreground">3 seats reserved · free trial</p>
        <div className="mt-3 flex items-center">
          <div className="flex -space-x-2">
            {["oklch(0.55 0.22 279)", "oklch(0.72 0.16 180)", "oklch(0.75 0.16 92)"].map((c, i) => (
              <span key={i} className="grid h-7 w-7 place-items-center rounded-full border-2 border-white text-[10px] font-semibold text-white" style={{ background: c }}>
                {["JL", "AK", "MB"][i]}
              </span>
            ))}
            <span className="grid h-7 w-7 place-items-center rounded-full border-2 border-white bg-secondary text-[10px] font-semibold text-foreground">
              +9
            </span>
          </div>
          <span className="ml-auto rounded-md bg-gradient-primary px-2 py-1 text-[10px] font-semibold text-white">Invite</span>
        </div>
      </div>

      {/* Bottom velocity chip */}
      <div className="absolute -bottom-2 left-1/2 flex -translate-x-1/2 items-center gap-2 rounded-2xl border border-border/60 bg-white/90 px-3.5 py-2.5 shadow-float animate-float">
        <span className="grid h-8 w-8 place-items-center rounded-lg bg-success/15 text-success">
          <Zap className="h-4 w-4" />
        </span>
        <div>
          <p className="text-[12px] font-semibold text-foreground">Setup in 60 seconds</p>
          <p className="text-[10px] text-muted-foreground">Guided by Zabaku AI</p>
        </div>
      </div>
    </div>
  );
}

/* =============== RIGHT — registration card =============== */
interface RegisterResponse {
  token?: string;
  data?: { token?: string };
}

function splitFullName(fullName: string): { firstName: string; lastName: string } {
  const trimmed = fullName.trim();
  if (!trimmed) {
    return { firstName: "", lastName: "" };
  }
  const spaceIndex = trimmed.indexOf(" ");
  if (spaceIndex === -1) {
    return { firstName: trimmed, lastName: "" };
  }
  const firstName = trimmed.slice(0, spaceIndex);
  const lastName = trimmed.slice(spaceIndex + 1).trim();
  return { firstName, lastName };
}

function RightPanel() {
  const router = useRouter();

  const { login } = useAuth();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [showPw, setShowPw] = useState(false);
  const [showPw2, setShowPw2] = useState(false);
  const [agree, setAgree] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const strength = useMemo(() => scorePassword(password), [password]);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);

    if (password !== confirm) {
      setError("Passwords do not match.");
      return;
    }

    const { firstName, lastName } = splitFullName(name);

    if (!firstName) {
      setError("Please enter your full name.");
      return;
    }

    setIsLoading(true);
    try {
      const data = await api<RegisterResponse>("/auth/register", {
        method: "POST",
        body: {
          firstName,
          lastName,
          email,
          password,
          workspaceName: `${firstName}'s Workspace`,
        },
      });

      const token = data?.token ?? data?.data?.token;

      if (!token) {
        router.navigate({ to: "/login" });
        return;
      }

      // Let AuthContext initialize the user
      await login(token);

      // Check whether the new user has any workspaces
      await login(token);

      router.navigate({
        to: "/dashboard",
      });

    } catch (err) {
      setError(err instanceof Error ? err.message : "Registration failed. Please try again.");
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <section className="relative flex items-center justify-center overflow-hidden p-6 sm:p-10 lg:p-14">
      <div className="pointer-events-none absolute inset-0 -z-10 bg-hero opacity-60" />
      <div className="pointer-events-none absolute inset-0 -z-10 opacity-40 [mask-image:radial-gradient(60%_60%_at_50%_40%,black,transparent)]">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,oklch(0.18_0.04_265/0.06)_1px,transparent_1px),linear-gradient(to_bottom,oklch(0.18_0.04_265/0.06)_1px,transparent_1px)] bg-[size:44px_44px]" />
      </div>

      {/* mobile brand */}
      <div className="absolute left-6 top-6 flex items-center gap-2 lg:hidden">
        <LogoMark size={24} />
        <span className="text-[14.5px] font-semibold tracking-tight">Zabaku</span>
      </div>

      <div className="relative w-full max-w-[460px]">
        <div className="absolute -inset-6 -z-10 rounded-[36px] bg-gradient-primary opacity-10 blur-3xl" />

        <div className="glass rounded-3xl border border-border/70 p-8 shadow-float animate-fade-up sm:p-10">
          <div className="hidden items-center gap-2 lg:flex">
            <LogoMark size={24} />
            <span className="text-[14px] font-semibold tracking-tight">Zabaku</span>
          </div>

          <h1 className="mt-8 text-[30px] font-semibold tracking-[-0.02em] lg:mt-6">
            Create your workspace
          </h1>
          <p className="mt-2 text-[13.5px] text-muted-foreground">
            Start your 14-day free trial. No credit card required.
          </p>

          {/* Google */}
          <button className="mt-8 flex w-full items-center justify-center gap-2.5 rounded-xl border border-border bg-surface px-4 py-3 text-[13.5px] font-semibold text-foreground shadow-xs transition-all hover:-translate-y-0.5 hover:shadow-soft">
            <GoogleIcon />
            Sign up with Google
          </button>

          <div className="my-7 flex items-center gap-3">
            <span className="h-px flex-1 bg-border" />
            <span className="text-[10.5px] font-medium uppercase tracking-[0.18em] text-muted-foreground">or with email</span>
            <span className="h-px flex-1 bg-border" />
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            <Field
              id="name"
              label="Full name"
              icon={<User className="h-4 w-4" />}
              type="text"
              placeholder="Ada Lovelace"
              autoComplete="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
            <Field
              id="email"
              label="Work email"
              icon={<Mail className="h-4 w-4" />}
              type="email"
              placeholder="you@company.com"
              autoComplete="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />

            {/* Password */}
            <div>
              <label htmlFor="password" className="mb-1.5 block text-[12px] font-semibold text-foreground">Password</label>
              <div className="group relative">
                <span className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-muted-foreground transition-colors group-focus-within:text-primary">
                  <Lock className="h-4 w-4" />
                </span>
                <input
                  id="password"
                  type={showPw ? "text" : "password"}
                  autoComplete="new-password"
                  placeholder="At least 8 characters"
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
              {/* strength */}
              <div className="mt-2 flex items-center gap-1.5">
                {[0, 1, 2, 3].map((i) => (
                  <span
                    key={i}
                    className={`h-1 flex-1 rounded-full transition-all ${i < strength.score
                      ? strength.score <= 1
                        ? "bg-destructive"
                        : strength.score === 2
                          ? "bg-warning"
                          : strength.score === 3
                            ? "bg-accent"
                            : "bg-success"
                      : "bg-border"
                      }`}
                  />
                ))}
                <span className="ml-1 text-[10.5px] font-medium text-muted-foreground">{strength.label}</span>
              </div>
            </div>

            {/* Confirm */}
            <div>
              <label htmlFor="confirm" className="mb-1.5 block text-[12px] font-semibold text-foreground">Confirm password</label>
              <div className="group relative">
                <span className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-muted-foreground transition-colors group-focus-within:text-primary">
                  <Lock className="h-4 w-4" />
                </span>
                <input
                  id="confirm"
                  type={showPw2 ? "text" : "password"}
                  autoComplete="new-password"
                  placeholder="Re-enter your password"
                  value={confirm}
                  onChange={(e) => setConfirm(e.target.value)}
                  className="h-11 w-full rounded-xl border border-border bg-surface pl-10 pr-11 text-[13.5px] text-foreground shadow-xs outline-none transition-all placeholder:text-muted-foreground/70 focus:border-primary/60 focus:ring-4 focus:ring-primary/15"
                />
                <button
                  type="button"
                  onClick={() => setShowPw2((v) => !v)}
                  className="absolute right-2 top-1/2 -translate-y-1/2 grid h-8 w-8 place-items-center rounded-lg text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground"
                  aria-label={showPw2 ? "Hide password" : "Show password"}
                >
                  {showPw2 ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>

            {/* Terms */}
            <label className="flex cursor-pointer items-start gap-2.5 select-none pt-1">
              <button
                type="button"
                onClick={() => setAgree(!agree)}
                className={`mt-0.5 grid h-4 w-4 flex-none place-items-center rounded-[5px] border transition-all ${agree ? "border-transparent bg-gradient-primary shadow-glow" : "border-border bg-surface"
                  }`}
                aria-pressed={agree}
              >
                {agree && <Check className="h-3 w-3 text-white" strokeWidth={3} />}
              </button>
              <span className="text-[12.5px] leading-relaxed text-foreground/90">
                I agree to Zabaku's{" "}
                <a href="#" className="font-medium text-primary hover:underline">Terms of Service</a>{" "}
                and{" "}
                <a href="#" className="font-medium text-primary hover:underline">Privacy Policy</a>.
              </span>
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
              disabled={!agree || isLoading}
              className="group mt-2 flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-primary px-4 py-3.5 text-[14px] font-semibold text-white shadow-glow transition-transform hover:scale-[1.02] active:scale-[0.99] disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:scale-100"
            >
              {isLoading ? "Creating workspace…" : "Create workspace"}
              {!isLoading && <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />}
            </button>
          </form>

          <p className="mt-7 text-center text-[13px] text-muted-foreground">
            Already have an account?{" "}
            <Link to="/login" className="font-semibold text-primary hover:underline">
              Sign in
            </Link>
          </p>
        </div>
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

function scorePassword(pw: string): { score: 0 | 1 | 2 | 3 | 4; label: string } {
  if (!pw) return { score: 0, label: "" };
  let s = 0;
  if (pw.length >= 8) s++;
  if (/[A-Z]/.test(pw) && /[a-z]/.test(pw)) s++;
  if (/\d/.test(pw)) s++;
  if (/[^A-Za-z0-9]/.test(pw)) s++;
  const label = ["", "Weak", "Fair", "Good", "Strong"][s];
  return { score: s as 0 | 1 | 2 | 3 | 4, label };
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
