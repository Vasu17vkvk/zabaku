export interface CreateActivityDto {
    workspace: string;
    project?: string;
    task?: string;

    user: string;

    action: string;

    entityType: "Workspace" | "Project" | "Task" | "Comment";

    entityId: string;

    metadata?: Record<string, unknown>;
}