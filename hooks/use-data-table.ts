"use client";

import * as React from "react";

import {
  type ColumnDef,
  type PaginationState,
  type RowSelectionState,
  type SortingState,
  getCoreRowModel,
  useReactTable,
} from "@tanstack/react-table";

export interface UseDataTableOptions<TData> {
  data: TData[];
  columns: ColumnDef<TData>[];

  pageCount?: number;

  manualPagination?: boolean;
  manualSorting?: boolean;
  manualFiltering?: boolean;

  initialPageIndex?: number;
  initialPageSize?: number;

  onPaginationChange?: (pagination: PaginationState) => void;
}

export function useDataTable<TData>({
  data,
  columns,

  pageCount = -1,

  manualPagination = false,
  manualSorting = false,
  manualFiltering = false,

  initialPageIndex = 0,
  initialPageSize = 10,

  onPaginationChange,
}: UseDataTableOptions<TData>) {
  const [sorting, setSorting] =
    React.useState<SortingState>([]);

  const [rowSelection, setRowSelection] =
    React.useState<RowSelectionState>({});

  const [pagination, setPagination] =
    React.useState<PaginationState>({
      pageIndex: initialPageIndex,
      pageSize: initialPageSize,
    });

  const table = useReactTable({
    data,
    columns,

    pageCount,

    state: {
      sorting,
      rowSelection,
      pagination,
    },

    manualPagination,
    manualSorting,
    manualFiltering,

    getCoreRowModel: getCoreRowModel(),

    onSortingChange: setSorting,

    onRowSelectionChange: setRowSelection,

    onPaginationChange: (updater) => {
      const next =
        typeof updater === "function"
          ? updater(pagination)
          : updater;

      setPagination(next);

      onPaginationChange?.(next);
    },
  });

  return {
    table,

    sorting,
    setSorting,

    pagination,
    setPagination,

    rowSelection,
    setRowSelection,
  };
}