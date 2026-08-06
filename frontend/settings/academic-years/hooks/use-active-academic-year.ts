import { useQuery } from "@tanstack/react-query";

import { getActiveAcademicYear } from "../api/academic-years.api";
import { ACADEMIC_YEAR_QUERY_KEYS } from "../constants";
import type { AcademicYear } from "../types/academic-year";

export function useActiveAcademicYear() {
  return useQuery<AcademicYear | null, Error>({
    queryKey: ACADEMIC_YEAR_QUERY_KEYS.active(),

    queryFn: async () => {
      return await getActiveAcademicYear();
    },

    staleTime: 5 * 60 * 1000, // 5 minutes

    gcTime: 10 * 60 * 1000, // 10 minutes

    retry: 1,

    refetchOnWindowFocus: false,

    refetchOnReconnect: true,

    refetchOnMount: true,
  });
}