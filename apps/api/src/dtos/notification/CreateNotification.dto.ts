export interface CreateNotificationDto {
    recipient: string;
    sender: string;
    workspace: string;

    type: string;

    title: string;
    message: string;

    entityType: "Workspace" | "Project" | "Task" | "Comment";
    entityId: string;
}