"use client";

import * as React from "react";
import { RotateCcw } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

import { SearchInput } from "../filters/search-input";

interface StudentToolbarProps {
  search: string;
  onSearchChange: (value: string) => void;
  onResetFilters: () => void;

  /**
   * Optional toolbar actions.
   *
   * Example:
   * actions={
   *   <>
   *     <RemoveStudentButton />
   *     <ExportStudentsButton />
   *   </>
   * }
   */
  actions?: React.ReactNode;
}

export function StudentToolbar({
  search,
  onSearchChange,
  onResetFilters,
  actions,
}: StudentToolbarProps) {
  const hasActiveFilters = Boolean(search.trim());

  return (
    <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
      {/* Left Section */}
      <div className="flex flex-1 flex-wrap items-center gap-2.5">
        <div className="w-full sm:max-w-sm">
          <SearchInput
            value={search}
            onChange={onSearchChange}
          />
        </div>

        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger
              render={
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={onResetFilters}
                  disabled={!hasActiveFilters}
                  className="gap-2"
                  aria-label="Reset filters"
                >
                  <RotateCcw className="h-4 w-4" />
                  <span>Reset</span>
                </Button>
              }
            />

            <TooltipContent className="text-xs font-medium">
              Clear Search
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </div>

      {/* Right Section */}
      <div className="flex w-full justify-end lg:w-auto">
        <div className="flex flex-wrap items-center gap-2">
          {actions}
        </div>
      </div>
    </div>
  );
}