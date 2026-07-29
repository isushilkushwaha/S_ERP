import { apiClient } from "@/lib/api-client";

import type {
  ApiResponse,
  Student,
  UpdateProfileRequest,
} from "../../types";

class ProfileApi {
  async updateProfile(
    id: string,
    payload: UpdateProfileRequest
  ): Promise<Student> {
    const response = await apiClient.patch<ApiResponse<Student>>(
      `/api/students/${id}/profile`,
      payload
    );

    return response.data?.data ?? response.data;
  }
}

export const profileApi = new ProfileApi();