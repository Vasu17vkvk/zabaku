import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import {
  useWorkspaces,
  getPersistedWorkspaceId,
  persistWorkspaceId,
} from "@/features/workspaces/hooks";
import type { Workspace } from "@/features/workspaces/api";

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export interface WorkspaceContextValue {
  /** List of all workspaces available to the authenticated user. */
  workspaces: Workspace[];
  /** The currently selected Workspace object, or null if loading/none available. */
  workspace: Workspace | null;
  /** The ID of the currently selected workspace, or null. */
  workspaceId: string | null;
  /** Update the selected workspace ID in state and persist to storage. */
  setWorkspace: (workspaceId: string) => void;
  /** True while the initial workspaces query is loading. */
  isLoading: boolean;
  /** Re-fetch workspaces from the backend API. */
  refresh: () => Promise<void>;
}

// ---------------------------------------------------------------------------
// Context
// ---------------------------------------------------------------------------

export const WorkspaceContext = createContext<WorkspaceContextValue | null>(null);

// ---------------------------------------------------------------------------
// Provider Component
// ---------------------------------------------------------------------------

export function WorkspaceProvider({ children }: { children: ReactNode }) {
  const { data: workspaces = [], isLoading, refetch } = useWorkspaces();

  // Initialize selected workspace ID from persisted storage
  const [workspaceId, setWorkspaceIdState] = useState<string | null>(() =>
    getPersistedWorkspaceId()
  );

  // Automatically handle active workspace selection logic:
  // - If a persisted ID exists and is valid in `workspaces`, keep it.
  // - If no workspace ID is persisted, or the persisted ID is no longer valid,
  //   automatically select the first available workspace and persist it.
  useEffect(() => {
    if (isLoading) return;

    if (workspaces.length === 0) {
      if (workspaceId !== null) {
        setWorkspaceIdState(null);
        persistWorkspaceId(null);
      }
      return;
    }

    const isValid = workspaceId
      ? workspaces.some((w) => w.id === workspaceId)
      : false;

    if (isValid && workspaceId) {
      persistWorkspaceId(workspaceId);
    } else {
      const defaultId = workspaces[0].id;
      setWorkspaceIdState(defaultId);
      persistWorkspaceId(defaultId);
    }
  }, [workspaces, isLoading, workspaceId]);

  // Programmatically change active workspace
  const setWorkspace = useCallback((id: string) => {
    setWorkspaceIdState(id);
    persistWorkspaceId(id);
  }, []);

  // Re-fetch workspaces from API
  const refresh = useCallback(async () => {
    await refetch();
  }, [refetch]);

  // Derived active Workspace object
  const workspace = useMemo(() => {
    if (!workspaceId || workspaces.length === 0) return null;
    return workspaces.find((w) => w.id === workspaceId) ?? null;
  }, [workspaces, workspaceId]);

  const value = useMemo<WorkspaceContextValue>(
    () => ({
      workspaces,
      workspace,
      workspaceId,
      setWorkspace,
      isLoading,
      refresh,
    }),
    [workspaces, workspace, workspaceId, setWorkspace, isLoading, refresh]
  );

  return (
    <WorkspaceContext.Provider value={value}>
      {children}
    </WorkspaceContext.Provider>
  );
}

// ---------------------------------------------------------------------------
// Custom Hook
// ---------------------------------------------------------------------------

/**
 * Access the global Workspace Context.
 * Must be used within a `<WorkspaceProvider>`.
 */
export function useWorkspaceContext(): WorkspaceContextValue {
  const context = useContext(WorkspaceContext);
  if (!context) {
    throw new Error(
      "useWorkspaceContext must be used within a <WorkspaceProvider>"
    );
  }
  return context;
}

/**
 * Access the global Workspace Context.
 * Alias for `useWorkspaceContext`.
 */
export const useWorkspace = useWorkspaceContext;

