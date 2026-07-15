"use client";

import { Menu } from "lucide-react";

import { useSidebar } from "../hooks/use-sidebar";

export function MobileMenuButton() {
  const { openMobile } = useSidebar();

  return (
    <button
      onClick={openMobile}
      className="
        rounded-md
        p-2
        hover:bg-accent
        lg:hidden
      "
      aria-label="Open menu"
    >
      <Menu className="h-5 w-5" />
    </button>
  );
}