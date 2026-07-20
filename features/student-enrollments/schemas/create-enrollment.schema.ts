// import {
//   AdmissionType,
//   EnrollmentStatus,
//   Medium,
//   Stream,
// } from "@prisma/client";
// import { z } from "zod";

// export const createEnrollmentSchema = z
//   .object({
//     studentId: z
//       .string()
//       .uuid("Invalid student id"),

//     academicYearId: z
//       .string()
//       .uuid("Invalid academic year id"),

//     classId: z
//       .string()
//       .uuid("Invalid class id"),

//     sectionId: z
//       .string()
//       .uuid("Invalid section id"),

//     rollNumber: z
//       .number({
//         error: "Roll number is required",
//       })
//       .int()
//       .positive(),

//     medium: z.nativeEnum(Medium),

//     stream: z
//       .nativeEnum(Stream)
//       .nullable()
//       .optional(),

//     house: z
//       .string()
//       .trim()
//       .max(100)
//       .nullable()
//       .optional(),

//     boardRegistrationNumber: z
//       .string()
//       .trim()
//       .max(100)
//       .nullable()
//       .optional(),

//     admissionType: z.nativeEnum(AdmissionType),

//     enrollmentStatus: z
//       .nativeEnum(EnrollmentStatus)
//       .default(EnrollmentStatus.ACTIVE),

//     joinedDate: z.coerce.date(),

//     leftDate: z
//       .coerce
//       .date()
//       .nullable()
//       .optional(),

//     remarks: z
//       .string()
//       .trim()
//       .max(1000)
//       .nullable()
//       .optional(),
//   })
//   .superRefine((data, ctx) => {
//     if (
//       data.leftDate &&
//       data.leftDate < data.joinedDate
//     ) {
//       ctx.addIssue({
//         code: z.ZodIssueCode.custom,
//         path: ["leftDate"],
//         message:
//           "Left date cannot be before joined date.",
//       });
//     }
//   });

// export type CreateEnrollmentInput =
//   z.infer<typeof createEnrollmentSchema>;


import {
  AdmissionType,
  EnrollmentStatus,
  Medium,
  Stream,
} from "@prisma/client";
import { z } from "zod";

export const enrollmentSchemaBase = z.object({
  studentId: z.string().uuid("Invalid student id"),

  academicYearId: z.string().uuid("Invalid academic year id"),

  classId: z.string().uuid("Invalid class id"),

  sectionId: z.string().uuid("Invalid section id"),

  rollNumber: z.number({
    error: "Roll number is required",
  }).int().positive(),

  medium: z.nativeEnum(Medium),

  stream: z.nativeEnum(Stream).nullable().optional(),

  house: z.string().trim().max(100).nullable().optional(),

  boardRegistrationNumber: z
    .string()
    .trim()
    .max(100)
    .nullable()
    .optional(),

  admissionType: z.nativeEnum(AdmissionType),

  enrollmentStatus: z
    .nativeEnum(EnrollmentStatus)
    .default(EnrollmentStatus.ACTIVE),

  joinedDate: z.coerce.date(),

  leftDate: z.coerce.date().nullable().optional(),

  remarks: z.string().trim().max(1000).nullable().optional(),
});

export const createEnrollmentSchema =
  enrollmentSchemaBase.superRefine((data, ctx) => {
    if (
      data.leftDate &&
      data.leftDate < data.joinedDate
    ) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["leftDate"],
        message: "Left date cannot be before joined date.",
      });
    }
  });

export type CreateEnrollmentInput =
  z.infer<typeof createEnrollmentSchema>;