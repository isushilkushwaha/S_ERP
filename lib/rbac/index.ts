import type { Permission } from "./permissions";

/**
 * Returns true if the user has the specified permission.
 */
export function hasPermission(
  permissions: readonly Permission[],
  permission: Permission
): boolean {
  return permissions.includes(permission);
}

/**
 * Returns true if the user has at least one of the required permissions.
 */
export function hasAnyPermission(
  permissions: readonly Permission[],
  required: readonly Permission[]
): boolean {
  return required.some((permission) =>
    permissions.includes(permission)
  );
}

/**
 * Returns true if the user has all of the required permissions.
 */
export function hasAllPermissions(
  permissions: readonly Permission[],
  required: readonly Permission[]
): boolean {
  return required.every((permission) =>
    permissions.includes(permission)
  );
}