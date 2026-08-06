// frontend/settings/classes/hooks/use-occupancy.ts

import { useQuery } from "@tanstack/react-query";
import { occupancyApi } from "../api/occupancy.api";
import { CLASS_QUERY_KEYS } from "../constants/query-keys";

export function useOccupancy(classId: string, academicYearId?: string) {
  return useQuery({
    queryKey: [...CLASS_QUERY_KEYS.occupancy(classId), academicYearId],
    queryFn: () => occupancyApi.getClassOccupancy(classId, academicYearId), // ✅ Passes academicYearId to API
    enabled: Boolean(classId),
    refetchInterval: 1000 * 30, // Auto-refresh every 30 seconds for live seating reports
  });
}