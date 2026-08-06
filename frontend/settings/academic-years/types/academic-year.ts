/* ============================================================================
 * Academic Year Status
 * ========================================================================== */

export type AcademicYearStatus =
  | "UPCOMING"
  | "ACTIVE"
  | "ARCHIVED";

/* ============================================================================
 * Academic Year
 * ========================================================================== */

export interface AcademicYear {
  id: string;

  name: string;
  code: string;

  startDate: string;
  endDate: string;

  status: AcademicYearStatus;

  description: string | null;

  sortOrder: number;

  createdAt: string;
  updatedAt: string;
  deletedAt: string | null;
}

/* ============================================================================
 * Create Academic Year
 * ========================================================================== */

export interface CreateAcademicYearRequest {
  name: string;
  code: string;

  startDate: string;
  endDate: string;

  status?: AcademicYearStatus;

  description?: string;

  sortOrder?: number;
}

/* ============================================================================
 * Update Academic Year
 * ========================================================================== */

export interface UpdateAcademicYearRequest {
  name?: string;
  code?: string;

  startDate?: string;
  endDate?: string;

  status?: AcademicYearStatus;

  description?: string;

  sortOrder?: number;
}

/* ============================================================================
 * Query Parameters
 * ========================================================================== */

export interface AcademicYearQueryParams {
  page?: number;
  limit?: number;

  search?: string;

  status?: AcademicYearStatus;

  sortBy?:
    | "name"
    | "code"
    | "startDate"
    | "endDate"
    | "sortOrder"
    | "createdAt";

  sortOrder?: "asc" | "desc";

  includeDeleted?: boolean;
}

/* ============================================================================
 * Pagination
 * ========================================================================== */

export interface PaginationMeta {
  page: number;
  limit: number;

  total: number;
  totalPages: number;

  hasNextPage: boolean;
  hasPreviousPage: boolean;
}

/* ============================================================================
 * List Response
 * ========================================================================== */

export interface AcademicYearListResponse {
  data: AcademicYear[];
  meta: PaginationMeta;
}

/* ============================================================================
 * Single Response
 * ========================================================================== */

export interface AcademicYearResponse {
  success: boolean;
  message?: string;
  data: AcademicYear;
}

/* ============================================================================
 * List API Response
 * ========================================================================== */

export interface AcademicYearListApiResponse {
  success: boolean;
  message?: string;
  data: AcademicYear[];
  meta: PaginationMeta;
}

/* ============================================================================
 * Delete Response
 * ========================================================================== */

export interface DeleteAcademicYearResponse {
  success: boolean;
  message: string;
}