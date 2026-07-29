// frontend/students/api/students.api.ts

import { apiClient } from "@/lib/api-client";

import type {
  CreateStudentRequest,
  DeleteResponse,
  GetStudentResponse,
  GetStudentsResponse,
  StudentFilters,
  UpdateStudentRequest,
} from "../types";

const BASE_URL = "/api/students";

function buildSearchParams(filters: StudentFilters) {
  const params = new URLSearchParams();

  params.set("page", String(filters.page));
  params.set("limit", String(filters.limit));

  if (filters.search?.trim()) {
    params.set("search", filters.search.trim());
  }

  return params.toString();
}

export const studentsApi = {
  getStudents(filters: StudentFilters) {
    return apiClient.get<GetStudentsResponse>(
      `${BASE_URL}?${buildSearchParams(filters)}`
    );
  },

  getStudent(id: string) {
    return apiClient.get<GetStudentResponse>(
      `${BASE_URL}/${id}`
    );
  },

  async searchStudentByCode(studentCode: string) {
  const response = await this.getStudents({
    page: 1,
    limit: 1,
    search: studentCode,
  });

  return response.data[0] ?? null;
},

  createStudent(payload: CreateStudentRequest) {
    return apiClient.post<GetStudentResponse>(
      BASE_URL,
      payload
    );
  },

  updateStudent(
    id: string,
    payload: UpdateStudentRequest
  ) {
    return apiClient.patch<GetStudentResponse>(
      `${BASE_URL}/${id}`,
      payload
    );
  },

  deleteStudent(id: string) {
    return apiClient.delete<DeleteResponse>(
      `${BASE_URL}/${id}`
    );
  },

  async uploadPhoto(id: string, file: File) {
  const formData = new FormData();

  formData.append("photo", file);

  const response = await fetch(
    `/api/students/${id}/photo`,
    {
      method: "PATCH",
      body: formData,
    }
  );

  if (!response.ok) {
    const error = await response.json();

    throw new Error(error.message ?? "Upload failed.");
  }

  return response.json();
}

};