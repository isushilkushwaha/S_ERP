"use client";

import type { ColumnDef } from "@tanstack/react-table";

import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";

import type { StudentListItem } from "../../types";
import { StudentActions } from "./student-actions";

function StatusBadge({
  status,
}: {
  status: StudentListItem["status"];
}) {
  switch (status) {
    case "ACTIVE":
      return <Badge>Active</Badge>;

    case "INACTIVE":
      return <Badge variant="secondary">Inactive</Badge>;

    case "TRANSFERRED":
      return <Badge variant="outline">Transferred</Badge>;

    case "ALUMNI":
      return <Badge variant="destructive">Alumni</Badge>;

    default:
      return <Badge variant="secondary">{status}</Badge>;
  }
}

export const studentColumns: ColumnDef<StudentListItem>[] = [
  /**
   * Row Selection
   */
  {
    id: "select",

    header: ({ table }) => (
      <Checkbox
        checked={table.getIsAllPageRowsSelected()}
        indeterminate={table.getIsSomePageRowsSelected()}
        onCheckedChange={(value) =>
          table.toggleAllPageRowsSelected(!!value)
        }
        aria-label="Select all"
      />
    ),

    cell: ({ row }) => (
      <Checkbox
        checked={row.getIsSelected()}
        onCheckedChange={(value) =>
          row.toggleSelected(!!value)
        }
        aria-label="Select row"
      />
    ),

    enableSorting: false,
    enableHiding: false,
  },

  /**
   * Admission Number
   */
  {
    accessorKey: "admissionNumber",

    header: "Admission No.",
  },

  /**
   * Student Name
   */
  {
    id: "student",

    accessorFn: (row) =>
      [
        row.firstName,
        row.middleName,
        row.lastName,
      ]
        .filter(Boolean)
        .join(" "),

    header: "Student",
  },

  /**
   * Class
   */
  {
    id: "class",

    accessorFn: (row) =>
      row.currentEnrollment?.className ?? "-",

    header: "Class",
  },

  /**
   * Section
   */
  {
    id: "section",

    accessorFn: (row) =>
      row.currentEnrollment?.sectionName ?? "-",

    header: "Section",
  },

  /**
   * Mobile
   */
  {
    accessorKey: "mobileNumber",

    header: "Mobile",
  },

  /**
   * Status
   */
  {
    accessorKey: "status",

    header: "Status",

    cell: ({ row }) => (
      <StatusBadge status={row.original.enrollmentStatus} />
    ),
  },

  /**
   * Actions
   */
  {
    id: "actions",

    cell: ({ row }) => (
      <StudentActions student={row.original} />
    ),

    enableSorting: false,
    enableHiding: false,
  },
];