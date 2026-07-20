"use client";

import { ErrorState } from "@/frontend/students/components/states";

export default function Error({
  reset,
}: {
  error: Error;
  reset: () => void;
}) {
  return (
    <ErrorState
      title="Failed to load students"
      description="Something went wrong while loading the student module."
      onRetry={reset}
    />
  );
}