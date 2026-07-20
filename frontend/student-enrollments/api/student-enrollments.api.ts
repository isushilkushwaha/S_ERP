import { apiClient } from "@/lib/api-client";

import type {
  CreateEnrollmentRequest,
  EnrollmentListResponse,
  EnrollmentQuery,
  EnrollmentResponse,
  StudentEnrollment,
  UpdateEnrollmentRequest,
} from "../types/enrollment";

/**
 * Build query string from filter object
 */
function buildQuery(params?: EnrollmentQuery): string {
  if (!params) return "";

  const searchParams = new URLSearchParams();

  Object.entries(params).forEach(([key, value]) => {
    if (
      value !== undefined &&
      value !== null &&
      value !== ""
    ) {
      searchParams.append(key, String(value));
    }
  });

  const query = searchParams.toString();

  return query ? `?${query}` : "";
}

/**
 * Get all enrollments
 */
export async function getEnrollments(
  params?: EnrollmentQuery
): Promise<EnrollmentListResponse> {
  return apiClient.get<EnrollmentListResponse>(    
    `/api/student-enrollments${buildQuery(params)}`                                                             
  );
}

/**
 * Get enrollment by ID
 */
export async function getEnrollmentById(
  id: string
): Promise<StudentEnrollment> {
  const response = await apiClient.get<EnrollmentResponse>(
    `/api/student-enrollments/${id}`
  );

  return response.data;
}

/**
 * Create enrollment
 */
export async function createEnrollment(
  data: CreateEnrollmentRequest
): Promise<StudentEnrollment> {
  const response = await apiClient.post<EnrollmentResponse>(
    "/api/student-enrollments",
    data
  );

  return response.data;
}

/**
 * Update enrollment
 */
export async function updateEnrollment(
  id: string,
  data: UpdateEnrollmentRequest
): Promise<StudentEnrollment> {
  const response = await apiClient.patch<EnrollmentResponse>(
    `/api/student-enrollments/${id}`,
    data
  );

  return response.data;
}

/**
 * Delete enrollment
 */
export async function deleteEnrollment(
  id: string
): Promise<void> {
  await apiClient.delete<void>(
    `/api/student-enrollments/${id}`
  );
}



































