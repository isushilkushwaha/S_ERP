import { useMutation, useQueryClient } from "@tanstack/react-query";

import {
  activateAcademicYear,
  ACADEMIC_YEAR_QUERY_KEYS,
} from "@/frontend/settings/academic-years";

export function useActivateAcademicYear() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => activateAcademicYear(id),

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