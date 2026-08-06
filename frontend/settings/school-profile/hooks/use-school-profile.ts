// use-school-profile.ts
import { useQuery } from "@tanstack/react-query";

import { schoolProfileApi } from "../api/school-profile.api";
import { schoolProfileQueryKeys } from "./query-keys";

/**
 * Hook to fetch active School Profile including admissionPrefix.
 */
export function useSchoolProfile() {
  return useQuery({
    queryKey: schoolProfileQueryKeys.detail(),
    queryFn: schoolProfileApi.getSchoolProfile,
  });
}