

import Link from "next/link";

import { auth } from "@/auth";

import { hasPermission } from "@/lib/rbac";
import { sidebarItems } from "@/config/sidebar";
import { cn } from "@/lib/utils";

interface SidebarContentProps {
  expanded: boolean;
}

export async function SidebarContent({
  expanded,
}: SidebarContentProps) {
  const session = await auth();

  if (!session?.user) {
    return null;
  }

  const permissions = session.user.permissions;


  return (
    <nav className="flex-1 space-y-1 p-4">
      {sidebarItems
        .filter((item) =>
          hasPermission(
            permissions ,
            item.permission
          )
        )
        .map((item) => {
          const Icon = item.icon;

          return (
            <Link
              key={item.id}
              href={item.href}
              className="flex items-center gap-3 rounded-lg px-4 py-3 transition-colors hover:bg-slate-100"
            >
              <Icon className="h-5 w-5 shrink-0" />

              <span
                className={cn(
                  "truncate transition-opacity duration-200",
                  expanded
                    ? "opacity-100"
                    : "hidden opacity-0"
                )}
              >
                {item.title}
              </span>
            </Link>
          );
        })}
    </nav>
  );
}