import { z } from "zod";

// Shared Enums matching your backend database values
export const GenderEnum = z.enum(["MALE", "FEMALE", "OTHER"]);
export const BloodGroupEnum = z.enum([
  "A_POSITIVE",
  "A_NEGATIVE",
  "B_POSITIVE",
  "B_NEGATIVE",
  "AB_POSITIVE",
  "AB_NEGATIVE",
  "O_POSITIVE",
  "O_NEGATIVE",
]);
export const CategoryEnum = z.enum([
  "GENERAL",
  "OBC",
  "SC",
  "ST",
  "EWS",
]);

export const personalSchema = z.object({
  dateOfBirth: z.string().nullable().optional(),
  gender: z.union([GenderEnum, z.literal("")]).optional(),
  bloodGroup: z.union([BloodGroupEnum, z.literal("")]).optional(),
  religion: z.string().nullable().optional(),
  category: z.union([CategoryEnum, z.literal("")]).optional(),
  caste: z.string().nullable().optional(),
  nationality: z.string().nullable().optional(),
  aadhaarNumber: z.string().nullable().optional(),
  birthCertificateNo: z.string().nullable().optional(),
  previousSchool: z.string().nullable().optional(),
  remarks: z.string().nullable().optional(),
});

export type PersonalFormValues = z.infer<typeof personalSchema>;