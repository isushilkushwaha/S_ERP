export type FeeStructureStatus = 'DRAFT' | 'ACTIVE' | 'ARCHIVED';

export interface FeeStructureItemDTO {
  id: string;
  feeStructureId: string;
  feeComponentId: string;
  amount: number;
  createdAt: string;
  updatedAt: string;
  feeComponent?: {
    id: string;
    name: string;
    code: string;
    isRequired: boolean;
  };
}

export interface FeeStructureDTO {
  id: string;
  tenantId: string;
  academicYearId: string;
  classId: string;
  effectiveFrom: string;
  status: FeeStructureStatus;
  notes?: string | null;
  version: number;
  createdBy?: string | null;
  updatedBy?: string | null;
  createdAt: string;
  updatedAt: string;
  deletedAt?: string | null;
  academicYear?: {
    id: string;
    name: string;
  };
  class?: {
    id: string;
    name: string;
  };
  items: FeeStructureItemDTO[];
  totalAmount: number;
}

export interface CreateFeeStructureItemInput {
  feeComponentId: string;
  amount: number;
}

export interface CreateFeeStructureDTO {
  tenantId: string;
  academicYearId: string;
  classId: string;
  effectiveFrom: Date;
  status?: FeeStructureStatus;
  notes?: string;
  items: CreateFeeStructureItemInput[];
  createdBy?: string;
}

export interface UpdateFeeStructureDTO {
  effectiveFrom?: Date;
  status?: FeeStructureStatus;
  notes?: string;
  items?: CreateFeeStructureItemInput[];
  updatedBy?: string;
}

export interface FeeStructureQueryParams {
  tenantId: string;
  page?: number;
  limit?: number;
  search?: string;
  academicYearId?: string;
  classId?: string;
  status?: FeeStructureStatus;
  sortBy?: 'createdAt' | 'effectiveFrom';
  sortOrder?: 'asc' | 'desc';
}

export interface PaginatedFeeStructures {
  items: FeeStructureDTO[];
  meta: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}