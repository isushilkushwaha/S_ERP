"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

import { updateEnrollment } from "../api/student-enrollments.api";

import type {
  StudentEnrollment,
  UpdateEnrollmentRequest,
  EnrollmentListResponse,
} from "../types/enrollment";

interface UpdateEnrollmentVariables {
  id: string;
  data: UpdateEnrollmentRequest;
}

export function useUpdateEnrollmentMutation() {
  const queryClient = useQueryClient();

  return useMutation<
    StudentEnrollment,
    Error,
    UpdateEnrollmentVariables
  >({
    mutationFn: ({ id, data }) =>
      updateEnrollment(id, data),

    onSuccess: (updatedEnrollment) => {
      queryClient.setQueryData<StudentEnrollment>(
        ["student-enrollment", updatedEnrollment.id],
        updatedEnrollment
      );

      queryClient.setQueriesData<EnrollmentListResponse>(
        {
          queryKey: ["student-enrollments"],
        },
        (old) => {
          if (!old) return old;

          return {
            ...old,
            data: old.data.map((item) =>
              item.id === updatedEnrollment.id
                ? updatedEnrollment
                : item
            ),
          };
        }
      );

      queryClient.invalidateQueries({
        queryKey: ["student-enrollments"],
      });

      toast.success(
        "Enrollment updated successfully."
      );
    },

    onError: (error) => {
      toast.error(
        error.message ||
          "Failed to update enrollment."
      );
    },
  });
}