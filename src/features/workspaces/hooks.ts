import {
  useQuery,
  useMutation,
  useQueryClient,
  type UseQueryResult,
  type UseMutationResult,
} from "@tanstack/react-query";
import {
  getWorkspaces,
  getWorkspace,
  createWorkspace,
  updateWorkspace,
  deleteWorkspace,
  type Workspace,
  type CreateWorkspaceInput,
  type UpdateWorkspaceInput,
} from "./api";

// ---------------------------------------------------------------------------
// Constants
// ---------------------------------------------------------------------------

const WORKSPACES_KEY = ["workspaces"] as const;
const WORKSPACE_KEY = (id: string) => ["workspaces", id] as const;
const STORAGE_KEY = "zabaku_workspace";

// ---------------------------------------------------------------------------
// Persisted active workspace helpers
// ---------------------------------------------------------------------------

export function getPersistedWorkspaceId(): string | null {
  try {
    return localStorage.getItem(STORAGE_KEY);
  } catch {
    return null;
  }
}

export function persistWorkspaceId(id: string | null): void {
  try {
    if (id) {
      localStorage.setItem(STORAGE_KEY, id);
    } else {
      localStorage.removeItem(STORAGE_KEY);
    }
  } catch {
    // localStorage unavailable (e.g. SSR or private-browsing restrictions)
  }
}

// ---------------------------------------------------------------------------
// Query: all workspaces
// ---------------------------------------------------------------------------

export function useWorkspaces(): UseQueryResult<Workspace[]> {
  return useQuery({
    queryKey: WORKSPACES_KEY,
    queryFn: getWorkspaces,
    staleTime: 60_000, // 1 min
  });
}

// ---------------------------------------------------------------------------
// Query: single workspace
// ---------------------------------------------------------------------------

export function useWorkspace(
  workspaceId: string | null
): UseQueryResult<Workspace> {
  return useQuery({
    queryKey: WORKSPACE_KEY(workspaceId ?? ""),
    queryFn: () => getWorkspace(workspaceId!),
    enabled: Boolean(workspaceId),
    staleTime: 60_000,
  });
}

// ---------------------------------------------------------------------------
// Mutation: create workspace
// ---------------------------------------------------------------------------

export function useCreateWorkspace() {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: createWorkspace,

    onSuccess: async (workspace) => {
      // Refresh workspace list
      await qc.invalidateQueries({
        queryKey: WORKSPACES_KEY,
      });

      // Make the new workspace active
      persistWorkspaceId(workspace.id);

      // Refresh all workspace-dependent data
      await Promise.all([
        qc.invalidateQueries({ queryKey: ["dashboard"] }),
        qc.invalidateQueries({ queryKey: ["projects"] }),
        qc.invalidateQueries({ queryKey: ["tasks"] }),
        qc.invalidateQueries({ queryKey: ["notifications"] }),
      ]);
    },
  });
}

// ---------------------------------------------------------------------------
// Mutation: update workspace
// ---------------------------------------------------------------------------

export function useUpdateWorkspace(): UseMutationResult<
  Workspace,
  Error,
  { workspaceId: string; input: UpdateWorkspaceInput }
> {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ workspaceId, input }) => updateWorkspace(workspaceId, input),
    onSuccess: (updated) => {
      qc.invalidateQueries({ queryKey: WORKSPACES_KEY });
      qc.invalidateQueries({ queryKey: WORKSPACE_KEY(updated.id) });
    },
  });
}

// ---------------------------------------------------------------------------
// Mutation: delete workspace
// ---------------------------------------------------------------------------

export function useDeleteWorkspace(): UseMutationResult<
  void,
  Error,
  string // workspaceId
> {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: deleteWorkspace,
    onSuccess: (_data, workspaceId) => {
      qc.invalidateQueries({ queryKey: WORKSPACES_KEY });
      qc.removeQueries({ queryKey: WORKSPACE_KEY(workspaceId) });

      // If the deleted workspace was persisted as active, clear it
      if (getPersistedWorkspaceId() === workspaceId) {
        persistWorkspaceId(null);
      }
    },
  });
}
