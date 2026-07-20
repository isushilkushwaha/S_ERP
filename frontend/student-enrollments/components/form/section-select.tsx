"use client";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import { useSections } from "@/frontend/sections/api/sections.query";

interface SectionSelectProps {
  classId?: string;
  value?: string;
  onChange: (value: string | null) => void;
  disabled?: boolean;
}

export function SectionSelect({
  classId,
  value,
  onChange,
  disabled,
}: SectionSelectProps) {
  const { data, isLoading } = useSections(classId);

  const sections = data ?? [];

  return (
    <Select
      value={value}
      onValueChange={onChange}
      disabled={disabled || !classId || isLoading}
    >
      <SelectTrigger>
        <SelectValue
          placeholder={
            !classId
              ? "Select class first"
              : isLoading
              ? "Loading sections..."
              : "Select section"
          }
        />
      </SelectTrigger>

      <SelectContent>
        {sections.length === 0 ? (
          <SelectItem value="__empty" disabled>
            No sections found
          </SelectItem>
        ) : (
          sections.map((section) => (
            <SelectItem
              key={section.id}
              value={section.id}
            >
              {section.name}
            </SelectItem>
          ))
        )}
      </SelectContent>
    </Select>
  );
}