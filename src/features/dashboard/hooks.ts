import { useQuery, type UseQueryResult } from "@tanstack/react-query";
import { getDashboard, type ApiDashboardData } from "./api";

// ---------------------------------------------------------------------------
// Query keys
// ---------------------------------------------------------------------------

export const dashboardKeys = {
  all: ["dashboard"] as const,
};

// ---------------------------------------------------------------------------
// Hooks
// ---------------------------------------------------------------------------

/** Fetch dashboard overview metrics. */
export function useDashboard(): UseQueryResult<ApiDashboardData> {
  return useQuery({
    queryKey: dashboardKeys.all,
    queryFn: getDashboard,
    staleTime: 15_000,
  });
}
