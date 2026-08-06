"use client";

import { Loader2, Trash2, AlertTriangle } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";

import {
  removeStudentFormSchema,
  type RemoveStudentFormValues,
} from "../../schemas/remove-student.schema";
import { useRemoveStudent } from "../../hooks/use-remove-student";

import type { Student } from "../../types";

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";

import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

interface RemoveStudentFormProps {
  student: Student;
  onClose: () => void;
}

export function RemoveStudentForm({
  student,
  onClose,
}: RemoveStudentFormProps) {
  const removeStudent = useRemoveStudent();

  const form = useForm<RemoveStudentFormValues>({
    resolver: zodResolver(removeStudentFormSchema),
    defaultValues: {
      studentCode: "",
      fullName: "",
      confirm: false,
    },
    mode: "onChange",
  });

  const databaseFullName = [
    student.firstName,
    student.middleName,
    student.lastName,
  ]
    .filter(Boolean)
    .join(" ")
    .trim();

  const onSubmit = (values: RemoveStudentFormValues) => {
    const enteredCode = values.studentCode.trim();
    const enteredName = values.fullName.trim().replace(/\s+/g, " ");
    const expectedName = databaseFullName.replace(/\s+/g, " ");

    // Validate Student Code
    if (enteredCode !== student.studentCode) {
      form.setError("studentCode", {
        type: "manual",
        message: "Student Code does not match.",
      });
      return;
    }

    // Validate Student Name
    if (enteredName.toLowerCase() !== expectedName.toLowerCase()) {
      form.setError("fullName", {
        type: "manual",
        message: "Student Full Name does not match.",
      });
      return;
    }

    removeStudent.mutate(
      {
        studentCode: student.studentCode,
        fullName: databaseFullName,
      },
      {
        onSuccess: () => {
          toast.success("Student record permanently removed.");
          form.reset();
          onClose();
        },
        onError: (error) => {
          toast.error(
            error instanceof Error
              ? error.message
              : "Failed to remove student record."
          );
        },
      }
    );
  };

  const isPending = removeStudent.isPending;

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
        {/* Warning Callout Box */}
        <div className="flex items-start gap-3 rounded-lg border border-destructive/30 bg-destructive/10 p-3.5 text-destructive">
          <AlertTriangle className="h-5 w-5 shrink-0 mt-0.5" />
          <div className="space-y-1">
            <p className="text-xs font-bold uppercase tracking-wider">
              Irreversible Action Warning
            </p>
            <p className="text-xs text-destructive/90 leading-relaxed">
              Permanently deleting this record removes all associated statutory data, academic records, and profile details.
            </p>
          </div>
        </div>

        {/* Confirm Student Code Field */}
        <FormField
          control={form.control}
          name="studentCode"
          render={({ field }) => (
            <FormItem className="space-y-1.5">
              <div className="flex items-center justify-between">
                <FormLabel className="text-xs font-semibold">
                  Confirm Student Code
                </FormLabel>
                <Badge variant="outline" className="font-mono text-[10px]">
                  {student.studentCode}
                </Badge>
              </div>

              <FormControl>
                <Input
                  placeholder={`Type "${student.studentCode}" to confirm`}
                  autoComplete="off"
                  disabled={isPending}
                  className="font-mono text-xs"
                  {...field}
                />
              </FormControl>

              <FormMessage />
            </FormItem>
          )}
        />

        {/* Confirm Full Name Field */}
        <FormField
          control={form.control}
          name="fullName"
          render={({ field }) => (
            <FormItem className="space-y-1.5">
              <div className="flex items-center justify-between">
                <FormLabel className="text-xs font-semibold">
                  Confirm Student Full Name
                </FormLabel>
                <span className="truncate max-w-[200px] text-[11px] font-medium text-muted-foreground">
                  {databaseFullName}
                </span>
              </div>

              <FormControl>
                <Input
                  placeholder={`Type "${databaseFullName}"`}
                  autoComplete="off"
                  disabled={isPending}
                  className="text-xs"
                  {...field}
                />
              </FormControl>

              <FormMessage />
            </FormItem>
          )}
        />

        {/* Confirmation Checkbox */}
        <FormField
          control={form.control}
          name="confirm"
          render={({ field }) => (
            <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-lg border border-border/80 bg-background p-3.5 shadow-2xs hover:border-destructive/40 transition-colors">
              <FormControl>
                <Checkbox
                  checked={field.value}
                  onCheckedChange={field.onChange}
                  disabled={isPending}
                  className="mt-0.5"
                />
              </FormControl>

              <div className="space-y-1 leading-none cursor-pointer">
                <FormLabel className="text-xs font-semibold text-foreground cursor-pointer">
                  Acknowledge Permanent Deletion
                </FormLabel>
                <p className="text-[11px] text-muted-foreground">
                  I confirm that I want to purge this student account from the active database.
                </p>
                <FormMessage />
              </div>
            </FormItem>
          )}
        />

        {/* Action Controls */}
        <div className="flex items-center justify-end gap-2.5 pt-2 border-t border-border/60">
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={onClose}
            disabled={isPending}
          >
            Cancel
          </Button>

          <Button
            type="submit"
            variant="destructive"
            size="sm"
            disabled={isPending || !form.formState.isValid}
            className="gap-2 font-medium"
          >
            {isPending ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                <span>Deleting Record...</span>
              </>
            ) : (
              <>
                <Trash2 className="h-4 w-4" />
                <span>Delete Registration</span>
              </>
            )}
          </Button>
        </div>
      </form>
    </Form>
  );
}