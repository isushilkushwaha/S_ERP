import { useMutation, useQueryClient } from "@tanstack/react-query";
import { classApi } from "../api/class.api";
import { CLASS_QUERY_KEYS } from "../constants/query-keys";
import { CreateClassPayload } from "../types/class";

export function useCreateClass() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: CreateClassPayload) => classApi.create(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: CLASS_QUERY_KEYS.all });
    },
  });
}