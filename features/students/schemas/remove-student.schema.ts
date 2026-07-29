import { z } from "zod";

export const removeStudentSchema = z.object({
  studentCode: z
    .string()
    .trim()
    .min(1, "Student Code is required."),

  fullName: z
    .string()
    .trim()
    .min(1, "Student Full Name is required."),
});

export type RemoveStudentInput = z.infer<
  typeof removeStudentSchema
>;