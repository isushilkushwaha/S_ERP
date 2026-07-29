"use client";

import type { ColumnDef } from "@tanstack/react-table";
import { differenceInYears, format } from "date-fns";
import { Eye } from "lucide-react";
import Link from "next/link";

import { Checkbox } from "@/components/ui/checkbox";
import { buttonVariants } from "@/components/ui/button";

import type { StudentListItem } from "../../types";

import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/components/ui/avatar";


export const studentColumns: ColumnDef<StudentListItem>[] = [
  /**
   * Select
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

  
         {
  id: "student",
  header: "Student Name",
  cell: ({ row }) => {
    const student = row.original;

    const fullName = [
      student.firstName,
      student.middleName,
      student.lastName,
    ]
      .filter(Boolean)
      .join(" ");

    return (
      <div className="flex items-center gap-3">
        <Avatar className="h-10 w-10">
          <AvatarImage
            src={student.photo ?? ""}
            alt={fullName}
          />

          <AvatarFallback>
            {student.firstName?.charAt(0)}
            {student.lastName?.charAt(0)}
          </AvatarFallback>
        </Avatar>

        <div className="flex flex-col">
          <span className="font-medium">
            {fullName}
          </span>

          <span className="text-xs text-muted-foreground">
            {student.studentCode}
          </span>
        </div>
      </div>
    );
  },
},
  /**
   * Father Name
   */
  {
    accessorKey: "fatherName",
    header: "Father Name",
    cell: ({ row }) => row.original.fatherName || "-",
  },

  /**
   * Mother Name
   */
  {
    accessorKey: "motherName",
    header: "Mother Name",
    cell: ({ row }) => row.original.motherName || "-",
  },

  /**
   * Mobile Number
   */
  {
    accessorKey: "mobile",
    header: "Mobile Number",
    cell: ({ row }) => row.original.mobile || "-",
  },

  {
  accessorKey: "dateOfBirth",
  header: "DOB",
  cell: ({ row }) => {
    const dob = row.original.dateOfBirth;

    if (!dob) return "-";

    const birthDate = new Date(dob);
    const age = differenceInYears(new Date(), birthDate);

    return (
      <span>
        {format(birthDate, "dd MMM yyyy")} ({age} Y)
      </span>
    );
  },
},

  /**
   * Registration Date
   */
  {
    accessorKey: "registrationDate",
    header: "Registered",
    cell: ({ row }) => {
      const date = row.original.registrationDate;

      if (!date) return "-";

      return format(new Date(date), "dd MMM yyyy");
    },
  },

  /**
 * Profile Action
 */
{
  id: "profile",
  header: "Profile",
  cell: ({ row }) => (
    <Link
      href={`/students/${row.original.id}`}
      title="View Profile"
      aria-label="View Profile"
      className={buttonVariants({
        variant: "ghost",
        size: "icon",
        className: "h-8 w-8",
      })}
    >
      <Eye className="h-4 w-4 text-muted-foreground" />
    </Link>
  ),
  enableSorting: false,
  enableHiding: false,
},
];