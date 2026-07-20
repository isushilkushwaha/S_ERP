// import { useQuery, type UseQueryOptions } from "@tanstack/react-query";

// import {
//   getAcademicYearById,
//   getAcademicYears,
// } from "./academic-years.api";

// import type {
//   AcademicYear,
//   AcademicYearListResponse,
//   AcademicYearQuery,
// } from "../types/academic-year";

// /**
//  * Query Keys
//  */
// export const academicYearKeys = {
//   all: ["academic-years"] as const,

//   lists: () => [...academicYearKeys.all, "list"] as const,

//   list: (params?: AcademicYearQuery) =>
//     [...academicYearKeys.lists(), params] as const,

//   details: () => [...academicYearKeys.all, "detail"] as const,

//   detail: (id: string) =>
//     [...academicYearKeys.details(), id] as const,
// };

// /**
//  * Get Academic Years
//  */
// export function useAcademicYears(
//   params?: AcademicYearQuery,
//   options?: Omit<
//     UseQueryOptions<
//       AcademicYearListResponse,
//       Error,
//       AcademicYearListResponse,
//       ReturnType<typeof academicYearKeys.list>
//     >,
//     "queryKey" | "queryFn"
//   >
// ) {
//   return useQuery({
//     queryKey: academicYearKeys.list(params),
//     queryFn: () => getAcademicYears(params),

//     staleTime: 5 * 60 * 1000,
//     gcTime: 10 * 60 * 1000,

//     ...options,
//   });
// }

// /**
//  * Get Single Academic Year
//  */
// export function useAcademicYear(
//   id: string,
//   options?: Omit<
//     UseQueryOptions<
//       AcademicYear,
//       Error,
//       AcademicYear,
//       ReturnType<typeof academicYearKeys.detail>
//     >,
//     "queryKey" | "queryFn"
//   >
// ) {
//   return useQuery({
//     queryKey: academicYearKeys.detail(id),
//     queryFn: () => getAcademicYearById(id),

//     enabled: Boolean(id),

//     staleTime: 5 * 60 * 1000,
//     gcTime: 10 * 60 * 1000,

//     ...options,
//   });
// }

import { useQuery, type UseQueryOptions } from "@tanstack/react-query";

import {
  getAcademicYearById,
  getAcademicYears,
} from "./academic-years.api";

import type {
  AcademicYear,
  AcademicYearListResponse,
  AcademicYearQuery,
} from "../types/academic-year";

/**
 * Query Keys
 */
export const academicYearKeys = {
  all: ["academic-years"] as const,

  lists: () => [...academicYearKeys.all, "list"] as const,

  list: (params?: AcademicYearQuery) =>
    [...academicYearKeys.lists(), params] as const,

  details: () => [...academicYearKeys.all, "detail"] as const,

  detail: (id?: string) =>
    [...academicYearKeys.details(), id ?? ""] as const,
};

/**
 * Get Academic Years
 */
export function useAcademicYears(
  params?: AcademicYearQuery,
  options?: Omit<
    UseQueryOptions<
      AcademicYearListResponse,
      Error,
      AcademicYearListResponse,
      ReturnType<typeof academicYearKeys.list>
    >,
    "queryKey" | "queryFn"
  >
) {
  return useQuery({
    queryKey: academicYearKeys.list(params),
    queryFn: () => getAcademicYears(params),

    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,

    ...options,
  });
}

/**
 * Get Single Academic Year
 */
export function useAcademicYear(
  id?: string,
  options?: Omit<
    UseQueryOptions<
      AcademicYear,
      Error,
      AcademicYear,
      ReturnType<typeof academicYearKeys.detail>
    >,
    "queryKey" | "queryFn"
  >
) {
  return useQuery({
    queryKey: academicYearKeys.detail(id),
    queryFn: () => getAcademicYearById(id!),

    enabled: !!id,

    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,

    ...options,
  });
}