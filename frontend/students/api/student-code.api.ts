import { apiClient } from "@/lib/api-client";

export interface NextStudentCodeResponse {
  studentCode: string;
}

export async function getNextStudentCode() {
  return apiClient.get<NextStudentCodeResponse>(
  "/api/students/next-registration-number"
);
}