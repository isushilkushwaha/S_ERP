import z from 'zod';
import { createFeeStructureSchema } from './create-fee-structure.schema';

export const updateFeeStructureSchema = createFeeStructureSchema.omit({
  academicYearId: true,
  classId: true,
}).partial();

export type UpdateFeeStructureInput = z.input<typeof updateFeeStructureSchema>;
export type UpdateFeeStructureSchema = z.output<typeof updateFeeStructureSchema>;