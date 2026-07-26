import { Link, useRouterState } from "@tanstack/react-router";
import { LayoutDashboard, FolderKanban, CheckSquare, Sparkles, User } from "lucide-react";

const ITEMS = [
  { to: "/dashboard", label: "Home", icon: LayoutDashboard },
  { to: "/projects", label: "Projects", icon: FolderKanban },
  { to: "/ai", label: "AI", icon: Sparkles, center: true },
  { to: "/tasks", label: "Tasks", icon: CheckSquare },
  { to: "/profile", label: "You", icon: User },
] as const;

const HIDDEN_ON = new Set(["/", "/login", "/register"]);

export function MobileBottomNav() {
  const pathname = useRouterState({
    select: (r) => r.location.pathname,
  });

  if (HIDDEN_ON.has(pathname)) return null;

  return (
    <nav
      aria-label="Primary"
      className="fixed inset-x-0 bottom-0 z-40 md:hidden"
      style={{ paddingBottom: "env(safe-area-inset-bottom)" }}
    >
      {/* soft fade behind so content doesn't collide */}
      <div className="pointer-events-none absolute inset-x-0 -top-6 h-6 bg-gradient-to-t from-background to-transparent" />

      <div className="mx-3 mb-3 rounded-2xl border border-border/70 bg-surface/85 shadow-[0_10px_30px_-10px_rgba(0,0,0,0.25)] backdrop-blur-xl">
        <ul className="grid grid-cols-5 items-end px-1.5 py-1.5">
          {ITEMS.map((it) => {
            const Icon = it.icon;
            const active =
              pathname === it.to || pathname.startsWith(it.to + "/");

            if ("center" in it && it.center) {
              return (
                <li key={it.to} className="flex justify-center">
                  <Link
                    to={it.to}
                    aria-label={it.label}
                    className="group relative -mt-6 flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-primary to-accent text-white shadow-lg shadow-primary/30 transition active:scale-95"
                  >
                    <span className="absolute inset-0 rounded-2xl bg-gradient-to-br from-primary to-accent opacity-60 blur-md transition group-hover:opacity-90" />
                    <Icon className="relative h-6 w-6" strokeWidth={2.25} />
                    <span className="sr-only">{it.label}</span>
                  </Link>
                </li>
              );
            }

            return (
              <li key={it.to}>
                <Link
                  to={it.to}
                  className={`relative flex flex-col items-center gap-1 rounded-xl px-2 py-1.5 text-[10.5px] font-medium transition active:scale-95 ${
                    active
                      ? "text-primary"
                      : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  <span
                    className={`flex h-9 w-9 items-center justify-center rounded-xl transition ${
                      active
                        ? "bg-primary/10"
                        : "bg-transparent group-hover:bg-surface-muted"
                    }`}
                  >
                    <Icon
                      className="h-[18px] w-[18px]"
                      strokeWidth={active ? 2.4 : 2}
                    />
                  </span>
                  <span className="leading-none">{it.label}</span>
                  {active ? (
                    <span className="absolute -top-0.5 left-1/2 h-1 w-1 -translate-x-1/2 rounded-full bg-primary" />
                  ) : null}
                </Link>
              </li>
            );
          })}
        </ul>
      </div>
    </nav>
  );
}
