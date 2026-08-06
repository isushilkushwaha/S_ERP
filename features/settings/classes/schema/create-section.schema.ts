import { z } from "zod";
import { Status } from "@prisma/client";

export const createSectionSchema = z.object({
  classId: z
    .string()
    .uuid("Invalid Class ID format."),

  name: z
    .string()
    .trim()
    .min(1, "Section name cannot be empty.")
    .max(20, "Section name cannot exceed 20 characters."),

  displayOrder: z
    .coerce
    .number()
    .int("Display order must be an integer.")
    .min(1, "Display order must be greater than zero."),

  capacity: z
    .coerce
    .number()
    .int("Capacity must be an integer.")
    .min(1, "Section capacity must be at least 1 student."),

  status: z
    .nativeEnum(Status, {
      error: "Status must be ACTIVE or INACTIVE.",
    })
    .default(Status.ACTIVE),
});

export type CreateSectionInput = z.infer<typeof createSectionSchema>;