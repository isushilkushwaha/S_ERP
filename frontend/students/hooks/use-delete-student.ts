import {
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";

import { studentsApi } from "../api";
import { studentQueryKeys } from "./query-keys";

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