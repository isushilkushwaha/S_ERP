"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ChevronDown, ChevronRight } from "lucide-react";
import { useState } from "react";

import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";

import { useSidebar } from "../hooks/use-sidebar";
import type { NavigationItem } from "../navigation/navigation-types";
import { SidebarTooltip } from "./sidebar-tooltip";

interface SidebarGroupProps {
  item: NavigationItem;
}

export function SidebarGroup({
  item,
}: SidebarGroupProps) {
  const pathname = usePathname();

  const { collapsed, closeMobile } = useSidebar();

  const defaultOpen =
    item.children?.some((child) =>
      pathname?.startsWith(child.href)
    ) ?? false;

  const [open, setOpen] = useState(defaultOpen);

  const Icon = item.icon;

  return (
    <SidebarTooltip label={item.title}>
      <Collapsible
        open={open}
        onOpenChange={setOpen}
      >
        <CollapsibleTrigger
  className={`
    flex
    w-full
    items-center
    rounded-lg
    px-3
    py-3
    transition-colors
    hover:bg-accent

    ${collapsed ? "justify-center" : "gap-3"}
  `}
>
  <Icon className="h-5 w-5 shrink-0" />

  {!collapsed && (
    <>
      <span className="flex-1 text-left">
        {item.title}
      </span>

      {open ? (
        <ChevronDown className="h-4 w-4" />
      ) : (
        <ChevronRight className="h-4 w-4" />
      )}
    </>
  )}
</CollapsibleTrigger>

        {!collapsed && (
          <CollapsibleContent
            className="
              overflow-hidden
              data-[state=closed]:animate-accordion-up
              data-[state=open]:animate-accordion-down
            "
          >
            <div className="ml-6 mt-1 space-y-1 border-l pl-3">
              {item.children?.map((child) => {
                const active =
                  pathname?.startsWith(child.href) ?? false;

                return (
                  <Link
                    key={child.id}
                    href={child.href}
                    onClick={closeMobile}
                    className={`
                      flex
                      items-center
                      rounded-md
                      px-3
                      py-2
                      text-sm
                      transition-colors

                      ${
                        active
                          ? "bg-primary text-primary-foreground"
                          : "hover:bg-accent"
                      }
                    `}
                  >
                    {child.title}
                  </Link>
                );
              })}
            </div>
          </CollapsibleContent>
        )}
      </Collapsible>
    </SidebarTooltip>
  );
}