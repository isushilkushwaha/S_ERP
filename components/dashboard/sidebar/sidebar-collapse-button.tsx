"use client";

import { PanelLeftClose } from "lucide-react";

import { useSidebar } from "../hooks/use-sidebar";

export function SidebarCollapseButton() {
  const { toggleSidebar } =
    useSidebar();

  return (
    <button
      onClick={toggleSidebar}
      className="
        m-4
        flex
        items-center
        justify-center
        rounded-lg
        border
        p-2
        hover:bg-accent
      "
    >
      <PanelLeftClose className="h-5 w-5" />
    </button>
  );
}