// frontend/students/types/filters.ts

import type { StudentStatus } from "./student";

export interface StudentFilters {
  page: number;
  limit: number;

  search?: string;

  academicYearId?: string;
  classId?: string;
  sectionId?: string;

  status?: StudentStatus;
}