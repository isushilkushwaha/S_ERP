// features/admissions/validators/admission.validator.ts

import { z } from "zod";
import { AdmissionType, Medium, Stream } from "@prisma/client";

export const searchStudentSchema = z.object({
  query: z.string().trim().optional(),
  studentCode: z.string().trim().optional(),
  studentId: z.string().uuid().optional(),
  fatherMobile: z.string().trim().optional(),
});

export const step1SelectStudentSchema = z.object({
  studentId: z.string().uuid({
    error: "Invalid student selection.",
  }),
});

export const step3AcademicAdmissionSchema = z.object({
  academicYearId: z.string().cuid({
    error: "Invalid Academic Year selection.",
  }),

  classId: z.string().uuid({
    error: "Invalid Class selection.",
  }),

  sectionId: z
    .string()
    .uuid()
    .or(z.literal(""))
    .nullable()
    .optional(),

  admissionDate: z.coerce.date({
    error: "Admission date is required.",
  }),

  admissionNumber: z
    .string()
    .trim()
    .min(1, "Admission number is required.")
    .max(50, "Admission number cannot exceed 50 characters."),

  rollNumber: z
    .number()
    .int("Roll number must be an integer.")
    .positive("Roll number must be greater than zero."),

  medium: z.enum(Medium, {
    error: "Medium is required.",
  }),

  stream: z.enum(Stream).nullable().optional(),

  admissionType: z.enum(AdmissionType, {
    error: "Admission type is required.",
  }),

  house: z.string().trim().max(50).nullable().optional(),

  boardRegistrationNumber: z
    .string()
    .trim()
    .max(100)
    .nullable()
    .optional(),

  isHostelRequired: z.boolean().default(false),

  isTransportRequired: z.boolean().default(false),

  remarks: z.string().trim().max(500).nullable().optional(),
});

export const createAdmissionSchema = z.object({
  studentId: z.string().uuid({
    error: "Invalid Student ID.",
  }),

  academicYearId: z.string().cuid({
    error: "Invalid Academic Year ID.",
  }),

  classId: z.string().uuid({
    error: "Invalid Class ID.",
  }),

  sectionId: z
    .string()
    .uuid()
    .or(z.literal(""))
    .nullable()
    .optional(),

  admissionDate: z.coerce.date(),

  admissionNumber: z
    .string()
    .trim()
    .min(1, "Admission number is required."),

  rollNumber: z
    .number()
    .int()
    .positive(),

  medium: z.enum(Medium),

  stream: z.enum(Stream).nullable().optional(),

  admissionType: z.enum(AdmissionType),

  house: z.string().trim().nullable().optional(),

  boardRegistrationNumber: z
    .string()
    .trim()
    .nullable()
    .optional(),

  isHostelRequired: z.boolean().default(false),

  isTransportRequired: z.boolean().default(false),

  remarks: z.string().trim().nullable().optional(),

  // --- FEE CONCESSION & INSTALLMENT SELECTION ---
  feeStructureId: z.string().uuid({
    error: "Invalid Fee Structure ID.",
  }),

  concession: z
    .object({
      discountType: z.string().trim().min(1, "Discount type is required."),
      discountAmount: z.number().nonnegative("Discount amount cannot be negative."),
      description: z.string().trim().max(255).nullable().optional(),
    })
    .nullable()
    .optional(),

  installmentPlanId: z
    .string()
    .cuid()
    .or(z.string().uuid())
    .nullable()
    .optional(),

  // 👈 ADDED INSTALLMENTS ARRAY SCHEMA DEFINITION
  installments: z
    .array(
      z.object({
        name: z.string().trim().min(1, "Installment name is required."),
        dueDate: z.string().nullable().optional(),
        value: z.number().nonnegative("Installment amount cannot be negative."),
        componentIds: z.array(z.string()).optional(),
      })
    )
    .nullable()
    .optional(),

  tenantId: z
    .string()
    .trim()
    .min(1, "Tenant scope is required."),
});

export type Step1SelectStudentInput = z.infer<
  typeof step1SelectStudentSchema
>;

export type Step3AcademicAdmissionInput = z.infer<
  typeof step3AcademicAdmissionSchema
>;

export type CreateAdmissionInput = z.infer<
  typeof createAdmissionSchema
>;