import { z } from "zod";

export const registerSchema = z.object({
  firstName: z.string().trim().min(1, "First name is required"),
  lastName: z.string().trim().optional().default(""),
  email: z.string().trim().email("Invalid email address").transform((email) => email.toLowerCase()),
  password: z.string().min(8, "Password must be at least 8 characters"),
  workspaceName: z.string().optional(),
});

export const loginSchema = z.object({
  email: z
    .string()
    .trim()
    .email("Invalid email address")
    .transform((email) => email.toLowerCase()),

  password: z
    .string()
    .min(8, "Password must be at least 8 characters"),
});

export type RegisterUserInput = z.infer<typeof registerSchema>;