import React from "react";
import { Skeleton } from "@/components/ui/skeleton";

export default function ClassesLoading() {
  return (
    <div className="flex flex-col gap-6 p-6">
      <div className="space-y-2">
        <Skeleton className="h-8 w-64" />
        <Skeleton className="h-4 w-96" />
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
        <div className="lg:col-span-7">
          <Skeleton className="h-[420px] w-full rounded-xl" />
        </div>
        <div className="flex flex-col gap-6 lg:col-span-5">
          <Skeleton className="h-32 w-full rounded-xl" />
          <Skeleton className="h-64 w-full rounded-xl" />
        </div>
      </div>
    </div>
  );
}