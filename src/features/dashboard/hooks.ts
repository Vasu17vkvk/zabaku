import { useQuery, type UseQueryResult } from "@tanstack/react-query";
import { getDashboard, type ApiDashboardData } from "./api";

// ---------------------------------------------------------------------------
// Query keys
// ---------------------------------------------------------------------------

export const dashboardKeys = {
  all: ["dashboard"] as const,
  workspace: (workspaceId?: string | null) =>
    workspaceId ? (["dashboard", workspaceId] as const) : (["dashboard"] as const),
};

// ---------------------------------------------------------------------------
// Hooks
// ---------------------------------------------------------------------------

/** Fetch dashboard overview metrics. */
export function useDashboard(
  workspaceId?: string | null
): UseQueryResult<ApiDashboardData> {
  return useQuery({
    queryKey: dashboardKeys.workspace(workspaceId),
    queryFn: () => getDashboard(workspaceId),
    staleTime: 15_000,
  });
}
