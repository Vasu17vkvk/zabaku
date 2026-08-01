import { z } from "zod";

export const createCommentSchema = z.object({
    message: z
        .string()
        .min(1, "Comment cannot be empty")
        .max(5000, "Comment is too long"),
});

export const updateCommentSchema = z.object({
    message: z
        .string()
        .min(1, "Comment cannot be empty")
        .max(5000, "Comment is too long"),
});