import type { ReactNode } from "react";
import type { Session } from "next-auth";

import { SidebarProvider } from "../providers/sidebar-provider";

import { DashboardShell } from "./dashboard-shell";

interface DashboardLayoutProps {
  children: ReactNode;
  session: Session | null;
}

export function DashboardLayout({
  children,
  session,
}: DashboardLayoutProps) {
  return (
    <SidebarProvider>
      <DashboardShell session={session}>
        {children}
      </DashboardShell>
    </SidebarProvider>
  );
}