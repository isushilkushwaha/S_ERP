// components/dashboard/layout/sidebar-wrapper.tsx
'use client';
import { useSidebar } from "../hooks/use-sidebar";
import { cn } from "@/lib/utils";

export function SidebarWrapper({ children }: { children: React.ReactNode }) {
  const { expanded } = useSidebar();
  return (
    <aside className={cn(
      "fixed left-0 top-0 z-40 h-screen border-r bg-white transition-all duration-300",
      expanded ? "w-64" : "w-20"
    )}>
      {children}
    </aside>
  );
}