"use client";

import React, { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { AlertTriangle } from "lucide-react";

interface ErrorProps {
  error: Error & { digest?: string };
  reset: () => void;
}

export default function ClassesError({ error, reset }: ErrorProps) {
  useEffect(() => {
    console.error("[CLASSES_PAGE_ERROR]", error);
  }, [error]);

  return (
    <div className="flex h-[70vh] flex-col items-center justify-center gap-4 text-center">
      <div className="flex h-12 w-12 items-center justify-center rounded-full bg-destructive/10 text-destructive">
        <AlertTriangle className="h-6 w-6" />
      </div>
      <div className="space-y-1">
        <h2 className="text-xl font-bold tracking-tight">Failed to load Classes Settings</h2>
        <p className="max-w-md text-sm text-muted-foreground">
          {error.message || "An unexpected error occurred while fetching module configuration."}
        </p>
      </div>
      <Button onClick={reset} variant="default" size="sm">
        Try Again
      </Button>
    </div>
  );
}