import { z } from "zod";

/**
 * Validation Patterns
 */
const phoneRegex =
  /^(\+91[- ]?)?[6-9]\d{9}$/;

const postalCodeRegex =
  /^\d{6}$/;

const websiteRegex =
  /^(https?:\/\/)?([\w-]+\.)+[\w-]{2,}(\/.*)?$/i;

const admissionPrefixRegex =
  /^[A-Z0-9-]+$/;

/**
 * Base Schema
 */
const schoolProfileSchema = z.object({
  schoolName: z
    .string()
    .trim()
    .min(3, "School name must be at least 3 characters.")
    .max(150, "School name cannot exceed 150 characters."),

  schoolCode: z
    .string()
    .trim()
    .max(30, "School code cannot exceed 30 characters.")
    .optional()
    .or(z.literal("")),

  admissionPrefix: z
    .string({
      error: "Admission prefix is required.",
    })
    .trim()
    .min(1, "Admission prefix cannot be empty.")
    .max(10, "Admission prefix cannot exceed 10 characters.")
    .transform((val) => val.toUpperCase())
    .refine((val) => admissionPrefixRegex.test(val), {
      message:
        "Only uppercase letters, numbers, and hyphens are allowed (e.g., ADM, REG, STU, STD, ABC-1).",
    })
    .default("ADM"),

  logoUrl: z
    .string()
    .trim()
    .regex(
      /^\/uploads\/school-profile\/.+$/,
      "Invalid logo path."
    )
    .optional()
    .or(z.literal("")),

  faviconUrl: z
    .string()
    .trim()
    .regex(
      /^\/uploads\/school-profile\/.+$/,
      "Invalid favicon path."
    )
    .optional()
    .or(z.literal("")),

  email: z
    .string()
    .trim()
    .email("Please enter a valid email address.")
    .max(150)
    .optional()
    .or(z.literal("")),

  phone: z
    .string()
    .trim()
    .regex(phoneRegex, "Please enter a valid phone number.")
    .optional()
    .or(z.literal("")),

  alternatePhone: z
    .string()
    .trim()
    .regex(phoneRegex, "Please enter a valid alternate phone number.")
    .optional()
    .or(z.literal("")),

  website: z
    .string()
    .trim()
    .regex(websiteRegex, "Please enter a valid website URL.")
    .max(255)
    .optional()
    .or(z.literal("")),

  addressLine1: z
    .string()
    .trim()
    .min(3, "Address is required.")
    .max(255),

  addressLine2: z
    .string()
    .trim()
    .max(255)
    .optional()
    .or(z.literal("")),

  city: z
    .string()
    .trim()
    .min(2, "City is required.")
    .max(100),

  district: z
    .string()
    .trim()
    .max(100)
    .optional()
    .or(z.literal("")),

  state: z
    .string()
    .trim()
    .min(2, "State is required.")
    .max(100),

  country: z
    .string()
    .trim()
    .min(2, "Country is required.")
    .max(100),

  postalCode: z
    .string()
    .trim()
    .regex(postalCodeRegex, "Postal code must be a valid 6-digit PIN code.")
    .optional()
    .or(z.literal("")),

  board: z
    .string()
    .trim()
    .max(100)
    .optional()
    .or(z.literal("")),

  affiliationNumber: z
    .string()
    .trim()
    .max(100)
    .optional()
    .or(z.literal("")),

  principalName: z
    .string()
    .trim()
    .max(150)
    .optional()
    .or(z.literal("")),

  timezone: z
    .string()
    .trim()
    .min(1, "Timezone is required."),

  currency: z
    .string()
    .trim()
    .min(1, "Currency is required."),

  isActive: z
    .boolean()
    .default(true),
});

/**
 * Create Schema
 */
export const createSchoolProfileSchema = schoolProfileSchema;

/**
 * Update Schema
 */
export const updateSchoolProfileSchema =
  schoolProfileSchema.partial();

/**
 * Types
 */
export type CreateSchoolProfileFormValues =
  z.input<typeof createSchoolProfileSchema>;

export type CreateSchoolProfileInput =
  z.output<typeof createSchoolProfileSchema>;

export type UpdateSchoolProfileInput =
  z.output<typeof updateSchoolProfileSchema>;