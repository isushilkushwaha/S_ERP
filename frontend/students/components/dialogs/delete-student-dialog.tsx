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

          <AlertDialogDescription className="space-y-3">
            <p>
              Are you sure you want to permanently delete this
              student registration?
            </p>

            <div className="rounded-md border bg-muted/50 p-4 text-sm">
              <div className="grid gap-2">
                <div className="flex justify-between">
                  <span className="font-medium text-muted-foreground">
                    Student
                  </span>

                  <span className="font-semibold">
                    {fullName}
                  </span>
                </div>

                <div className="flex justify-between">
                  <span className="font-medium text-muted-foreground">
                    Student Code
                  </span>

                  <span>{student.studentCode}</span>
                </div>

                {student.mobile && (
                  <div className="flex justify-between">
                    <span className="font-medium text-muted-foreground">
                      Mobile
                    </span>

                    <span>{student.mobile}</span>
                  </div>
                )}

                {student.emisNumber && (
                  <div className="flex justify-between">
                    <span className="font-medium text-muted-foreground">
                      EMIS
                    </span>

                    <span>{student.emisNumber}</span>
                  </div>
                )}
              </div>
            </div>

            <p className="text-destructive font-medium">
              This action cannot be undone.
            </p>

            <p className="text-sm text-muted-foreground">
              Deleting this student will permanently remove the
              student's master registration record. If the student
              has enrollment, fee, attendance, examination, or other
              related records, deletion may be restricted depending on
              your system rules.
            </p>
          </AlertDialogDescription>
        </AlertDialogHeader>

        <AlertDialogFooter>
          <AlertDialogCancel disabled={loading}>
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