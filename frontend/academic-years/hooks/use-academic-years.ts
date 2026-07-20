import {
  useAcademicYears,
  useAcademicYear,
} from "../api/academic-years.query";

import {
  useCreateAcademicYear,
  useUpdateAcademicYear,
  useDeleteAcademicYear,
} from "../api/academic-years.mutation";

import type { AcademicYearQuery } from "../types/academic-year";

export function useAcademicYearsData(
  params?: AcademicYearQuery
) {
  return useAcademicYears(params);
}

export function useAcademicYearData(id?: string) {
  return useAcademicYear(id);
}

export {
  useCreateAcademicYear,
  useUpdateAcademicYear,
  useDeleteAcademicYear,
};