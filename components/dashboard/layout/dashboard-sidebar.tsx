"use client";

import type { Session } from "next-auth";

import { useSidebar } from "../hooks/use-sidebar";

import { SidebarLogo } from "../sidebar/sidebar-logo";
import { SidebarNav } from "../sidebar/sidebar-nav";

interface DashboardSidebarProps {
  session: Session | null;
}

export function DashboardSidebar({
  session,
}: DashboardSidebarProps) {
  const { collapsed } = useSidebar();

  return (
    <aside
      className={`
        hidden
        lg:flex
        sticky
        top-0
        h-screen
        shrink-0
        flex-col
        border-r
        bg-background
        transition-all
        duration-300
        ease-in-out
        ${
          collapsed
            ? "w-[72px]"
            : "w-[280px]"
        }
      `}
    >
      <SidebarLogo />

      <SidebarNav session={session} />
    </aside>
  );
}