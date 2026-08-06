"use client";

import React from "react";
import Link from "next/link";
import type { Session } from "next-auth";
import { usePathname } from "next/navigation";
import { ChevronRight } from "lucide-react";

import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";

import {
  SidebarGroup,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
} from "@/components/ui/sidebar";

import { navigation } from "@/components/dashboard/navigation/navigation";
import { hasPermission } from "@/lib/rbac";

interface NavMainProps {
  session: Session | null;
}

export function NavMain({ session }: NavMainProps) {
  const pathname = usePathname();

  // 1. 🔒 ALL HOOKS DECLARED UNCONDITIONALLY AT THE TOP
  const permissions = React.useMemo(
    () => session?.user?.permissions ?? [],
    [session?.user?.permissions]
  );

  const visibleItems = React.useMemo(
    () =>
      navigation.filter((item) =>
        hasPermission(permissions, item.permission)
      ),
    [permissions]
  );

  const checkIsActive = React.useCallback(
    (href?: string) => {
      if (!href) return false;
      return pathname === href || pathname.startsWith(`${href}/`);
    },
    [pathname]
  );

  const [openItems, setOpenItems] = React.useState<Record<string, boolean>>({});
  const lastPathname = React.useRef(pathname);

  React.useEffect(() => {
    if (lastPathname.current !== pathname) {
      lastPathname.current = pathname;

      visibleItems.forEach((item) => {
        if (item.children?.length) {
          const hasActiveChild = item.children.some((child) =>
            checkIsActive(child.href)
          );
          if (hasActiveChild) {
            setOpenItems((prev) => ({
              ...prev,
              [item.id]: true,
            }));
          }
        }
      });
    }
  }, [pathname, visibleItems, checkIsActive]);

  // 2. 🛑 EARLY RETURN PLACED AFTER ALL HOOKS
  if (!session?.user) {
    return null;
  }

  return (
    <SidebarGroup>
      <SidebarGroupContent>
        <SidebarMenu>
          {visibleItems.map((item) => {
            const Icon = item.icon;

            const isChildActive = item.children?.some((child) =>
              checkIsActive(child.href)
            );
            const isActive = item.href ? checkIsActive(item.href) : isChildActive;

            // Single Item Layout (No Children)
            if (!item.children?.length) {
              return (
                <SidebarMenuItem key={item.id}>
                  <SidebarMenuButton
                    render={<Link href={item.href ?? "#"} />}
                    isActive={isActive}
                    tooltip={item.title}
                  >
                    {Icon && <Icon className="h-4 w-4" />}
                    <span>{item.title}</span>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              );
            }

            // Filter permitted sub-children
            const permittedChildren = item.children.filter(
              (child) =>
                hasPermission(permissions, child.permission) && child.href
            );

            if (permittedChildren.length === 0) {
              return null;
            }

            const isOpen = openItems[item.id] ?? isChildActive;

            return (
              <Collapsible
                key={item.id}
                open={isOpen}
                onOpenChange={(open) =>
                  setOpenItems((prev) => ({
                    ...prev,
                    [item.id]: open,
                  }))
                }
                className="group/collapsible"
              >
                <SidebarMenuItem>
                  <CollapsibleTrigger
                    render={
                      <SidebarMenuButton
                        type="button"
                        tooltip={item.title}
                        isActive={isActive}
                      />
                    }
                  >
                    {Icon && <Icon className="h-4 w-4" />}
                    <span>{item.title}</span>
                    <ChevronRight className="ml-auto h-4 w-4 transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90" />
                  </CollapsibleTrigger>

                  <CollapsibleContent>
                    <SidebarMenuSub>
                      {permittedChildren.map((child) => {
                        const ChildIcon = child.icon;
                        const href = child.href!;
                        const childActive = checkIsActive(href);

                        return (
                          <SidebarMenuSubItem key={child.id}>
                            <SidebarMenuSubButton
                              render={<Link href={href} />}
                              isActive={childActive}
                            >
                              {ChildIcon && (
                                <ChildIcon className="h-4 w-4" />
                              )}
                              <span>{child.title}</span>
                            </SidebarMenuSubButton>
                          </SidebarMenuSubItem>
                        );
                      })}
                    </SidebarMenuSub>
                  </CollapsibleContent>
                </SidebarMenuItem>
              </Collapsible>
            );
          })}
        </SidebarMenu>
      </SidebarGroupContent>
    </SidebarGroup>
  );
}