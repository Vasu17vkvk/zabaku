import { useAuthContext, type AuthContextValue } from "@/context/AuthContext";

/**
 * Access the Zabaku authentication state and actions from any component.
 *
 * Must be used inside <AuthProvider> (mounted at the root).
 *
 * @example
 * const { user, isAuthenticated, login, logout } = useAuth();
 */
export function useAuth(): AuthContextValue {
  return useAuthContext();
}
