import {
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";

import { removeStudentApi } from "../api/remove-student.api";
import { studentQueryKeys } from "./query-keys";

import type {
  RemoveStudentRequest,
  RemoveStudentResponse,
} from "../types/remove-student";

export function useRemoveStudent() {
  const queryClient = useQueryClient();

  return useMutation<
    RemoveStudentResponse,
    Error,
    RemoveStudentRequest
  >({
    mutationFn: (payload) =>
      removeStudentApi.removeStudent(payload),

    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: studentQueryKeys.lists(),
      });
    },
  });
}