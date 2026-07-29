import { useMutation, useQueryClient } from "@tanstack/react-query";

import { parentApi } from "../../api/update/parent.api";
import { studentQueryKeys } from "../query-keys";

import type {
  Student,
  UpdateStudentRequest,
  ApiResponse,
} from "../../types";

export function useUpdateParent() {
  const queryClient = useQueryClient();

  return useMutation<
    ApiResponse<Student>,
    Error,
    {
      studentId: string;
      payload: UpdateStudentRequest;
    }
  >({
    mutationFn: ({ studentId, payload }) =>
      parentApi.updateParent(studentId, payload),

    onSuccess: async (response) => {
      const updatedStudent = response.data;

      if (!updatedStudent?.id) return;

      // Refresh the current student detail
      await queryClient.invalidateQueries({
        queryKey: studentQueryKeys.detail(updatedStudent.id),
      });

      // Refresh the student list
      await queryClient.invalidateQueries({
        queryKey: studentQueryKeys.lists(),
      });
    },
  });
}