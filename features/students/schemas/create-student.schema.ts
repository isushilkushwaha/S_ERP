import { Gender, StudentCategory, StudentStatus } from "@prisma/client";
import { z } from "zod";

export const createStudentSchema = z.object({
  studentCode: z
    .string()
    .trim()
    .min(1, "Student code is required")
    .max(50),

  admissionNumber: z
    .string()
    .trim()
    .min(1, "Admission number is required")
    .max(50),

  emisNumber: z.string().trim().max(50).optional().nullable(),

  apaarId: z.string().trim().max(50).optional().nullable(),

  penNumber: z.string().trim().max(50).optional().nullable(),

  firstName: z
    .string()
    .trim()
    .min(2, "First name is required")
    .max(100),

  middleName: z.string().trim().max(100).optional().nullable(),

  lastName: z
    .string()
    .trim()
    .min(1, "Last name is required")
    .max(100),

  gender: z.nativeEnum(Gender),

  dateOfBirth: z.coerce.date(),

  bloodGroup: z.string().trim().max(10).optional().nullable(),

  religion: z.string().trim().max(100).optional().nullable(),

  category: z.nativeEnum(StudentCategory).optional().nullable(),

  caste: z.string().trim().max(100).optional().nullable(),

  nationality: z.string().trim().max(100).optional().nullable(),

  aadhaarNumber: z
    .string()
    .trim()
    .regex(/^\d{12}$/, "Aadhaar must contain exactly 12 digits")
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
    .trim()
    .email("Invalid email")
    .optional()
    .or(z.literal(""))
    .nullable(),

  mobile: z
    .string()
    .trim()
    .regex(/^[6-9]\d{9}$/, "Invalid mobile number")
    .optional()
    .or(z.literal(""))
    .nullable(),

  photo: z.string().optional().nullable(),

  admissionDate: z.coerce.date(),

  previousSchool: z
    .string()
    .trim()
    .max(255)
    .optional()
    .nullable(),

  status: z.nativeEnum(StudentStatus).default(StudentStatus.ACTIVE),

  remarks: z.string().trim().max(1000).optional().nullable(),

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
    .trim()
    .regex(/^[6-9]\d{9}$/, "Invalid father mobile number"),

  fatherEmail: z
    .string()
    .trim()
    .email()
    .optional()
    .or(z.literal(""))
    .nullable(),

  motherName: z.string().trim().max(150).optional().nullable(),

  motherOccupation: z
    .string()
    .trim()
    .max(150)
    .optional()
    .nullable(),

  motherMobile: z
    .string()
    .trim()
    .regex(/^[6-9]\d{9}$/, "Invalid mother mobile number")
    .optional()
    .or(z.literal(""))
    .nullable(),

  motherEmail: z
    .string()
    .trim()
    .email()
    .optional()
    .or(z.literal(""))
    .nullable(),

  guardianName: z.string().trim().max(150).optional().nullable(),

  guardianRelation: z.string().trim().max(100).optional().nullable(),

  guardianMobile: z
    .string()
    .trim()
    .regex(/^[6-9]\d{9}$/, "Invalid guardian mobile number")
    .optional()
    .or(z.literal(""))
    .nullable(),

  guardianEmail: z
    .string()
    .trim()
    .email()
    .optional()
    .or(z.literal(""))
    .nullable(),

  addressLine1: z
    .string()
    .trim()
    .min(5, "Address is required")
    .max(255),

  addressLine2: z.string().trim().max(255).optional().nullable(),

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
    .max(100),

  postalCode: z
    .string()
    .trim()
    .regex(/^\d{6}$/, "Postal code must be 6 digits"),

  isTransportRequired: z.boolean().default(false),

  isHostelRequired: z.boolean().default(false),
});

export type CreateStudentInput = z.infer<typeof createStudentSchema>;