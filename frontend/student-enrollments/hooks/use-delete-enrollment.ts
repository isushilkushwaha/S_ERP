"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";

import { deleteEnrollment } from "../api/student-enrollments.api";

interface UseDeleteEnrollmentOptions {
  onSuccess?: () => void;
  onError?: (error: Error) => void;
}

export function useDeleteEnrollment(
  options?: UseDeleteEnrollmentOptions
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => deleteEnrollment(id),

    onSuccess: async () => {
      // Refresh enrollment list
      await queryClient.invalidateQueries({
        queryKey: ["student-enrollments"],
      });

      // Remove any cached enrollment details
      await queryClient.invalidateQueries({
        queryKey: ["student-enrollment"],
      });

      options?.onSuccess?.();
    },

    onError: (error: Error) => {
      console.error("Delete Enrollment Error:", error);

      options?.onError?.(error);
    },
  });
}