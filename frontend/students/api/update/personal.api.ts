

// api/update/personal.api.ts
import { apiClient } from "@/lib/api-client"; // or wherever your apiClient is
import type { Student, UpdatePersonalRequest } from "../../types/student";

export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
}

export const personalApi = {
  async updatePersonal(id: string, payload: UpdatePersonalRequest): Promise<Student> {
    const response = await apiClient.patch<ApiResponse<Student>>(
      `/api/students/${id}/personal`,
      payload
    );
    
    // If your apiClient returns AxiosResponse or raw fetch JSON wrapper, return response.data.data or response.data:
    return response.data?.data ?? response.data;
  },
};