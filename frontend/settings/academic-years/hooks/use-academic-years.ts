import { useQuery } from "@tanstack/react-query";

import { getAcademicYears } from "../api/academic-years.api";
import {
  ACADEMIC_YEAR_QUERY_KEYS,
  DEFAULT_ACADEMIC_YEAR_QUERY,
} from "../constants";
import type {
  AcademicYearListResponse,
  AcademicYearQueryParams,
} from "../types/academic-year";

export function useAcademicYears(
  params?: Partial<AcademicYearQueryParams>
) {
  const query: AcademicYearQueryParams = {
    ...DEFAULT_ACADEMIC_YEAR_QUERY,
    ...params,
  };

  return useQuery<AcademicYearListResponse>({
    queryKey: ACADEMIC_YEAR_QUERY_KEYS.list(query),

    queryFn: () => getAcademicYears(query),

    placeholderData: (previousData) => previousData,

    staleTime: 1000 * 60 * 5, // 5 minutes

    gcTime: 1000 * 60 * 10, // 10 minutes
  });
}