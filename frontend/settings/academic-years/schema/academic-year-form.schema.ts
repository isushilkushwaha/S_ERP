import { z } from "zod";

import { ACADEMIC_YEAR_STATUS } from "../constants";

export const academicYearFormSchema = z
  .object({
    name: z
      .string()
      .trim()
      .min(1, "Academic year name is required.")
      .max(100, "Academic year name cannot exceed 100 characters."),

    code: z
      .string()
      .trim()
      .min(1, "Academic year code is required.")
      .max(20, "Academic year code cannot exceed 20 characters."),

    startDate: z
      .string()
      .min(1, "Start date is required."),

    endDate: z
      .string()
      .min(1, "End date is required."),

    status: z.enum([
      ACADEMIC_YEAR_STATUS.UPCOMING,
      ACADEMIC_YEAR_STATUS.ACTIVE,
      ACADEMIC_YEAR_STATUS.ARCHIVED,
    ]),

    sortOrder: z
      .number()
      .int("Sort order must be an integer.")
      .min(1, "Sort order must be at least 1."),
  })
  .refine(
    (data) => new Date(data.startDate) < new Date(data.endDate),
    {
      path: ["endDate"],
      message: "End date must be after start date.",
    }
  );

export type AcademicYearFormValues = z.infer<
  typeof academicYearFormSchema
>;