// components/team-switcher.tsx

"use client";

import type { Session } from "next-auth";
import { GraduationCap } from "lucide-react";

import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";

interface TeamSwitcherProps {
  session: Session | null;
}

export function TeamSwitcher({
}: TeamSwitcherProps) {
  const school = {
    name: "Helexora ERP",
    logo: GraduationCap,
  };

  const Logo = school.logo;

  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <SidebarMenuButton
          size="lg"
          className="cursor-default hover:bg-transparent active:bg-transparent"
        >
          <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
            <Logo className="size-4" />
          </div>

          <div className="flex flex-1 items-center">
            <span className="truncate font-semibold">
              {school.name}
            </span>
          </div>
        </SidebarMenuButton>
      </SidebarMenuItem>
    </SidebarMenu>
  );
}