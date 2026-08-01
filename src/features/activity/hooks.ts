import { useQuery, type UseQueryResult } from "@tanstack/react-query";
import { getTaskActivity, type ApiActivity } from "./api";

// ---------------------------------------------------------------------------
// Query keys
// ---------------------------------------------------------------------------

export const activityKeys = {
  all: (taskId: string) => ["activity", taskId] as const,
};

// ---------------------------------------------------------------------------
// Hooks
// ---------------------------------------------------------------------------

/** Fetch activity timeline for a task. */
export function useTaskActivity(
  taskId: string | null
): UseQueryResult<ApiActivity[]> {
  return useQuery({
    queryKey: activityKeys.all(taskId ?? ""),
    queryFn: () => getTaskActivity(taskId!),
    enabled: Boolean(taskId),
    staleTime: 10_000,
  });
}
