import { z } from "zod";

import {
  BLOOD_GROUP_OPTIONS,
  CATEGORY_OPTIONS,
  GENDER_OPTIONS,
} from "../constants";

// Helper validator for optional regex fields that can be empty strings
const optionalRegex = (pattern: RegExp, errorMessage: string) =>
  z
    .string()
    .trim()
    .regex(pattern, errorMessage)
    .optional()
    .nullable()
    .or(z.literal(""));

// Helper validator for optional email fields that can be empty strings
const optionalEmail = (errorMessage = "Invalid email") =>
  z
    .string()
    .trim()
    .email(errorMessage)
    .optional()
    .nullable()
    .or(z.literal(""));

export const studentFormSchema = z.object({
  // Government IDs
  emisNumber: z.string().trim().max(50).optional().nullable().or(z.literal("")),
  apaarId: z.string().trim().max(50).optional().nullable().or(z.literal("")),
  penNumber: z.string().trim().max(50).optional().nullable().or(z.literal("")),

  // Personal Information
  firstName: z
    .string()
    .trim()
    .min(2, "First name is required")
    .max(100),

  middleName: z.string().trim().max(100).optional().nullable().or(z.literal("")),

  lastName: z
    .string()
    .trim()
    .min(1, "Last name is required")
    .max(100),

  gender: z
    .string()
    .min(1, "Gender is required")
    .refine(
      (value) =>
        GENDER_OPTIONS.includes(
          value as (typeof GENDER_OPTIONS)[number]
        ),
      "Invalid gender"
    ),

  dateOfBirth: z.string().min(1, "Date of birth is required"),

  bloodGroup: z
    .enum(BLOOD_GROUP_OPTIONS)
    .optional()
    .nullable()
    .or(z.literal("")),

  religion: z.string().trim().max(100).optional().nullable().or(z.literal("")),

  category: z
    .enum(CATEGORY_OPTIONS)
    .optional()
    .nullable()
    .or(z.literal("")),

  caste: z.string().trim().max(100).optional().nullable().or(z.literal("")),

  nationality: z
    .string()
    .trim()
    .max(100)
    .default("India")
    .optional()
    .nullable()
    .or(z.literal("")),

  aadhaarNumber: optionalRegex(
    /^\d{12}$/,
    "Aadhaar must contain exactly 12 digits"
  ),

  birthCertificateNo: z.string().trim().max(100).optional().nullable().or(z.literal("")),

  email: optionalEmail("Invalid email"),

  mobile: optionalRegex(/^[6-9]\d{9}$/, "Invalid mobile number"),

  photo: z.string().optional().nullable().or(z.literal("")),

  previousSchool: z.string().trim().max(255).optional().nullable().or(z.literal("")),

  remarks: z.string().trim().max(1000).optional().nullable().or(z.literal("")),

  // Father
  fatherName: z
    .string()
    .trim()
    .min(2, "Father name is required")
    .max(150),

  fatherOccupation: z.string().trim().max(150).optional().nullable().or(z.literal("")),

  fatherMobile: z
    .string()
    .regex(/^[6-9]\d{9}$/, "Invalid father mobile number"),

  fatherEmail: optionalEmail("Invalid father email"),

  // Mother
  motherName: z.string().trim().max(150).optional().nullable().or(z.literal("")),

  motherOccupation: z.string().trim().max(150).optional().nullable().or(z.literal("")),

  motherMobile: optionalRegex(/^[6-9]\d{9}$/, "Invalid mother mobile number"),

  motherEmail: optionalEmail("Invalid mother email"),

  // Guardian
  guardianName: z.string().trim().max(150).optional().nullable().or(z.literal("")),

  guardianRelation: z.string().trim().max(100).optional().nullable().or(z.literal("")),

  guardianMobile: optionalRegex(/^[6-9]\d{9}$/, "Invalid guardian mobile number"),

  guardianEmail: optionalEmail("Invalid guardian email"),

  // Address
  addressLine1: z
    .string()
    .trim()
    .min(5, "Address is required")
    .max(255),

  addressLine2: z.string().trim().max(255).optional().nullable().or(z.literal("")),

  city: z
    .string()
    .trim()
    .min(2)
    .max(100),

  district: z
    .string()
    .trim()
    .min(2)
    .max(100),

  state: z
    .string()
    .trim()
    .min(2)
    .max(100),

  country: z
    .string()
    .trim()
    .min(2)
    .max(100)
    .default("India"),

  postalCode: z
    .string()
    .regex(/^\d{6}$/, "Postal code must be 6 digits"),
});

export type StudentFormValues = z.infer<typeof studentFormSchema>;