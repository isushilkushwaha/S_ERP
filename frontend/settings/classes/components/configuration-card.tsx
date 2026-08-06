// frontend/settings/classes/components/configuration-card.tsx

"use client";

import React, { useEffect } from "react";
import { useForm, SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { classConfigurationSchema } from "@/features/settings/classes/schema/class-configuration.schema";
import { ClassConfiguration } from "@/frontend/settings/classes/types/configuration";
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";

type ConfigFormValues = z.infer<typeof classConfigurationSchema>;

interface ConfigurationCardProps {
  classId: string;
  className: string;
  configuration?: ClassConfiguration | null;
  onSave: (payload: ConfigFormValues) => Promise<void>;
  isSaving?: boolean;
}

export function ConfigurationCard({
  classId,
  className,
  configuration,
  onSave,
  isSaving,
}: ConfigurationCardProps) {
  // Pass undefined instead of `any` for the second generic argument to resolve @typescript-eslint/no-explicit-any
  const {
    register,
    handleSubmit,
    watch,
    setValue,
    reset,
    formState: { errors },
  } = useForm<z.input<typeof classConfigurationSchema>, undefined, ConfigFormValues>({
    resolver: zodResolver(classConfigurationSchema),
    defaultValues: {
      classId,
      sectionsEnabled: true,
      defaultSectionCapacity: 40,
      maxStudentsWithoutSection: null,
      autoAllocationEnabled: true,
    },
  });

  const sectionsEnabled = watch("sectionsEnabled");
  const autoAllocationEnabled = watch("autoAllocationEnabled");

  useEffect(() => {
    reset({
      classId,
      sectionsEnabled: configuration?.sectionsEnabled ?? true,
      defaultSectionCapacity: configuration?.defaultSectionCapacity ?? 40,
      maxStudentsWithoutSection: configuration?.maxStudentsWithoutSection ?? null,
      autoAllocationEnabled: configuration?.autoAllocationEnabled ?? true,
    });
  }, [classId, configuration, reset]);

  const handleFormSubmit: SubmitHandler<ConfigFormValues> = async (data) => {
    await onSave(data);
  };

  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-base font-semibold">
          Configuration: <span className="text-primary">{className}</span>
        </CardTitle>
      </CardHeader>
      <form onSubmit={handleSubmit(handleFormSubmit)}>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between rounded-lg border p-3">
            <div className="space-y-0.5">
              <Label className="text-sm font-medium">Enable Sections</Label>
              <p className="text-xs text-muted-foreground">
                Subdivide students into Section A, B, C...
              </p>
            </div>
            <Switch
              checked={sectionsEnabled}
              onCheckedChange={(checked) => setValue("sectionsEnabled", checked)}
            />
          </div>

          {sectionsEnabled ? (
            <div className="space-y-1">
              <Label htmlFor="defaultSectionCapacity">Default Section Capacity</Label>
              <Input
                id="defaultSectionCapacity"
                type="number"
                {...register("defaultSectionCapacity", { valueAsNumber: true })}
              />
              {errors.defaultSectionCapacity && (
                <p className="text-xs text-destructive">{errors.defaultSectionCapacity.message}</p>
              )}
            </div>
          ) : (
            <div className="space-y-1">
              <Label htmlFor="maxStudentsWithoutSection">Max Students (No Sections)</Label>
              <Input
                id="maxStudentsWithoutSection"
                type="number"
                placeholder="e.g. 30"
                {...register("maxStudentsWithoutSection", { valueAsNumber: true })}
              />
              {errors.maxStudentsWithoutSection && (
                <p className="text-xs text-destructive">{errors.maxStudentsWithoutSection.message}</p>
              )}
            </div>
          )}

          <div className="flex items-center justify-between rounded-lg border p-3">
            <div className="space-y-0.5">
              <Label className="text-sm font-medium">Auto Section Allocation</Label>
              <p className="text-xs text-muted-foreground">
                Automatically assign available sections during admission
              </p>
            </div>
            <Switch
              checked={autoAllocationEnabled}
              onCheckedChange={(checked) => setValue("autoAllocationEnabled", checked)}
            />
          </div>
        </CardContent>

        <CardFooter className="pt-2">
          <Button type="submit" size="sm" className="w-full" disabled={isSaving}>
            {isSaving ? "Saving Config..." : "Save Configuration"}
          </Button>
        </CardFooter>
      </form>
    </Card>
  );
}