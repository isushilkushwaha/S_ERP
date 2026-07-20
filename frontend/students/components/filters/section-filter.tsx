"use client";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface SectionOption {
  id: string;
  name: string;
}

interface SectionFilterProps {
  value?: string;
  disabled?: boolean;
  sections: SectionOption[];
  onChange: (sectionId?: string) => void;
}

export function SectionFilter({
  value,
  disabled,
  sections,
  onChange,
}: SectionFilterProps) {
  return (
    <Select
      value={value ?? "all"}
      disabled={disabled}
      onValueChange={(value) => {
        const sectionId = value === "all" || value == null ? undefined : value;
        onChange(sectionId);
      }}
    >
      <SelectTrigger className="w-[180px]">
        <SelectValue placeholder="Section" />
      </SelectTrigger>

      <SelectContent>
        <SelectItem value="all">
          All Sections
        </SelectItem>

        {sections.map((section) => (
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