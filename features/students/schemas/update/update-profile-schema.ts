import { z } from "zod";

export const updateProfileSchema = z.object({
  firstName: z
    .string()
    .trim()
    .min(1, "First name is required.")
    .max(100, "First name must be less than 100 characters."),

  middleName: z
    .string()
    .trim()
    .max(100, "Middle name must be less than 100 characters.")
    .optional()
    .nullable(),

  lastName: z
    .string()
    .trim()
    .max(100, "Last name must be less than 100 characters.")
    .optional()
    .nullable(),

  mobile: z
    .string()
    .trim()
    .regex(/^[6-9]\d{9}$/, "Please enter a valid 10-digit mobile number.")
    .optional()
    .nullable(),

  email: z
    .string()
    .trim()
    .email("Please enter a valid email address.")
    .max(255, "Email must be less than 255 characters.")
    .optional()
    .nullable(),
});

export type UpdateProfileFormValues = z.infer<
  typeof updateProfileSchema
>;