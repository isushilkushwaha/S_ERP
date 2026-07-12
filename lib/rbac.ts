import { Session } from "next-auth";
import { ROLE_PERMISSIONS } from "./role-permissions";
import { Permission } from "./permissions";

export function hasPermission(
  session: Session | null,
  permission: Permission
) {
  if (!session?.user) return false;

  const role = session.user.role as keyof typeof ROLE_PERMISSIONS;

  return ROLE_PERMISSIONS[role]?.includes(permission) ?? false;
}

export function isAdmin(session: Session | null) {
  return session?.user.role === "ADMIN";
}

export function isTeacher(session: Session | null) {
  return session?.user.role === "TEACHER";
}