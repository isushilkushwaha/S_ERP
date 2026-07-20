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
  LoadingState,
  EmptyState,
  ErrorState,
} from "../states";

import { useStudentTable } from "../../hooks";

export function StudentTable() {
  const {
    table,

    filters,

    studentsQuery,

    setSearch,

    setClass,
    setSection,
    setStatus,

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
          studentsQuery.error?.message ??
          "Unable to load students."
        }
        onRetry={() => studentsQuery.refetch()}
      />
    );
  }

  return (
    <div className="space-y-6">
      <StudentToolbar
        search={filters.search ?? ""}
        classId={filters.classId}
        sectionId={filters.sectionId}
        status={filters.status}
        onSearchChange={setSearch}
        onClassChange={setClass}
        onSectionChange={setSection}
        onStatusChange={setStatus}
        onResetFilters={resetFilters}
      />

      <div className="rounded-lg border">
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
            {table.getRowModel().rows.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  data-state={
                    row.getIsSelected() && "selected"
                  }
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
                  colSpan={table.getAllColumns().length}
                  className="h-40"
                >
                  <EmptyState />
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      <StudentPagination
        table={table}
        totalItems={
          studentsQuery.data?.meta.totalItems ?? 0
        }
      />
    </div>
  );
}