/**
 * Academic Year
 */
export interface AcademicYear {
  id: string;

  name: string;

  code: string;

  startDate: string;

  endDate: string;

  isCurrent: boolean;

  isActive: boolean;

  createdAt: string;

  updatedAt: string;
}

/**
 * Create Academic Year Request
 */
export interface CreateAcademicYearRequest {
  name: string;

  code: string;

  startDate: string;

  endDate: string;

  isCurrent?: boolean;

  isActive?: boolean;
}

/**
 * Update Academic Year Request
 */
export interface UpdateAcademicYearRequest
  extends Partial<CreateAcademicYearRequest> {}

/**
 * Query Parameters
 */
export interface AcademicYearQuery {
  page?: number;

  limit?: number;

  search?: string;

  isCurrent?: boolean;

  isActive?: boolean;
}

/**
 * List Response
 */
export interface AcademicYearListResponse {
  data: AcademicYear[];

  total: number;

  page: number;

  limit: number;

  totalPages: number;
}

/**
 * Single Response
 */
export interface AcademicYearResponse {
  data: AcademicYear;

  message: string;
}

/**
 * Select Option
 */
export interface AcademicYearOption {
  value: string;

  label: string;
}