"use client";

import { ColumnDef } from "@tanstack/react-table";
import { format } from "date-fns";

import { Badge } from "@/components/ui/badge";

import { StudentEnrollment, EnrollmentStatus } from "../../types/enrollment";
import { EnrollmentActions } from "./enrollment-actions";

const statusVariant: Record<
  EnrollmentStatus,
  "default" | "secondary" | "destructive" | "outline"
> = {
  ACTIVE: "default",
  PROMOTED: "secondary",
  TRANSFERRED: "outline",
  PASSED_OUT: "secondary",
  LEFT: "destructive",
  
};

export const enrollmentColumns: ColumnDef<StudentEnrollment>[] = [
  {
    accessorKey: "student",
    header: "Student",
    cell: ({ row }) => {
      const student = row.original.student;

      return (
        <div className="flex flex-col">
          <span className="font-medium">{student.fullName}</span>

          {student.studentCode && (
            <span className="text-muted-foreground text-xs">
              {student.studentCode}
            </span>
          )}
        </div>
      );
    },
  },

  {
    accessorKey: "admissionNumber",
    header: "Admission No",
    cell: ({ row }) => row.original.student.admissionNumber,
  },

  {
    accessorKey: "academicYear",
    header: "Academic Year",
    cell: ({ row }) => row.original.academicYear.name,
  },

  {
    accessorKey: "class",
    header: "Class",
    cell: ({ row }) => row.original.class.name,
  },

  {
    accessorKey: "section",
    header: "Section",
    cell: ({ row }) => row.original.section.name,
  },

  {
    accessorKey: "rollNumber",
    header: "Roll No",
    cell: ({ row }) => row.original.rollNumber ?? "-",
  },

  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => {
      const status = row.original.enrollmentStatus;

      return (
        <Badge variant={statusVariant[status]}>
          {status}
        </Badge>
      );
    },
  },

  {
    accessorKey: "admissionDate",
    header: "Admission Date",
    cell: ({ row }) =>
      format(new Date(row.original.joinedDate), "dd MMM yyyy"),
  },

  {
    id: "actions",
    enableSorting: false,
    enableHiding: false,
    cell: ({ row }) => (
      <EnrollmentActions enrollment={row.original} />
    ),
  },
];