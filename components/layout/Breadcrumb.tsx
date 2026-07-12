"use client";

import { usePathname } from "next/navigation";

export function Breadcrumb() {
  const pathname = usePathname();

  const segments = pathname
    .split("/")
    .filter(Boolean);

  return (
    <div>
      <p className="text-sm text-gray-500">
        {segments.join(" / ") || "Dashboard"}
      </p>
    </div>
  );
}