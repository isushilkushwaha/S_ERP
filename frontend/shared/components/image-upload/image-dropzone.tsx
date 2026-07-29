"use client";

import { useState } from "react";
import type { RefObject } from "react";
import { UploadCloud } from "lucide-react";

import { cn } from "@/lib/utils";

interface ImageDropzoneProps {
  inputRef: RefObject<HTMLInputElement | null>;
  accept?: string;
  disabled?: boolean;
  onFileSelect: (file: File) => void;
}

export function ImageDropzone({
  inputRef,
  accept = "image/png,image/jpeg,image/webp,image/svg+xml",
  disabled,
  onFileSelect,
}: ImageDropzoneProps) {
  const [dragging, setDragging] = useState(false);

  function handleFile(file?: File) {
    if (!file) return;

    onFileSelect(file);

    if (inputRef.current) {
      inputRef.current.value = "";
    }
  }

  return (
    <>
      <input
        ref={inputRef}
        hidden
        type="file"
        accept={accept}
        disabled={disabled}
        onChange={(event) => handleFile(event.target.files?.[0])}
      />

      <div
        role="button"
        tabIndex={disabled ? -1 : 0}
        onClick={() => inputRef.current?.click()}
        onKeyDown={(event) => {
          if (event.key === "Enter" || event.key === " ") {
            event.preventDefault();
            inputRef.current?.click();
          }
        }}
        onDragOver={(event) => {
          event.preventDefault();
          setDragging(true);
        }}
        onDragLeave={() => setDragging(false)}
        onDrop={(event) => {
          event.preventDefault();
          setDragging(false);
          handleFile(event.dataTransfer.files?.[0]);
        }}
        className={cn(
          "group relative flex cursor-pointer items-center justify-between gap-3 rounded-lg border border-dashed px-3 py-2 transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/50",
          dragging
            ? "border-primary bg-primary/10 ring-2 ring-primary/20"
            : "border-border/80 bg-muted/20 hover:border-primary/60 hover:bg-muted/40",
          disabled && "pointer-events-none opacity-50"
        )}
      >
        {/* Left: Icon & Main Prompt */}
        <div className="flex items-center gap-2.5 min-w-0">
          <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-md bg-background shadow-2xs border border-border/50 text-muted-foreground group-hover:text-primary transition-colors">
            <UploadCloud className="h-4 w-4" />
          </div>
          <div className="flex flex-col truncate">
            <p className="text-xs font-medium text-foreground truncate">
              {dragging ? "Drop image here" : "Choose file or drag & drop"}
            </p>
            <p className="text-[10px] text-muted-foreground truncate">
              PNG, JPG, WEBP, SVG up to 2MB
            </p>
          </div>
        </div>

        {/* Right: Browse Action Tag */}
        <span className="shrink-0 rounded bg-background px-2 py-0.5 text-[10px] font-semibold text-muted-foreground border border-border/60 shadow-2xs group-hover:text-foreground">
          Browse
        </span>
      </div>
    </>
  );
}