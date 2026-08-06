import { z } from 'zod';

export const feeStructureItemSchema = z.object({
  feeComponentId: z.string().min(1, 'Invalid component ID'),
  amount: z.coerce.number().min(0, 'Amount cannot be negative'),
});

export const createFeeStructureSchema = z.object({
  academicYearId: z.string().min(1, 'Please select an academic year'),
  classId: z.string().min(1, 'Please select a class'),
  effectiveFrom: z.coerce.date({
    message: 'Effective date is required',
  }),
  status: z.enum(['DRAFT', 'ACTIVE', 'ARCHIVED']).default('ACTIVE'),
  notes: z.string().max(500, 'Notes cannot exceed 500 characters').optional().or(z.literal('')),
  items: z
    .array(feeStructureItemSchema)
    .min(1, 'At least one fee component amount must be specified'),
});

export type CreateFeeStructureInput = z.input<typeof createFeeStructureSchema>;
export type CreateFeeStructureSchema = z.infer<typeof createFeeStructureSchema>;