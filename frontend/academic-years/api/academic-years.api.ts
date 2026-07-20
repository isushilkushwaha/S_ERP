import { apiClient } from "@/lib/api-client";

import type {
  AcademicYear,
  AcademicYearListResponse,
  AcademicYearQuery,
  CreateAcademicYearRequest,
  UpdateAcademicYearRequest,
} from "../types/academic-year";

export async function getAcademicYears(
  params?: AcademicYearQuery
): Promise<AcademicYearListResponse> {
  const query = params
    ? new URLSearchParams(
        Object.entries(params)
          .filter(([, value]) => value !== undefined && value !== null)
          .reduce<Record<string, string>>((acc, [key, value]) => {
            acc[key] = String(value);
            return acc;
          }, {})
      ).toString()
    : "";

  return apiClient.get<AcademicYearListResponse>(
    `/api/academic-years${query ? `?${query}` : ""}`
  );
}

export async function getAcademicYearById(
  id: string
): Promise<AcademicYear> {
  return apiClient.get<AcademicYear>(
    `/api/academic-years/${id}`
  );
}

export async function createAcademicYear(
  data: CreateAcademicYearRequest
): Promise<AcademicYear> {
  return apiClient.post<AcademicYear>(
    "/api/academic-years",
    data
  );
}

export async function updateAcademicYear(
  id: string,
  data: UpdateAcademicYearRequest
): Promise<AcademicYear> {
  return apiClient.patch<AcademicYear>(
    `/api/academic-years/${id}`,
    data
  );
}

export async function deleteAcademicYear(
  id: string
): Promise<void> {
  await apiClient.delete<void>(
    `/api/academic-years/${id}`
  );
}

export async function getCurrentAcademicYear(): Promise<AcademicYear> {
  return apiClient.get<AcademicYear>(
    "/api/academic-years/current"
  );
}