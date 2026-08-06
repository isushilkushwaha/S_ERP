// frontend/students/hooks/update/use-update-personal.ts

import { useMutation, useQueryClient } from "@tanstack/react-query";

import { personalApi } from "../../api/update/personal.api";
import { studentQueryKeys } from "../query-keys";

import type {
  Student,
  UpdatePersonalRequest,
} from "../../types";

interface MutationResponse {
  data?: Student;
  [key: string]: unknown;
}

export function useUpdatePersonal() {
  const queryClient = useQueryClient();

  return useMutation<
    MutationResponse | Student,
    Error,
    {
      id: string;
      payload: UpdatePersonalRequest;
    }
  >({
    mutationFn: ({ id, payload }) =>
      personalApi.updatePersonal(id, payload),

    onSuccess: async (response) => {
      const resp = response as MutationResponse;
      const updatedStudent: Student | undefined =
        resp?.data ?? (response as Student);

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