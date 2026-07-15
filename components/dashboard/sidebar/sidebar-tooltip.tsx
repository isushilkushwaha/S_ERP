"use client";

import type { ReactNode } from "react";

interface Props {
  label: string;
  children: ReactNode;
}

export function SidebarTooltip({
  label,
  children,
}: Props) {
  return (
    <div className="group relative">

      {children}

      <div
        className="
          invisible
          absolute
          left-full
          top-1/2
          ml-2
          -translate-y-1/2
          rounded-md
          bg-black
          px-2
          py-1
          text-xs
          text-white
          opacity-0
          transition-all
          group-hover:visible
          group-hover:opacity-100
        "
      >
        {label}
      </div>

    </div>
  );
}