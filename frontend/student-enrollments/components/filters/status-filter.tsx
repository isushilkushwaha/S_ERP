"use client";

import { CheckCircle2 } from "lucide-react";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";


import { EnrollmentStatus } from "../../types/enrollment";

interface StatusFilterProps {
  value?: EnrollmentStatus | "";
  onChange: (value: EnrollmentStatus | "") => void;
  disabled?: boolean;
  className?: string;
}

const STATUS_OPTIONS: {
  value: EnrollmentStatus;
  label: string;
}[] = [
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
  
];

export function StatusFilter({
  value = "",
  onChange,
  disabled = false,
  className,
}: StatusFilterProps) {
  return (
    <Select
      value={value as string}
      disabled={disabled}
      onValueChange={(selectedValue) =>
        onChange(selectedValue as EnrollmentStatus | "")
      }
    >
      <SelectTrigger className={className ?? "w-full lg:w-[180px]"}>
        <div className="flex items-center gap-2">
          <CheckCircle2 className="h-4 w-4 text-muted-foreground" />

          <SelectValue placeholder="All Status" />
        </div>
      </SelectTrigger>

      <SelectContent>
        <SelectItem value="">All Status</SelectItem>

        {STATUS_OPTIONS.map((status) => (
          <SelectItem key={status.value} value={status.value}>
            {status.label}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}