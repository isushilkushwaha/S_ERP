import type { LucideIcon } from "lucide-react";
import type { Permission } from "@/lib/rbac/permissions";

export interface NavigationBadge {
  readonly label: string;

  readonly variant?:
    | "default"
    | "secondary"
    | "destructive";
}

export interface NavigationItem {
  readonly id: string;

  readonly title: string;

  readonly href: string;

  readonly icon: LucideIcon;

  readonly permission: Permission;

  readonly badge?: NavigationBadge;

  readonly children?: readonly NavigationItem[];

  readonly exact?: boolean;

  readonly disabled?: boolean;

  readonly hidden?: boolean;
}