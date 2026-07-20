"use client";

import { useMemo, useState } from "react";

import { useEnrollments } from "../api/student-enrollments.query";
import { EnrollmentQuery } from "../types/enrollment";

export function useStudentEnrollmentTable() {
  const [query, setQuery] = useState<EnrollmentQuery>({
    page: 1,
    limit: 10,
    search: "",
    academicYearId: undefined,
    classId: undefined,
    sectionId: undefined,
    enrollmentStatus: undefined,
  });

  const enrollmentsQuery = useEnrollments(query);

  const enrollments = useMemo(
    () => enrollmentsQuery.data?.data ?? [],
    [enrollmentsQuery.data]
  );

  const pagination = useMemo(
    () => ({
      page: enrollmentsQuery.data?.page ?? 1,
      limit: enrollmentsQuery.data?.limit ?? 10,
      total: enrollmentsQuery.data?.total ?? 0,
      totalPages: enrollmentsQuery.data?.totalPages ?? 1,
    }),
    [enrollmentsQuery.data]
  );

  return {
    query,
    setQuery,

    enrollments,

    pagination,

    isLoading: enrollmentsQuery.isLoading,

    isFetching: enrollmentsQuery.isFetching,

    error: enrollmentsQuery.error,

    refetch: enrollmentsQuery.refetch,
  };
}