import {
  useQuery,
  useMutation,
  useQueryClient,
  type UseQueryResult,
  type UseMutationResult,
  type QueryClient,
} from "@tanstack/react-query";
import {
  getTasks,
  getTask,
  createTask,
  updateTask,
  updateTaskStatus,
  deleteTask,
  type ApiTask,
  type TaskStatusKey,
  type TaskFilters,
  type CreateTaskInput,
  type UpdateTaskInput,
} from "./api";

// ---------------------------------------------------------------------------
// Query key factory
// ---------------------------------------------------------------------------

export const taskKeys = {
  all: (projectId: string, filters?: TaskFilters) =>
    filters && Object.keys(filters).length > 0
      ? (["tasks", projectId, filters] as const)
      : (["tasks", projectId] as const),
  detail: (taskId: string) => ["task", taskId] as const,
};

// ---------------------------------------------------------------------------
// useTasks
// ---------------------------------------------------------------------------

export function useTasks(
  projectId: string | null,
  filters: TaskFilters = {}
): UseQueryResult<ApiTask[]> {
  return useQuery({
    queryKey: taskKeys.all(projectId ?? "", filters),
    queryFn: () => getTasks(projectId!, filters),
    enabled: Boolean(projectId),
    staleTime: 20_000,
  });
}

// ---------------------------------------------------------------------------
// useTask
// ---------------------------------------------------------------------------

export function useTask(taskId: string | null): UseQueryResult<ApiTask> {
  return useQuery({
    queryKey: taskKeys.detail(taskId ?? ""),
    queryFn: () => getTask(taskId!),
    enabled: Boolean(taskId),
    staleTime: 20_000,
  });
}

// ---------------------------------------------------------------------------
// useCreateTask
// ---------------------------------------------------------------------------

export function useCreateTask(
  projectId: string | null
): UseMutationResult<ApiTask, Error, CreateTaskInput> {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (input) => createTask(projectId!, input),
    onSuccess: () => {
      if (projectId) qc.invalidateQueries({ queryKey: taskKeys.all(projectId) });
      qc.invalidateQueries({ queryKey: ["dashboard"] });
    },
  });
}

// ---------------------------------------------------------------------------
// useUpdateTask
// ---------------------------------------------------------------------------

export function useUpdateTask(
  projectId: string | null
): UseMutationResult<ApiTask, Error, { taskId: string; input: UpdateTaskInput }> {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ taskId, input }) => updateTask(taskId, input),
    onSuccess: (updated) => {
      const id = updated._id ?? updated.id ?? "";
      qc.invalidateQueries({ queryKey: taskKeys.detail(id) });
      if (projectId) qc.invalidateQueries({ queryKey: taskKeys.all(projectId) });
      qc.invalidateQueries({ queryKey: ["dashboard"] });
    },
  });
}

// ---------------------------------------------------------------------------
// useUpdateTaskStatus  (optimistic update for drag-and-drop)
// ---------------------------------------------------------------------------

export function useUpdateTaskStatus(projectId: string | null): UseMutationResult<
  ApiTask,
  Error,
  { taskId: string; status: TaskStatusKey },
  { previousTasks: ApiTask[] | undefined }
> {
  const qc = useQueryClient();
  const listKey = taskKeys.all(projectId ?? "");

  return useMutation({
    mutationFn: ({ taskId, status }) => updateTaskStatus(taskId, status),

    // Optimistic: instantly update the cache before the request lands
    onMutate: async ({ taskId, status }) => {
      await qc.cancelQueries({ queryKey: listKey });
      const previousTasks = qc.getQueryData<ApiTask[]>(listKey);
      qc.setQueryData<ApiTask[]>(listKey, (old = []) =>
        old.map((t) =>
          (t._id === taskId || t.id === taskId) ? { ...t, status } : t
        )
      );
      return { previousTasks };
    },

    // Rollback on error
    onError: (_err, _vars, ctx) => {
      if (ctx?.previousTasks) {
        qc.setQueryData<ApiTask[]>(listKey, ctx.previousTasks);
      }
    },

    // Always refetch after settle so server state wins
    onSettled: () => {
      if (projectId) qc.invalidateQueries({ queryKey: taskKeys.all(projectId) });
      qc.invalidateQueries({ queryKey: ["activity"] });
      qc.invalidateQueries({ queryKey: ["dashboard"] });
    },
  });
}

// ---------------------------------------------------------------------------
// useDeleteTask
// ---------------------------------------------------------------------------

export function useDeleteTask(
  projectId: string | null
): UseMutationResult<void, Error, string> {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: deleteTask,
    onSuccess: (_data, taskId) => {
      if (projectId) qc.invalidateQueries({ queryKey: taskKeys.all(projectId) });
      qc.removeQueries({ queryKey: taskKeys.detail(taskId) });
      qc.invalidateQueries({ queryKey: ["dashboard"] });
    },
  });
}
