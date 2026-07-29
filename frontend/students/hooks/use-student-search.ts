"use client";

import { useMutation } from "@tanstack/react-query";

import { studentsApi } from "../api";

export function useStudentSearch() {
  return useMutation({
    mutationFn: async (studentCode: string) => {
      const response = await studentsApi.getStudents({
        page: 1,
        limit: 1,
        search: studentCode,
      });

      return response.data[0] ?? null;
    },
  });
}