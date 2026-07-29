"use client";

import { FormProvider, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner"; // Modern toast library

import {
  createSchoolProfileSchema,
  type CreateSchoolProfileFormValues,
} from "@/features/settings/school-profile/schemas/school-profile.schema";

import type { SchoolProfile } from "../types";
import { defaultSchoolProfileValues, mapSchoolProfileToForm } from "../utils";

import {
  BasicInformation,
  Branding,
  ContactInformation,
  AddressInformation,
  AcademicInformation,
  Localization,
  FormActions,
} from "./sections";

interface SchoolProfileFormProps {
  mode: "create" | "update";
  profile?: SchoolProfile | null;
  isSubmitting: boolean;
  onSubmit: (values: CreateSchoolProfileFormValues) => Promise<void>;
  onCancel?: () => void;
}

export function SchoolProfileForm({
  mode,
  profile,
  isSubmitting,
  onSubmit,
  onCancel,
}: SchoolProfileFormProps) {
  const methods = useForm<CreateSchoolProfileFormValues>({
    resolver: zodResolver(createSchoolProfileSchema),
    defaultValues: profile
      ? mapSchoolProfileToForm(profile)
      : defaultSchoolProfileValues,
  });

  const handleFormSubmit = methods.handleSubmit(async (values) => {
    const actionText = mode === "create" ? "creating" : "updating";
    const successText = mode === "create" ? "created" : "updated";

    toast.promise(onSubmit(values), {
      loading: `Saving school profile...`,
      success: () => {
        if (mode === "create") {
          methods.reset(defaultSchoolProfileValues);
        }
        return `School profile ${successText} successfully!`;
      },
      error: (err) => {
        return err?.message || `Failed to ${actionText} school profile. Please try again.`;
      },
    });
  });

  const handleReset = () => {
    methods.reset(
      profile ? mapSchoolProfileToForm(profile) : defaultSchoolProfileValues
    );
    toast.info("Form reset to original values");
  };

  return (
    <FormProvider {...methods}>
      <form onSubmit={handleFormSubmit} className="space-y-6">
        <BasicInformation />
        <Branding />
        <ContactInformation />
        <AddressInformation />
        <AcademicInformation />
        <Localization />

        <FormActions
          mode={mode}
          isSubmitting={isSubmitting}
          onReset={handleReset}
          onCancel={onCancel}
        />
      </form>
    </FormProvider>
  );
}