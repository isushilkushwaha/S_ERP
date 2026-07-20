"use client";

import * as React from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export interface SectionOption {
  id: string;
  name: string;
}

interface SectionFilterProps {
  value?: string;
  options: SectionOption[];
  onChange: (value: string) => void;
  placeholder?: string;
  disabled?: boolean;
  className?: string;
}

const ALL_SECTIONS = "__ALL__";

export function SectionFilter({
  value,
  options,
  onChange,
  placeholder = "All Sections",
  disabled = false,
  className,
}: SectionFilterProps) {
  const selectedValue =
    value && value.trim().length > 0 ? value : ALL_SECTIONS;

  const handleValueChange = (selected: string | null) => {
    if (!selected || selected === ALL_SECTIONS) {
      onChange("");
      return;
    }

    onChange(selected);
  };

  return (
    <Select
      value={selectedValue}
      onValueChange={handleValueChange}
      disabled={disabled}
    >
      <SelectTrigger className={className ?? "w-full min-w-[180px]"}>
        <SelectValue placeholder={placeholder} />
      </SelectTrigger>

      <SelectContent>
        <SelectItem value={ALL_SECTIONS}>
          All Sections
        </SelectItem>

        {options.map((section) => (
          <SelectItem
            key={section.id}
            value={section.id}
          >
            {section.name}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}

export default SectionFilter;