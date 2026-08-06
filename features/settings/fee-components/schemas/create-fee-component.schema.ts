import { z } from 'zod';

export const createFeeComponentSchema = z.object({
  name: z.string().trim().min(2, 'Name must be at least 2 characters').max(100),
  code: z
    .string()
    .trim()
    .min(2, 'Code must be at least 2 characters')
    .max(30)
    .regex(/^[A-Z0-9_]+$/, 'Code must be uppercase alphanumeric with underscores (e.g., TUITION_FEE)'),
  description: z.string().trim().max(255).optional().or(z.literal('')),
  isRequired: z.boolean().default(true),
  displayOrder: z.coerce.number().int().min(0).default(0),
  status: z.enum(['ACTIVE', 'INACTIVE']).default('ACTIVE'),
});

// Use z.input and z.output for precise form typing
export type CreateFeeComponentInput = z.input<typeof createFeeComponentSchema>;
export type CreateFeeComponentSchema = z.output<typeof createFeeComponentSchema>;