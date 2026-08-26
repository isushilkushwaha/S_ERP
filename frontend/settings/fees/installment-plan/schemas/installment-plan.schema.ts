import { z } from 'zod';

export const installmentItemSchema = z.object({
  name: z.string().trim().min(1, 'Milestone name is required'),
  dueRule: z.enum(['FIXED_DATE', 'ADMISSION_DATE', 'OFFSET_DAYS']),
  dueDate: z.string().nullable().optional(),
  dueDay: z.number().int().min(1).max(31).nullable().optional(),
  dueMonth: z.number().int().min(1).max(12).nullable().optional(),
  dueOffsetDays: z.number().int().min(0).nullable().optional(),
  calculationType: z.enum(['PERCENTAGE', 'FIXED_AMOUNT']),
  value: z.number().min(0, 'Value cannot be negative'),
  displayOrder: z.number().int().min(1),
  feeComponentIds: z.array(z.string()).min(1, 'Select at least one fee component'),
});

export const installmentPlanSchema = z.object({
  academicYearId: z.string().min(1, 'Academic Year is required'),
  classId: z.string().min(1, 'Class is required'),
  name: z.string().trim().min(1, 'Plan name is required'),
  code: z.string().trim().min(1, 'Plan code is required').max(30),
  planType: z.enum(['MONTHLY', 'QUARTERLY', 'HALF_YEARLY', 'ANNUAL', 'CUSTOM']),
  effectiveFrom: z.string().min(1, 'Effective from date is required'),
  effectiveTo: z.string().min(1, 'Effective to date is required'),
  items: z.array(installmentItemSchema).min(1, 'At least one milestone is required'),
});

export type InstallmentPlanFormValues = z.infer<typeof installmentPlanSchema>;