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
import { useDeleteAcademicYear } from "@/frontend/settings/academic-years";

interface DeleteDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  academicYear: AcademicYear;
}

export function DeleteAcademicYearDialog({
  open,
  onOpenChange,
  academicYear,
}: DeleteDialogProps) {
  const { mutateAsync, isPending } = useDeleteAcademicYear();

  const handleDelete = async () => {
    try {
      await mutateAsync(academicYear.id);

      toast.success(
        `"${academicYear.name}" has been deleted successfully.`
      );

      onOpenChange(false);
    } catch (error) {
      toast.error(
        error instanceof Error
          ? error.message
          : "Unable to delete the academic year. Please try again."
      );
    }
  };

  return (
    <AlertDialog
      open={open}
      onOpenChange={(isOpen) => {
        if (!isPending) {
          onOpenChange(isOpen);
        }
      }}
    >
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Delete Academic Year</AlertDialogTitle>

          <AlertDialogDescription>
            Are you sure you want to permanently delete{" "}
            <strong>{academicYear.name}</strong>?
            <br />
            <br />
            <span className="font-medium text-destructive">
              This action cannot be undone.
            </span>
            <br />
            Deleting this academic year will permanently remove it from the
            system.
          </AlertDialogDescription>
        </AlertDialogHeader>

        <AlertDialogFooter>
          <AlertDialogCancel disabled={isPending}>
            Cancel
          </AlertDialogCancel>

          <AlertDialogAction
            type="button"
            disabled={isPending}
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              handleDelete();
            }}
            className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
          >
            {isPending ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Deleting...
              </>
            ) : (
              "Delete"
            )}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}