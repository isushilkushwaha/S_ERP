"use client";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface ClassOption {
  id: string;
  name: string;
}

interface ClassFilterProps {
  value?: string;
  options: ClassOption[];

  onChange: (value?: string) => void;

  disabled?: boolean;
}

export function ClassFilter({
  value,
  options,
  onChange,
  disabled,
}: ClassFilterProps) {
  return (
    <Select
      value={value ?? "all"}
      disabled={disabled}
      onValueChange={(value) =>
        onChange(value === "all" || value == null ? undefined : value)
      }
    >
      <SelectTrigger className="w-[180px]">
        <SelectValue placeholder="Class" />
      </SelectTrigger>

      <SelectContent>
        <SelectItem value="all">
          All Classes
        </SelectItem>

        {options.map((item) => (
          <SelectItem
            key={item.id}
            value={item.id}
          >
            {item.name}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}