import { useMutation, useQueryClient } from "@tanstack/react-query";

import {
  createEnrollment,
  deleteEnrollment,
  updateEnrollment,
} from "./student-enrollments.api";

import type {
  CreateEnrollmentRequest,
  StudentEnrollment,
  UpdateEnrollmentRequest,
} from "../types/enrollment";

const ENROLLMENT_QUERY_KEY = ["student-enrollments"];

interface UpdateEnrollmentVariables {
  id: string;
  data: UpdateEnrollmentRequest;
}

/**
 * Create Enrollment
 */
export function useCreateEnrollment() {
  const queryClient = useQueryClient();

  return useMutation<StudentEnrollment, Error, CreateEnrollmentRequest>({
    mutationFn: createEnrollment,

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ENROLLMENT_QUERY_KEY,
      });
    },
  });
}

/**
 * Update Enrollment
 */
export function useUpdateEnrollment() {
  const queryClient = useQueryClient();

  return useMutation<StudentEnrollment, Error, UpdateEnrollmentVariables>({
    mutationFn: ({ id, data }) => updateEnrollment(id, data),

    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: ENROLLMENT_QUERY_KEY,
      });

      queryClient.invalidateQueries({
        queryKey: [...ENROLLMENT_QUERY_KEY, variables.id],
      });
    },
  });
}

/**
 * Delete Enrollment
 */
export function useDeleteEnrollment() {
  const queryClient = useQueryClient();

  return useMutation<void, Error, string>({
    mutationFn: deleteEnrollment,

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ENROLLMENT_QUERY_KEY,
      });
    },
  });
}