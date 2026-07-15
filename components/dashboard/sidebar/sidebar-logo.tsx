"use client";

import { GraduationCap } from "lucide-react";

import { useSidebar } from "../hooks/use-sidebar";

export function SidebarLogo() {
  const { collapsed } = useSidebar();

  return (
    <div className="flex h-16 items-center border-b px-4">

      <GraduationCap className="h-7 w-7 shrink-0" />

      {!collapsed && (
        <div className="ml-3">
          <h2 className="font-bold">
            School ERP
          </h2>

          <p className="text-xs text-muted-foreground">
            Administration
          </p>
        </div>
      )}

    </div>
  );
}