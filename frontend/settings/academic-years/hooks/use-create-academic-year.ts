import { useMutation, useQueryClient } from "@tanstack/react-query";

import { createAcademicYear } from "../api/academic-years.api";
import { ACADEMIC_YEAR_QUERY_KEYS } from "../constants";
import type {
  AcademicYear,
  CreateAcademicYearRequest,
} from "../types/academic-year";

export function useCreateAcademicYear() {
  const queryClient = useQueryClient();

  return useMutation<AcademicYear, Error, CreateAcademicYearRequest>({
    mutationFn: createAcademicYear,

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ACADEMIC_YEAR_QUERY_KEYS.all,
      });

      queryClient.invalidateQueries({
        queryKey: ACADEMIC_YEAR_QUERY_KEYS.active(),
      });
    },
  });
}