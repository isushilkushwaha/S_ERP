"use client";

import * as React from "react";
import { CalendarDays } from "lucide-react";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface AcademicYearOption {
  id: string;
  name: string;
}

interface AcademicYearFilterProps {
  value?: string;
  options: AcademicYearOption[];
  onChange: (value: string) => void;
  disabled?: boolean;
  placeholder?: string;
  className?: string;
}

export function AcademicYearFilter({
  value,
  options,
  onChange,
  disabled = false,
  placeholder = "Academic Year",
  className,
}: AcademicYearFilterProps) {
  return (
    <div className={className}>
      <Select
        value={value ?? "all"}
        onValueChange={(value) =>
          onChange(value === "all" || value === null ? "" : value)
        }
        disabled={disabled}
      >
        <SelectTrigger className="w-full min-w-[220px]">
          <div className="flex items-center gap-2">
            <CalendarDays className="h-4 w-4 text-muted-foreground" />
            <SelectValue placeholder={placeholder} />
          </div>
        </SelectTrigger>

        <SelectContent>
          <SelectItem value="all">
            All Academic Years
          </SelectItem>

          {options.map((academicYear) => (
            <SelectItem
              key={academicYear.id}
              value={academicYear.id}
            >
              {academicYear.name}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}