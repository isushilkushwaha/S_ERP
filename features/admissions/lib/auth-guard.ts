import { NextResponse } from "next/server";
import { RoleName } from "@prisma/client";

export interface AuthenticatedUser {
  id: string;
  fullName: string;
  email: string;
  role: RoleName;
  tenantId: string;
}

/**
 * Validates session context and RBAC permissions.
 * Integration note: Replace mock call below with your project's `auth()` helper from Auth.js.
 */
export async function getAuthenticatedUser(): Promise<AuthenticatedUser | null> {
  // Mock Auth.js session resolution for context:
  // const session = await auth();
  // if (!session?.user) return null;

  return {
    id: "usr_admin_01",
    fullName: "System Admin",
    email: "admin@school.edu",
    role: RoleName.ADMIN,
    tenantId: "tenant_default_01",
  };
}

export function handleUnauthorized() {
  return NextResponse.json(
    { success: false, error: "Unauthorized access. Session invalid or expired." },
    { status: 401 }
  );
}

export function handleForbidden(message = "Insufficient permissions to perform this action.") {
  return NextResponse.json(
    { success: false, error: message },
    { status: 403 }
  );
}