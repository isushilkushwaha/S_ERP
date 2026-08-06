import fetcher from "./client";
import { ClassOccupancyReport, AutoAllocationResult } from "../types/occupancy";

export const occupancyApi = {
  /**
   * Get dynamic occupancy report for a class
   */
  async getClassOccupancy(classId: string | undefined, academicYearId: string | undefined): Promise<ClassOccupancyReport> {
    return fetcher<ClassOccupancyReport>(`/api/settings/classes/occupancy?classId=${classId}`);
  },

  /**
   * Trigger auto section allocation engine
   */
  async allocateSection(classId: string): Promise<AutoAllocationResult> {
    return fetcher<AutoAllocationResult>("/api/settings/classes/auto-allocation", {
      method: "POST",
      body: JSON.stringify({ classId }),
    });
  },
};