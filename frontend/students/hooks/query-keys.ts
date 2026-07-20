// frontend/students/hooks/query-keys.ts

import type { StudentFilters } from "../types";

export const studentQueryKeys = {
  all: ["students"] as const,

  lists: () => [...studentQueryKeys.all, "list"] as const,

  list: (filters: StudentFilters) =>
    [...studentQueryKeys.lists(), filters] as const,

  details: () =>
    [...studentQueryKeys.all, "detail"] as const,

  detail: (studentId: string) =>
    [...studentQueryKeys.details(), studentId] as const,
};