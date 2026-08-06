import { useMutation, useQueryClient } from "@tanstack/react-query";
import { classApi } from "../api/class.api";
import { CLASS_QUERY_KEYS } from "../constants/query-keys";
import { UpdateClassPayload } from "../types/class";

interface UpdateClassParams {
  id: string;
  payload: UpdateClassPayload;
}

export function useUpdateClass() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, payload }: UpdateClassParams) => classApi.update(id, payload),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: CLASS_QUERY_KEYS.lists() });
      queryClient.invalidateQueries({ queryKey: CLASS_QUERY_KEYS.detail(variables.id) });
    },
  });
}