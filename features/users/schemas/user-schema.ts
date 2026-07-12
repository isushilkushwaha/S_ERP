import { z } from "zod";

export const createUserSchema = z
  .object({
    fullName: z
      .string()
      .trim()
      .min(3, "Full name is required")
      .max(100),

    email: z
      .string()
      .trim()
      .email("Invalid email"),

    username: z
      .string()
      .trim()
      .min(3)
      .max(30),

    password: z
      .string()
      .min(8, "Password must be at least 8 characters"),

    confirmPassword: z.string(),

    role: z.enum(["ADMIN", "TEACHER"]),

    isActive: z.boolean(),
  })
  .refine(
    (data) => data.password === data.confirmPassword,
    {
      path: ["confirmPassword"],
      message: "Passwords do not match",
    }
  );

export type CreateUserSchema = z.infer<
  typeof createUserSchema
>;