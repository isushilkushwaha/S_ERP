import { z } from "zod";

import { createStudentSchema } from "./create-student.schema";

export const updateStudentSchema = createStudentSchema.partial();

export type UpdateStudentInput = z.infer<typeof updateStudentSchema>;