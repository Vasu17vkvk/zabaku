import { useWorkspaceContext, type WorkspaceContextValue } from "@/context/WorkspaceContext";

/**
 * Custom hook to access the active workspace state and actions from any component.
 *
 * Must be used inside `<WorkspaceProvider>` (mounted at the root).
 *
 * @example
 * const { workspace, workspaces, workspaceId, setWorkspace, isLoading } = useWorkspace();
 */
export function useWorkspace(): WorkspaceContextValue {
  return useWorkspaceContext();
}

export { useWorkspaceContext, type WorkspaceContextValue };
export default useWorkspace;
