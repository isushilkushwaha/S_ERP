import { useMutation, useQueryClient } from "@tanstack/react-query";

import {
  deleteAcademicYear,
  ACADEMIC_YEAR_QUERY_KEYS,
  type DeleteAcademicYearResponse,
} from "@/frontend/settings/academic-years";

export function useDeleteAcademicYear() {
  const queryClient = useQueryClient();

  return useMutation<DeleteAcademicYearResponse, Error, string>({
    mutationFn: deleteAcademicYear,

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