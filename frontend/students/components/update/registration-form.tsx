"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import {
  Loader2,
  FileBadge,
  Lock,
  AlertCircle,
  Save,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

import type { Student } from "../../types/student";
import {
  registrationSchema,
  type RegistrationFormValues,
} from "../../schemas/update/registration-schema";
import { useUpdateRegistration } from "../../hooks/update/use-update-registration";

interface RegistrationFormProps {
  student: Student;
  onCancel: () => void;
  onSubmitSuccess?: (values: RegistrationFormValues) => void;
}

export function RegistrationForm({
  student,
  onCancel,
  onSubmitSuccess,
}: RegistrationFormProps) {
  const updateRegistration = useUpdateRegistration();

  const form = useForm<RegistrationFormValues>({
    resolver: zodResolver(registrationSchema),
    defaultValues: {
      emisNumber: student.emisNumber ?? "",
      apaarId: student.apaarId ?? "",
      penNumber: student.penNumber ?? "",
    },
  });

  const onSubmit = (values: RegistrationFormValues) => {
    updateRegistration.mutate(
      {
        studentId: student.id,
        data: values,
      },
      {
        onSuccess: () => {
          toast.success("Registration details updated successfully.");
          if (onSubmitSuccess) {
            onSubmitSuccess(values);
          } else {
            onCancel();
          }
        },
        onError: (error) => {
          toast.error(
            error instanceof Error
              ? error.message
              : "Failed to update registration details."
          );
        },
      }
    );
  };

  const handleCancel = () => {
    form.reset();
    onCancel();
  };

  const isPending = updateRegistration.isPending;

  return (
    <form
      id="registration-form"
      onSubmit={form.handleSubmit(onSubmit)}
      className="space-y-6 pt-2"
    >
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {/* Student Code (Read-Only) */}
        <div className="space-y-2">
          <Label
            htmlFor="studentCode"
            className="text-xs font-bold uppercase tracking-wider text-foreground/80"
          >
            Student Code
          </Label>

          <div className="relative">
            <Lock className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground/60" />
            <Input
              id="studentCode"
              value={student.studentCode}
              disabled
              readOnly
              className="pl-9 font-mono bg-muted/40 border-border/80 text-muted-foreground font-bold cursor-not-allowed"
            />
          </div>

          <p className="text-[11px] font-medium text-muted-foreground">
            Immutable primary code.
          </p>
        </div>

        {/* EMIS Number */}
        <div className="space-y-2">
          <Label
            htmlFor="emisNumber"
            className="text-xs font-bold uppercase tracking-wider text-foreground/80"
          >
            EMIS Number
          </Label>

          <div className="relative">
            <FileBadge className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              id="emisNumber"
              placeholder="Enter EMIS Number"
              disabled={isPending}
              className={`pl-9 font-mono border-border/80 bg-background font-medium focus-visible:ring-2 focus-visible:ring-primary ${
                form.formState.errors.emisNumber ? "border-destructive" : ""
              }`}
              {...form.register("emisNumber")}
            />
          </div>

          {form.formState.errors.emisNumber && (
            <p className="flex items-center gap-1 text-xs font-semibold text-destructive pt-0.5">
              <AlertCircle className="h-3 w-3 shrink-0" />
              {form.formState.errors.emisNumber.message}
            </p>
          )}
        </div>

        {/* APAAR ID */}
        <div className="space-y-2">
          <Label
            htmlFor="apaarId"
            className="text-xs font-bold uppercase tracking-wider text-foreground/80"
          >
            APAAR ID
          </Label>

          <Input
            id="apaarId"
            placeholder="12-digit APAAR ID"
            disabled={isPending}
            className={`font-mono border-border/80 bg-background font-medium focus-visible:ring-2 focus-visible:ring-primary ${
              form.formState.errors.apaarId ? "border-destructive" : ""
            }`}
            {...form.register("apaarId")}
          />

          {form.formState.errors.apaarId && (
            <p className="flex items-center gap-1 text-xs font-semibold text-destructive pt-0.5">
              <AlertCircle className="h-3 w-3 shrink-0" />
              {form.formState.errors.apaarId.message}
            </p>
          )}
        </div>

        {/* PEN Number */}
        <div className="space-y-2">
          <Label
            htmlFor="penNumber"
            className="text-xs font-bold uppercase tracking-wider text-foreground/80"
          >
            PEN Number
          </Label>

          <Input
            id="penNumber"
            placeholder="Permanent Education No."
            disabled={isPending}
            className={`font-mono border-border/80 bg-background font-medium focus-visible:ring-2 focus-visible:ring-primary ${
              form.formState.errors.penNumber ? "border-destructive" : ""
            }`}
            {...form.register("penNumber")}
          />

          {form.formState.errors.penNumber && (
            <p className="flex items-center gap-1 text-xs font-semibold text-destructive pt-0.5">
              <AlertCircle className="h-3 w-3 shrink-0" />
              {form.formState.errors.penNumber.message}
            </p>
          )}
        </div>
      </div>

      {/* Form Action Controls */}
      <div className="flex items-center justify-end gap-3 border-t border-border/80 pt-5">
        <Button
          type="button"
          variant="outline"
          disabled={isPending}
          onClick={handleCancel}
          className="px-5 font-semibold transition-colors hover:bg-muted"
        >
          Cancel
        </Button>

        <Button
          type="submit"
          disabled={isPending}
          className="gap-2 px-6 font-semibold shadow-xs transition-colors"
        >
          {isPending ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin shrink-0" />
              <span>Saving...</span>
            </>
          ) : (
            <>
              <Save className="h-4 w-4 shrink-0" />
              <span>Save Changes</span>
            </>
          )}
        </Button>
      </div>
    </form>
  );
}