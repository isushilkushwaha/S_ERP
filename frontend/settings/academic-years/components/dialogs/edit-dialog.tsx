"use client";

import { toast } from "sonner";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

import { AcademicYearForm } from "../form/academic-year-form";

import {
  useUpdateAcademicYear,
  type AcademicYear,
  type UpdateAcademicYearRequest,
} from "@/frontend/settings/academic-years";

interface EditAcademicYearDialogProps {
  academicYear: AcademicYear;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function EditAcademicYearDialog({
  academicYear,
  open,
  onOpenChange,
}: EditAcademicYearDialogProps) {
  const updateMutation = useUpdateAcademicYear();

  const handleSubmit = async (
    data: UpdateAcademicYearRequest
  ) => {
    try {
      const updatedAcademicYear =
        await updateMutation.mutateAsync({
          id: academicYear.id,
          data,
        });

      toast.success(
        `"${updatedAcademicYear.name}" has been updated successfully.`
      );

      onOpenChange(false);
    } catch (error) {
      toast.error(
        error instanceof Error
          ? error.message
          : "Unable to update the academic year. Please try again."
      );
    }
  };

  return (
    <Dialog
      open={open}
      onOpenChange={(isOpen) => {
        if (!updateMutation.isPending) {
          onOpenChange(isOpen);
        }
      }}
    >
      <DialogContent className="sm:max-w-2xl">
        <DialogHeader>
          <DialogTitle>Edit Academic Year</DialogTitle>

          <DialogDescription>
            Update the academic year information. Changes will be reflected
            throughout the system after saving.
          </DialogDescription>
        </DialogHeader>

        <AcademicYearForm
          initialData={academicYear}
          isLoading={updateMutation.isPending}
          onSubmit={handleSubmit}
          onCancel={() => onOpenChange(false)}
        />
      </DialogContent>
    </Dialog>
  );
}