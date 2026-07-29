

"use client";

import type { Session } from "next-auth";

import { NavMain } from "@/components/nav-main";
import { TeamSwitcher } from "@/components/team-switcher";

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
} from "@/components/ui/sidebar";

interface AppSidebarProps
  extends React.ComponentProps<typeof Sidebar> {
  session: Session | null;
}

export function AppSidebar({
  session,
  ...props
}: AppSidebarProps) {
  if (!session?.user) {
    return null;
  }

  return (
    <Sidebar
      collapsible="icon"
      {...props}
    >
      <SidebarHeader>
        <TeamSwitcher session={session} />
      </SidebarHeader>

      <SidebarContent>
        <NavMain session={session} />
      </SidebarContent>

      <SidebarFooter>
        {/* <NavUser session={session} /> */}
      </SidebarFooter>

      <SidebarRail />
    </Sidebar>
  );
}