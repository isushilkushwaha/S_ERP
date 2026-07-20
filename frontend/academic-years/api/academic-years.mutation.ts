// frontend/academic-years/api/academic-years.mutation.ts

import { useMutation, useQueryClient } from "@tanstack/react-query";

import {
  createAcademicYear,
  deleteAcademicYear,
  updateAcademicYear,
} from "./academic-years.api";

import { academicYearKeys } from "./academic-years.query";

import type {
  AcademicYear,
  CreateAcademicYearRequest,
  UpdateAcademicYearRequest,
} from "../types/academic-year";

/**
 * Create Academic Year
 */
export function useCreateAcademicYear() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateAcademicYearRequest) =>
      createAcademicYear(data),

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: academicYearKeys.lists(),
      });
    },
  });
}

/**
 * Update Academic Year
 */
export function useUpdateAcademicYear() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      id,
      data,
    }: {
      id: string;
      data: UpdateAcademicYearRequest;
    }) => updateAcademicYear(id, data),

    onSuccess: (academicYear: AcademicYear) => {
      queryClient.invalidateQueries({
        queryKey: academicYearKeys.lists(),
      });

      queryClient.setQueryData(
        academicYearKeys.detail(academicYear.id),
        academicYear
      );
    },
  });
}

/**
 * Delete Academic Year
 */
export function useDeleteAcademicYear() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => deleteAcademicYear(id),

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: academicYearKeys.lists(),
      });
    },
  });
}