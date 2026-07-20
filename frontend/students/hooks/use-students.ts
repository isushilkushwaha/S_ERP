// import {
//   keepPreviousData,
//   useQuery,
// } from "@tanstack/react-query";

// import { studentsApi } from "../api";
// import { studentQueryKeys } from "./query-keys";

// import type {
//   GetStudentsResponse,
//   StudentFilters,
// } from "../types";

// // export function useStudents(filters: StudentFilters) {
// //   return useQuery<GetStudentsResponse>({
// //     queryKey: studentQueryKeys.list(filters),

// //     queryFn: () =>
// //       studentsApi.getStudents(filters),

// //     placeholderData: keepPreviousData,

// //     staleTime: 1000 * 60 * 5,
// //   });
// // }

import {
  keepPreviousData,
  useQuery,
} from "@tanstack/react-query";

import { studentsApi } from "../api";
import { studentQueryKeys } from "./query-keys";

import type {
  GetStudentsResponse,
  StudentFilters,
} from "../types";

export function useStudents(filters: StudentFilters) {
  return useQuery<GetStudentsResponse>({
    queryKey: studentQueryKeys.list(filters),

    queryFn: () => studentsApi.getStudents(filters),

    placeholderData: keepPreviousData,

    staleTime: 1000 * 60 * 5,
  });
}