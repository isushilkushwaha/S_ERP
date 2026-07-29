"use client";

import { flexRender } from "@tanstack/react-table";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import { studentColumns } from "./student-columns";
import { StudentToolbar } from "./student-toolbar";
import { StudentPagination } from "./student-pagination";

import {
  EmptyState,
  ErrorState,
  LoadingState,
} from "../states";

import { useStudentTable } from "../../hooks";

export function StudentTable() {
  const {
    table,
    filters,
    studentsQuery,
    setSearch,
    resetFilters,
  } = useStudentTable({
    columns: studentColumns,
  });

  if (studentsQuery.isPending) {
    return <LoadingState />;
  }

  if (studentsQuery.isError) {
    return (
      <ErrorState
        description={
          studentsQuery.error?.message ?? "Unable to load students."
        }
        onRetry={() => studentsQuery.refetch()}
      />
    );
  }

  return (
    <div className="flex flex-1 flex-col overflow-hidden gap-4">
      {/* 1. Fixed Toolbar (Search & Reset) */}
      <div className="shrink-0">
        <StudentToolbar
          search={filters.search ?? ""}
          onSearchChange={setSearch}
          onResetFilters={resetFilters}
        />
      </div>

      {/* 2. Scrollable Table Container */}
      <div className="relative flex-1 overflow-auto rounded-md border border-border/60 bg-background/50">
        <Table>
          {/* Sticky Table Headers */}
          <TableHeader className="sticky top-0 z-10 bg-muted/80 backdrop-blur-md">
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id} className="hover:bg-transparent">
                {headerGroup.headers.map((header) => (
                  <TableHead key={header.id} className="h-10 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
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
            {table.getRowModel().rows.length > 0 ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() ? "selected" : undefined}
                  className="transition-colors hover:bg-muted/40 data-[state=selected]:bg-muted"
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id} className="py-3 text-sm">
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
                  colSpan={table.getVisibleLeafColumns().length}
                  className="h-60 text-center"
                >
                  <EmptyState />
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      {/* 3. Fixed Pagination at Bottom */}
      <div className="shrink-0 pt-2">
        <StudentPagination
          table={table}
          totalItems={studentsQuery.data?.meta.totalItems ?? 0}
        />
      </div>
    </div>
  );
}