import { useQuery } from "@tanstack/react-query";
import { classApi } from "../api/class.api";
import { CLASS_QUERY_KEYS } from "../constants/query-keys";

export function useClass(id: string) {
  return useQuery({
    queryKey: CLASS_QUERY_KEYS.detail(id),
    queryFn: () => classApi.getById(id),
    enabled: Boolean(id),
  });
}