"use client";

import { useState } from "react";
import { Check, ChevronsUpDown, Loader2 } from "lucide-react";

import { cn } from "@/lib/utils";

import { Button } from "@/components/ui/button";

import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";

import { useAcademicYearsData } from "@/frontend/academic-years/hooks/use-academic-years";

import type { AcademicYear } from "@/frontend/academic-years/types/academic-year";

interface AcademicYearSelectProps {
  value?: string;
  onValueChange: (value: string) => void;
  disabled?: boolean;
  placeholder?: string;
  className?: string;
}

export function AcademicYearSelect({
  value,
  onValueChange,
  disabled = false,
  placeholder = "Select academic year",
  className,
}: AcademicYearSelectProps) {
  const [open, setOpen] = useState(false);

  const {
    data: response,
    isLoading,
    isError,
  } = useAcademicYearsData();

  const academicYears = response?.data ?? [];

  const selected = academicYears.find(
    (item: AcademicYear) => item.id === value
  );

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger>
  <Button
    type="button"
    variant="outline"
    role="combobox"
    disabled={disabled || isLoading}
    className={cn("w-full justify-between", className)}
  >
    <span>{selected?.name ?? placeholder}</span>

    {isLoading ? (
      <Loader2 className="h-4 w-4 animate-spin" />
    ) : (
      <ChevronsUpDown className="h-4 w-4 opacity-50" />
    )}
  </Button>
</PopoverTrigger>

      <PopoverContent className="w-[320px] p-0">
        <Command>
          <CommandInput placeholder="Search academic year..." />

          <CommandList>
            <CommandEmpty>
              {isError
                ? "Unable to load academic years."
                : "No academic year found."}
            </CommandEmpty>

            <CommandGroup>
              {academicYears.map((year: AcademicYear) => (
                <CommandItem
                  key={year.id}
                  value={year.name}
                  onSelect={() => {
                    onValueChange(year.id);
                    setOpen(false);
                  }}
                >
                  <Check
                    className={cn(
                      "mr-2 h-4 w-4",
                      value === year.id
                        ? "opacity-100"
                        : "opacity-0"
                    )}
                  />

                  {year.name}
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}