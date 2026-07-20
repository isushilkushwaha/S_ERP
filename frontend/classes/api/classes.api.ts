import { apiClient } from "@/lib/api-client";

import type {
  Class,
  ClassListResponse,
  ClassQuery,
  ClassResponse,
} from "../types/class";

export async function getClasses(
  params?: ClassQuery
): Promise<ClassListResponse> {
  const query = params?.academicYearId
    ? `?academicYearId=${params.academicYearId}`
    : "";

  return apiClient.get<ClassListResponse>(
    `/api/classes${query}`
  );
}

export async function getClassById(
  id: string
): Promise<Class> {
  const response =
    await apiClient.get<ClassResponse>(
      `/api/classes/${id}`
    );

  return response.data;
}