
import { redirect } from "next/navigation";

import { auth } from "@/auth";

import { hasPermission } from "@/lib/rbac";
import { PERMISSIONS } from "@/lib/rbac/permissions";
import type { Permission } from "@/lib/rbac/permissions";

import { userService } from "@/features/users/services/user.service";
import { UsersClient } from "@/features/users/components/users-client";

export default async function UsersPage() {
  const session = await auth();

  if (!session?.user) {
    redirect("/login");
  }

  const permissions = (session.user.permissions ?? []) as readonly Permission[];

  if (!hasPermission(permissions, PERMISSIONS.USERS_VIEW)) {
    redirect("/dashboard");
  }

  const users = await userService.findAll();

  return <UsersClient users={users} />;
}