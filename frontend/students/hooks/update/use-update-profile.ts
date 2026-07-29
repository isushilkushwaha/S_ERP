import { useMutation, useQueryClient } from "@tanstack/react-query";

import { profileApi } from "../../api/update/profile.api";
import { studentQueryKeys } from "../query-keys";

import type {
  Student,
  UpdateProfileRequest,
} from "../../types/student";

export function useUpdateProfile() {
  const queryClient = useQueryClient();

  return useMutation<
    Student,
    Error,
    {
      id: string;
      payload: UpdateProfileRequest;
    }
  >({
    mutationFn: ({ id, payload }) =>
      profileApi.updateProfile(id, payload),

    onSuccess: async (updatedStudent) => {
      // Refresh the student details
      await queryClient.invalidateQueries({
        queryKey: studentQueryKeys.detail(updatedStudent.id),
      });

      // Refresh the students list
      await queryClient.invalidateQueries({
        queryKey: studentQueryKeys.lists(),
      });
    },
  });
}