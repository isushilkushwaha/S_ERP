import z from 'zod';
import { createFeeComponentSchema } from './create-fee-component.schema';

export const updateFeeComponentSchema = createFeeComponentSchema.partial();

export type UpdateFeeComponentSchema = z.infer<typeof updateFeeComponentSchema>;