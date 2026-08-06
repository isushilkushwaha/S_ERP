import { z } from "zod";

export const classConfigurationSchema = z
  .object({
    classId: z
      .string()
      .uuid("Invalid Class ID format."),

    sectionsEnabled: z.boolean(),

    defaultSectionCapacity: z
      .coerce
      .number()
      .int("Default capacity must be an integer.")
      .min(1, "Default section capacity must be at least 1.")
      .nullable()
      .optional(),

    maxStudentsWithoutSection: z
      .coerce
      .number()
      .int("Maximum capacity must be an integer.")
      .min(1, "Maximum students without section must be at least 1.")
      .nullable()
      .optional(),

    autoAllocationEnabled: z.boolean().default(true),
  })
  .refine(
    (data) => {
      if (!data.sectionsEnabled) {
        return (
          data.maxStudentsWithoutSection !== null &&
          data.maxStudentsWithoutSection !== undefined &&
          data.maxStudentsWithoutSection > 0
        );
      }

      return true;
    },
    {
      message:
        "Maximum students without section is required when sections are disabled.",
      path: ["maxStudentsWithoutSection"],
    }
  )
  .refine(
    (data) => {
      if (data.sectionsEnabled) {
        return (
          data.defaultSectionCapacity !== null &&
          data.defaultSectionCapacity !== undefined &&
          data.defaultSectionCapacity > 0
        );
      }

      return true;
    },
    {
      message:
        "Default section capacity is required when sections are enabled.",
      path: ["defaultSectionCapacity"],
    }
  );

export type ClassConfigurationInput = z.infer<
  typeof classConfigurationSchema
>;