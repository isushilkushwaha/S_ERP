// import type { ReactNode } from "react";
// import type { Session } from "next-auth";

// import { SidebarProvider } from "../providers/sidebar-provider";

// import { DashboardShell } from "./dashboard-shell";

// interface DashboardLayoutProps {
//   children: ReactNode;
//   session: Session | null;
// }

// export function DashboardLayout({
//   children,
//   session,
// }: DashboardLayoutProps) {
//   return (
//     <SidebarProvider>
//       <DashboardShell session={session}>
//         {children}
//       </DashboardShell>
//     </SidebarProvider>
//   );
// }

"use client";

import type { ReactNode } from "react";
import type { Session } from "next-auth";

import { AppSidebar } from "@/components/app-sidebar";

import {
  SidebarInset,
  SidebarProvider,
} from "@/components/ui/sidebar";

import { DashboardHeader } from "./dashboard-header";

interface DashboardLayoutProps {
  session: Session | null;
  children: ReactNode;
}

export function DashboardLayout({
  session,
  children,
}: DashboardLayoutProps) {
  return (
    <SidebarProvider defaultOpen>
      <AppSidebar session={session} />

      <SidebarInset className="min-h-screen">
        <DashboardHeader session={session} />

        <div className="flex flex-1 flex-col p-6">
          {children}
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}