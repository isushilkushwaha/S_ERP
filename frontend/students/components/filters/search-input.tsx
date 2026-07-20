"use client";

import * as React from "react";
import { Search, X } from "lucide-react";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

interface SearchInputProps {
  value: string;
  placeholder?: string;

  onChange: (value: string) => void;

  onSearch?: (value: string) => void;

  debounce?: number;
}

export function SearchInput({
  value,
  placeholder = "Search...",
  onChange,
  onSearch,
  debounce = 500,
}: SearchInputProps) {
  const [search, setSearch] = React.useState(value);

  React.useEffect(() => {
    setSearch(value);
  }, [value]);

  React.useEffect(() => {
    const timer = setTimeout(() => {
      onChange(search);
      onSearch?.(search);
    }, debounce);

    return () => clearTimeout(timer);
  }, [search, debounce, onChange, onSearch]);

  return (
    <div className="relative w-full max-w-sm">
      <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />

      <Input
        value={search}
        placeholder={placeholder}
        className="pl-9 pr-10"
        onChange={(event) =>
          setSearch(event.target.value)
        }
      />

      {search && (
        <Button
          type="button"
          variant="ghost"
          size="icon"
          className="absolute right-1 top-1/2 h-7 w-7 -translate-y-1/2"
          onClick={() => setSearch("")}
        >
          <X className="h-4 w-4" />
        </Button>
      )}
    </div>
  );
}