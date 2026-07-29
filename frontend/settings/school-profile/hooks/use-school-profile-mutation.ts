import { useMutation, useQueryClient } from "@tanstack/react-query";

import { schoolProfileApi } from "../api/school-profile.api";
import { schoolProfileQueryKeys } from "./query-keys";

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