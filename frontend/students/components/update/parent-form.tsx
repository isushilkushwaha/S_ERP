"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import {
  Loader2,
  UserCheck,
  Phone,
  Mail,
  Briefcase,
  Shield,
  HeartHandshake,
  AlertCircle,
  Save,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

import type { Student } from "../../types/student";
import {
  parentSchema,
  type ParentFormValues,
} from "../../schemas/update/parent-schema";
import { useUpdateParent } from "../../hooks/update/use-update-parent";

interface ParentFormProps {
  student: Student;
  onCancel: () => void;
}

export function ParentForm({ student, onCancel }: ParentFormProps) {
  const mutation = useUpdateParent();

  const form = useForm<ParentFormValues>({
    resolver: zodResolver(parentSchema),
    values: {
      fatherName: student.fatherName ?? "",
      fatherOccupation: student.fatherOccupation ?? "",
      fatherMobile: student.fatherMobile ?? "",
      fatherEmail: student.fatherEmail ?? "",
      motherName: student.motherName ?? "",
      motherOccupation: student.motherOccupation ?? "",
      motherMobile: student.motherMobile ?? "",
      motherEmail: student.motherEmail ?? "",
      guardianName: student.guardianName ?? "",
      guardianRelation: student.guardianRelation ?? "",
      guardianMobile: student.guardianMobile ?? "",
      guardianEmail: student.guardianEmail ?? "",
    },
  });

  const onSubmit = (values: ParentFormValues) => {
    mutation.mutate(
      {
        studentId: student.id,
        payload: values,
      },
      {
        onSuccess: () => {
          toast.success("Parent information updated successfully.");
          onCancel();
        },
        onError: (error) => {
          toast.error(
            error instanceof Error
              ? error.message
              : "Failed to update parent information."
          );
        },
      }
    );
  };

  return (
    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 pt-2">
      {/* SECTION 1: Father Details */}
      <section className="space-y-4">
        <div className="flex items-center gap-2 rounded-md bg-muted/60 px-3 py-1.5 border border-border/60">
          <UserCheck className="h-4 w-4 text-primary shrink-0" />
          <span className="text-xs font-bold tracking-wider text-foreground uppercase">
            Father Details
          </span>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {/* Father Name */}
          <div className="space-y-2">
            <Label
              htmlFor="fatherName"
              className="text-xs font-bold uppercase tracking-wider text-foreground/80"
            >
              Father Name
            </Label>
            <div className="relative">
              <UserCheck className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                id="fatherName"
                placeholder="Father's Full Name"
                autoComplete="name"
                disabled={mutation.isPending}
                className={`pl-9 border-border/80 bg-background font-medium focus-visible:ring-2 focus-visible:ring-primary ${
                  form.formState.errors.fatherName ? "border-destructive" : ""
                }`}
                {...form.register("fatherName")}
              />
            </div>
            {form.formState.errors.fatherName && (
              <p className="flex items-center gap-1 text-xs font-semibold text-destructive pt-0.5">
                <AlertCircle className="h-3 w-3 shrink-0" />
                {form.formState.errors.fatherName.message}
              </p>
            )}
          </div>

          {/* Father Occupation */}
          <div className="space-y-2">
            <Label
              htmlFor="fatherOccupation"
              className="text-xs font-bold uppercase tracking-wider text-foreground/80"
            >
              Father Occupation
            </Label>
            <div className="relative">
              <Briefcase className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                id="fatherOccupation"
                placeholder="e.g. Business / Government"
                disabled={mutation.isPending}
                className={`pl-9 border-border/80 bg-background font-medium focus-visible:ring-2 focus-visible:ring-primary ${
                  form.formState.errors.fatherOccupation
                    ? "border-destructive"
                    : ""
                }`}
                {...form.register("fatherOccupation")}
              />
            </div>
            {form.formState.errors.fatherOccupation && (
              <p className="flex items-center gap-1 text-xs font-semibold text-destructive pt-0.5">
                <AlertCircle className="h-3 w-3 shrink-0" />
                {form.formState.errors.fatherOccupation.message}
              </p>
            )}
          </div>

          {/* Father Mobile */}
          <div className="space-y-2">
            <Label
              htmlFor="fatherMobile"
              className="text-xs font-bold uppercase tracking-wider text-foreground/80"
            >
              Father Mobile
            </Label>
            <div className="relative">
              <Phone className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                id="fatherMobile"
                type="tel"
                inputMode="numeric"
                maxLength={10}
                autoComplete="tel"
                placeholder="10-digit Mobile"
                disabled={mutation.isPending}
                className={`pl-9 font-mono border-border/80 bg-background font-medium focus-visible:ring-2 focus-visible:ring-primary ${
                  form.formState.errors.fatherMobile ? "border-destructive" : ""
                }`}
                {...form.register("fatherMobile")}
              />
            </div>
            {form.formState.errors.fatherMobile && (
              <p className="flex items-center gap-1 text-xs font-semibold text-destructive pt-0.5">
                <AlertCircle className="h-3 w-3 shrink-0" />
                {form.formState.errors.fatherMobile.message}
              </p>
            )}
          </div>

          {/* Father Email */}
          <div className="space-y-2">
            <Label
              htmlFor="fatherEmail"
              className="text-xs font-bold uppercase tracking-wider text-foreground/80"
            >
              Father Email
            </Label>
            <div className="relative">
              <Mail className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                id="fatherEmail"
                type="email"
                autoComplete="email"
                placeholder="father@example.com"
                disabled={mutation.isPending}
                className={`pl-9 border-border/80 bg-background font-medium focus-visible:ring-2 focus-visible:ring-primary ${
                  form.formState.errors.fatherEmail ? "border-destructive" : ""
                }`}
                {...form.register("fatherEmail")}
              />
            </div>
            {form.formState.errors.fatherEmail && (
              <p className="flex items-center gap-1 text-xs font-semibold text-destructive pt-0.5">
                <AlertCircle className="h-3 w-3 shrink-0" />
                {form.formState.errors.fatherEmail.message}
              </p>
            )}
          </div>
        </div>
      </section>

      {/* SECTION 2: Mother Details */}
      <section className="space-y-4">
        <div className="flex items-center gap-2 rounded-md bg-muted/60 px-3 py-1.5 border border-border/60">
          <UserCheck className="h-4 w-4 text-primary shrink-0" />
          <span className="text-xs font-bold tracking-wider text-foreground uppercase">
            Mother Details
          </span>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {/* Mother Name */}
          <div className="space-y-2">
            <Label
              htmlFor="motherName"
              className="text-xs font-bold uppercase tracking-wider text-foreground/80"
            >
              Mother Name
            </Label>
            <div className="relative">
              <UserCheck className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                id="motherName"
                placeholder="Mother's Full Name"
                disabled={mutation.isPending}
                className={`pl-9 border-border/80 bg-background font-medium focus-visible:ring-2 focus-visible:ring-primary ${
                  form.formState.errors.motherName ? "border-destructive" : ""
                }`}
                {...form.register("motherName")}
              />
            </div>
            {form.formState.errors.motherName && (
              <p className="flex items-center gap-1 text-xs font-semibold text-destructive pt-0.5">
                <AlertCircle className="h-3 w-3 shrink-0" />
                {form.formState.errors.motherName.message}
              </p>
            )}
          </div>

          {/* Mother Occupation */}
          <div className="space-y-2">
            <Label
              htmlFor="motherOccupation"
              className="text-xs font-bold uppercase tracking-wider text-foreground/80"
            >
              Mother Occupation
            </Label>
            <div className="relative">
              <Briefcase className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                id="motherOccupation"
                placeholder="e.g. Teacher / Homemaker"
                disabled={mutation.isPending}
                className={`pl-9 border-border/80 bg-background font-medium focus-visible:ring-2 focus-visible:ring-primary ${
                  form.formState.errors.motherOccupation
                    ? "border-destructive"
                    : ""
                }`}
                {...form.register("motherOccupation")}
              />
            </div>
            {form.formState.errors.motherOccupation && (
              <p className="flex items-center gap-1 text-xs font-semibold text-destructive pt-0.5">
                <AlertCircle className="h-3 w-3 shrink-0" />
                {form.formState.errors.motherOccupation.message}
              </p>
            )}
          </div>

          {/* Mother Mobile */}
          <div className="space-y-2">
            <Label
              htmlFor="motherMobile"
              className="text-xs font-bold uppercase tracking-wider text-foreground/80"
            >
              Mother Mobile
            </Label>
            <div className="relative">
              <Phone className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                id="motherMobile"
                type="tel"
                inputMode="numeric"
                maxLength={10}
                autoComplete="tel"
                placeholder="10-digit Mobile"
                disabled={mutation.isPending}
                className={`pl-9 font-mono border-border/80 bg-background font-medium focus-visible:ring-2 focus-visible:ring-primary ${
                  form.formState.errors.motherMobile ? "border-destructive" : ""
                }`}
                {...form.register("motherMobile")}
              />
            </div>
            {form.formState.errors.motherMobile && (
              <p className="flex items-center gap-1 text-xs font-semibold text-destructive pt-0.5">
                <AlertCircle className="h-3 w-3 shrink-0" />
                {form.formState.errors.motherMobile.message}
              </p>
            )}
          </div>

          {/* Mother Email */}
          <div className="space-y-2">
            <Label
              htmlFor="motherEmail"
              className="text-xs font-bold uppercase tracking-wider text-foreground/80"
            >
              Mother Email
            </Label>
            <div className="relative">
              <Mail className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                id="motherEmail"
                type="email"
                autoComplete="email"
                placeholder="mother@example.com"
                disabled={mutation.isPending}
                className={`pl-9 border-border/80 bg-background font-medium focus-visible:ring-2 focus-visible:ring-primary ${
                  form.formState.errors.motherEmail ? "border-destructive" : ""
                }`}
                {...form.register("motherEmail")}
              />
            </div>
            {form.formState.errors.motherEmail && (
              <p className="flex items-center gap-1 text-xs font-semibold text-destructive pt-0.5">
                <AlertCircle className="h-3 w-3 shrink-0" />
                {form.formState.errors.motherEmail.message}
              </p>
            )}
          </div>
        </div>
      </section>

      {/* SECTION 3: Guardian Details */}
      <section className="space-y-4">
        <div className="flex items-center gap-2 rounded-md bg-muted/60 px-3 py-1.5 border border-border/60">
          <Shield className="h-4 w-4 text-primary shrink-0" />
          <span className="text-xs font-bold tracking-wider text-foreground uppercase">
            Guardian Details
          </span>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {/* Guardian Name */}
          <div className="space-y-2">
            <Label
              htmlFor="guardianName"
              className="text-xs font-bold uppercase tracking-wider text-foreground/80"
            >
              Guardian Name
            </Label>
            <div className="relative">
              <Shield className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                id="guardianName"
                placeholder="Guardian's Full Name"
                disabled={mutation.isPending}
                className={`pl-9 border-border/80 bg-background font-medium focus-visible:ring-2 focus-visible:ring-primary ${
                  form.formState.errors.guardianName ? "border-destructive" : ""
                }`}
                {...form.register("guardianName")}
              />
            </div>
            {form.formState.errors.guardianName && (
              <p className="flex items-center gap-1 text-xs font-semibold text-destructive pt-0.5">
                <AlertCircle className="h-3 w-3 shrink-0" />
                {form.formState.errors.guardianName.message}
              </p>
            )}
          </div>

          {/* Guardian Relation */}
          <div className="space-y-2">
            <Label
              htmlFor="guardianRelation"
              className="text-xs font-bold uppercase tracking-wider text-foreground/80"
            >
              Guardian Relation
            </Label>
            <div className="relative">
              <HeartHandshake className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                id="guardianRelation"
                placeholder="e.g. Uncle / Grandfather"
                disabled={mutation.isPending}
                className={`pl-9 border-border/80 bg-background font-medium focus-visible:ring-2 focus-visible:ring-primary ${
                  form.formState.errors.guardianRelation
                    ? "border-destructive"
                    : ""
                }`}
                {...form.register("guardianRelation")}
              />
            </div>
            {form.formState.errors.guardianRelation && (
              <p className="flex items-center gap-1 text-xs font-semibold text-destructive pt-0.5">
                <AlertCircle className="h-3 w-3 shrink-0" />
                {form.formState.errors.guardianRelation.message}
              </p>
            )}
          </div>

          {/* Guardian Mobile */}
          <div className="space-y-2">
            <Label
              htmlFor="guardianMobile"
              className="text-xs font-bold uppercase tracking-wider text-foreground/80"
            >
              Guardian Mobile
            </Label>
            <div className="relative">
              <Phone className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                id="guardianMobile"
                type="tel"
                inputMode="numeric"
                maxLength={10}
                autoComplete="tel"
                placeholder="10-digit Mobile"
                disabled={mutation.isPending}
                className={`pl-9 font-mono border-border/80 bg-background font-medium focus-visible:ring-2 focus-visible:ring-primary ${
                  form.formState.errors.guardianMobile
                    ? "border-destructive"
                    : ""
                }`}
                {...form.register("guardianMobile")}
              />
            </div>
            {form.formState.errors.guardianMobile && (
              <p className="flex items-center gap-1 text-xs font-semibold text-destructive pt-0.5">
                <AlertCircle className="h-3 w-3 shrink-0" />
                {form.formState.errors.guardianMobile.message}
              </p>
            )}
          </div>

          {/* Guardian Email */}
          <div className="space-y-2">
            <Label
              htmlFor="guardianEmail"
              className="text-xs font-bold uppercase tracking-wider text-foreground/80"
            >
              Guardian Email
            </Label>
            <div className="relative">
              <Mail className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                id="guardianEmail"
                type="email"
                autoComplete="email"
                placeholder="guardian@example.com"
                disabled={mutation.isPending}
                className={`pl-9 border-border/80 bg-background font-medium focus-visible:ring-2 focus-visible:ring-primary ${
                  form.formState.errors.guardianEmail ? "border-destructive" : ""
                }`}
                {...form.register("guardianEmail")}
              />
            </div>
            {form.formState.errors.guardianEmail && (
              <p className="flex items-center gap-1 text-xs font-semibold text-destructive pt-0.5">
                <AlertCircle className="h-3 w-3 shrink-0" />
                {form.formState.errors.guardianEmail.message}
              </p>
            )}
          </div>
        </div>
      </section>

      {/* Form Action Buttons */}
      <div className="flex items-center justify-end gap-3 border-t border-border/80 pt-5">
        <Button
          type="button"
          variant="outline"
          onClick={onCancel}
          disabled={mutation.isPending}
          className="px-5 font-semibold transition-colors hover:bg-muted"
        >
          Cancel
        </Button>

        <Button
          type="submit"
          disabled={mutation.isPending}
          className="gap-2 px-6 font-semibold shadow-xs transition-colors"
        >
          {mutation.isPending ? (
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