import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

import { studentsApi } from "../api";
import { studentQueryKeys } from "./query-keys";

export function useUploadStudentPhoto(id: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (file: File) =>
      studentsApi.uploadPhoto(id, file),

    onSuccess: () => {
      toast.success("Photo updated successfully.");

      queryClient.invalidateQueries({
        queryKey: studentQueryKeys.detail(id),
      });
    },

    onError: (error: Error) => {
      toast.error(error.message);
    },
  });
}