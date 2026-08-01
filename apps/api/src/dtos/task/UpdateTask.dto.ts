export interface UpdateTaskDto {
    title?: string;
    description?: string;
    assignee?: string;
    priority?: "Low" | "Medium" | "High" | "Urgent";
    dueDate?: Date;
}