import { z } from "zod";

export const updateUserSchema = z.object({
  fullName: z.string().trim().min(3),

  email: z.string().email(),

  username: z.string().min(3),

  role: z.enum(["ADMIN", "TEACHER"]),

  isActive: z.boolean(),
});

export type UpdateUserSchema =
  z.infer<typeof updateUserSchema>;