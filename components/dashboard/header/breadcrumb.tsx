"use client";

import { Fragment, useMemo } from "react";
import { usePathname } from "next/navigation";
import { Home } from "lucide-react";

import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";

function formatSegment(segment: string) {
  return segment
    .replace(/-/g, " ")
    .replace(/\b\w/g, (char) => char.toUpperCase());
}

export function DashboardBreadcrumb() {
  const pathname = usePathname();

  const breadcrumbs = useMemo(() => {
    const segments = pathname
      .split("/")
      .filter(Boolean)
      .filter((segment) => segment !== "dashboard")
      .filter((segment) => !/^\d+$/.test(segment));

    return segments.map((segment, index) => ({
      label: formatSegment(segment),
      href: `/dashboard/${segments.slice(0, index + 1).join("/")}`,
      isLast: index === segments.length - 1,
    }));
  }, [pathname]);

  return (
    <Breadcrumb className="hidden md:flex">
      <BreadcrumbList>
        <BreadcrumbItem>
          <BreadcrumbLink
            href="/dashboard"
            className="flex items-center gap-2"
          >
            <Home className="h-4 w-4" />
          </BreadcrumbLink>
        </BreadcrumbItem>

        {breadcrumbs.map((item) => (
          <Fragment key={item.href}>
            <BreadcrumbSeparator />

            <BreadcrumbItem>
              {item.isLast ? (
                <BreadcrumbPage>
                  {item.label}
                </BreadcrumbPage>
              ) : (
                <BreadcrumbLink href={item.href}>
                  {item.label}
                </BreadcrumbLink>
              )}
            </BreadcrumbItem>
          </Fragment>
        ))}
      </BreadcrumbList>
    </Breadcrumb>
  );
}