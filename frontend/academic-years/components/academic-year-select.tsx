"use client";

import { ControllerRenderProps } from "react-hook-form";
import { Loader2 } from "lucide-react";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import { useAcademicYearsData } from "../hooks/use-academic-years";

interface AcademicYearSelectProps {
  field: ControllerRenderProps<any, any>;
  disabled?: boolean;
  placeholder?: string;
}

export function AcademicYearSelect({
  field,
  disabled = false,
  placeholder = "Select Academic Year",
}: AcademicYearSelectProps) {
  const {
    data,
    isLoading,
    isError,
  } = useAcademicYearsData();

  const academicYears = data?.data ?? [];

  return (
    <Select
      value={field.value ?? ""}
      onValueChange={field.onChange}
      disabled={disabled || isLoading}
    >
      <SelectTrigger className="w-full">
        <SelectValue placeholder={placeholder} />
      </SelectTrigger>

      <SelectContent>
        {isLoading && (
          <div className="flex items-center gap-2 p-2 text-sm text-muted-foreground">
            <Loader2 className="h-4 w-4 animate-spin" />
            Loading...
          </div>
        )}

        {isError && (
          <div className="p-2 text-sm text-destructive">
            Failed to load academic years.
          </div>
        )}

        {!isLoading &&
          !isError &&
          academicYears.length === 0 && (
            <div className="p-2 text-sm text-muted-foreground">
              No Academic Years Found
            </div>
          )}

        {academicYears.map((year) => (
          <SelectItem
            key={year.id}
            value={year.id}
          >
            {year.name}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}