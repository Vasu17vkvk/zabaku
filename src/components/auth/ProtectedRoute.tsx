import { type ReactNode } from "react";
import { useAuth } from "@/hooks/useAuth";

interface ProtectedRouteProps {
  children: ReactNode;
}

/**
 * Wraps a protected page component.
 *
 * - While auth is still loading (startup /auth/me in flight): renders a
 *   full-screen loading spinner so the protected page never flashes to an
 *   unauthenticated user.
 * - Once resolved: renders children.
 *
 * The actual redirect for unauthenticated users is handled at the router
 * level via `beforeLoad` in each protected route, so this component only
 * needs to handle the loading state.
 */
export function ProtectedRoute({ children }: ProtectedRouteProps) {
  const { isLoading } = useAuth();

  if (isLoading) {
    return (
      <div
        role="status"
        aria-label="Loading"
        className="flex min-h-screen items-center justify-center bg-background"
      >
        <div className="flex flex-col items-center gap-4">
          {/* Spinner */}
          <span className="relative flex h-10 w-10">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-primary opacity-30" />
            <span className="relative inline-flex h-10 w-10 items-center justify-center rounded-full bg-gradient-primary shadow-glow">
              {/* Zabaku "Z" mark */}
              <svg
                width="18"
                height="18"
                viewBox="0 0 24 24"
                fill="none"
                aria-hidden="true"
              >
                <path
                  d="M4 4h16v2.5L8.5 18H20v2H4v-2.5L15.5 6H4V4Z"
                  fill="white"
                />
              </svg>
            </span>
          </span>
          <p className="text-[13px] font-medium text-muted-foreground animate-pulse">
            Loading your workspace…
          </p>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}
