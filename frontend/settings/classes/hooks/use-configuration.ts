import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { configurationApi } from "../api/configuration.api";
import { CLASS_QUERY_KEYS } from "../constants/query-keys";
import { UpdateConfigurationPayload } from "../types/configuration";

export function useConfiguration(classId: string) {
  return useQuery({
    queryKey: CLASS_QUERY_KEYS.configuration(classId),
    queryFn: () => configurationApi.getByClassId(classId),
    enabled: Boolean(classId),
  });
}

export function useUpdateConfiguration() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: UpdateConfigurationPayload) => configurationApi.update(payload),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: CLASS_QUERY_KEYS.configuration(variables.classId) });
      queryClient.invalidateQueries({ queryKey: CLASS_QUERY_KEYS.detail(variables.classId) });
      queryClient.invalidateQueries({ queryKey: CLASS_QUERY_KEYS.occupancy(variables.classId) });
    },
  });
}