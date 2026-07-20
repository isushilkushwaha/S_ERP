import { useQuery } from "@tanstack/react-query";

import { getEnrollments } from "../api/student-enrollments.api";
import type { EnrollmentQuery } from "../types/enrollment";

export const enrollmentKeys = {
  all: ["student-enrollments"] as const,

  lists: () => [...enrollmentKeys.all, "list"] as const,

  list: (params?: EnrollmentQuery) =>
    [...enrollmentKeys.lists(), params] as const,
};

export function useStudentEnrollments(
  params?: EnrollmentQuery
) {
  return useQuery({
    queryKey: enrollmentKeys.list(params),
    queryFn: () => getEnrollments(params),

    placeholderData: (previousData) => previousData,

    staleTime: 1000 * 60 * 5, // 5 minutes
  });
}