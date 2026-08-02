import { createFileRoute } from "@tanstack/react-router";
import { WorkspaceList } from "@/features/workspaces/components/WorkspaceList";

export const Route = createFileRoute("/workspaces")({
    component: WorkspacesPage,
});

function WorkspacesPage() {
    return (
        <div className="space-y-6 p-6">
            <h1 className="text-3xl font-bold">Workspace Management</h1>

            <WorkspaceList />
        </div>
    );
}