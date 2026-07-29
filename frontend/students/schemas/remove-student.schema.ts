import { z } from "zod";

export const removeStudentFormSchema = z.object({
  studentCode: z
    .string()
    .trim()
    .min(1, "Student Code is required."),

  fullName: z
    .string()
    .trim()
    .min(1, "Student Full Name is required."),

  confirm: z
    .boolean()
    .refine((value) => value === true, {
      message: "Please confirm this action.",
    }),
});

export type RemoveStudentFormValues = z.infer<
  typeof removeStudentFormSchema
>;