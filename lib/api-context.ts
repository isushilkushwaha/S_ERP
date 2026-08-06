import { NextResponse } from "next/server";

export interface RequestContext {
  tenantId: string;
  userId: string;
}

export function getRequestContext(req: Request): RequestContext {
  const tenantId = req.headers.get("x-tenant-id") || "tenant-demo-001";
  const userId = req.headers.get("x-user-id") || "system-admin-id";
  return { tenantId, userId };
}

export function handleApiError(error: unknown) {
  console.error("[API_ERROR]", error);
  const message = error instanceof Error ? error.message : "An unexpected server error occurred.";
  return NextResponse.json({ success: false, error: message }, { status: 400 });
}