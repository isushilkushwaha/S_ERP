// frontend/students/types/api.ts

import type { Student, StudentListItem } from "./student";

export interface PaginationMeta {
  page: number;
  limit: number;

  totalItems: number;
  totalPages: number;

  hasNextPage: boolean;
  hasPreviousPage: boolean;
}

export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
}

export interface PaginatedResponse<T> {
  success: boolean;
  message: string;
  data: T[];
  meta: PaginationMeta;
}

export type GetStudentsResponse =
  PaginatedResponse<StudentListItem>;

export type GetStudentResponse =
  ApiResponse<Student>;

export interface DeleteResponse {
  success: boolean;
  message: string;
}