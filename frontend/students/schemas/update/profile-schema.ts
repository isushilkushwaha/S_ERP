import { z } from "zod";

export const profileSchema = z.object({
  firstName: z
    .string()
    .trim()
    .min(1, "First name is required.")
    .max(100, "First name must not exceed 100 characters."),

  middleName: z
    .string()
    .trim()
    .max(100, "Middle name must not exceed 100 characters.")
    .optional()
    .or(z.literal("")),

  lastName: z
    .string()
    .trim()
    .max(100, "Last name must not exceed 100 characters.")
    .optional()
    .or(z.literal("")),

  mobile: z
    .string()
    .trim()
    .regex(/^[6-9]\d{9}$/, "Enter a valid 10-digit mobile number.")
    .or(z.literal("")),

  email: z
    .string()
    .trim()
    .email("Enter a valid email address.")
    .or(z.literal("")),
});

export type ProfileFormValues = z.infer<typeof profileSchema>;