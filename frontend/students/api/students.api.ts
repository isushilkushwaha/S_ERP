// frontend/students/api/students.api.ts

import { apiClient } from "@/lib/api-client";

import type {
  CreateStudentRequest,
  DeleteResponse,
  GetStudentResponse,
  GetStudentsResponse,
  UpdateStudentRequest,
} from "../types";

import type { StudentFilters } from "../types";

const BASE_URL = "/api/students";

function buildSearchParams(filters: StudentFilters) {
  const params = new URLSearchParams();

  params.set("page", String(filters.page));
  params.set("limit", String(filters.limit));

  if (filters.search) params.set("search", filters.search);

  if (filters.academicYearId)
    params.set("academicYearId", filters.academicYearId);

  if (filters.classId)
    params.set("classId", filters.classId);

  if (filters.sectionId)
    params.set("sectionId", filters.sectionId);

  if (filters.status)
    params.set("status", filters.status);

  return params.toString();
}

export const studentsApi = {
  getStudents(filters: StudentFilters) {
    return apiClient.get<GetStudentsResponse>(
      `${BASE_URL}?${buildSearchParams(filters)}`
    );
  },

  getStudent(studentId: string) {
    return apiClient.get<GetStudentResponse>(
      `${BASE_URL}/${studentId}`
    );
  },

  createStudent(payload: CreateStudentRequest) {
    return apiClient.post<GetStudentResponse>(
      BASE_URL,
      payload
    );
  },

  updateStudent(
    studentId: string,
    payload: UpdateStudentRequest
  ) {
    return apiClient.patch<GetStudentResponse>(
      `${BASE_URL}/${studentId}`,
      payload
    );
  },

  deleteStudent(studentId: string) {
    return apiClient.delete<DeleteResponse>(
      `${BASE_URL}/${studentId}`
    );
  },
};