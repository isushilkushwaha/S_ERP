"use client";

import { Loader2 } from "lucide-react";
import { toast } from "sonner";

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

import type { AcademicYear } from "@/frontend/settings/academic-years";
import { useArchiveAcademicYear } from "@/frontend/settings/academic-years/hooks";

interface ArchiveDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  academicYear: AcademicYear;
}

export function ArchiveAcademicYearDialog({
  open,
  onOpenChange,
  academicYear,
}: ArchiveDialogProps) {
  const archiveMutation = useArchiveAcademicYear();

  const handleArchive = async () => {
    try {
      await archiveMutation.mutateAsync(academicYear.id);

      toast.success("Academic year archived successfully.");

      onOpenChange(false);
    } catch (error) {
      toast.error(
        error instanceof Error
          ? error.message
          : "Unable to archive the academic year. Please try again."
      );
    }
  };

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Archive Academic Year</AlertDialogTitle>

          <AlertDialogDescription>
            Are you sure you want to archive{" "}
            <strong>{academicYear.name}</strong>?
            <br />
            <br />
            Archived academic years become read-only and are preserved for
            historical records.
          </AlertDialogDescription>
        </AlertDialogHeader>

        <AlertDialogFooter>
          <AlertDialogCancel disabled={archiveMutation.isPending}>
            Cancel
          </AlertDialogCancel>

          <AlertDialogAction
            type="button"
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              handleArchive();
            }}
            disabled={archiveMutation.isPending}
            className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
          >
            {archiveMutation.isPending ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Archiving...
              </>
            ) : (
              "Archive"
            )}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}