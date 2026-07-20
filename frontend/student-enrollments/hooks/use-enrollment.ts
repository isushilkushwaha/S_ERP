"use client";

import { useQuery } from "@tanstack/react-query";

import { getEnrollmentById } from "../api/student-enrollments.api";

import { StudentEnrollment } from "../types/enrollment";

export const enrollmentKeys = {
  all: ["student-enrollments"] as const,

  lists: () => [...enrollmentKeys.all, "list"] as const,

  list: (params?: Record<string, unknown>) =>
    [...enrollmentKeys.lists(), params] as const,

  details: () => [...enrollmentKeys.all, "detail"] as const,

  detail: (id: string) =>
    [...enrollmentKeys.details(), id] as const,
};

interface UseEnrollmentOptions {
  enabled?: boolean;

  staleTime?: number;

  gcTime?: number;
}

export function useEnrollment(
  id?: string,
  options?: UseEnrollmentOptions
) {
  return useQuery<StudentEnrollment>({
    queryKey: enrollmentKeys.detail(id ?? ""),

    queryFn: () => getEnrollmentById(id!),

    enabled: Boolean(id) && (options?.enabled ?? true),

    staleTime: options?.staleTime ?? 5 * 60 * 1000,

    gcTime: options?.gcTime ?? 10 * 60 * 1000,

    retry: 1,

    refetchOnWindowFocus: false,

    refetchOnReconnect: true,

    refetchOnMount: true,
  });
}