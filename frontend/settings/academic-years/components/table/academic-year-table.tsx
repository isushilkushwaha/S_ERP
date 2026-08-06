"use client";

import {
  flexRender,
  getCoreRowModel,
  useReactTable,
  type PaginationState,
} from "@tanstack/react-table";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import type { AcademicYear } from "@/frontend/settings/academic-years";

import { academicYearColumns } from "./academic-year-columns";
import { AcademicYearToolbar } from "./academic-year-toolbar";
import { AcademicYearPagination } from "./academic-year-pagination";

interface AcademicYearTableProps {
  data: AcademicYear[];
  loading?: boolean;

  page: number;
  limit: number;
  total: number;

  search: string;
  status: string;

  onSearchChange: (value: string) => void;
  onStatusChange: (value: string) => void;

  onPageChange: (page: number) => void;
  onLimitChange: (limit: number) => void;

  onRefresh: () => void;
  onCreate: () => void;
}

export function AcademicYearTable({
  data,
  loading = false,

  page,
  limit,
  total,

  search,
  status,

  onSearchChange,
  onStatusChange,

  onPageChange,
  onLimitChange,

  onRefresh,
  onCreate,
}: AcademicYearTableProps) {
  const totalPages = Math.max(1, Math.ceil(total / limit));

  const pagination: PaginationState = {
    pageIndex: page - 1,
    pageSize: limit,
  };

  const table = useReactTable({
    data,
    columns: academicYearColumns,

    getCoreRowModel: getCoreRowModel(),

    manualPagination: true,

    pageCount: totalPages,

    state: {
      pagination,
    },
  });

  return (
    <div className="space-y-4">
      <AcademicYearToolbar
        search={search}
        status={status}
        onSearchChange={onSearchChange}
        onStatusChange={onStatusChange}
        onRefresh={onRefresh}
        onCreate={onCreate}
      />

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <TableHead key={header.id}>
                    {header.isPlaceholder
                      ? null
                      : flexRender(
                          header.column.columnDef.header,
                          header.getContext()
                        )}
                  </TableHead>
                ))}
              </TableRow>
            ))}
          </TableHeader>

          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell
                  colSpan={academicYearColumns.length}
                  className="h-24 text-center"
                >
                  Loading academic years...
                </TableCell>
              </TableRow>
            ) : data.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={academicYearColumns.length}
                  className="h-24 text-center"
                >
                  No academic years found.
                </TableCell>
              </TableRow>
            ) : (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && "selected"}
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      <AcademicYearPagination
        page={page}
        limit={limit}
        total={total}
        totalPages={totalPages}
        onPageChange={onPageChange}
        onLimitChange={onLimitChange}
      />
    </div>
  );
}