export interface GetTasksQueryDto {
    search?: string;

    status?: string;

    priority?: string;

    assignee?: string;

    page?: number;

    limit?: number;

    sort?: string;
}