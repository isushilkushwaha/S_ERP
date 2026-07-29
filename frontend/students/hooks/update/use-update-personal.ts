import { useMutation, useQueryClient } from "@tanstack/react-query";

import { personalApi } from "../../api/update/personal.api";
import { studentQueryKeys } from "../query-keys";

import type {
  Student,
  UpdatePersonalRequest,
} from "../../types";

export function useUpdatePersonal() {
  const queryClient = useQueryClient();

  return useMutation<
    any,
    Error,
    {
      id: string;
      payload: UpdatePersonalRequest;
    }
  >({
    mutationFn: ({ id, payload }) =>
      personalApi.updatePersonal(id, payload),

    onSuccess: async (response) => {
      const updatedStudent: Student =
        response?.data ?? response;

      if (!updatedStudent?.id) return;

      // Remove setQueryData for now

      // Refresh student detail
      await queryClient.invalidateQueries({
        queryKey: studentQueryKeys.detail(updatedStudent.id),
      });

      // Refresh students list
      await queryClient.invalidateQueries({
        queryKey: studentQueryKeys.lists(),
      });
    },
  });
}