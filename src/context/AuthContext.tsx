import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";
import { useRouter } from "@tanstack/react-router";
import { api } from "@/lib/api";
import { disconnectSocket } from "@/lib/socket";

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export interface AuthUser {
  id: string;
  name: string;
  email: string;
  [key: string]: unknown;
}

export interface AuthContextValue {
  /** The currently authenticated user, or null when unauthenticated. */
  user: AuthUser | null;
  /** True once the startup /auth/me check has resolved. */
  isAuthenticated: boolean;
  /** True while the startup token validation (or any auth action) is in flight. */
  isLoading: boolean;
  /**
   * Store a JWT token, fetch /auth/me, and populate the user in context.
   * Call this after a successful /auth/login or /auth/register response.
   */
  login: (token: string) => Promise<void>;
  /**
   * Clear the token and user, then redirect to /login.
   */
  logout: () => void;
  /**
   * Re-fetch /auth/me with the current token and refresh the user in context.
   * Useful after a profile update.
   */
  refreshUser: () => Promise<void>;
}

// ---------------------------------------------------------------------------
// Context
// ---------------------------------------------------------------------------

const TOKEN_KEY = "zabaku_token";

const AuthContext = createContext<AuthContextValue | null>(null);

// ---------------------------------------------------------------------------
// Helper — fetch the current user from the backend
// ---------------------------------------------------------------------------

interface MeResponse {
  data?: { user?: AuthUser } | AuthUser;
  user?: AuthUser;
  [key: string]: unknown;
}

async function fetchMe(): Promise<AuthUser> {
  const res = await api<MeResponse>("/auth/me");

  // Support common backend shapes:
  //   { data: { user: {...} } }   ← same envelope as /auth/login
  //   { data: {...} }             ← data IS the user
  //   { user: {...} }             ← flat wrapper
  //   { id, name, email, ... }    ← bare user object
  if (res && typeof res === "object") {
    if ("data" in res && res.data) {
      const d = res.data as Record<string, unknown>;
      if ("user" in d && d.user) return d.user as AuthUser;
      return d as AuthUser;
    }
    if ("user" in res && res.user) return res.user as AuthUser;
  }
  return res as unknown as AuthUser;
}

// ---------------------------------------------------------------------------
// Provider
// ---------------------------------------------------------------------------

export function AuthProvider({ children }: { children: ReactNode }) {
  const router = useRouter();
  const [user, setUser] = useState<AuthUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // ── Startup: validate any existing token ─────────────────────────────────
  useEffect(() => {
    const token = localStorage.getItem(TOKEN_KEY);

    if (!token) {
      setIsLoading(false);
      return;
    }

    fetchMe()
      .then((me) => setUser(me))
      .catch(() => {
        // Token is expired or invalid — clean up silently
        localStorage.removeItem(TOKEN_KEY);
        setUser(null);
      })
      .finally(() => setIsLoading(false));
  }, []);

  // ── login ─────────────────────────────────────────────────────────────────
  const login = useCallback(async (token: string): Promise<void> => {
    localStorage.setItem(TOKEN_KEY, token);
    setIsLoading(true);
    try {
      const me = await fetchMe();
      setUser(me);
    } catch {
      localStorage.removeItem(TOKEN_KEY);
      setUser(null);
      throw new Error("Failed to load user after login.");
    } finally {
      setIsLoading(false);
    }
  }, []);

  // ── logout ────────────────────────────────────────────────────────────────
  const logout = useCallback((): void => {
    localStorage.removeItem(TOKEN_KEY);
    disconnectSocket();
    setUser(null);
    router.navigate({ to: "/login" });
  }, [router]);

  // ── refreshUser ───────────────────────────────────────────────────────────
  const refreshUser = useCallback(async (): Promise<void> => {
    const token = localStorage.getItem(TOKEN_KEY);
    if (!token) return;

    setIsLoading(true);
    try {
      const me = await fetchMe();
      setUser(me);
    } catch {
      localStorage.removeItem(TOKEN_KEY);
      setUser(null);
    } finally {
      setIsLoading(false);
    }
  }, []);

  // ── Value ─────────────────────────────────────────────────────────────────
  const value: AuthContextValue = {
    user,
    isAuthenticated: user !== null,
    isLoading,
    login,
    logout,
    refreshUser,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

// ---------------------------------------------------------------------------
// Internal hook — consumed by useAuth.ts
// ---------------------------------------------------------------------------

export function useAuthContext(): AuthContextValue {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error("useAuthContext must be used inside <AuthProvider>.");
  }
  return ctx;
}
