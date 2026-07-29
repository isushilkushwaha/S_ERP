"use client";

import { Progress } from "@/components/ui/progress";

interface ImageProgressProps {
  progress: number;
}

export function ImageProgress({
  progress,
}: ImageProgressProps) {
  if (progress <= 0 || progress >= 100) {
    return null;
  }

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between text-sm">
        <span>Uploading...</span>

        <span>{progress}%</span>
      </div>

      <Progress value={progress} />
    </div>
  );
}