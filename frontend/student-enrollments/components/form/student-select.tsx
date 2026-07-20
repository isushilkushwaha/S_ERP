"use client";

import * as React from "react";
import { Check, ChevronsUpDown } from "lucide-react";

import { cn } from "@/lib/utils";

import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

import { useStudents } from "@/frontend/students/hooks/use-students";

interface StudentOption {
  id: string;
  fullName: string;
  admissionNumber: string;
}

interface StudentSelectProps {
  value?: string;
  onChange: (value: string) => void;

  disabled?: boolean;

  placeholder?: string;
}

export function StudentSelect({
  value,
  onChange,
  disabled = false,
  placeholder = "Select student",
}: StudentSelectProps) {
  const [open, setOpen] = React.useState(false);

  const { data, isLoading } = useStudents({
    page: 1,
    limit: 100,
  });

  const students: StudentOption[] = (data?.data ?? []).map((s: any) => ({
    id: s.id,
    // prefer explicit fullName, fall back to common name fields
    fullName:
      s.fullName ?? s.name ?? `${s.firstName ?? ""} ${s.lastName ?? ""}`.trim(),
    admissionNumber: s.admissionNumber ?? s.admission_number ?? "",
  }));

  const selectedStudent = students.find(
    (student) => student.id === value
  );

  return (
    <Popover
      open={open}
      onOpenChange={setOpen}
    >
      {/* <PopoverTrigger asChild>
        <Button
          type="button"
          variant="outline"
          role="combobox"
          disabled={disabled}
          aria-expanded={open}
          className="w-full justify-between"
        >
          {selectedStudent ? (
            <div className="flex flex-col items-start">
              <span>{selectedStudent.fullName}</span>

              <span className="text-muted-foreground text-xs">
                {selectedStudent.admissionNumber}
              </span>
            </div>
          ) : (
            <span className="text-muted-foreground">
              {placeholder}
            </span>
          )}

          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger> */}

       <PopoverTrigger>
  <Button
    type="button"
    variant="outline"
    role="combobox"
    disabled={disabled}
    aria-expanded={open}
    className="w-full justify-between"
  >
    {selectedStudent ? (
      <div className="flex flex-col items-start">
        <span>{selectedStudent.fullName}</span>
        <span className="text-muted-foreground text-xs">
          {selectedStudent.admissionNumber}
        </span>
      </div>
    ) : (
      <span className="text-muted-foreground">{placeholder}</span>
    )}

    <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
  </Button>
</PopoverTrigger>

      <PopoverContent
        className="w-[400px] p-0"
        align="start"
      >
        <Command shouldFilter>
          <CommandInput placeholder="Search student..." />

          <CommandList>
            {isLoading && (
              <div className="p-4 text-center text-sm">
                Loading students...
              </div>
            )}

            {!isLoading && (
              <>
                <CommandEmpty>
                  No students found.
                </CommandEmpty>

                <CommandGroup>
                  {students.map((student) => (
                    <CommandItem
                      key={student.id}
                      value={`${student.fullName} ${student.admissionNumber}`}
                      onSelect={() => {
                        onChange(student.id);
                        setOpen(false);
                      }}
                    >
                      <Check
                        className={cn(
                          "mr-2 h-4 w-4",
                          value === student.id
                            ? "opacity-100"
                            : "opacity-0"
                        )}
                      />

                      <div className="flex flex-col">
                        <span>{student.fullName}</span>

                        <span className="text-muted-foreground text-xs">
                          {student.admissionNumber}
                        </span>
                      </div>
                    </CommandItem>
                  ))}
                </CommandGroup>
              </>
            )}
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}