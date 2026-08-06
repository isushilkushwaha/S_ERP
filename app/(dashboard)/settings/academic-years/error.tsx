"use client";

import { useEffect } from "react";

import { Button } from "@/components/ui/button";

interface ErrorProps {
  error: Error & {
    digest?: string;
  };
  reset: () => void;
}

export default function Error({
  error,
  reset,
}: ErrorProps) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="flex min-h-[400px] flex-col items-center justify-center gap-4">
      <h2 className="text-xl font-semibold">
        Something went wrong
      </h2>

      <p className="text-muted-foreground">
        Unable to load Academic Years.
      </p>

      <Button onClick={reset}>
        Try Again
      </Button>
    </div>
  );
}