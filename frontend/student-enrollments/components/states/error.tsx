"use client";

import { AlertTriangle, RefreshCcw } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

interface EnrollmentTableErrorProps {
  message?: string;
  onRetry?: () => void;
}

export function EnrollmentTableError({
  message,
  onRetry,
}: EnrollmentTableErrorProps) {
  return (
    <Card className="border-destructive">
      <CardContent className="flex h-80 flex-col items-center justify-center space-y-5">
        <AlertTriangle className="h-14 w-14 text-destructive" />

        <div className="space-y-2 text-center">
          <h2 className="text-lg font-semibold">
            Failed to Load Enrollments
          </h2>

          <p className="max-w-md text-sm text-muted-foreground">
            {message ??
              "Something went wrong while loading student enrollments."}
          </p>
        </div>

        {onRetry && (
          <Button onClick={onRetry}>
            <RefreshCcw className="mr-2 h-4 w-4" />
            Try Again
          </Button>
        )}
      </CardContent>
    </Card>
  );
}