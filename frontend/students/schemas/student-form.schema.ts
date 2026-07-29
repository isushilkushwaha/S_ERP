import { z } from "zod";

import {
  BLOOD_GROUP_OPTIONS,
  CATEGORY_OPTIONS,
  GENDER_OPTIONS,
} from "../constants";

export const studentFormSchema = z.object({
  // Government IDs
  emisNumber: z
    .string()
    .trim()
    .max(50)
    .optional()
    .nullable(),

  apaarId: z
    .string()
    .trim()
    .max(50)
    .optional()
    .nullable(),

  penNumber: z
    .string()
    .trim()
    .max(50)
    .optional()
    .nullable(),

  // Personal Information
  firstName: z
    .string()
    .trim()
    .min(2, "First name is required")
    .max(100),

  middleName: z
    .string()
    .trim()
    .max(100)
    .optional()
    .nullable(),

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

  religion: z
    .string()
    .trim()
    .max(100)
    .optional()
    .nullable(),

  category: z
  .enum(CATEGORY_OPTIONS)
  .optional()
  .nullable()
  .or(z.literal("")),

  caste: z
    .string()
    .trim()
    .max(100)
    .optional()
    .nullable(),

  nationality: z
    .string()
    .trim()
    .min(2)
    .max(100)
    .default("India"),

  aadhaarNumber: z
    .string()
    .regex(
      /^\d{12}$/,
      "Aadhaar must contain exactly 12 digits"
    )
    .optional()
    .nullable(),

  birthCertificateNo: z
    .string()
    .trim()
    .max(100)
    .optional()
    .nullable(),

  email: z
    .string()
    .email("Invalid email")
    .optional()
    .nullable(),

  mobile: z
    .string()
    .regex(
      /^[6-9]\d{9}$/,
      "Invalid mobile number"
    )
    .optional()
    .nullable(),

  photo: z
    .string()
    .optional()
    .nullable(),

  previousSchool: z
    .string()
    .trim()
    .max(255)
    .optional()
    .nullable(),

  remarks: z
    .string()
    .trim()
    .max(1000)
    .optional()
    .nullable(),

  // Father
  fatherName: z
    .string()
    .trim()
    .min(2, "Father name is required")
    .max(150),

  fatherOccupation: z
    .string()
    .trim()
    .max(150)
    .optional()
    .nullable(),

  fatherMobile: z
    .string()
    .regex(
      /^[6-9]\d{9}$/,
      "Invalid father mobile number"
    ),

  fatherEmail: z
    .string()
    .email("Invalid father email")
    .optional()
    .nullable(),

  // Mother
  motherName: z
    .string()
    .trim()
    .max(150)
    .optional()
    .nullable(),

  motherOccupation: z
    .string()
    .trim()
    .max(150)
    .optional()
    .nullable(),

  motherMobile: z
    .string()
    .regex(
      /^[6-9]\d{9}$/,
      "Invalid mother mobile number"
    )
    .optional()
    .nullable(),

  motherEmail: z
    .string()
    .email("Invalid mother email")
    .optional()
    .nullable(),

  // Guardian
  guardianName: z
    .string()
    .trim()
    .max(150)
    .optional()
    .nullable(),

  guardianRelation: z
    .string()
    .trim()
    .max(100)
    .optional()
    .nullable(),

  guardianMobile: z
    .string()
    .regex(
      /^[6-9]\d{9}$/,
      "Invalid guardian mobile number"
    )
    .optional()
    .nullable(),

  guardianEmail: z
    .string()
    .email("Invalid guardian email")
    .optional()
    .nullable(),

  // Address
  addressLine1: z
    .string()
    .trim()
    .min(5, "Address is required")
    .max(255),

  addressLine2: z
    .string()
    .trim()
    .max(255)
    .optional()
    .nullable(),

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
    .regex(
      /^\d{6}$/,
      "Postal code must be 6 digits"
    ),
});

export type StudentFormValues = z.infer<
  typeof studentFormSchema
>;