import {
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";

import { configurationApi } from "../api/configuration.api";
import { CLASS_QUERY_KEYS } from "../constants/query-keys";
import {
  UpdateConfigurationPayload,
} from "../types/configuration";

export function useConfiguration(
  academicYearId: string,
  classId: string
) {
  return useQuery({
    queryKey:
      CLASS_QUERY_KEYS.configuration(
        academicYearId,
        classId
      ),

    queryFn: () =>
      configurationApi.getByClassId(
        academicYearId,
        classId
      ),

    enabled:
      Boolean(academicYearId) &&
      Boolean(classId),

    staleTime: 1000 * 60 * 5,
  });
}

export function useUpdateConfiguration() {
  const queryClient =
    useQueryClient();

  return useMutation({
    mutationFn: (
      payload: UpdateConfigurationPayload
    ) =>
      configurationApi.update(payload),

    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey:
          CLASS_QUERY_KEYS.configuration(
            variables.academicYearId,
            variables.classId
          ),
      });

      queryClient.invalidateQueries({
        queryKey:
          CLASS_QUERY_KEYS.detail(
            variables.classId
          ),
      });

      queryClient.invalidateQueries({
        queryKey:
          CLASS_QUERY_KEYS.occupancy(
            variables.classId
          ),
      });
    },
  });
}