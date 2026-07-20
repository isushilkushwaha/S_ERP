"use client";

import { useCallback, useMemo, useState } from "react";

import type { StudentFilters, StudentStatus } from "../types";

const DEFAULT_FILTERS: StudentFilters = {
  page: 1,
  limit: 10,
  search: "",
  academicYearId: undefined,
  classId: undefined,
  sectionId: undefined,
  status: undefined,
};

export function useStudentFilters(
  initialFilters: Partial<StudentFilters> = {}
) {
  const [filters, setFilters] = useState<StudentFilters>({
    ...DEFAULT_FILTERS,
    ...initialFilters,
  });

  const setPage = useCallback((page: number) => {
    setFilters((prev) => ({
      ...prev,
      page,
    }));
  }, []);

  const setLimit = useCallback((limit: number) => {
    setFilters((prev) => ({
      ...prev,
      limit,
      page: 1,
    }));
  }, []);

  const setSearch = useCallback((search: string) => {
    setFilters((prev) => ({
      ...prev,
      search,
      page: 1,
    }));
  }, []);

  const setAcademicYear = useCallback(
    (academicYearId?: string) => {
      setFilters((prev) => ({
        ...prev,
        academicYearId,
        page: 1,
      }));
    },
    []
  );

  const setClass = useCallback((classId?: string) => {
    setFilters((prev) => ({
      ...prev,
      classId,
      sectionId: undefined,
      page: 1,
    }));
  }, []);

  const setSection = useCallback((sectionId?: string) => {
    setFilters((prev) => ({
      ...prev,
      sectionId,
      page: 1,
    }));
  }, []);

  const setStatus = useCallback(
    (status?: StudentStatus) => {
      setFilters((prev) => ({
        ...prev,
        status,
        page: 1,
      }));
    },
    []
  );

  const resetFilters = useCallback(() => {
    setFilters(DEFAULT_FILTERS);
  }, []);

  return useMemo(
    () => ({
      filters,

      setPage,
      setLimit,

      setSearch,

      setAcademicYear,
      setClass,
      setSection,
      setStatus,

      resetFilters,
    }),
    [
      filters,

      setPage,
      setLimit,

      setSearch,

      setAcademicYear,
      setClass,
      setSection,
      setStatus,

      resetFilters,
    ]
  );
}