"use client";

import { EnrollmentStatus } from "../../types/enrollment";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface StatusSelectProps {
  value?: EnrollmentStatus;
  onValueChange: (value: EnrollmentStatus) => void;
  disabled?: boolean;
  placeholder?: string;
}

const STATUS_OPTIONS = [
  {
    value: EnrollmentStatus.ACTIVE,
    label: "Active",
  },
  {
    value: EnrollmentStatus.PROMOTED,
    label: "Promoted",
  },
  {
    value: EnrollmentStatus.TRANSFERRED,
    label: "Transferred",
  },
  {
    value: EnrollmentStatus.PASSED_OUT,
    label: "PASSED_OUT",
  },
  
  {
    value: EnrollmentStatus.LEFT,
    label: "Left",
  },
] as const;

export function StatusSelect({
  value,
  onValueChange,
  disabled = false,
  placeholder = "Select status",
}: StatusSelectProps) {
  return (
    <Select
      value={value}
      onValueChange={(value) =>
        onValueChange(value as EnrollmentStatus)
      }
      disabled={disabled}
    >
      <SelectTrigger className="w-full">
        <SelectValue placeholder={placeholder} />
      </SelectTrigger>

      <SelectContent>
        {STATUS_OPTIONS.map((status) => (
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