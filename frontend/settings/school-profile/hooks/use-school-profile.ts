import { useQuery } from "@tanstack/react-query";

import { schoolProfileApi } from "../api/school-profile.api";
import { schoolProfileQueryKeys } from "./query-keys";

export function useSchoolProfile() {
  return useQuery({
    queryKey: schoolProfileQueryKeys.detail(),
    queryFn: schoolProfileApi.getSchoolProfile,
  });
}