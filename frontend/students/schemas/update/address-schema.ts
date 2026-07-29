import { z } from "zod";

export const addressSchema = z.object({
  addressLine1: z.string().trim().nullable().optional(),
  addressLine2: z.string().trim().nullable().optional(),
  city: z.string().trim().nullable().optional(),
  district: z.string().trim().nullable().optional(),
  state: z.string().trim().nullable().optional(),
  country: z.string().trim().nullable().optional(),
  postalCode: z.string().trim().nullable().optional(),
});

export type AddressFormValues = z.infer<typeof addressSchema>;