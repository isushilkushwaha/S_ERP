import { z } from 'zod';

export const installmentPlanItemSchema = z.object({
  id: z.string().optional(),
  feeComponentId: z.string().optional().nullable(),
  name: z.string().min(1, 'Item name is required').max(100),
  dueRule: z.enum(['ADMISSION_DATE', 'FIXED_DATE', 'OFFSET_DAYS']),
  dueDay: z.number().int().min(1).max(31).optional().nullable(),
  dueMonth: z.number().int().min(1).max(12).optional().nullable(),
  dueOffsetDays: z.number().int().nonnegative().optional().nullable(),
  calculationType: z.enum(['PERCENTAGE', 'FIXED_AMOUNT']),
  value: z.number().positive('Value must be greater than 0'),
  displayOrder: z.number().int().default(0),
});

export const createInstallmentPlanSchema = z.object({
  tenantId: z.string().default('default_tenant'),
  academicYearId: z.string().min(1, 'Academic Year is required'),
  classId: z.string().min(1, 'Class is required'),
  name: z.string().min(1, 'Plan name is required').max(100),
  code: z.string().min(1, 'Plan code is required').max(30),
  planType: z.enum(['MONTHLY', 'QUARTERLY', 'HALF_YEARLY', 'ANNUAL', 'CUSTOM']),
  description: z.string().max(255).optional().nullable(),
  status: z.enum(['ACTIVE', 'INACTIVE']).default('ACTIVE'),
  effectiveFrom: z.string().optional().nullable(),
  effectiveTo: z.string().optional().nullable(),
  items: z.array(installmentPlanItemSchema).min(1, 'At least one installment item is required'),
});

export const updateInstallmentPlanSchema = createInstallmentPlanSchema.partial().extend({
  items: z.array(installmentPlanItemSchema).optional(),
});