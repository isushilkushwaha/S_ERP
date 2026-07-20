"use client";

import * as React from "react";
import { Search, X } from "lucide-react";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export interface EnrollmentSearchProps {
  /**
   * Current search value
   */
  value: string;

  /**
   * Called after debounce
   */
  onChange: (value: string) => void;

  /**
   * Placeholder text
   */
  placeholder?: string;

  /**
   * Debounce delay (ms)
   */
  debounce?: number;

  /**
   * Disable input
   */
  disabled?: boolean;

  /**
   * Additional className
   */
  className?: string;
}

export function EnrollmentSearch({
  value,
  onChange,
  placeholder = "Search by student, admission no or roll no...",
  debounce = 300,
  disabled = false,
  className,
}: EnrollmentSearchProps) {
  const [search, setSearch] = React.useState(value);

  /**
   * Sync external value
   */
  React.useEffect(() => {
    setSearch(value);
  }, [value]);

  /**
   * Debounce search
   */
  React.useEffect(() => {
    const timer = window.setTimeout(() => {
      if (search !== value) {
        onChange(search.trim());
      }
    }, debounce);

    return () => window.clearTimeout(timer);
  }, [search, value, debounce, onChange]);

  const clearSearch = () => {
    setSearch("");
    onChange("");
  };

  return (
    <div className={`relative w-full max-w-md ${className ?? ""}`}>
      <Search
        className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground"
      />

      <Input
        value={search}
        disabled={disabled}
        autoComplete="off"
        spellCheck={false}
        placeholder={placeholder}
        className="pr-10 pl-10"
        onChange={(event) => setSearch(event.target.value)}
        aria-label="Search student enrollments"
      />

      {search.length > 0 && (
        <Button
          type="button"
          variant="ghost"
          size="icon"
          onClick={clearSearch}
          disabled={disabled}
          className="absolute right-1 top-1/2 h-8 w-8 -translate-y-1/2"
        >
          <X className="h-4 w-4" />
          <span className="sr-only">Clear search</span>
        </Button>
      )}
    </div>
  );
}