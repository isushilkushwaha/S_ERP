import { AcademicYear, AcademicYearStatus } from "@prisma/client";

/* -------------------------------------------------------------------------- */
/*                                Core Entity                                 */
/* -------------------------------------------------------------------------- */

export type AcademicYearEntity = AcademicYear;

/* -------------------------------------------------------------------------- */
/*                                    DTOs                                    */
/* -------------------------------------------------------------------------- */

export interface AcademicYearDTO {
  id: string;

  name: string;
  code: string;

  startDate: Date;
  endDate: Date;

  status: AcademicYearStatus;

  description: string | null;

  sortOrder: number;

  createdAt: Date;
  updatedAt: Date;
  deletedAt: Date | null;
}

export interface CreateAcademicYearDTO {
  name: string;
  code: string;

  startDate: Date;
  endDate: Date;

  status?: AcademicYearStatus;

  description?: string;

  sortOrder?: number;
}

export interface UpdateAcademicYearDTO {
  name?: string;
  code?: string;

  startDate?: Date;
  endDate?: Date;

  status?: AcademicYearStatus;

  description?: string | null;

  sortOrder?: number;
}

/* -------------------------------------------------------------------------- */
/*                            Repository Inputs                                */
/* -------------------------------------------------------------------------- */

export interface AcademicYearRepositoryCreateInput {
  name: string;
  code: string;

  startDate: Date;
  endDate: Date;

  status: AcademicYearStatus;

  description?: string | null;

  sortOrder?: number;
}

export interface AcademicYearRepositoryUpdateInput {
  name?: string;
  code?: string;

  startDate?: Date;
  endDate?: Date;

  status?: AcademicYearStatus;

  description?: string | null;

  sortOrder?: number;
}

/* -------------------------------------------------------------------------- */
/*                                  Filters                                   */
/* -------------------------------------------------------------------------- */

export interface AcademicYearFilters {
  search?: string;

  status?: AcademicYearStatus;

  includeDeleted?: boolean;
}

/* -------------------------------------------------------------------------- */
/*                                  Sorting                                   */
/* -------------------------------------------------------------------------- */

export type AcademicYearSortField =
  | "name"
  | "code"
  | "startDate"
  | "endDate"
  | "status"
  | "sortOrder"
  | "createdAt"
  | "updatedAt";

export type SortOrder = "asc" | "desc";

/* -------------------------------------------------------------------------- */
/*                                Pagination                                  */
/* -------------------------------------------------------------------------- */

export interface PaginationOptions {
  page: number;
  limit: number;

  sortBy?: AcademicYearSortField;
  sortOrder?: SortOrder;
}

export type AcademicYearQueryOptions = PaginationOptions & AcademicYearFilters;

/* -------------------------------------------------------------------------- */
/*                              API Responses                                 */
/* -------------------------------------------------------------------------- */

export interface PaginationMeta {
  page: number;
  limit: number;

  total: number;
  totalPages: number;

  hasNextPage: boolean;
  hasPreviousPage: boolean;
}

export interface PaginationResponse<T> {
  data: T[];
  meta: PaginationMeta;
}

export interface SearchResponse<T> {
  query: string;

  results: T[];

  total: number;
}

/* -------------------------------------------------------------------------- */
/*                          Repository Responses                              */
/* -------------------------------------------------------------------------- */

export interface AcademicYearListResponse {
  data: AcademicYearDTO[];

  meta: PaginationMeta;
}

/* -------------------------------------------------------------------------- */
/*                           Service Return Types                             */
/* -------------------------------------------------------------------------- */

export interface AcademicYearOperationResult {
  success: boolean;

  message: string;

  data?: AcademicYearDTO;
}

export interface AcademicYearDeleteResult {
  success: boolean;

  deletedId: string;
}

/* -------------------------------------------------------------------------- */
/*                         Active Academic Year                               */
/* -------------------------------------------------------------------------- */

export interface ActiveAcademicYearResponse {
  academicYear: AcademicYearDTO | null;
}

/* -------------------------------------------------------------------------- */
/*                              Search Result                                 */
/* -------------------------------------------------------------------------- */

export type AcademicYearSearchResult = SearchResponse<AcademicYearDTO>;

/* -------------------------------------------------------------------------- */
/*                         Archive / Activate DTO                             */
/* -------------------------------------------------------------------------- */

export interface ArchiveAcademicYearDTO {
  id: string;
}

export interface ActivateAcademicYearDTO {
  id: string;
}

/* -------------------------------------------------------------------------- */
/*                            Soft Delete DTO                                 */
/* -------------------------------------------------------------------------- */

export interface SoftDeleteAcademicYearDTO {
  id: string;
}