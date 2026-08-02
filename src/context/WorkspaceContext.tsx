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
  workspaces: Workspace[];
  workspace: Workspace | null;
  workspaceId: string | null;
  setWorkspace: (workspaceId: string) => void;
  isLoading: boolean;
  refresh: () => Promise<void>;
}

// ---------------------------------------------------------------------------
// Context
// ---------------------------------------------------------------------------

export const WorkspaceContext =
  createContext<WorkspaceContextValue | null>(null);

// ---------------------------------------------------------------------------
// Provider
// ---------------------------------------------------------------------------

export function WorkspaceProvider({
  children,
}: {
  children: ReactNode;
}) {
  const {
    data: workspaces = [],
    isLoading,
    refetch,
  } = useWorkspaces();

  const [workspaceId, setWorkspaceIdState] = useState<string | null>(() =>
    getPersistedWorkspaceId()
  );

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

    if (isValid) {
      persistWorkspaceId(workspaceId!);
    } else {
      const defaultId = workspaces[0].id;
      setWorkspaceIdState(defaultId);
      persistWorkspaceId(defaultId);
    }
  }, [workspaces, workspaceId, isLoading]);

  const setWorkspace = useCallback((id: string) => {
    setWorkspaceIdState(id);
    persistWorkspaceId(id);
  }, []);

  const refresh = useCallback(async () => {
    await refetch();
  }, [refetch]);

  const workspace = useMemo(() => {
    if (!workspaceId) return null;

    return workspaces.find((w) => w.id === workspaceId) ?? null;
  }, [workspaceId, workspaces]);

  const value = useMemo(
    () => ({
      workspaces,
      workspace,
      workspaceId,
      setWorkspace,
      isLoading,
      refresh,
    }),
    [
      workspaces,
      workspace,
      workspaceId,
      setWorkspace,
      isLoading,
      refresh,
    ]
  );

  return (
    <WorkspaceContext.Provider value={value}>
      {children}
    </WorkspaceContext.Provider>
  );
}

// ---------------------------------------------------------------------------
// Hook
// ---------------------------------------------------------------------------

export function useWorkspaceContext(): WorkspaceContextValue {
  const context = useContext(WorkspaceContext);

  if (!context) {
    throw new Error(
      "useWorkspaceContext must be used within a WorkspaceProvider"
    );
  }

  return context;
}

export const useWorkspace = useWorkspaceContext;