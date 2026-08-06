export type Status = 'ACTIVE' | 'INACTIVE';

export interface FeeComponentDTO {
  id: string;
  tenantId: string;
  name: string;
  code: string;
  description?: string | null;
  isRequired: boolean;
  displayOrder: number;
  status: Status;
  version: number;
  createdBy?: string | null;
  updatedBy?: string | null;
  createdAt: string;
  updatedAt: string;
  deletedAt?: string | null;
}

export interface CreateFeeComponentDTO {
  tenantId: string;
  name: string;
  code: string;
  description?: string;
  isRequired?: boolean;
  displayOrder?: number;
  status?: Status;
  createdBy?: string;
}

export interface UpdateFeeComponentDTO {
  name?: string;
  code?: string;
  description?: string;
  isRequired?: boolean;
  displayOrder?: number;
  status?: Status;
  updatedBy?: string;
}

export interface FeeComponentQueryParams {
  tenantId: string;
  page?: number;
  limit?: number;
  search?: string;
  status?: Status;
  sortBy?: 'name' | 'code' | 'displayOrder' | 'createdAt';
  sortOrder?: 'asc' | 'desc';
}

export interface PaginatedFeeComponents {
  items: FeeComponentDTO[];
  meta: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}