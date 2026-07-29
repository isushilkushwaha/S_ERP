import { apiClient } from "@/lib/api-client";

import type {
  RemoveStudentRequest,
  RemoveStudentResponse,
} from "../types/remove-student";

export const removeStudentApi = {
  async removeStudent(
    payload: RemoveStudentRequest
  ): Promise<RemoveStudentResponse> {
    return apiClient.post(
      "/api/students/remove",
      payload
    );
  },
};