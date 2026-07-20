import { useQuery } from "@tanstack/react-query";

import { getSections } from "../api/sections.api";
import type { SectionQuery } from "../types/section";

export function useSections(filters: SectionQuery = {}) {
  return useQuery({
    queryKey: ["sections", filters],
    queryFn: () => getSections(filters),
  });
}