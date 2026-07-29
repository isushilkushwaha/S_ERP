"use client";

import { RotateCcw, Search } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

import { EnrollmentStatus } from "../../types/enrollment";

interface EnrollmentToolbarProps {
  search: string;
  onSearchChange: (value: string) => void;

  academicYearId?: string;
  onAcademicYearChange: (value: string) => void;

  classId?: string;
  onClassChange: (value: string) => void;

  sectionId?: string;
  onSectionChange: (value: string) => void;

  status?: EnrollmentStatus;
  onStatusChange: (value: EnrollmentStatus | undefined) => void;

  onResetFilters: () => void;
}

export function EnrollmentToolbar({
  search,
  onSearchChange,

  academicYearId,
  onAcademicYearChange,

  classId,
  onClassChange,

  sectionId,
  onSectionChange,

  status,
  onStatusChange,

  onResetFilters,
}: EnrollmentToolbarProps) {
  return (
    <div className="space-y-4">
      {/* Search */}
      <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <div className="relative w-full md:max-w-sm">
          <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />

          <Input
            value={search}
            placeholder="Search by student..."
            className="pl-9"
            onChange={(e) => onSearchChange(e.target.value)}
          />
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-3">
        {/* Academic Year Select */}

        {/* Class Select */}

        {/* Section Select */}

        {/* Status Select */}

        <Button
          variant="outline"
          onClick={onResetFilters}
        >
          <RotateCcw className="mr-2 h-4 w-4" />
          Reset
        </Button>
      </div>
    </div>
  );
}