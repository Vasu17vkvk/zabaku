import { useWorkspaceContext, type WorkspaceContextValue } from "@/context/WorkspaceContext";

/**
 * Custom hook to access the active workspace context throughout the app.
 * Must be used within a `<WorkspaceProvider>`.
 */
export { useWorkspaceContext, type WorkspaceContextValue };
export default useWorkspaceContext;
