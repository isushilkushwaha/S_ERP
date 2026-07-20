import { AcademicYearStatus } from "@prisma/client";

export interface AcademicYearQuery {
  search?: string;

  status?: AcademicYearStatus;

  page?: number;

  limit?: number;
}

export interface AcademicYearListItem {
  id: string;

  name: string;

  startDate: Date;

  endDate: Date;

  isCurrent: boolean;

  status: AcademicYearStatus;

  createdAt: Date;

  updatedAt: Date;
}

export interface AcademicYearPaginationResult {
  data: AcademicYearListItem[];

  total: number;

  page: number;

  limit: number;

  totalPages: number;
}