"use client";

import { useState } from "react";
import { MoreHorizontal, Pencil, CheckCircle2, Archive, Trash2 } from "lucide-react";

import type { AcademicYear } from "@/frontend/settings/academic-years";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import { EditAcademicYearDialog } from "../dialogs/edit-dialog";
import { DeleteAcademicYearDialog } from "../dialogs/delete-dialog";
import { ActivateAcademicYearDialog } from "../dialogs/activate-dialog";
import { ArchiveAcademicYearDialog } from "../dialogs/archive-dialog";

interface AcademicYearActionsProps {
  academicYear: AcademicYear;
}

export function AcademicYearActions({
  academicYear,
}: AcademicYearActionsProps) {
  const [editOpen, setEditOpen] = useState(false);
  const [activateOpen, setActivateOpen] = useState(false);
  const [archiveOpen, setArchiveOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger
  className="inline-flex h-9 w-9 items-center justify-center rounded-md border border-transparent hover:bg-accent hover:text-accent-foreground focus:outline-none focus:ring-2 focus:ring-ring"
>
  <MoreHorizontal className="h-4 w-4" />
  <span className="sr-only">Open actions</span>
</DropdownMenuTrigger>

        <DropdownMenuContent align="end" className="w-48">
          <DropdownMenuItem onClick={() => setEditOpen(true)}>
            <Pencil className="mr-2 h-4 w-4" />
            Edit
          </DropdownMenuItem>

          <DropdownMenuItem onClick={() => setActivateOpen(true)}>
            <CheckCircle2 className="mr-2 h-4 w-4" />
            Activate
          </DropdownMenuItem>

          <DropdownMenuItem onClick={() => setArchiveOpen(true)}>
            <Archive className="mr-2 h-4 w-4" />
            Archive
          </DropdownMenuItem>

          <DropdownMenuSeparator />

          <DropdownMenuItem
            className="text-destructive focus:text-destructive"
            onClick={() => setDeleteOpen(true)}
          >
            <Trash2 className="mr-2 h-4 w-4" />
            Delete
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <EditAcademicYearDialog
        open={editOpen}
        onOpenChange={setEditOpen}
        academicYear={academicYear}
      />

      <ActivateAcademicYearDialog
        open={activateOpen}
        onOpenChange={setActivateOpen}
        academicYear={academicYear}
      />

      <ArchiveAcademicYearDialog
        open={archiveOpen}
        onOpenChange={setArchiveOpen}
        academicYear={academicYear}
      />

      <DeleteAcademicYearDialog
        open={deleteOpen}
        onOpenChange={setDeleteOpen}
        academicYear={academicYear}
      />
    </>
  );
}