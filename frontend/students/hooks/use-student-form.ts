"use client";

import { useRouter } from "next/navigation";
import { toast } from "sonner";

import { useCreateStudent } from "./use-create-student";
import { useUpdateStudent } from "./use-update-student";
import type { UseFormReturn } from "react-hook-form";
import { ApiError } from "@/lib/api-client";

import type { StudentFormValues } from "../schemas/student-form.schema";

interface UseStudentFormOptions {
  studentId?: string;
   form: UseFormReturn<StudentFormValues>;
}

export function useStudentForm({
  studentId,
  form,
}: UseStudentFormOptions)  {
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

        toast.success("Student updated successfully.", {
  description: "The student's information has been updated.",
});


        setTimeout(() => {
  router.push("/students");
  router.refresh();
}, 1200);


      } else {
        await createMutation.mutateAsync(values as any);

        toast.success("Student registered successfully.", {
  description: "The student has been added successfully.",
});


      }

      //router.push("/students");
      //router.refresh();
      setTimeout(() => {
  router.push("/students");
  router.refresh();
}, 1200);


    } catch (error) {
  if (error instanceof ApiError) {
    if (error.errors) {
      Object.entries(error.errors).forEach(([field, messages]) => {
        if (!messages?.length) return;

        form.setError(field as keyof StudentFormValues, {
          type: "server",
          message: messages[0],
        });
      });
    }

    toast.error("Unable to save student.", {
  description: error.message,
});

    return;
  }

  toast.error("Something went wrong.", {
  description: "Please try again or contact the administrator.",
});


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