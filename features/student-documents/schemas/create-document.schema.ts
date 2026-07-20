import { DocumentType } from "@prisma/client";
import { z } from "zod";

export const createDocumentSchema = z
  .object({
    studentId: z
      .string()
      .uuid("Invalid student id"),

    documentType: z.nativeEnum(DocumentType),

    documentNumber: z
      .string()
      .trim()
      .max(100)
      .nullable()
      .optional(),

    fileName: z
      .string()
      .trim()
      .min(1, "File name is required")
      .max(255),

    fileUrl: z
      .string()
      .trim()
      .min(1, "File URL is required")
      .max(1000),

    issueDate: z
      .coerce
      .date()
      .nullable()
      .optional(),

    expiryDate: z
      .coerce
      .date()
      .nullable()
      .optional(),

    verified: z
      .boolean()
      .default(false),

    remarks: z
      .string()
      .trim()
      .max(1000)
      .nullable()
      .optional(),
  })
  .superRefine((data, ctx) => {
    if (
      data.issueDate &&
      data.expiryDate &&
      data.expiryDate < data.issueDate
    ) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["expiryDate"],
        message:
          "Expiry date cannot be before issue date.",
      });
    }
  });

export type CreateDocumentInput =
  z.infer<typeof createDocumentSchema>;