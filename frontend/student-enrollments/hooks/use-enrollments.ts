"use client";

import { useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { getEnrollments } from "../api/student-enrollments.api";

import type {
  EnrollmentListResponse,
  EnrollmentQuery,
} from "../types/enrollment";

export const enrollmentKeys = {
  all: ["student-enrollments"] as const,

  lists: () =>
    [...enrollmentKeys.all, "list"] as const,

  list: (query: EnrollmentQuery) =>
    [...enrollmentKeys.lists(), query] as const,

  details: () =>
    [...enrollmentKeys.all, "detail"] as const,

  detail: (id: string) =>
    [...enrollmentKeys.details(), id] as const,
};

const DEFAULT_QUERY: EnrollmentQuery = {
  page: 1,
  limit: 10,
  search: "",
  academicYearId: "",
  classId: "",
  sectionId: "",
  enrollmentStatus: undefined,
};

export function useEnrollments(
  filters?: Partial<EnrollmentQuery>
) {
  const query = useMemo<EnrollmentQuery>(
    () => ({
      ...DEFAULT_QUERY,
      ...filters,
    }),
    [filters]
  );

  return useQuery<EnrollmentListResponse>({
    queryKey: enrollmentKeys.list(query),

    queryFn: () => getEnrollments(query),

    staleTime: 1000 * 60 * 5,

    gcTime: 1000 * 60 * 10,

    retry: 1,

    refetchOnWindowFocus: false,

    placeholderData: (previousData) => previousData,
  });
}