import { z } from "zod";
import { Status } from "@prisma/client";

export const updateSectionSchema = z.object({
  name: z
    .string()
    .trim()
    .min(1, "Section name cannot be empty.")
    .max(20, "Section name cannot exceed 20 characters.")
    .optional(),

  displayOrder: z
    .coerce
    .number()
    .int("Display order must be an integer.")
    .min(1, "Display order must be greater than zero.")
    .optional(),

  capacity: z
    .coerce
    .number()
    .int("Capacity must be an integer.")
    .min(1, "Section capacity must be at least 1 student.")
    .optional(),

  status: z
    .nativeEnum(Status, {
      error: "Status must be ACTIVE or INACTIVE.",
    })
    .optional(),
});

export type UpdateSectionInput = z.infer<typeof updateSectionSchema>;