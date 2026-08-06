"use client";

import { ColumnDef } from "@tanstack/react-table";

import { type AcademicYear } from "@/frontend/settings/academic-years";

import { StatusBadge } from "./status-badge";
import { AcademicYearActions } from "./academic-year-actions";

import { formatDate } from "@/frontend/settings/academic-years";

export const academicYearColumns: ColumnDef<AcademicYear>[] = [
  {
    accessorKey: "name",
    header: "Academic Year",
    cell: ({ row }) => (
      <div className="font-medium">
        {row.original.name}
      </div>
    ),
  },
  {
    accessorKey: "code",
    header: "Code",
    cell: ({ row }) => (
      <span className="font-mono text-sm">
        {row.original.code}
      </span>
    ),
  },
  {
    accessorKey: "startDate",
    header: "Start Date",
    cell: ({ row }) => formatDate(row.original.startDate),
  },
  {
    accessorKey: "endDate",
    header: "End Date",
    cell: ({ row }) => formatDate(row.original.endDate),
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => (
      <StatusBadge status={row.original.status} />
    ),
  },
  {
    accessorKey: "sortOrder",
    header: "Sort Order",
    cell: ({ row }) => (
      <div className="text-center">
        {row.original.sortOrder}
      </div>
    ),
  },
  {
    id: "actions",
    header: "",
    enableSorting: false,
    enableHiding: false,
    cell: ({ row }) => (
      <AcademicYearActions
        academicYear={row.original}
      />
    ),
  },
];