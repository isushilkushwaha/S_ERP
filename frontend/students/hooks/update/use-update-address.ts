import { useMutation, useQueryClient } from "@tanstack/react-query";

import { addressApi } from "../../api/update/address.api";
import { studentQueryKeys } from "../query-keys";

import type { Student } from "../../types/student";
import type { AddressFormValues } from "../../schemas/update/address-schema";

export function useUpdateAddress() {
  const queryClient = useQueryClient();

  return useMutation<
    Student,
    Error,
    {
      id: string;
      payload: AddressFormValues;
    }
  >({
    mutationFn: ({ id, payload }) =>
      addressApi.updateAddress(
        id,
        payload as Partial<Student>
      ),

    onSuccess: async (updatedStudent) => {
      if (!updatedStudent?.id) return;

      // Refresh current student details
      await queryClient.invalidateQueries({
        queryKey: studentQueryKeys.detail(updatedStudent.id),
      });

      // Refresh students list
      await queryClient.invalidateQueries({
        queryKey: studentQueryKeys.lists(),
      });
    },
  });
}