"use client";

import { Loader2, Trash2 } from "lucide-react";

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

import type { StudentListItem } from "../../types";

interface DeleteStudentDialogProps {
  open: boolean;
  student?: StudentListItem | null;

  loading?: boolean;

  onOpenChange: (open: boolean) => void;
  onConfirm: (student: StudentListItem) => void;
}

export function DeleteStudentDialog({
  open,
  student,
  loading = false,
  onOpenChange,
  onConfirm,
}: DeleteStudentDialogProps) {
  if (!student) return null;

  const fullName = [
    student.firstName,
    student.middleName,
    student.lastName,
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <AlertDialog
      open={open}
      onOpenChange={onOpenChange}
    >
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>
            Delete Student
          </AlertDialogTitle>

          <AlertDialogDescription>
            Are you sure you want to delete
            <span className="font-semibold">
              {" "}
              {fullName}
            </span>
            ?
            <br />
            <br />
            Admission No:
            <span className="font-medium">
              {" "}
              {student.admissionNumber}
            </span>
            <br />
            <br />
            This action cannot be undone.
          </AlertDialogDescription>
        </AlertDialogHeader>

        <AlertDialogFooter>
          <AlertDialogCancel
            disabled={loading}
          >
            Cancel
          </AlertDialogCancel>

          <AlertDialogAction
            disabled={loading}
            onClick={(event) => {
              event.preventDefault();

              onConfirm(student);
            }}
            className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
          >
            {loading ? (
              <>
                <Loader2 className="mr-2 size-4 animate-spin" />
                Deleting...
              </>
            ) : (
              <>
                <Trash2 className="mr-2 size-4" />
                Delete Student
              </>
            )}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}