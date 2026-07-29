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

  return params.toString();
}