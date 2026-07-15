"use client";

import type { ReactNode } from "react";
import type { Session } from "next-auth";

import { useSidebar } from "../hooks/use-sidebar";

import { DashboardContent } from "./dashboard-content";
import { DashboardFooter } from "./dashboard-footer";
import { DashboardHeader } from "./dashboard-header";
import { DashboardSidebar } from "./dashboard-sidebar";
import { SidebarMobile } from "../sidebar/sidebar-mobile";

interface DashboardShellProps {
  children: ReactNode;
  session: Session | null;
}

export function DashboardShell({
  children,
  session,
}: DashboardShellProps) {
  const { collapsed,isMobile } = useSidebar();

  return (
    <>
      <SidebarMobile session={session}/>

      <div
        className="grid min-h-screen bg-muted/30 transition-all duration-300"
        style={{
    gridTemplateColumns:
        isMobile
            ? "1fr"
            : collapsed
                ? "72px 1fr"
                : "280px 1fr",
}}
      >
        <DashboardSidebar session={session}/>

        <div className="flex min-w-0 flex-col">
          <DashboardHeader session={session} />

          <DashboardContent>{children}</DashboardContent>

          <DashboardFooter />
        </div>
      </div>
    </>
  );
}