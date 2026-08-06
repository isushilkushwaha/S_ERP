import { z } from 'zod';

export const searchFeeStructureSchema = z.object({
  tenantId: z.string().min(1, 'Invalid tenant ID'),
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(100).default(10),
  search: z.string().trim().optional(),
  academicYearId: z.string().min(1).optional(),
  classId: z.string().min(1).optional(),
  status: z.enum(['DRAFT', 'ACTIVE', 'ARCHIVED']).optional(),
  sortBy: z.enum(['createdAt', 'effectiveFrom']).default('createdAt'),
  sortOrder: z.enum(['asc', 'desc']).default('desc'),
});

export type SearchFeeStructureSchema = z.output<typeof searchFeeStructureSchema>;