import { useMutation, useQueryClient } from "@tanstack/react-query";

import {
  archiveAcademicYear,
  ACADEMIC_YEAR_QUERY_KEYS,
} from "@/frontend/settings/academic-years";

export function useArchiveAcademicYear() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => archiveAcademicYear(id),

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