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
  useCreateAcademicYear,
  type AcademicYearFormValues,
} from "@/frontend/settings/academic-years";

interface CreateAcademicYearDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function CreateAcademicYearDialog({
  open,
  onOpenChange,
}: CreateAcademicYearDialogProps) {
  const createMutation = useCreateAcademicYear();

  const handleSubmit = async (
    values: AcademicYearFormValues
  ) => {
    try {
      const academicYear =
        await createMutation.mutateAsync(values);

      toast.success(
        `"${academicYear.name}" has been created successfully.`
      );

      onOpenChange(false);
    } catch (error) {
      toast.error(
        error instanceof Error
          ? error.message
          : "Unable to create the academic year. Please try again."
      );
    }
  };

  return (
    <Dialog
      open={open}
      onOpenChange={(isOpen) => {
        if (!createMutation.isPending) {
          onOpenChange(isOpen);
        }
      }}
    >
      <DialogContent className="sm:max-w-2xl">
        <DialogHeader>
          <DialogTitle>Create Academic Year</DialogTitle>

          <DialogDescription>
            Create a new academic year for your school.
            Only one academic year can be active at a time.
          </DialogDescription>
        </DialogHeader>

        <AcademicYearForm
          isLoading={createMutation.isPending}
          onSubmit={handleSubmit}
          onCancel={() => onOpenChange(false)}
        />
      </DialogContent>
    </Dialog>
  );
}