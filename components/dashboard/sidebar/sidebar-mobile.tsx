"use client";

import type { Session } from "next-auth";
import { X } from "lucide-react";

import { useSidebar } from "../hooks/use-sidebar";

import { SidebarLogo } from "./sidebar-logo";
import { SidebarNav } from "./sidebar-nav";

interface SidebarMobileProps {
  session: Session | null;
}

export function SidebarMobile({
  session,
}: SidebarMobileProps) {
  const {
    mobileOpen,
    closeMobile,
  } = useSidebar();

  if (!mobileOpen) {
    return null;
  }

  return (
    <>
      {/* Overlay */}
      <div
        onClick={closeMobile}
        className="fixed inset-0 z-40 bg-black/40 lg:hidden"
      />

      {/* Drawer */}
      <aside
        className="
          fixed
          left-0
          top-0
          z-50
          flex
          h-screen
          w-72
          flex-col
          border-r
          bg-background
          shadow-xl
          lg:hidden
        "
      >
        <div className="flex items-center justify-between border-b">
          <SidebarLogo />

          <button
            onClick={closeMobile}
            className="mr-4 rounded-md p-2 hover:bg-accent"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <SidebarNav session={session} />
      </aside>
    </>
  );
}