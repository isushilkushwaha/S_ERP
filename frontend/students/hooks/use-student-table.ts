// frontend/students/hooks/use-student-table.ts

"use client";

import { useState } from "react";
import type { ColumnDef } from "@tanstack/react-table";
import {
  getCoreRowModel,
  useReactTable,
  PaginationState,
} from "@tanstack/react-table";

import { useStudents } from "./use-students";
import { useStudentFilters } from "./use-student-filters";

import type { StudentListItem } from "../types";

interface UseStudentTableOptions {
  columns: ColumnDef<StudentListItem>[];
}

export function useStudentTable({
  columns,
}: UseStudentTableOptions) {
  const {
    filters,
    setSearch,
    setPage,
    setLimit,
    resetFilters,
  } = useStudentFilters();

  const studentsQuery = useStudents(filters);

  // 1. Manage pagination state synced with your filters/URL parameters
  const pageIndex = (filters.page ?? 1) - 1;
  const pageSize = filters.limit ?? 10;

  const pagination: PaginationState = {
    pageIndex,
    pageSize,
  };

  // 2. Initialize TanStack Table directly
  const table = useReactTable({
    data: studentsQuery.data?.data ?? [],
    columns,
    pageCount: studentsQuery.data?.meta?.totalPages ?? 0,
    state: {
      pagination,
    },
    onPaginationChange: (updaterOrValue) => {
      const nextPagination =
        typeof updaterOrValue === "function"
          ? updaterOrValue(pagination)
          : updaterOrValue;

      // Update filters/URL parameters when pagination changes
      setPage(nextPagination.pageIndex + 1);
      setLimit(nextPagination.pageSize);
    },
    manualPagination: true,
    getCoreRowModel: getCoreRowModel(),
  });

  return {
    table,
    filters,
    studentsQuery,
    setSearch,
    setPage,
    setLimit,
    resetFilters,
  };
}