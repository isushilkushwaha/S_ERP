import { apiClient } from "@/lib/api-client";

import type {
  Student,
  UpdateStudentRequest,
} from "../../types";

export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
}

export const parentApi = {
  updateParent(
    id: string,
    payload: UpdateStudentRequest,
  ) {
    return apiClient.patch<ApiResponse<Student>>(
      `/api/students/${id}/parent`,
      payload,
    );
  },
};