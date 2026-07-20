import { useQuery } from "@tanstack/react-query";

import {
  getEnrollmentById,
  getEnrollments,
} from "./student-enrollments.api";

import type { EnrollmentQuery } from "../types/enrollment";

/**
 * React Query Keys
 */
export const enrollmentKeys = {
  all: ["student-enrollments"] as const,

  lists: () => [...enrollmentKeys.all, "list"] as const,

  list: (params?: EnrollmentQuery) =>
    [...enrollmentKeys.lists(), params] as const,

  details: () => [...enrollmentKeys.all, "detail"] as const,

  detail: (id: string) =>
    [...enrollmentKeys.details(), id] as const,
};

/**
 * Get Enrollment List
 */
export function useEnrollments(params?: EnrollmentQuery) {
  return useQuery({
    queryKey: enrollmentKeys.list(params),
    queryFn: () => getEnrollments(params),

    placeholderData: (previousData) => previousData,

    staleTime: 1000 * 60 * 5, // 5 minutes
  });
}

/**
 * Get Single Enrollment
 */
export function useEnrollment(id: string) {
  return useQuery({
    queryKey: enrollmentKeys.detail(id),
    queryFn: () => getEnrollmentById(id),

    enabled: !!id,

    staleTime: 1000 * 60 * 5,
  });
}