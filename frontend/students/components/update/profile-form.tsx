"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2, User, Phone, Mail, AlertCircle, Save } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

import type { Student } from "../../types/student";
import type { UpdateProfileRequest } from "../../types/student";

import {
  profileSchema,
  type ProfileFormValues,
} from "../../schemas/update/profile-schema";

import { useUpdateProfile } from "../../hooks/update/use-update-profile";

interface ProfileFormProps {
  student: Student;
  onCancel: () => void;
}

export function ProfileForm({ student, onCancel }: ProfileFormProps) {
  const mutation = useUpdateProfile();

  const form = useForm<ProfileFormValues>({
    resolver: zodResolver(profileSchema),

    // Automatically updates form after React Query cache refresh
    values: {
      firstName: student.firstName ?? "",
      middleName: student.middleName ?? "",
      lastName: student.lastName ?? "",
      mobile: student.mobile ?? "",
      email: student.email ?? "",
    },
  });

  const onSubmit = (values: ProfileFormValues) => {
    const payload: UpdateProfileRequest = {
      firstName: values.firstName.trim(),
      middleName: values.middleName?.trim() || null,
      lastName: values.lastName?.trim() || null,
      mobile: values.mobile?.trim() || null,
      email: values.email?.trim() || null,
    };

    mutation.mutate(
      {
        id: student.id,
        payload,
      },
      {
        onSuccess: () => {
          toast.success("Profile updated successfully.");
          onCancel();
        },

        onError: (error) => {
          toast.error(
            error instanceof Error
              ? error.message
              : "Failed to update profile."
          );
        },
      }
    );
  };

  return (
    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 pt-2">
      {/* Section 1: Full Name Information */}
      <div className="space-y-4">
        <div className="flex items-center gap-2 rounded-md bg-muted/60 px-3 py-1.5 border border-border/60">
          <User className="h-4 w-4 text-primary shrink-0" />
          <span className="text-xs font-bold tracking-wider text-foreground uppercase">
            Legal Name Details
          </span>
        </div>

        <div className="grid gap-4 sm:grid-cols-3">
          {/* First Name */}
          <div className="space-y-2">
            <Label
              htmlFor="firstName"
              className="text-xs font-bold text-foreground/80 uppercase tracking-wider"
            >
              First Name <span className="text-destructive">*</span>
            </Label>
            <div className="relative">
              <User className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                id="firstName"
                placeholder="First Name"
                disabled={mutation.isPending}
                className={`pl-9 border-border/80 bg-background font-medium focus-visible:ring-2 focus-visible:ring-primary ${
                  form.formState.errors.firstName ? "border-destructive" : ""
                }`}
                {...form.register("firstName")}
              />
            </div>
            {form.formState.errors.firstName && (
              <p className="flex items-center gap-1 text-xs font-semibold text-destructive pt-0.5">
                <AlertCircle className="h-3 w-3 shrink-0" />
                {form.formState.errors.firstName.message}
              </p>
            )}
          </div>

          {/* Middle Name */}
          <div className="space-y-2">
            <Label
              htmlFor="middleName"
              className="text-xs font-bold text-foreground/80 uppercase tracking-wider"
            >
              Middle Name
            </Label>
            <div className="relative">
              <User className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground/60" />
              <Input
                id="middleName"
                placeholder="Middle Name"
                disabled={mutation.isPending}
                className={`pl-9 border-border/80 bg-background font-medium focus-visible:ring-2 focus-visible:ring-primary ${
                  form.formState.errors.middleName ? "border-destructive" : ""
                }`}
                {...form.register("middleName")}
              />
            </div>
            {form.formState.errors.middleName && (
              <p className="flex items-center gap-1 text-xs font-semibold text-destructive pt-0.5">
                <AlertCircle className="h-3 w-3 shrink-0" />
                {form.formState.errors.middleName.message}
              </p>
            )}
          </div>

          {/* Last Name */}
          <div className="space-y-2">
            <Label
              htmlFor="lastName"
              className="text-xs font-bold text-foreground/80 uppercase tracking-wider"
            >
              Last Name
            </Label>
            <div className="relative">
              <User className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground/60" />
              <Input
                id="lastName"
                placeholder="Last Name"
                disabled={mutation.isPending}
                className={`pl-9 border-border/80 bg-background font-medium focus-visible:ring-2 focus-visible:ring-primary ${
                  form.formState.errors.lastName ? "border-destructive" : ""
                }`}
                {...form.register("lastName")}
              />
            </div>
            {form.formState.errors.lastName && (
              <p className="flex items-center gap-1 text-xs font-semibold text-destructive pt-0.5">
                <AlertCircle className="h-3 w-3 shrink-0" />
                {form.formState.errors.lastName.message}
              </p>
            )}
          </div>
        </div>
      </div>

      {/* Section 2: Primary Contact Coordinates */}
      <div className="space-y-4">
        <div className="flex items-center gap-2 rounded-md bg-muted/60 px-3 py-1.5 border border-border/60">
          <Phone className="h-4 w-4 text-primary shrink-0" />
          <span className="text-xs font-bold tracking-wider text-foreground uppercase">
            Contact Coordinates
          </span>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          {/* Mobile Number */}
          <div className="space-y-2">
            <Label
              htmlFor="mobile"
              className="text-xs font-bold text-foreground/80 uppercase tracking-wider"
            >
              Mobile Number
            </Label>
            <div className="relative">
              <Phone className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                id="mobile"
                placeholder="e.g. +91 9876543210"
                disabled={mutation.isPending}
                className={`pl-9 font-mono border-border/80 bg-background font-medium focus-visible:ring-2 focus-visible:ring-primary ${
                  form.formState.errors.mobile ? "border-destructive" : ""
                }`}
                {...form.register("mobile")}
              />
            </div>
            {form.formState.errors.mobile && (
              <p className="flex items-center gap-1 text-xs font-semibold text-destructive pt-0.5">
                <AlertCircle className="h-3 w-3 shrink-0" />
                {form.formState.errors.mobile.message}
              </p>
            )}
          </div>

          {/* Email Address */}
          <div className="space-y-2">
            <Label
              htmlFor="email"
              className="text-xs font-bold text-foreground/80 uppercase tracking-wider"
            >
              Email Address
            </Label>
            <div className="relative">
              <Mail className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                id="email"
                type="email"
                placeholder="student@school.edu"
                disabled={mutation.isPending}
                className={`pl-9 border-border/80 bg-background font-medium focus-visible:ring-2 focus-visible:ring-primary ${
                  form.formState.errors.email ? "border-destructive" : ""
                }`}
                {...form.register("email")}
              />
            </div>
            {form.formState.errors.email && (
              <p className="flex items-center gap-1 text-xs font-semibold text-destructive pt-0.5">
                <AlertCircle className="h-3 w-3 shrink-0" />
                {form.formState.errors.email.message}
              </p>
            )}
          </div>
        </div>
      </div>

      {/* Form Action Buttons */}
      <div className="flex items-center justify-end gap-3 border-t border-border/80 pt-5">
        <Button
          type="button"
          variant="outline"
          disabled={mutation.isPending}
          onClick={onCancel}
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