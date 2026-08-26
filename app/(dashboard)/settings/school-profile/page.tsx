"use client";

import { useState } from "react";
import type { ComponentProps } from "react";

import {
  SchoolProfileDetails,
  SchoolProfileForm,
  SchoolProfileHeader,
  SchoolProfileSkeleton,
} from "@/frontend/settings/school-profile/components";

import {
  useCreateSchoolProfile,
  useSchoolProfile,
  useUpdateSchoolProfile,
} from "@/frontend/settings/school-profile/hooks";

type SchoolProfileFormValues =
  ComponentProps<typeof SchoolProfileForm>["onSubmit"] extends (
    values: infer V,
  ) => unknown
    ? V
    : never;

export default function SchoolProfilePage() {
  const {
    data: profile,
    isLoading,
    isError,
  } = useSchoolProfile();

  const createMutation = useCreateSchoolProfile();
  const updateMutation = useUpdateSchoolProfile();

  const [isEditing, setIsEditing] = useState(false);

  // 👈 Fix: Safely handle both null and undefined states
  const hasProfile = profile != null;
  const isCreateMode = !profile;

  async function handleSubmit(values: SchoolProfileFormValues) {
    if (isCreateMode) {
      await createMutation.mutateAsync(values);
      return;
    }

    await updateMutation.mutateAsync(values);
    setIsEditing(false);
  }

  if (isLoading) {
    return <SchoolProfileSkeleton />;
  }

  if (isError) {
    return (
      <div className="rounded-lg border border-destructive p-6 text-destructive">
        Failed to load school profile.
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <SchoolProfileHeader
        title="School Profile"
        description="Manage your school's basic information, branding, contact details, and localization settings."
      />

      {/* Create Profile */}
      {isCreateMode && (
        <SchoolProfileForm
          mode="create"
          isSubmitting={createMutation.isPending}
          onSubmit={handleSubmit}
        />
      )}

      {/* View Profile */}
      {hasProfile && !isEditing && profile && (
        <SchoolProfileDetails
          profile={profile}
          onEdit={() => setIsEditing(true)}
        />
      )}

      {/* Edit Profile */}
      {hasProfile && isEditing && profile && (
        <SchoolProfileForm
          mode="update"
          profile={profile}
          isSubmitting={updateMutation.isPending}
          onSubmit={handleSubmit}
          onCancel={() => setIsEditing(false)}
        />
      )}
    </div>
  );
}