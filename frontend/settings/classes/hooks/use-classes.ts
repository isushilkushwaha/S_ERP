import { useQuery } from "@tanstack/react-query";
import { classApi } from "../api/class.api";
import { CLASS_QUERY_KEYS } from "../constants/query-keys";
import { Status } from "../types/class";

export function useClasses(status?: Status) {
  return useQuery({
    queryKey: CLASS_QUERY_KEYS.list(status),
    queryFn: () => classApi.getAll(status),
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
}