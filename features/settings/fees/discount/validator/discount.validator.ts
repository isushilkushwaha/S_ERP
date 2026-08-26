import { z } from 'zod';

export const createDiscountTypeSchema = z.object({
  tenantId: z.string().default('default_tenant'),
  name: z.string().min(1, 'Discount name is required').max(100),
  code: z.string().min(1, 'Discount code is required').max(30),
  description: z.string().max(255).optional().nullable(),
  percentage: z.number().min(0).max(100).optional().nullable(),
  fixedAmount: z.number().nonnegative().optional().nullable(),
  maxLimit: z.number().nonnegative().optional().nullable(),
  validFrom: z.string().optional().nullable(),
  validUntil: z.string().optional().nullable(),
  status: z.enum(['ACTIVE', 'INACTIVE']).default('ACTIVE'),
  applicableComponentIds: z.array(z.string()).default([]), // Fee Component IDs this discount applies to
}).refine(data => {
  const hasPercentage = data.percentage !== null && data.percentage !== undefined && data.percentage > 0;
  const hasFixed = data.fixedAmount !== null && data.fixedAmount !== undefined && data.fixedAmount > 0;
  return (hasPercentage && !hasFixed) || (!hasPercentage && hasFixed);
}, {
  message: 'Either percentage or fixed amount must be specified (mutually exclusive).',
  path: ['percentage'],
});

export const updateDiscountTypeSchema = createDiscountTypeSchema.partial();