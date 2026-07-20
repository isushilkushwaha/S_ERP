
import { z } from "zod";

import {
  BLOOD_GROUP_OPTIONS,
  CATEGORY_OPTIONS,
  GENDER_OPTIONS,
  STUDENT_STATUS_VALUES,
} from "../constants";

export const studentFormSchema = z.object({
  // Admission
  studentCode: z.string().trim().min(1).max(30),

  admissionNumber: z.string().trim().min(1).max(30),

  admissionDate: z.string().min(1),

  status: z.enum(STUDENT_STATUS_VALUES),

  // Personal
  firstName: z.string().trim().min(2).max(100),

  middleName: z.string().trim().max(100).optional().or(z.literal("")),

  lastName: z.string().trim().min(1).max(100),

  // gender: z.enum(GENDER_OPTIONS),
  gender: z
  .string()
  .min(1, "Gender is required")
  .refine(
    (value) => GENDER_OPTIONS.includes(value as (typeof GENDER_OPTIONS)[number]),
    "Invalid gender"
  ),

  dateOfBirth: z.string().min(1),

  bloodGroup: z.enum(BLOOD_GROUP_OPTIONS).optional().or(z.literal("")),

  religion: z.string().trim().max(100).optional().or(z.literal("")),

  category: z.enum(CATEGORY_OPTIONS).optional().or(z.literal("")),

  caste: z.string().trim().max(100).optional().or(z.literal("")),

  nationality: z.string().trim().max(100),

  aadhaarNumber: z
    .string()
    .regex(/^\d{12}$/)
    .optional()
    .or(z.literal("")),

  birthCertificateNo: z
    .string()
    .trim()
    .max(100)
    .optional()
    .or(z.literal("")),

  email: z.email().optional().or(z.literal("")),

  mobile: z
    .string()
    .regex(/^[6-9]\d{9}$/)
    .optional()
    .or(z.literal("")),

  previousSchool: z
    .string()
    .trim()
    .max(200)
    .optional()
    .or(z.literal("")),

  remarks: z
    .string()
    .trim()
    .max(500)
    .optional()
    .or(z.literal("")),

  // Parent
  fatherName: z.string().trim().min(2).max(150),

  fatherOccupation: z
    .string()
    .trim()
    .max(100)
    .optional()
    .or(z.literal("")),

  fatherMobile: z
    .string()
    .regex(/^[6-9]\d{9}$/)
    .optional()
    .or(z.literal("")),

  fatherEmail: z.email().optional().or(z.literal("")),

  motherName: z.string().trim().min(2).max(150),

  motherOccupation: z
    .string()
    .trim()
    .max(100)
    .optional()
    .or(z.literal("")),

  motherMobile: z
    .string()
    .regex(/^[6-9]\d{9}$/)
    .optional()
    .or(z.literal("")),

  motherEmail: z.email().optional().or(z.literal("")),

  guardianName: z
    .string()
    .trim()
    .max(150)
    .optional()
    .or(z.literal("")),

  guardianRelation: z
    .string()
    .trim()
    .max(100)
    .optional()
    .or(z.literal("")),

  guardianMobile: z
    .string()
    .regex(/^[6-9]\d{9}$/)
    .optional()
    .or(z.literal("")),

  guardianEmail: z.email().optional().or(z.literal("")),

  // Address
  addressLine1: z.string().trim().min(5).max(200),

  addressLine2: z
    .string()
    .trim()
    .max(200)
    .optional()
    .or(z.literal("")),

  city: z.string().trim().min(2).max(100),

  district: z.string().trim().min(2).max(100),

  state: z.string().trim().min(2).max(100),

  country: z.string().trim().min(2).max(100),

  postalCode: z.string().regex(/^\d{6}$/),

  // Facilities
  isTransportRequired: z.boolean(),

  isHostelRequired: z.boolean(),
});

/**
 * IMPORTANT:
 * Use the INPUT type for React Hook Form / shadcn Form.
 */
export type StudentFormValues = z.input<typeof studentFormSchema>;