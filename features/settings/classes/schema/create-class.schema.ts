import { z } from "zod";
import { Medium, Status } from "@prisma/client";

export const createClassSchema = z.object({
  name: z
    .string()
    .trim()
    .min(1, "Class name cannot be empty.")
    .max(50, "Class name cannot exceed 50 characters."),

  shortName: z
    .string()
    .trim()
    .max(20, "Short name cannot exceed 20 characters.")
    .optional(),

  code: z
    .string()
    .trim()
    .min(1, "Class code cannot be empty.")
    .max(20, "Class code cannot exceed 20 characters.")
    .regex(
      /^[A-Za-z0-9-_]+$/,
      "Code can only contain alphanumeric characters, dashes, and underscores."
    ),

  description: z
    .string()
    .trim()
    .max(255, "Description cannot exceed 255 characters.")
    .optional(),

  medium: z
    .nativeEnum(Medium, {
      error: "Invalid instruction medium.",
    })
    .default(Medium.ENGLISH),

  displayOrder: z
    .number()
    .int("Display order must be an integer.")
    .min(1, "Display order must be greater than zero."),

  status: z
    .nativeEnum(Status, {
      error: "Status must be ACTIVE or INACTIVE.",
    })
    .default(Status.ACTIVE),

  defaultConfig: z
    .object({
      sectionsEnabled: z.boolean().default(true),

      defaultSectionCapacity: z
        .number()
        .int("Capacity must be an integer.")
        .min(1, "Capacity must be at least 1.")
        .optional(),

      maxStudentsWithoutSection: z
        .number()
        .int("Capacity must be an integer.")
        .min(1, "Capacity must be at least 1.")
        .optional(),
    })
    .optional(),
});

export type CreateClassInput = z.infer<typeof createClassSchema>;