import {
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";

import {
  CreateStudentRequest,
  UpdateStudentRequest,
} from "../types";

import { studentsApi } from "./students.api";
import { studentQueryKeys } from "./students.query";

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

export function useUpdateStudent() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      studentId,
      payload,
    }: {
      studentId: string;
      payload: UpdateStudentRequest;
    }) =>
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

export function useDeleteStudent() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (studentId: string) =>
      studentsApi.deleteStudent(studentId),

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: studentQueryKeys.lists(),
      });
    },
  });
}