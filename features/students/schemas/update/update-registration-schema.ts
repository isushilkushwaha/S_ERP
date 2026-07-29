import { z } from "zod";

export const updateRegistrationSchema = z.object({
  emisNumber: z.string().trim().max(30).nullable().optional(),
  apaarId: z.string().trim().max(30).nullable().optional(),
  penNumber: z.string().trim().max(30).nullable().optional(),
});

export type UpdateRegistrationRequest =
  z.infer<typeof updateRegistrationSchema>;