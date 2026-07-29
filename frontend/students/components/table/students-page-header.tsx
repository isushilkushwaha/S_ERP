"use client";

import Link from "next/link";
import { UserPlus } from "lucide-react";

import { Button } from "@/components/ui/button";
import { RemoveStudentButton } from "@/frontend/students/components/remove/remove-student-button";

interface StudentsPageHeaderProps {
  title?: string;
  description?: string;
}

export function StudentsPageHeader({
  title = "Student List",
  description = "Manage student records, search, filter, and perform student operations.",
}: StudentsPageHeaderProps) {
  return (
    <header className="sticky top-0 z-20 -mx-6 bg-background/95 px-6 py-4 backdrop-blur-md transition-all border-b border-border/40">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        {/* Title & Subtitle */}
        <div className="space-y-0.5">
          <h1 className="text-2xl font-bold tracking-tight text-foreground">
            {title}
          </h1>

          <p className="text-xs font-medium text-muted-foreground">
            {description}
          </p>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-2.5 shrink-0">
          {/* New Registration Button */}
          <Link href="/students/registration">
            <Button size="sm" className="gap-2 font-medium shadow-xs">
              <UserPlus className="h-4 w-4" />
              <span>New Registration</span>
            </Button>
          </Link>

          {/* Remove Student Button */}
          <RemoveStudentButton />
        </div>
      </div>
    </header>
  );
}