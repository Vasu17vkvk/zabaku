import { useState } from "react";
import { Button } from "@/components/ui/button";
import { useWorkspace } from "@/context/WorkspaceContext";

import { WorkspaceCard } from "./WorkspaceCard";
import { CreateWorkspaceDialog } from "./CreateWorkspaceDialog";

export function WorkspaceList() {
    const { workspaces, isLoading } = useWorkspace();

    const [open, setOpen] = useState(false);

    if (isLoading) {
        return (
            <div className="rounded-lg border p-8 text-center text-muted-foreground">
                Loading workspaces...
            </div>
        );
    }

    return (
        <>
            <div className="mb-6 flex items-center justify-between">
                <div>
                    <h2 className="text-2xl font-bold">Your Workspaces</h2>
                    <p className="text-sm text-muted-foreground">
                        Manage and switch between your workspaces.
                    </p>
                </div>

                <Button onClick={() => setOpen(true)}>
                    + New Workspace
                </Button>
            </div>

            <CreateWorkspaceDialog
                open={open}
                onOpenChange={setOpen}
            />

            {workspaces.length === 0 ? (
                <div className="rounded-lg border p-8 text-center">
                    <h3 className="text-lg font-semibold">
                        No workspaces found
                    </h3>

                    <p className="mt-2 text-sm text-muted-foreground">
                        Create your first workspace to start collaborating.
                    </p>

                    <Button
                        className="mt-6"
                        onClick={() => setOpen(true)}
                    >
                        Create Workspace
                    </Button>
                </div>
            ) : (
                <div className="grid gap-4">
                    {workspaces.map((workspace) => (
                        <WorkspaceCard
                            key={workspace.id}
                            workspace={workspace}
                        />
                    ))}
                </div>
            )}
        </>
    );
}