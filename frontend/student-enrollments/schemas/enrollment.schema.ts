


import { z } from "zod";
import {
  AdmissionType,
  EnrollmentStatus,
  Medium,
  Stream,
} from "@prisma/client";

/**
 * Base Enrollment Schema
 */
const enrollmentSchemaBase = z.object({
  studentId: z
    .string()
    .uuid("Please select a valid student."),

  academicYearId: z
    .string()
    .uuid("Please select an academic year."),

  classId: z
    .string()
    .uuid("Please select a class."),

  sectionId: z
    .string()
    .uuid("Please select a section."),

  rollNumber: z.coerce
    .number({
      message: "Roll number is required.",
    })
    .int("Roll number must be a whole number.")
    .positive("Roll number must be greater than 0."),

  medium: z.nativeEnum(Medium, {
    error: "Please select a valid medium.",
  }),

  stream: z
    .nativeEnum(Stream)
    .nullable()
    .optional(),

  house: z
    .string()
    .trim()
    .max(100, "House cannot exceed 100 characters.")
    .nullable()
    .optional(),

  boardRegistrationNumber: z
    .string()
    .trim()
    .max(
      100,
      "Board Registration Number cannot exceed 100 characters."
    )
    .nullable()
    .optional(),

  admissionType: z.nativeEnum(AdmissionType, {
    error: "Please select a valid admission type.",
  }),

  enrollmentStatus: z.nativeEnum(EnrollmentStatus, {
    error:
      "Please select a valid enrollment status.",
  }),

  joinedDate: z.coerce.date({
    message: "Joined date is required.",
  }),

  leftDate: z.coerce
    .date()
    .nullable()
    .optional(),

  remarks: z
    .string()
    .trim()
    .max(
      1000,
      "Remarks cannot exceed 1000 characters."
    )
    .nullable()
    .optional(),
});

/**
 * Create Enrollment Schema
 */
export const createEnrollmentSchema =
  enrollmentSchemaBase.superRefine(
    (data, ctx) => {
      if (
        data.leftDate &&
        data.leftDate < data.joinedDate
      ) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ["leftDate"],
          message:
            "Left date cannot be before joined date.",
        });
      }
    }
  );

/**
 * Update Enrollment Schema
 */
export const updateEnrollmentSchema =
  enrollmentSchemaBase
    .partial()
    .superRefine((data, ctx) => {
      if (
        data.joinedDate &&
        data.leftDate &&
        data.leftDate < data.joinedDate
      ) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ["leftDate"],
          message:
            "Left date cannot be before joined date.",
        });
      }
    });

/**
 * Search / Filter Schema
 */
export const enrollmentFilterSchema =
  z.object({
    search: z.string().optional(),

    academicYearId: z
      .string()
      .uuid()
      .optional(),

    classId: z
      .string()
      .uuid()
      .optional(),

    sectionId: z
      .string()
      .uuid()
      .optional(),

    enrollmentStatus: z
      .nativeEnum(EnrollmentStatus)
      .optional(),

    page: z.coerce
      .number()
      .min(1)
      .default(1),

    limit: z.coerce
      .number()
      .min(1)
      .max(100)
      .default(10),
  });

/**
 * Form Types
 */
export type CreateEnrollmentFormValues =
  z.input<typeof createEnrollmentSchema>;

export type UpdateEnrollmentFormValues =
  z.input<typeof updateEnrollmentSchema>;

export type EnrollmentFilterValues =
  z.infer<typeof enrollmentFilterSchema>;