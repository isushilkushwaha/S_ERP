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

import { Button } from "@/components/ui/button";

import { StudentEnrollment } from "../../types/enrollment";
import { useDeleteEnrollment } from "../../api/student-enrollments.mutation";

interface DeleteEnrollmentDialogProps {
  enrollment: StudentEnrollment | null;

  open: boolean;

  onOpenChange: (open: boolean) => void;
}

export function DeleteEnrollmentDialog({
  enrollment,
  open,
  onOpenChange,
}: DeleteEnrollmentDialogProps) {
  const deleteEnrollment = useDeleteEnrollment();

  if (!enrollment) return null;

  const handleDelete = async () => {
    try {
      await deleteEnrollment.mutateAsync(enrollment.id);

      onOpenChange(false);
    } catch {
      // Error handled in mutation
    }
  };

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent className="sm:max-w-md">
        <AlertDialogHeader>
          <AlertDialogTitle>
            Delete Student Enrollment
          </AlertDialogTitle>

          <AlertDialogDescription>
            This action cannot be undone.
          </AlertDialogDescription>
        </AlertDialogHeader>

        <div className="rounded-lg border bg-muted/30 p-4 space-y-2">
          <div className="text-sm">
            <span className="font-medium">Student:</span>{" "}
            {enrollment.student.fullName}
          </div>

          <div className="text-sm">
            <span className="font-medium">Admission No:</span>{" "}
            {enrollment.student.admissionNumber}
          </div>

          <div className="text-sm">
            <span className="font-medium">Academic Year:</span>{" "}
            {enrollment.academicYear.name}
          </div>

          <div className="text-sm">
            <span className="font-medium">Class:</span>{" "}
            {enrollment.class.name}
          </div>

          <div className="text-sm">
            <span className="font-medium">Section:</span>{" "}
            {enrollment.section.name}
          </div>

          <div className="text-sm">
            <span className="font-medium">Roll Number:</span>{" "}
            {enrollment.rollNumber ?? "-"}
          </div>
        </div>

        <AlertDialogFooter>
          <AlertDialogCancel disabled={deleteEnrollment.isPending}>
            Cancel
          </AlertDialogCancel>
{/* 
          <AlertDialogAction asChild>
            <Button
              variant="destructive"
              onClick={handleDelete}
              disabled={deleteEnrollment.isPending}
            >
              {deleteEnrollment.isPending ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Deleting...
                </>
              ) : (
                <>
                  <Trash2 className="mr-2 h-4 w-4" />
                  Delete Enrollment
                </>
              )}
            </Button>
          </AlertDialogAction> */}
        <AlertDialogAction
  onClick={handleDelete}
  disabled={deleteEnrollment.isPending}
>
  {deleteEnrollment.isPending ? (
    <>
      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
      Deleting...
    </>
  ) : (
    <>
      <Trash2 className="mr-2 h-4 w-4" />
      Delete Enrollment
    </>
  )}
</AlertDialogAction>


        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}