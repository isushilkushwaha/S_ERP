// use-school-profile-mutation.ts
import { useMutation, useQueryClient } from "@tanstack/react-query";

import { schoolProfileApi } from "../api/school-profile.api";
import { schoolProfileQueryKeys } from "./query-keys";

/**
 * Hook to create initial School Profile and invalidate profile query cache.
 */
export function useCreateSchoolProfile() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: schoolProfileApi.createSchoolProfile,

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: schoolProfileQueryKeys.all,
      });
    },
  });
}

/**
 * Hook to update School Profile (including admissionPrefix) and invalidate profile query cache.
 */
export function useUpdateSchoolProfile() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: schoolProfileApi.updateSchoolProfile,

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: schoolProfileQueryKeys.all,
      });
    },
  });
}