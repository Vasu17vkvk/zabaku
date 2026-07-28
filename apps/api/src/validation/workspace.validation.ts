import { z } from "zod";
import { WorkspaceRole } from "../constants/workspace.constants";

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

export const addMemberSchema = z.object({
    email: z.string().trim().email("Invalid email address"),

    role: z.enum([
        WorkspaceRole.ADMIN,
        WorkspaceRole.MEMBER,
    ]),
});

export const updateWorkspaceSchema = createWorkspaceSchema.partial();