"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { createEnrollment } from "../api/student-enrollments.api";

import type {
  CreateEnrollmentRequest,
  StudentEnrollment,
} from "../types/enrollment";

export function useCreateEnrollmentMutation() {
  const queryClient = useQueryClient();

  return useMutation<
    StudentEnrollment,
    Error,
    CreateEnrollmentRequest
  >({
    mutationFn: createEnrollment,

    onSuccess: async () => {
      toast.success("Enrollment created successfully.");

      await Promise.all([
        queryClient.invalidateQueries({
          queryKey: ["student-enrollments"],
        }),

        queryClient.invalidateQueries({
          queryKey: ["students"],
        }),
      ]);
    },

    onError: (error) => {
      toast.error(
        error.message || "Failed to create enrollment."
      );
    },
  });
}