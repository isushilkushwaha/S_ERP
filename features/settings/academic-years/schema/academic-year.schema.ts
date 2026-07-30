import { z } from "zod";

import { AcademicYearStatus } from "@prisma/client";

/* -------------------------------------------------------------------------- */
/*                               Common Fields                                */
/* -------------------------------------------------------------------------- */

const name = z
  .string()
  .trim()
  .min(3, "Academic year name must be at least 3 characters.")
  .max(100, "Academic year name cannot exceed 100 characters.");

const code = z
  .string()
  .trim()
  .min(2, "Academic year code is required.")
  .max(20, "Academic year code cannot exceed 20 characters.");

const startDate = z.coerce.date({
  error: "Invalid start date.",
});

const endDate = z.coerce.date({
  error: "Invalid end date.",
});

const description = z
  .string()
  .trim()
  .max(500, "Description cannot exceed 500 characters.")
  .optional()
  .nullable();

const status = z
  .nativeEnum(AcademicYearStatus)
  .default(AcademicYearStatus.UPCOMING);

const sortOrder = z
  .number()
  .int()
  .min(0)
  .default(0);

/* -------------------------------------------------------------------------- */
/*                             Create Academic Year                           */
/* -------------------------------------------------------------------------- */

export const createAcademicYearSchema = z
  .object({
    name,
    code,
    startDate,
    endDate,
    status,
    description,
    sortOrder,
  })
  .refine(
    (data) => data.startDate < data.endDate,
    {
      path: ["endDate"],
      message: "End date must be after start date.",
    }
  );

/* -------------------------------------------------------------------------- */
/*                             Update Academic Year                           */
/* -------------------------------------------------------------------------- */

export const updateAcademicYearSchema = z
  .object({
    name: name.optional(),
    code: code.optional(),
    startDate: startDate.optional(),
    endDate: endDate.optional(),
    status: status.optional(),
    description,
    sortOrder: sortOrder.optional(),
  })
  .refine(
    (data) => {
      if (!data.startDate || !data.endDate) {
        return true;
      }

      return data.startDate < data.endDate;
    },
    {
      path: ["endDate"],
      message: "End date must be after start date.",
    }
  );

/* -------------------------------------------------------------------------- */
/*                              Query Parameters                              */
/* -------------------------------------------------------------------------- */

export const academicYearQuerySchema = z.object({
  page: z.coerce.number().int().positive().default(1),

  limit: z.coerce.number().int().min(1).max(100).default(10),

  search: z.string().trim().optional(),

  status: z.nativeEnum(AcademicYearStatus).optional(),

  sortBy: z
    .enum([
      "name",
      "code",
      "startDate",
      "endDate",
      "createdAt",
      "sortOrder",
    ])
    .default("startDate"),

  sortOrder: z
    .enum(["asc", "desc"])
    .default("desc"),

  includeDeleted: z.coerce.boolean().default(false),
});

/* -------------------------------------------------------------------------- */
/*                              Route Parameters                              */
/* -------------------------------------------------------------------------- */

export const academicYearIdSchema = z.object({
  id: z.cuid("Invalid Academic Year ID."),
});

/* -------------------------------------------------------------------------- */
/*                                   Types                                    */
/* -------------------------------------------------------------------------- */

export type CreateAcademicYearInput = z.infer<
  typeof createAcademicYearSchema
>;

export type UpdateAcademicYearInput = z.infer<
  typeof updateAcademicYearSchema
>;

export type AcademicYearQueryInput = z.infer<
  typeof academicYearQuerySchema
>;

export type AcademicYearIdInput = z.infer<
  typeof academicYearIdSchema
>;