// frontend/admissions/components/table/admission-columns.tsx

"use client";

import React, { useState } from "react";
import { ColumnDef } from "@tanstack/react-table";
import { useRouter } from "next/navigation";
import {
  Eye,
  MoreHorizontal,
  UserX,
  UserCheck,
} from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

export interface AdmissionTableRow {
  id: string;
  admissionNumber: string;
  rollNumber: number;
  admissionDate: string;
  status: "ACTIVE" | "INACTIVE" | "LEFT" | "PENDING" | string;
  student: {
    id: string;
    studentCode: string;
    firstName: string;
    lastName: string;
    fatherName?: string;
    fatherMobile?: string;
    photo?: string | null;
    avatarUrl?: string | null;
  };
  academicYear: { name: string };
  class: { name: string };
  section?: { name: string } | null;
}

interface ColumnOptions {
  onToggleStatus: (id: string, currentStatus: string) => void;
}

interface AdmissionActionsCellProps {
  item: AdmissionTableRow;
  onToggleStatus: (id: string, currentStatus: string) => void;
}

function AdmissionActionsCell({ item, onToggleStatus }: AdmissionActionsCellProps) {
  const router = useRouter();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const isActive = item.status?.toUpperCase() === "ACTIVE";

  return (
    <div className="flex justify-end">
      <DropdownMenu>
        <DropdownMenuTrigger className="inline-flex items-center justify-center rounded-xl text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring hover:bg-zinc-100 dark:hover:bg-zinc-800 h-8 w-8 p-0 text-zinc-500">
          <span className="sr-only">Open menu</span>
          <MoreHorizontal className="h-4 w-4" />
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-48 rounded-xl text-xs p-1">
          <DropdownMenuGroup>
            <DropdownMenuLabel className="text-[10px] font-mono uppercase tracking-wider text-zinc-400">
              Student Actions
            </DropdownMenuLabel>
            
            <DropdownMenuItem
              onClick={() => router.push(`/admissions/${item.id}`)}
              className="flex items-center px-2.5 py-1.5 rounded-lg cursor-pointer"
            >
              <Eye className="mr-2 h-3.5 w-3.5 text-zinc-400" />
              <span>View Profile</span>
            </DropdownMenuItem>
          </DropdownMenuGroup>
          <DropdownMenuSeparator />
          <DropdownMenuItem
            onClick={() => setIsDialogOpen(true)}
            className={
              isActive
                ? "text-destructive focus:text-destructive cursor-pointer px-2.5 py-1.5 rounded-lg"
                : "text-emerald-600 focus:text-emerald-600 cursor-pointer px-2.5 py-1.5 rounded-lg"
            }
          >
            {isActive ? (
              <>
                <UserX className="mr-2 h-3.5 w-3.5" />
                <span>Deactivate Record</span>
              </>
            ) : (
              <>
                <UserCheck className="mr-2 h-3.5 w-3.5" />
                <span>Reactivate Record</span>
              </>
            )}
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <AlertDialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <AlertDialogContent className="rounded-2xl">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-base font-bold">
              {isActive ? "Deactivate Admission Record?" : "Reactivate Admission Record?"}
            </AlertDialogTitle>
            <AlertDialogDescription className="text-xs text-zinc-500">
              {isActive ? (
                <>
                  Are you sure you want to deactivate the admission record for{" "}
                  <strong className="text-zinc-900 dark:text-zinc-100">
                    {item.student?.firstName} {item.student?.lastName}
                  </strong>{" "}
                  ({item.admissionNumber})? This will set their enrollment status to LEFT.
                </>
              ) : (
                <>
                  Are you sure you want to reactivate the admission record for{" "}
                  <strong className="text-zinc-900 dark:text-zinc-100">
                    {item.student?.firstName} {item.student?.lastName}
                  </strong>{" "}
                  ({item.admissionNumber})? This will set their status back to ACTIVE.
                </>
              )}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="text-xs rounded-xl">Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => {
                onToggleStatus(item.id, item.status);
                setIsDialogOpen(false);
              }}
              className={`text-xs rounded-xl text-white ${
                isActive
                  ? "bg-destructive hover:bg-destructive/90"
                  : "bg-emerald-600 hover:bg-emerald-700"
              }`}
            >
              Confirm {isActive ? "Deactivate" : "Reactivate"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}

export const getAdmissionColumns = ({
  onToggleStatus,
}: ColumnOptions): ColumnDef<AdmissionTableRow>[] => [
  {
    accessorKey: "student.firstName",
    header: "Student Profile",
    cell: ({ row }) => {
      const student = row.original.student;
      const fullName = `${student?.firstName || ""} ${student?.lastName || ""}`.trim() || "N/A";
      const initials = fullName
        .split(" ")
        .map((n) => n[0])
        .join("")
        .toUpperCase()
        .slice(0, 2) || "ST";

      const realPhotoSrc = student?.photo || student?.avatarUrl || undefined;

      return (
        <div className="flex items-center space-x-3 py-1">
          <Avatar className="h-9 w-9 border border-zinc-200 dark:border-zinc-800 shadow-2xs shrink-0">
            <AvatarImage src={realPhotoSrc} alt={fullName} className="object-cover h-full w-full" />
            <AvatarFallback className="text-[10px] font-bold bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-300">
              {initials}
            </AvatarFallback>
          </Avatar>
          <div className="flex flex-col space-y-0.5 overflow-hidden">
            <span className="font-semibold text-xs text-zinc-900 dark:text-zinc-100 tracking-tight hover:text-blue-600 transition-colors truncate">
              {fullName}
            </span>
            <div className="flex items-center space-x-1.5 text-[10px] text-zinc-500 font-mono">
              <span className="font-medium text-emerald-600 dark:text-emerald-400">
                {row.original.admissionNumber || "N/A"}
              </span>
              <span>•</span>
              <span>Code: {student?.studentCode || "N/A"}</span>
            </div>
          </div>
        </div>
      );
    },
  },
  {
    accessorKey: "class.name",
    header: "Class & Section",
    cell: ({ row }) => {
      const className = row.original.class?.name || "N/A";
      const sectionName = row.original.section?.name;

      return (
        <div className="flex items-center space-x-1.5">
          <Badge
            variant="outline"
            className="text-[11px] font-medium bg-zinc-50 dark:bg-zinc-900 border-zinc-200 dark:border-zinc-800 rounded-lg px-2 py-0.5"
          >
            Class {className}
          </Badge>
          {sectionName && (
            <Badge
              variant="secondary"
              className="text-[10px] font-mono font-semibold text-zinc-600 dark:text-zinc-400 rounded-lg px-1.5 py-0.5"
            >
              Sec {sectionName}
            </Badge>
          )}
        </div>
      );
    },
  },
  {
    accessorKey: "rollNumber",
    header: "Roll No",
    cell: ({ row }) => (
      <span className="font-mono text-xs font-bold text-zinc-700 dark:text-zinc-300">
        #{row.original.rollNumber ?? "N/A"}
      </span>
    ),
  },
  {
    accessorKey: "academicYear.name",
    header: "Academic Session",
    cell: ({ row }) => (
      <span className="text-xs text-zinc-600 dark:text-zinc-400 font-medium">
        {row.original.academicYear?.name || "N/A"}
      </span>
    ),
  },
  {
    accessorKey: "admissionDate",
    header: "Admission Date",
    cell: ({ row }) => {
      const rawDate = row.original.admissionDate;
      const formatted = rawDate
        ? new Date(rawDate).toLocaleDateString("en-IN", {
            day: "2-digit",
            month: "short",
            year: "numeric",
          })
        : "N/A";

      return (
        <span className="text-xs font-mono text-zinc-500 dark:text-zinc-400">
          {formatted}
        </span>
      );
    },
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => {
      const status = (row.original.status || "ACTIVE").toUpperCase();

      if (status === "ACTIVE") {
        return (
          <Badge
            variant="outline"
            className="text-[10px] font-mono font-semibold bg-emerald-50/80 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-400 border-emerald-200 dark:border-emerald-900/60 rounded-full px-2.5 py-0.5"
          >
            Active
          </Badge>
        );
      }

      if (status === "PENDING") {
        return (
          <Badge
            variant="outline"
            className="text-[10px] font-mono font-semibold bg-amber-50/80 dark:bg-amber-950/40 text-amber-700 dark:text-amber-400 border-amber-200 dark:border-amber-900/60 rounded-full px-2.5 py-0.5"
          >
            Pending
          </Badge>
        );
      }

      if (status === "LEFT") {
        return (
          <Badge
            variant="outline"
            className="text-[10px] font-mono font-semibold bg-red-50/80 dark:bg-red-950/40 text-red-700 dark:text-red-400 border-red-200 dark:border-red-900/60 rounded-full px-2.5 py-0.5"
          >
            Left
          </Badge>
        );
      }

      return (
        <Badge
          variant="outline"
          className="text-[10px] font-mono font-semibold bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400 border-zinc-200 dark:border-zinc-700 rounded-full px-2.5 py-0.5"
        >
          {status || "Inactive"}
        </Badge>
      );
    },
  },
  {
    id: "actions",
    header: () => <div className="text-right">Actions</div>,
    cell: ({ row }) => <AdmissionActionsCell item={row.original} onToggleStatus={onToggleStatus} />,
  },
];