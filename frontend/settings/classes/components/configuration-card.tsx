"use client";

import React, { useEffect } from "react";
import {
  useForm,
  SubmitHandler,
} from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

import { classConfigurationSchema } from "@/features/settings/classes/schema/class-configuration.schema";

import { ClassConfiguration } from "@/frontend/settings/classes/types/configuration";

import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardFooter,
} from "@/components/ui/card";

import { Switch } from "@/components/ui/switch";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";

type ConfigFormValues = z.infer<
  typeof classConfigurationSchema
>;

interface ConfigurationCardProps {
  /**
   * Currently selected academic year.
   *
   * Configuration belongs to the
   * academic-year + class combination.
   */
  academicYearId: string;

  /**
   * Selected class.
   */
  classId: string;

  /**
   * Class display name.
   */
  className: string;

  /**
   * Configuration returned from the API.
   */
  configuration?: ClassConfiguration | null;

  /**
   * Save configuration.
   */
  onSave: (
    payload: ConfigFormValues
  ) => Promise<void>;

  /**
   * Saving state.
   */
  isSaving?: boolean;
}

export function ConfigurationCard({
  academicYearId,
  classId,
  className,
  configuration,
  onSave,
  isSaving,
}: ConfigurationCardProps) {
  const {
    register,
    handleSubmit,
    watch,
    setValue,
    reset,
    formState: { errors },
  } = useForm<
    z.input<typeof classConfigurationSchema>,
    undefined,
    ConfigFormValues
  >({
    resolver: zodResolver(
      classConfigurationSchema
    ),

    defaultValues: {
      academicYearId,

      classId,

      sectionsEnabled: true,

      defaultSectionCapacity: 40,

      maxStudentsWithoutSection: null,

      autoAllocationEnabled: true,
    },
  });

  /**
   * Current sections setting.
   */
  const sectionsEnabled =
    watch("sectionsEnabled");

  /**
   * Current automatic allocation setting.
   */
  const autoAllocationEnabled =
    watch("autoAllocationEnabled");

  /**
   * Reset the form whenever:
   *
   * - academic year changes
   * - class changes
   * - configuration is loaded/changed
   */
  useEffect(() => {
    reset({
      academicYearId,

      classId,

      sectionsEnabled:
        configuration?.sectionsEnabled ??
        true,

      defaultSectionCapacity:
        configuration?.defaultSectionCapacity ??
        40,

      maxStudentsWithoutSection:
        configuration?.maxStudentsWithoutSection ??
        null,

      autoAllocationEnabled:
        configuration?.autoAllocationEnabled ??
        true,
    });
  }, [
    academicYearId,
    classId,
    configuration,
    reset,
  ]);

  /**
   * Submit configuration.
   */
  const handleFormSubmit: SubmitHandler<
    ConfigFormValues
  > = async (data) => {
    await onSave(data);
  };

  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-base font-semibold">
          Configuration:{" "}
          <span className="text-primary">
            {className}
          </span>
        </CardTitle>
      </CardHeader>

      <form
        onSubmit={handleSubmit(
          handleFormSubmit
        )}
      >
        <CardContent className="space-y-4">
          {/* Academic Year */}
          <div className="rounded-lg border bg-muted/30 p-3">
            <p className="text-xs text-muted-foreground">
              Academic Year
            </p>

            <p className="text-sm font-medium">
              {academicYearId}
            </p>
          </div>

          {/* Sections */}
          <div className="flex items-center justify-between rounded-lg border p-3">
            <div className="space-y-0.5">
              <Label className="text-sm font-medium">
                Enable Sections
              </Label>

              <p className="text-xs text-muted-foreground">
                Subdivide students into Section
                A, B, C...
              </p>
            </div>

            <Switch
              checked={sectionsEnabled}
              onCheckedChange={(checked) =>
                setValue(
                  "sectionsEnabled",
                  checked,
                  {
                    shouldValidate: true,
                    shouldDirty: true,
                  }
                )
              }
            />
          </div>

          {/* Section Capacity */}
          {sectionsEnabled ? (
            <div className="space-y-1">
              <Label htmlFor="defaultSectionCapacity">
                Default Section Capacity
              </Label>

              <Input
                id="defaultSectionCapacity"
                type="number"
                min={1}
                {...register(
                  "defaultSectionCapacity",
                  {
                    valueAsNumber: true,
                  }
                )}
              />

              {errors.defaultSectionCapacity && (
                <p className="text-xs text-destructive">
                  {
                    errors
                      .defaultSectionCapacity
                      .message
                  }
                </p>
              )}
            </div>
          ) : (
            <div className="space-y-1">
              <Label htmlFor="maxStudentsWithoutSection">
                Max Students (No Sections)
              </Label>

              <Input
                id="maxStudentsWithoutSection"
                type="number"
                min={1}
                placeholder="e.g. 30"
                {...register(
                  "maxStudentsWithoutSection",
                  {
                    valueAsNumber: true,
                  }
                )}
              />

              {errors.maxStudentsWithoutSection && (
                <p className="text-xs text-destructive">
                  {
                    errors
                      .maxStudentsWithoutSection
                      .message
                  }
                </p>
              )}
            </div>
          )}

          {/* Automatic Section Allocation */}
          <div className="flex items-center justify-between rounded-lg border p-3">
            <div className="space-y-0.5">
              <Label className="text-sm font-medium">
                Auto Section Allocation
              </Label>

              <p className="text-xs text-muted-foreground">
                Automatically assign available
                sections during admission
              </p>
            </div>

            <Switch
              checked={
                autoAllocationEnabled
              }
              onCheckedChange={(checked) =>
                setValue(
                  "autoAllocationEnabled",
                  checked,
                  {
                    shouldValidate: true,
                    shouldDirty: true,
                  }
                )
              }
            />
          </div>

          {/* Hidden/registered academic year and class values */}
          <input
            type="hidden"
            {...register("academicYearId")}
          />

          <input
            type="hidden"
            {...register("classId")}
          />
        </CardContent>

        <CardFooter className="pt-2">
          <Button
            type="submit"
            size="sm"
            className="w-full"
            disabled={
              isSaving ||
              !academicYearId ||
              !classId
            }
          >
            {isSaving
              ? "Saving Config..."
              : "Save Configuration"}
          </Button>
        </CardFooter>
      </form>
    </Card>
  );
}