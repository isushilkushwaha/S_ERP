"use client";

import Link from "next/link";
import { Inbox } from "lucide-react";

import { Button } from "@/components/ui/button";
import { STUDENT_ROUTES } from "../../constants";

interface EmptyStateProps {
  title?: string;
  description?: string;
}

export function EmptyState({
  title = "No students found",
  description = "There are no students matching your current filters.",
}: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center rounded-lg border border-dashed py-16 text-center">
      <Inbox className="mb-4 size-12 text-muted-foreground" />

      <h3 className="text-lg font-semibold">
        {title}
      </h3>

      <p className="mt-2 max-w-sm text-sm text-muted-foreground">
        {description}
      </p>

      <Link href={STUDENT_ROUTES.CREATE}>
        <Button className="mt-6">
          Add Student
        </Button>
      </Link>
    </div>
  );
}