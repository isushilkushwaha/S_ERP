import { useMutation, useQueryClient } from "@tanstack/react-query";
import { classApi } from "../api/class.api";
import { CLASS_QUERY_KEYS } from "../constants/query-keys";

export function useDeleteClass() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => classApi.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: CLASS_QUERY_KEYS.all });
    },
  });
}