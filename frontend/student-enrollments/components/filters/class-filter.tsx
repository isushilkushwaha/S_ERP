"use client";

import * as React from "react";
import { GraduationCap } from "lucide-react";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export interface ClassOption {
  id: string;
  name: string;
}

interface ClassFilterProps {
  value?: string;
  options: ClassOption[];
  onChange: (value: string | undefined) => void;
  disabled?: boolean;
  placeholder?: string;
  className?: string;
}

export function ClassFilter({
  value,
  options,
  onChange,
  disabled = false,
  placeholder = "All Classes",
  className,
}: ClassFilterProps) {
  const handleValueChange = (selectedValue: string | null) => {
    if (selectedValue === null || selectedValue === "all") {
      onChange(undefined);
      return;
    }

    onChange(selectedValue);
  };

  return (
    <div className={className}>
      <Select
        disabled={disabled}
        value={value ?? "all"}
        onValueChange={handleValueChange}
      >
        <SelectTrigger className="min-w-[180px]">
          <div className="flex items-center gap-2">
            <GraduationCap className="h-4 w-4 text-muted-foreground" />
            <SelectValue placeholder={placeholder} />
          </div>
        </SelectTrigger>

        <SelectContent>
          <SelectItem value="all">{placeholder}</SelectItem>

          {options.map((classItem) => (
            <SelectItem key={classItem.id} value={classItem.id}>
              {classItem.name}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}

export default ClassFilter;