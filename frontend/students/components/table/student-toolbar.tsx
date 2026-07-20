"use client";

import Link from "next/link";
import { Plus } from "lucide-react";

import { Button } from "@/components/ui/button";

import { SearchInput } from "../filters/search-input";
import { ClassFilter } from "../filters/class-filter";
import { SectionFilter } from "../filters/section-filter";
import { StatusFilter } from "../filters/status-filter";

import { STUDENT_ROUTES } from "../../constants";
import type { StudentStatus } from "../../types";

interface StudentToolbarProps {
  search: string;

  classId?: string;

  sectionId?: string;

  status?: StudentStatus;

  onSearchChange: (value: string) => void;

  onClassChange: (value?: string) => void;

  onSectionChange: (value?: string) => void;

  onStatusChange: (value?: StudentStatus) => void;

  onResetFilters: () => void;
}

export function StudentToolbar({
  search,

  classId,

  sectionId,

  status,

  onSearchChange,

  onClassChange,

  onSectionChange,

  onStatusChange,

  onResetFilters,
}: StudentToolbarProps) {
  return (
    <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
      <div className="flex flex-1 flex-wrap items-center gap-2">
        <SearchInput
          value={search}
          onChange={onSearchChange}
        />

        <ClassFilter
          value={classId}
          onChange={onClassChange}
          options={[]}
        />

        <SectionFilter
          value={sectionId}
          onChange={onSectionChange}
          sections={[]}
        />

        <StatusFilter
          value={status}
          onChange={onStatusChange}
        />

        <Button
          variant="outline"
          onClick={onResetFilters}
        >
          Reset
        </Button>
      </div>

      <Link href={STUDENT_ROUTES.CREATE}>
        <Button>
          <Plus className="mr-2 h-4 w-4" />
          Add Student
        </Button>
      </Link>
    </div>
  );
}