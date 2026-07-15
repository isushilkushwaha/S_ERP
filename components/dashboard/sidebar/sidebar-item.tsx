"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import { useSidebar } from "../hooks/use-sidebar";
import type { NavigationItem } from "../navigation/navigation-types";

import { SidebarTooltip } from "./sidebar-tooltip";

interface Props {
  item: NavigationItem;
}

export function SidebarItem({
  item,
}: Props) {
  const pathname = usePathname();

  const { collapsed , closeMobile} = useSidebar();

  const active =
    pathname.startsWith(item.href);

  const Icon = item.icon;

  return (
    <SidebarTooltip label={item.title}>
      <Link
        href={item.href}
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

        <Icon className="h-5 w-5 shrink-0" />

        {!collapsed && (
          <span>{item.title}</span>
        )}

      </Link>
    </SidebarTooltip>
  );
}