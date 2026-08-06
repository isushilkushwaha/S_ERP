import { useMutation, useQueryClient } from "@tanstack/react-query";

import {
  updateAcademicYear,
  ACADEMIC_YEAR_QUERY_KEYS,
  type AcademicYear,
  type UpdateAcademicYearRequest,
} from "@/frontend/settings/academic-years";

interface UpdateAcademicYearVariables {
  id: string;
  data: UpdateAcademicYearRequest;
}

export function useUpdateAcademicYear() {
  const queryClient = useQueryClient();

  return useMutation<AcademicYear, Error, UpdateAcademicYearVariables>({
    mutationFn: ({ id, data }) => updateAcademicYear(id, data),

    onSuccess: (academicYear) => {
      queryClient.invalidateQueries({
        queryKey: ACADEMIC_YEAR_QUERY_KEYS.all,
      });

      queryClient.invalidateQueries({
        queryKey: ACADEMIC_YEAR_QUERY_KEYS.detail(academicYear.id),
      });

      queryClient.invalidateQueries({
        queryKey: ACADEMIC_YEAR_QUERY_KEYS.active(),
      });
    },
  });
}