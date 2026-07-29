"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";

import { updateRegistration } from "../../api/update/update-registration";
import { studentQueryKeys } from "../query-keys";
import { RegistrationFormValues } from "../../schemas/update/registration-schema";
import type { Student } from "../../types/student";

interface UpdateRegistrationVariables {
  studentId: string;
  data: RegistrationFormValues;
}

export function useUpdateRegistration() {
  const queryClient = useQueryClient();

  return useMutation<
    Student,
    Error,
    UpdateRegistrationVariables
  >({
    mutationFn: ({ studentId, data }) =>
      updateRegistration(studentId, data),

    onSuccess: (updatedStudent, variables) => {
      // Refresh student profile
      queryClient.invalidateQueries({
        queryKey: studentQueryKeys.detail(
          variables.studentId,
        ),
      });

      // Refresh student list (in case the table displays these fields)
      queryClient.invalidateQueries({
        queryKey: studentQueryKeys.lists(),
      });

      // Optional: update cache immediately
      queryClient.setQueryData(
        studentQueryKeys.detail(variables.studentId),
        updatedStudent,
      );
    },
  });
}