"use client";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import { useClasses } from "@/frontend/classes/hooks/use-classes";

import type { Class } from "@/frontend/classes/types/class";

interface ClassSelectProps {
  value?: string;
  onChange: (value: string) => void;
  disabled?: boolean;
}

export function ClassSelect({
  value,
  onChange,
  disabled,
}: ClassSelectProps) {
 const {
  data,
  isLoading,
  isError,
} = useClasses();

  const classes = data?.data ?? [];

  return (
    <Select
      value={value}
      onValueChange={(value) => onChange(value ?? "")}
      disabled={disabled || isLoading}
    >
      <SelectTrigger>
        <SelectValue placeholder="Select Class" />
      </SelectTrigger>

      <SelectContent>
        {isLoading && (
          <SelectItem value="loading" disabled>
            Loading...
          </SelectItem>
        )}

        {isError && (
          <SelectItem value="error" disabled>
            Failed to load classes
          </SelectItem>
        )}

        {classes.map((item: Class) => (
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