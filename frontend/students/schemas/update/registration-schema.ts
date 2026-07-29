import { z } from "zod";

import { studentFormSchema } from "../student-form.schema";

export const registrationSchema = studentFormSchema.pick({
  emisNumber: true,
  apaarId: true,
  penNumber: true,
});

export type RegistrationFormValues = z.infer<
  typeof registrationSchema
>;