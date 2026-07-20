"use client";

import * as React from "react";
import {
  ColumnDef,
  PaginationState,
  SortingState,
  getCoreRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table";

import { useEnrollments } from "../api/student-enrollments.query";
import type { StudentEnrollment } from "../types/enrollment";

export interface EnrollmentFilters {
  search?: string;
  academicYearId?: string;
  classId?: string;
  sectionId?: string;
  status?: string;
}

interface UseEnrollmentTableProps {
  columns: ColumnDef<StudentEnrollment>[];
}

export function useEnrollmentTable({
  columns,
}: UseEnrollmentTableProps) {
  const [sorting, setSorting] = React.useState<SortingState>([]);

  const [pagination, setPagination] =
    React.useState<PaginationState>({
      pageIndex: 0,
      pageSize: 10,
    });

  const [filters, setFilters] =
    React.useState<EnrollmentFilters>({
      search: "",
    });

  const query = useEnrollments({
    page: pagination.pageIndex + 1,
    limit: pagination.pageSize,
    search: filters.search,
    academicYearId: filters.academicYearId,
    classId: filters.classId,
    sectionId: filters.sectionId,
    enrollmentStatus: filters.status as any,
  });

  const table = useReactTable({
    data: query.data?.data ?? [],
    columns,

    state: {
      sorting,
      pagination,
    },

    pageCount: query.data?.totalPages ?? 0,

    manualPagination: true,

    onPaginationChange: setPagination,

    onSortingChange: setSorting,

    getCoreRowModel: getCoreRowModel(),

    getPaginationRowModel: getPaginationRowModel(),

    getSortedRowModel: getSortedRowModel(),
  });

  return {
    table,

    filters,

    setFilters,

    pagination,

    sorting,

    ...query,
  };
}