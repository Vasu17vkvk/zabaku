import {
  useQuery,
  useMutation,
  useQueryClient,
  type UseQueryResult,
  type UseMutationResult,
} from "@tanstack/react-query";
import {
  getProjects,
  getProject,
  createProject,
  updateProject,
  deleteProject,
  type ApiProject,
  type CreateProjectInput,
  type UpdateProjectInput,
} from "./api";

// ---------------------------------------------------------------------------
// Query key factory
// ---------------------------------------------------------------------------

export const projectKeys = {
  all: (workspaceId: string) => ["projects", workspaceId] as const,
  detail: (projectId: string) => ["project", projectId] as const,
};

// ---------------------------------------------------------------------------
// localStorage persistence — selected project
// ---------------------------------------------------------------------------

const PROJECT_STORAGE_KEY = "zabaku_project";

export function getPersistedProjectId(): string | null {
  try {
    return localStorage.getItem(PROJECT_STORAGE_KEY);
  } catch {
    return null;
  }
}

export function persistProjectId(id: string | null): void {
  try {
    if (id) {
      localStorage.setItem(PROJECT_STORAGE_KEY, id);
    } else {
      localStorage.removeItem(PROJECT_STORAGE_KEY);
    }
  } catch {
    // ignore
  }
}

// ---------------------------------------------------------------------------
// useProjects
// ---------------------------------------------------------------------------

export function useProjects(
  workspaceId: string | null
): UseQueryResult<ApiProject[]> {
  return useQuery({
    queryKey: projectKeys.all(workspaceId ?? ""),
    queryFn: () => getProjects(workspaceId!),
    enabled: Boolean(workspaceId),
    staleTime: 30_000,
  });
}

// ---------------------------------------------------------------------------
// useProject
// ---------------------------------------------------------------------------

export function useProject(
  projectId: string | null
): UseQueryResult<ApiProject> {
  return useQuery({
    queryKey: projectKeys.detail(projectId ?? ""),
    queryFn: () => getProject(projectId!),
    enabled: Boolean(projectId),
    staleTime: 30_000,
  });
}

// ---------------------------------------------------------------------------
// useCreateProject
// ---------------------------------------------------------------------------

export function useCreateProject(
  workspaceId: string | null
): UseMutationResult<ApiProject, Error, CreateProjectInput> {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (input) => createProject(workspaceId!, input),
    onSuccess: () => {
      if (workspaceId) {
        qc.invalidateQueries({ queryKey: projectKeys.all(workspaceId) });
      }
      qc.invalidateQueries({ queryKey: ["dashboard"] });
    },
  });
}

// ---------------------------------------------------------------------------
// useUpdateProject
// ---------------------------------------------------------------------------

export function useUpdateProject(
  workspaceId: string | null
): UseMutationResult<
  ApiProject,
  Error,
  { projectId: string; input: UpdateProjectInput }
> {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ projectId, input }) => updateProject(projectId, input),
    onSuccess: (updated) => {
      qc.invalidateQueries({
        queryKey: projectKeys.detail(updated._id ?? updated.id ?? ""),
      });
      if (workspaceId) {
        qc.invalidateQueries({ queryKey: projectKeys.all(workspaceId) });
      }
      qc.invalidateQueries({ queryKey: ["dashboard"] });
    },
  });
}

// ---------------------------------------------------------------------------
// useDeleteProject
// ---------------------------------------------------------------------------

export function useDeleteProject(
  workspaceId: string | null
): UseMutationResult<void, Error, string> {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: deleteProject,
    onSuccess: (_data, projectId) => {
      if (workspaceId) {
        qc.invalidateQueries({ queryKey: projectKeys.all(workspaceId) });
      }
      qc.removeQueries({ queryKey: projectKeys.detail(projectId) });
      qc.invalidateQueries({ queryKey: ["dashboard"] });

      // Clear persisted project if it was the deleted one
      if (getPersistedProjectId() === projectId) {
        persistProjectId(null);
      }
    },
  });
}
