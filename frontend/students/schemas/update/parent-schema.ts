import { z } from "zod";

const phoneRegex = /^[6-9]\d{9}$/;

export const parentSchema = z.object({
  // Father
  fatherName: z
    .string()
    .trim()
    .max(100, "Father name must be less than 100 characters.")
    .optional()
    .or(z.literal("")),

  fatherOccupation: z
    .string()
    .trim()
    .max(100, "Father occupation must be less than 100 characters.")
    .optional()
    .or(z.literal("")),

  fatherMobile: z
    .string()
    .trim()
    .refine(
      (value) => value === "" || phoneRegex.test(value),
      "Enter a valid 10-digit mobile number."
    )
    .optional()
    .or(z.literal("")),

  fatherEmail: z
    .string()
    .trim()
    .email("Enter a valid email address.")
    .optional()
    .or(z.literal("")),

  // Mother
  motherName: z
    .string()
    .trim()
    .max(100, "Mother name must be less than 100 characters.")
    .optional()
    .or(z.literal("")),

  motherOccupation: z
    .string()
    .trim()
    .max(100, "Mother occupation must be less than 100 characters.")
    .optional()
    .or(z.literal("")),

  motherMobile: z
    .string()
    .trim()
    .refine(
      (value) => value === "" || phoneRegex.test(value),
      "Enter a valid 10-digit mobile number."
    )
    .optional()
    .or(z.literal("")),

  motherEmail: z
    .string()
    .trim()
    .email("Enter a valid email address.")
    .optional()
    .or(z.literal("")),

  // Guardian
  guardianName: z
    .string()
    .trim()
    .max(100, "Guardian name must be less than 100 characters.")
    .optional()
    .or(z.literal("")),

  guardianRelation: z
    .string()
    .trim()
    .max(50, "Guardian relation must be less than 50 characters.")
    .optional()
    .or(z.literal("")),

  guardianMobile: z
    .string()
    .trim()
    .refine(
      (value) => value === "" || phoneRegex.test(value),
      "Enter a valid 10-digit mobile number."
    )
    .optional()
    .or(z.literal("")),

  guardianEmail: z
    .string()
    .trim()
    .email("Enter a valid email address.")
    .optional()
    .or(z.literal("")),
});

export type ParentFormValues = z.infer<typeof parentSchema>;