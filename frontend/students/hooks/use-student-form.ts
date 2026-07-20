"use client";

import { useRouter } from "next/navigation";
import { toast } from "sonner";

import { useCreateStudent } from "./use-create-student";
import { useUpdateStudent } from "./use-update-student";

import type { StudentFormValues } from "../schemas/student-form.schema";

interface UseStudentFormOptions {
  studentId?: string;
}

export function useStudentForm({
  studentId,
}: UseStudentFormOptions = {}) {
  const router = useRouter();

  const createMutation = useCreateStudent();
  const updateMutation = useUpdateStudent();

  const isEdit = Boolean(studentId);

  async function onSubmit(values: StudentFormValues) {
    try {
      if (isEdit && studentId) {
        await updateMutation.mutateAsync({
          studentId,
          payload: values as any,
        });

        toast.success("Student updated successfully.");
      } else {
        await createMutation.mutateAsync(values as any);

        toast.success("Student created successfully.");
      }

      router.push("/students");
      router.refresh();
    } catch (error) {
      toast.error(
        error instanceof Error
          ? error.message
          : "Something went wrong."
      );
    }
  }

  return {
    onSubmit,
    isEdit,
    isSubmitting:
      createMutation.isPending ||
      updateMutation.isPending,
  };
}