// frontend/settings/school-profile/components/sections/branding.tsx

"use client";

import { useFormContext } from "react-hook-form";

import {
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";

import { ImageUpload } from "@/frontend/shared/components/image-upload";

import type { CreateSchoolProfileRequest } from "../../types";

export function Branding() {
  const form = useFormContext<CreateSchoolProfileRequest>();

  return (
    <section className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold">
          Branding
        </h3>

        <p className="text-sm text-muted-foreground">
          Configure your school branding information.
        </p>
      </div>

      <FormField
        control={form.control}
        name="logoUrl"
        render={({ field }) => (
          <FormItem>
            <FormControl>
              <ImageUpload
                // 1. Convert null or empty strings to undefined to match ImageUploadProps
                value={field.value && field.value.trim() !== "" ? field.value : undefined}
                onChange={(url) => {
                  // 2. Pass undefined or empty string instead of null on change/clear
                  field.onChange(url && url.trim() !== "" ? url : "");
                }}
                uploadUrl="/api/uploads/school-logo"
                label="School Logo"
                description="Upload your school's official logo. Supported formats: PNG, JPG, WEBP. Maximum size: 2 MB."
              />
            </FormControl>

            <FormMessage />
          </FormItem>
        )}
      />
    </section>
  );
}