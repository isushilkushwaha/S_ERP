import { apiClient } from "@/lib/api-client";

import type { Student } from "../../types/student";

export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
}

export const addressApi = {
  async updateAddress(id: string, payload: Partial<Student>): Promise<Student> {
    const response = await apiClient.patch<ApiResponse<Student>>(
      `/api/students/${id}/address`,
      payload
    );

    return response.data?.data ?? response.data;
  },
};