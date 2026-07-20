import { useQuery } from "@tanstack/react-query";

import { studentsApi } from "../api";
import { studentQueryKeys } from "./query-keys";

import type { GetStudentResponse } from "../types";

export function useStudent(studentId: string) {
  return useQuery<GetStudentResponse>({
    queryKey: studentQueryKeys.detail(studentId),

    queryFn: () =>
      studentsApi.getStudent(studentId),

    enabled: Boolean(studentId),

    staleTime: 1000 * 60 * 5,
  });
}