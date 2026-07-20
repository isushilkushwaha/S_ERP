import {
  keepPreviousData,
  useQuery,
} from "@tanstack/react-query";

import { studentsApi } from "./students.api";

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

export function useStudents(
  filters: StudentFilters
) {
  return useQuery({
    queryKey: studentQueryKeys.list(filters),

    queryFn: () =>
      studentsApi.getStudents(filters),

    placeholderData: keepPreviousData,

    staleTime: 1000 * 60 * 5,
  });
}

export function useStudent(studentId: string) {
  return useQuery({
    queryKey: studentQueryKeys.detail(studentId),

    queryFn: () =>
      studentsApi.getStudent(studentId),

    enabled: !!studentId,

    staleTime: 1000 * 60 * 5,
  });
}