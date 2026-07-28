import { z } from "zod";

export const createWorkspaceSchema = z.object({
    name: z
        .string()
        .trim()
        .min(3, "Workspace name must be at least 3 characters")
        .max(100, "Workspace name cannot exceed 100 characters"),

    description: z
        .string()
        .trim()
        .max(500, "Description cannot exceed 500 characters")
        .optional(),
});

export const updateWorkspaceSchema = createWorkspaceSchema.partial();