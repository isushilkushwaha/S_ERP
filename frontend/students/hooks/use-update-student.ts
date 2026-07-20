import {
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";

import { studentsApi } from "../api";
import { studentQueryKeys } from "./query-keys";

import type {
  UpdateStudentRequest,
} from "../types";

interface UpdateStudentPayload {
  studentId: string;
  payload: UpdateStudentRequest;
}

export function useUpdateStudent() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      studentId,
      payload,
    }: UpdateStudentPayload) =>
      studentsApi.updateStudent(studentId, payload),

    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: studentQueryKeys.lists(),
      });

      queryClient.invalidateQueries({
        queryKey: studentQueryKeys.detail(
          variables.studentId
        ),
      });
    },
  });
}