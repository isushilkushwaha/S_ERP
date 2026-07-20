"use client";

import type { ColumnDef } from "@tanstack/react-table";

import { useDataTable } from "@/hooks/use-data-table";

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

    setClass,
    setSection,
    setStatus,

    resetFilters,
  } = useStudentFilters();

  const studentsQuery = useStudents(filters);
  console.log("studentsQuery.data =", studentsQuery.data);

  const tableState = useDataTable({
    data: studentsQuery.data?.data ?? [],

    columns,

    pageCount:
      studentsQuery.data?.meta.totalPages ?? 0,

    manualPagination: true,

    initialPageIndex: filters.page - 1,

    initialPageSize: filters.limit,

    onPaginationChange: (pagination) => {
      setPage(pagination.pageIndex + 1);
      setLimit(pagination.pageSize);
    },
  });

  return {
    ...tableState,

    filters,

    studentsQuery,

    setSearch,

    setClass,
    setSection,
    setStatus,

    setPage,
    setLimit,

    resetFilters,
  };
}