"use client";

import { Search, Plus, RefreshCw } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
// import {
//   Select,
//   SelectContent,
//   SelectItem,
//   SelectTrigger,
//   SelectValue,
// } from "@/components/ui/select";

// import { ACADEMIC_YEAR_STATUS } from "@/frontend/settings/academic-years";

interface AcademicYearToolbarProps {
  search: string;
  status: string;

  onSearchChange: (value: string) => void;
  onStatusChange: (value: string) => void;

  onRefresh: () => void;
  onCreate: () => void;

  isRefreshing?: boolean;
}

export function AcademicYearToolbar({
  search,
  onSearchChange,
  onRefresh,
  onCreate,
  isRefreshing = false,
}: AcademicYearToolbarProps) {
  return (
    <div className="flex flex-col gap-4 rounded-lg border bg-background p-4 md:flex-row md:items-center md:justify-between">
      <div className="flex flex-1 flex-col gap-3 md:flex-row">
        <div className="relative w-full md:max-w-sm">
          <Search className="text-muted-foreground absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2" />

          <Input
            value={search}
            onChange={(event) => onSearchChange(event.target.value)}
            placeholder="Search academic years..."
            className="pl-9"
          />
        </div>

        {/* <Select
          value={status}
          onValueChange={(value) => onStatusChange(value ?? "all")}
        >
          <SelectTrigger className="w-full md:w-52">
            <SelectValue placeholder="All Status" />
          </SelectTrigger>

          <SelectContent>
            <SelectItem value="all">All Status</SelectItem>

            <SelectItem value={ACADEMIC_YEAR_STATUS.ACTIVE}>
              Active
            </SelectItem>

            <SelectItem value={ACADEMIC_YEAR_STATUS.ARCHIVED}>
              Archived
            </SelectItem>
          </SelectContent>
        </Select> */}
      </div>

      <div className="flex items-center gap-2">
        <Button
          variant="outline"
          onClick={onRefresh}
          disabled={isRefreshing}
        >
          <RefreshCw
            className={`mr-2 h-4 w-4 ${
              isRefreshing ? "animate-spin" : ""
            }`}
          />
          Refresh
        </Button>

        <Button onClick={onCreate}>
          <Plus className="mr-2 h-4 w-4" />
          Academic Year
        </Button>
      </div>
    </div>
  );
}