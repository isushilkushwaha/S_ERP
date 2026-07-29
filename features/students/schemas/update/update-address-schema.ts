import { z } from "zod";

export const updateAddressSchema = z.object({
  addressLine1: z
    .string()
    .trim()
    .max(255, "Address Line 1 must not exceed 255 characters")
    .optional()
    .or(z.literal("")),

  addressLine2: z
    .string()
    .trim()
    .max(255, "Address Line 2 must not exceed 255 characters")
    .optional()
    .or(z.literal("")),

  city: z
    .string()
    .trim()
    .max(100, "City must not exceed 100 characters")
    .optional()
    .or(z.literal("")),

  district: z
    .string()
    .trim()
    .max(100, "District must not exceed 100 characters")
    .optional()
    .or(z.literal("")),

  state: z
    .string()
    .trim()
    .max(100, "State must not exceed 100 characters")
    .optional()
    .or(z.literal("")),

  country: z
    .string()
    .trim()
    .max(100, "Country must not exceed 100 characters")
    .optional()
    .or(z.literal("")),

  postalCode: z
    .string()
    .trim()
    .regex(/^[0-9]{6}$/, "Postal Code must be a valid 6-digit PIN code")
    .optional()
    .or(z.literal("")),
});

export type UpdateAddressInput = z.infer<typeof updateAddressSchema>;