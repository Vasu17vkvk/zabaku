import { z } from "zod";

export const createTaskSchema = z.object({
    title: z
        .string()
        .trim()
        .min(2, "Task title must be at least 2 characters")
        .max(200),

    description: z
        .string()
        .trim()
        .max(2000)
        .optional(),

    assignee: z.string().optional(),

    priority: z
        .enum([
            "Low",
            "Medium",
            "High",
            "Urgent",
        ])
        .optional(),

    dueDate: z.coerce.date().optional(),
});

export const updateTaskSchema = createTaskSchema.partial();

export const updateTaskStatusSchema = z.object({
    status: z.enum([
        "Todo",
        "In Progress",
        "Review",
        "Done",
    ]),
});