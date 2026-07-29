"use client";

import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

function SectionSkeleton({
  fields = 2,
}: {
  fields?: number;
}) {
  return (
    <Card>
      <CardHeader>
        <Skeleton className="h-6 w-48" />
        <Skeleton className="mt-2 h-4 w-72" />
      </CardHeader>

      <CardContent>
        <div className="grid gap-6 md:grid-cols-2">
          {Array.from({ length: fields }).map((_, index) => (
            <div key={index} className="space-y-2">
              <Skeleton className="h-4 w-28" />
              <Skeleton className="h-10 w-full rounded-md" />
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

export function SchoolProfileSkeleton() {
  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="space-y-2">
        <Skeleton className="h-8 w-64" />
        <Skeleton className="h-4 w-96 max-w-full" />
      </div>

      {/* Basic Information */}
      <SectionSkeleton fields={2} />

      {/* Branding */}
      <SectionSkeleton fields={1} />

      {/* Contact Information */}
      <SectionSkeleton fields={4} />

      {/* Address */}
      <SectionSkeleton fields={7} />

      {/* Academic Information */}
      <SectionSkeleton fields={3} />

      {/* Localization */}
      <SectionSkeleton fields={3} />

      {/* Actions */}
      <div className="flex justify-end gap-3">
        <Skeleton className="h-10 w-24" />
        <Skeleton className="h-10 w-36" />
      </div>
    </div>
  );
}