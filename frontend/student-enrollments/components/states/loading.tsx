"use client";

import { Loader2 } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

export function EnrollmentTableLoading() {
  return (
    <Card>
      <CardContent className="flex h-80 items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <Loader2 className="h-10 w-10 animate-spin text-primary" />
          <div className="space-y-1 text-center">
            <h3 className="font-medium">Loading Enrollments</h3>
            <p className="text-sm text-muted-foreground">
              Please wait while we fetch student enrollments...
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}