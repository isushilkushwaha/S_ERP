import fetcher from "./client";
import {
  ClassOccupancyReport,
  AutoAllocationResult,
} from "../types/occupancy";

export const occupancyApi = {
  /**
   * Get occupancy for a class in a specific academic year.
   */
  async getClassOccupancy(
    classId: string,
    academicYearId?: string
  ): Promise<ClassOccupancyReport> {
    const params = new URLSearchParams();

    params.set("classId", classId);

    if (academicYearId) {
      params.set(
        "academicYearId",
        academicYearId
      );
    }

    return fetcher<ClassOccupancyReport>(
      `/api/settings/classes/occupancy?${params.toString()}`
    );
  },

  /**
   * Trigger automatic section allocation.
   */
  async allocateSection(
    classId: string
  ): Promise<AutoAllocationResult> {
    return fetcher<AutoAllocationResult>(
      "/api/settings/classes/auto-allocation",
      {
        method: "POST",
        body: JSON.stringify({
          classId,
        }),
      }
    );
  },
};