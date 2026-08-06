"use client";

import { Search,Loader2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

interface StudentSearchProps {
  value: string;
  onValueChange: (value: string) => void;
  onSearch: () => void;
  loading?: boolean;
}

export function StudentSearch({
  value,
  onValueChange,
  onSearch,
  loading = false,
}: StudentSearchProps) {
  const isDisabled = loading || value.trim().length === 0;

  return (
    <div className="space-y-2">
      <label
        htmlFor="student-search"
        className="text-sm font-medium"
      >
        Student Code
      </label>

      <div className="flex flex-col gap-2 sm:flex-row">
        <Input
          id="student-search"
          placeholder="Enter Student Code (e.g. STD000001)"
          value={value}
          onChange={(event) =>
            onValueChange(event.target.value.toUpperCase())
          }
          onKeyDown={(event) => {
            if (event.key === "Enter" && !isDisabled) {
              event.preventDefault();
              onSearch();
            }
          }}
          autoComplete="off"
          spellCheck={false}
          className="flex-1"
        />

        <Button
  type="button"
  onClick={onSearch}
  disabled={loading}
>
  {loading ? (
    <>
      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
      Searching...
    </>
  ) : (
    <>
      <Search className="mr-2 h-4 w-4" />
      Search
    </>
  )}
</Button>
      </div>

      <p className="text-xs text-muted-foreground">
        Enter the students unique Student Code to search.
      </p>
    </div>
  );
}