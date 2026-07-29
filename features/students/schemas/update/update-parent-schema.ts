import { z } from "zod";

export const updateParentSchema = z.object({
  fatherName: z.string().trim().max(100).optional().nullable(),

  fatherOccupation: z
    .string()
    .trim()
    .max(100)
    .optional()
    .nullable(),

  fatherMobile: z
    .string()
    .trim()
    .max(15)
    .optional()
    .nullable(),

  fatherEmail: z
    .string()
    .trim()
    .email("Invalid father email.")
    .optional()
    .or(z.literal(""))
    .nullable(),

  motherName: z.string().trim().max(100).optional().nullable(),

  motherOccupation: z
    .string()
    .trim()
    .max(100)
    .optional()
    .nullable(),

  motherMobile: z
    .string()
    .trim()
    .max(15)
    .optional()
    .nullable(),

  motherEmail: z
    .string()
    .trim()
    .email("Invalid mother email.")
    .optional()
    .or(z.literal(""))
    .nullable(),

  guardianName: z
    .string()
    .trim()
    .max(100)
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
    .trim()
    .max(15)
    .optional()
    .nullable(),

  guardianEmail: z
    .string()
    .trim()
    .email("Invalid guardian email.")
    .optional()
    .or(z.literal(""))
    .nullable(),
});

export type UpdateParentRequest = z.infer<
  typeof updateParentSchema
>;