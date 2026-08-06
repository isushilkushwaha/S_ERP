"use client";

import type { ReactNode } from "react";

export default function AcademicYearsLayout({
  children,
}: {
  children: ReactNode;
}) {
  return (
    <div className="flex h-full flex-col gap-6 p-6">
      {children}
    </div>
  );
}