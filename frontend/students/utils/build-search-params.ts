// frontend/students/utils/build-search-params.ts

import type { StudentFilters } from "../types";

export function buildStudentSearchParams(
  filters: StudentFilters
): string {
  const params = new URLSearchParams();

  params.set("page", String(filters.page));
  params.set("limit", String(filters.limit));

  if (filters.search?.trim()) {
    params.set("search", filters.search.trim());
  }

  if (filters.academicYearId) {
    params.set("academicYearId", filters.academicYearId);
  }

  if (filters.classId) {
    params.set("classId", filters.classId);
  }

  if (filters.sectionId) {
    params.set("sectionId", filters.sectionId);
  }

  if (filters.status) {
    params.set("status", filters.status);
  }

  return params.toString();
}