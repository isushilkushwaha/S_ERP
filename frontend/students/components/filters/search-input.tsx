// frontend/students/components/filters/search-input.tsx

"use client";

import * as React from "react";
import { Search, X } from "lucide-react";

import { Input } from "@/components/ui/input";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface SearchInputProps {
  value: string;
  placeholder?: string;
  onChange: (value: string) => void;
  onSearch?: (value: string) => void;
  debounce?: number;
}

export function SearchInput({
  value,
  placeholder = "Search students...",
  onChange,
  onSearch,
  debounce = 500,
}: SearchInputProps) {
  const [search, setSearch] = React.useState(value);
  const [isFocused, setIsFocused] = React.useState(false);
  const [showTooltip, setShowTooltip] = React.useState(false);
  const inputRef = React.useRef<HTMLInputElement>(null);

  // Derived state sync without useEffect to prevent cascading renders
  const [prevValue, setPrevValue] = React.useState(value);
  if (value !== prevValue) {
    setPrevValue(value);
    setSearch(value);
  }

  React.useEffect(() => {
    const timer = setTimeout(() => {
      onChange(search);
      onSearch?.(search);
    }, debounce);

    return () => clearTimeout(timer);
  }, [search, debounce, onChange, onSearch]);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Escape" && search) {
      setSearch("");
      inputRef.current?.blur();
    }
  };

  const handleClear = () => {
    setSearch("");
    inputRef.current?.focus();
  };

  const supportedFields = [
    "Student Name",
    "Student Code",
    "Father's Name",
    "Mother's Name",
    "Mobile Number",
    "Addhar Number"
  ];

  return (
    <TooltipProvider>
      <Tooltip open={showTooltip || isFocused}>
        <TooltipTrigger
          className="w-full max-w-sm text-left focus:outline-hidden"
          onMouseEnter={() => setShowTooltip(true)}
          onMouseLeave={() => setShowTooltip(false)}
        >
          <div className="group relative w-full">
            {/* Search Icon */}
            <Search
              className={`absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 transition-colors duration-200 ${
                isFocused || search
                  ? "text-indigo-600 dark:text-indigo-400"
                  : "text-muted-foreground/70 group-hover:text-muted-foreground"
              }`}
            />

            {/* Input Field */}
            <Input
              ref={inputRef}
              value={search}
              placeholder={placeholder}
              onFocus={() => {
                setIsFocused(true);
                setShowTooltip(true);
              }}
              onBlur={() => {
                setIsFocused(false);
                setShowTooltip(false);
              }}
              onKeyDown={handleKeyDown}
              onChange={(event) => setSearch(event.target.value)}
              className="h-9 w-full rounded-lg border-border/70 bg-background/80 pl-9 pr-16 text-xs font-medium tracking-tight shadow-2xs transition-all duration-200 placeholder:text-muted-foreground/60 hover:border-border hover:bg-background focus:border-indigo-500/50 focus:bg-background focus:ring-2 focus:ring-indigo-500/10 focus:outline-hidden"
            />

            {/* Clear Action (Span avoids button-in-button hydration issue) */}
            <div className="absolute right-1.5 top-1/2 flex -translate-y-1/2 items-center gap-1">
              {search ? (
                <span
                  role="button"
                  tabIndex={0}
                  className="flex h-6 w-6 items-center justify-center rounded-md text-muted-foreground hover:bg-muted hover:text-foreground active:scale-95 transition-all cursor-pointer"
                  onClick={handleClear}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" || e.key === " ") {
                      e.preventDefault();
                      handleClear();
                    }
                  }}
                  title="Clear search (Esc)"
                  aria-label="Clear search input"
                >
                  <X className="h-3.5 w-3.5" />
                </span>
              ) : (
                !isFocused && (
                  <kbd className="pointer-events-none hidden select-none items-center gap-0.5 rounded border border-border/80 bg-muted/40 px-1.5 font-mono text-[10px] font-semibold text-muted-foreground/80 sm:inline-flex">
                    <span className="text-[9px]">⌘</span>K
                  </kbd>
                )
              )}
            </div>
          </div>
        </TooltipTrigger>

        {/* Search Parameter Tooltip */}
        <TooltipContent
          side="bottom"
          align="start"
          sideOffset={8}
          className="w-72 rounded-xl border border-indigo-500/20 bg-background/95 p-3.5 text-foreground shadow-xl backdrop-blur-md dark:border-indigo-400/20"
        >
          <div className="space-y-3">
            <div className="flex items-center justify-between border-b border-border/60 pb-2">
              <div className="flex items-center gap-2">
                <div className="flex h-6 w-6 items-center justify-center rounded-md bg-indigo-500/10 text-indigo-600 dark:bg-indigo-400/15 dark:text-indigo-400">
                  <Search className="h-3.5 w-3.5" />
                </div>
                <span className="text-xs font-bold tracking-tight text-foreground">
                  Search Parameters
                </span>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-1.5">
              {supportedFields.map((field) => (
                <div
                  key={field}
                  className="flex items-center gap-2 rounded-md border border-border/50 bg-muted/40 px-2 py-1.5 text-[11px] font-medium text-foreground transition-all hover:border-indigo-500/40 hover:bg-indigo-500/5"
                >
                  <span className="h-1.5 w-1.5 rounded-full bg-indigo-500 shrink-0 dark:bg-indigo-400" />
                  <span className="truncate">{field}</span>
                </div>
              ))}
            </div>

            <div className="flex items-center justify-between rounded-md border border-border/40 bg-muted/30 px-2.5 py-1 text-[10px] text-muted-foreground">
              <span>Clear search field</span>
              <kbd className="rounded border border-border bg-background px-1.5 py-0.5 font-mono text-[9px] font-semibold text-foreground shadow-2xs">
                Esc
              </kbd>
            </div>
          </div>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}