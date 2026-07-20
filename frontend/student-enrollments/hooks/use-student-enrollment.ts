import { useQuery } from "@tanstack/react-query";

import { getEnrollmentById } from "../api/student-enrollments.api";

export const enrollmentKeys = {
  all: ["student-enrollments"] as const,

  lists: () => [...enrollmentKeys.all, "list"] as const,

  list: (params?: unknown) =>
    [...enrollmentKeys.lists(), params] as const,

  details: () => [...enrollmentKeys.all, "detail"] as const,

  detail: (id: string) =>
    [...enrollmentKeys.details(), id] as const,
};

interface UseStudentEnrollmentOptions {
  enabled?: boolean;
}

export function useStudentEnrollment(
  id?: string,
  options?: UseStudentEnrollmentOptions
) {
  return useQuery({
    queryKey: enrollmentKeys.detail(id ?? ""),
    queryFn: () => getEnrollmentById(id!),
    enabled: !!id && (options?.enabled ?? true),
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
}