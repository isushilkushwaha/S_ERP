"use client";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import { STUDENT_STATUS_OPTIONS } from "../../constants";
import type { StudentStatus } from "../../types";

interface StatusFilterProps {
  value?: StudentStatus;
  onChange: (status?: StudentStatus) => void;
}

export function StatusFilter({
  value,
  onChange,
}: StatusFilterProps) {
  return (
    <Select
      value={value ?? "all"}
      onValueChange={(value) =>
        onChange(
          value === "all"
            ? undefined
            : (value as StudentStatus)
        )
      }
    >
      <SelectTrigger className="w-[180px]">
        <SelectValue placeholder="Status" />
      </SelectTrigger>

      <SelectContent>
        <SelectItem value="all">
          All Status
        </SelectItem>

        {STUDENT_STATUS_OPTIONS.map((status) => (
          <SelectItem
            key={status.value}
            value={status.value}
          >
            {status.label}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}