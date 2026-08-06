"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { type LucideIcon } from "lucide-react";

import { useSidebar } from "../hooks/use-sidebar";
import type { NavigationItem } from "../navigation/navigation-types";

import { SidebarTooltip } from "./sidebar-tooltip";

interface Props {
  item: NavigationItem;
}

export function SidebarItem({
  item,
}: Props) {
  const pathname = usePathname() ?? "";
  const { collapsed, closeMobile } = useSidebar();

  const itemHref = item.href ?? "#";
  const active = pathname.startsWith(itemHref);

  // Safely cast LucideIcon to element type to satisfy JSX checks
  const Icon = item.icon as LucideIcon | undefined;

  return (
    <SidebarTooltip label={item.title}>
      <Link
        href={itemHref}
        onClick={closeMobile}
        className={`
          flex
          items-center
          rounded-lg
          px-3
          py-3
          transition-colors

          ${
            active
              ? "bg-primary text-primary-foreground"
              : "hover:bg-accent"
          }

          ${
            collapsed
              ? "justify-center"
              : "gap-3"
          }
        `}
      >
        {Icon && <Icon className="h-5 w-5 shrink-0" />}

        {!collapsed && (
          <span>{item.title}</span>
        )}
      </Link>
    </SidebarTooltip>
  );
}