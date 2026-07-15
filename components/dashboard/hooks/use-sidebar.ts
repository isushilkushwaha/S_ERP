"use client";

import { useContext } from "react";

import { SidebarContext } from "../providers/sidebar-provider";

export function useSidebar() {
  const context = useContext(SidebarContext);

  if (!context) {
    throw new Error(
      "useSidebar must be used within SidebarProvider."
    );
  }

  return context;
}