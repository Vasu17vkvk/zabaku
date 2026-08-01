import { redirect } from "@tanstack/react-router";

const TOKEN_KEY = "zabaku_token";

/**
 * TanStack Router `beforeLoad` guard for protected routes.
 *
 * Checks for the presence of a JWT token in localStorage **before** the route
 * component mounts. If the token is absent the user is immediately redirected
 * to /login with the originally-requested path stored so a post-login redirect
 * can be implemented later.
 *
 * Usage — add to any protected route definition:
 *
 * ```ts
 * export const Route = createFileRoute("/dashboard")({
 *   beforeLoad: requireAuth,
 *   component: DashboardPage,
 * });
 * ```
 *
 * Note: This guard is intentionally a fast, synchronous token-presence check.
 * The full token validity check (GET /auth/me) is handled by AuthProvider on
 * startup; by the time `beforeLoad` runs the AuthContext has already cleaned
 * up any expired tokens.
 */
export function requireAuth({ location }: { location: { pathname: string } }) {
  const token =
    typeof window !== "undefined" ? localStorage.getItem(TOKEN_KEY) : null;

  if (!token) {
    throw redirect({
      to: "/login",
      search: { redirect: location.pathname },
    });
  }
}
