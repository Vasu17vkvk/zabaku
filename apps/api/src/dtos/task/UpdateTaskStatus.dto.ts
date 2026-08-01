export interface UpdateTaskStatusDto {
    status:
    | "Todo"
    | "In Progress"
    | "Review"
    | "Done";
}