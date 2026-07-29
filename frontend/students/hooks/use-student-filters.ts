"use client";

import { useCallback, useMemo, useState } from "react";

import type { StudentFilters } from "../types";

const DEFAULT_FILTERS: StudentFilters = {
  page: 1,
  limit: 10,
  search: "",
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

  const resetFilters = useCallback(() => {
    setFilters(DEFAULT_FILTERS);
  }, []);

  return useMemo(
    () => ({
      filters,
      setPage,
      setLimit,
      setSearch,
      resetFilters,
    }),
    [
      filters,
      setPage,
      setLimit,
      setSearch,
      resetFilters,
    ]
  );
}