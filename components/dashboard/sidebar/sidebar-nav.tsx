import type { Session } from "next-auth";

import { hasPermission } from "@/lib/rbac";

import { navigation } from "../navigation/navigation";
import { SidebarItem } from "./sidebar-item";

interface SidebarNavProps {
  session: Session | null;
}

export function SidebarNav({
  session,
}: SidebarNavProps) {
  if (!session?.user) {
    return null;
  }

  const permissions = session.user.permissions ?? [];

  const visibleItems = navigation.filter((item) =>
    hasPermission(permissions, item.permission)
  );

  return (
    <nav className="flex-1 space-y-1 p-4">
      {visibleItems.map((item) => (
        <SidebarItem
          key={item.id}
          item={item}
        />
      ))}
    </nav>
  );
}