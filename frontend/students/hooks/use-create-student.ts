import {
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";

import { studentsApi } from "../api";
import { studentQueryKeys } from "./query-keys";

import type {
  CreateStudentRequest,
} from "../types";

export function useCreateStudent() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: CreateStudentRequest) =>
      studentsApi.createStudent(payload),

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: studentQueryKeys.lists(),
      });
    },
  });
}