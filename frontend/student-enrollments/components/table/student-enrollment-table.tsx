"use client";

import * as React from "react";

import {
  ColumnDef,
  SortingState,
  VisibilityState,
  ColumnFiltersState,
  flexRender,
  getCoreRowModel,
  getSortedRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  useReactTable,
} from "@tanstack/react-table";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import {
  Card,
  CardContent,
} from "@/components/ui/card";

import { Skeleton } from "@/components/ui/skeleton";

import { StudentEnrollment } from "../../types/enrollment";

interface StudentEnrollmentTableProps {
  columns: ColumnDef<StudentEnrollment>[];

  data: StudentEnrollment[];

  loading?: boolean;
}

export function StudentEnrollmentTable({
  columns,
  data,
  loading = false,
}: StudentEnrollmentTableProps) {

      const [sorting, setSorting] =
    React.useState<SortingState>([]);

  const [columnFilters, setColumnFilters] =
    React.useState<ColumnFiltersState>([]);

  const [columnVisibility, setColumnVisibility] =
    React.useState<VisibilityState>({});

  const [rowSelection, setRowSelection] =
    React.useState({});

      const table = useReactTable({
    data,

    columns,

    state: {
      sorting,
      columnFilters,
      columnVisibility,
      rowSelection,
    },

    onSortingChange: setSorting,

    onColumnFiltersChange:
      setColumnFilters,

    onColumnVisibilityChange:
      setColumnVisibility,

    onRowSelectionChange:
      setRowSelection,

    getCoreRowModel:
      getCoreRowModel(),

    getSortedRowModel:
      getSortedRowModel(),

    getFilteredRowModel:
      getFilteredRowModel(),

    getPaginationRowModel:
      getPaginationRowModel(),
  });

    if (loading) {
    return (
      <Card>
        <CardContent className="space-y-3 pt-6">
          {Array.from({ length: 8 }).map(
            (_, index) => (
              <Skeleton
                key={index}
                className="h-12 w-full"
              />
            )
          )}
        </CardContent>
      </Card>
    );
  }

    return (
    <div className="rounded-md border">
      <Table>       
         <TableHeader>
          {table
            .getHeaderGroups()
            .map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map(
                  (header) => (
                    <TableHead
                      key={header.id}
                    >
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                            header.column.columnDef
                              .header,
                            header.getContext()
                          )}
                    </TableHead>
                  )
                )}
              </TableRow>
            ))}
        </TableHeader>
        <TableBody>
  {table.getRowModel().rows?.length ? (
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
  ) : (
    <TableRow>
      <TableCell
        colSpan={columns.length}
        className="h-32 text-center"
      >
        <div className="flex flex-col items-center justify-center space-y-2">
          <p className="text-lg font-medium">
            No enrollments found
          </p>

          <p className="text-sm text-muted-foreground">
            Try changing your filters or create a new enrollment.
          </p>
        </div>
      </TableCell>
    </TableRow>
  )}
</TableBody>


        </Table>
<div className="mt-4 flex items-center justify-between">
  <div className="text-sm text-muted-foreground">
    {table.getFilteredRowModel().rows.length} enrollment(s)
  </div>

  <div className="flex items-center gap-2">
    <button
      type="button"
      className="rounded-md border px-3 py-2 text-sm disabled:opacity-50"
      onClick={() => table.previousPage()}
      disabled={!table.getCanPreviousPage()}
    >
      Previous
    </button>

    <button
      type="button"
      className="rounded-md border px-3 py-2 text-sm disabled:opacity-50"
      onClick={() => table.nextPage()}
      disabled={!table.getCanNextPage()}
    >
      Next
    </button>
  </div>
</div>
              
    </div>
  );
}
    