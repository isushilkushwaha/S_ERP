"use client";

import React, { memo } from "react";
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";


interface SearchProps {
  placeholder?: string;
  onSearch?: (value: string) => void;
  disabled?: boolean;
  loading?: boolean;
}

export const SearchBar = memo(({ 
  placeholder = "Search students, fees, attendance...", 
  onSearch, 
  disabled = false,
  loading = false 
}: SearchProps) => {
  return (
    <div className="relative flex items-center w-full max-w-sm">
      {/* Desktop Search */}
      <div className="relative hidden md:flex w-full items-center">
        <Search className="absolute left-2.5 h-4 w-4 text-muted-foreground" />
        <Input
          type="search"
          placeholder={placeholder}
          className="w-full pl-9 pr-12 h-9 rounded-xl border-border"
          disabled={disabled || loading}
          onChange={(e) => onSearch?.(e.target.value)}
        />
        <kbd className="absolute right-2.5 pointer-events-none inline-flex h-5 select-none items-center gap-1 rounded border bg-muted px-1.5 font-mono text-[10px] font-medium text-muted-foreground opacity-100">
          <span className="text-xs">⌘</span>K
        </kbd>
      </div>

      {/* Mobile Search - Icon Only */}
      <button 
        className="md:hidden flex h-9 w-9 items-center justify-center rounded-xl border bg-background text-muted-foreground hover:bg-accent"
        aria-label="Search"
      >
        <Search className="h-4 w-4" />
      </button>
    </div>
  );
});

SearchBar.displayName = "SearchBar";