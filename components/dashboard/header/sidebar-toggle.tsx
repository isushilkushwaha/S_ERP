"use client";

import React, { memo } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useSidebar } from "../hooks/use-sidebar";

export const SidebarCollapseButton = memo(() => {
  const { collapsed, toggleSidebar } = useSidebar();

  return (
    <Button
      variant="ghost"
      size="icon"
      className={cn(
        "h-8 w-8 transition-all duration-300",
        collapsed ? "mx-auto" : "ml-auto"
      )}
      onClick={toggleSidebar}
      aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
    >
      {collapsed ? (
        <ChevronRight className="h-4 w-4" />
      ) : (
        <ChevronLeft className="h-4 w-4" />
      )}
    </Button>
  );
});

SidebarCollapseButton.displayName = "SidebarCollapseButton";