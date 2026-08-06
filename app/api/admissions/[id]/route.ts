import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { EnrollmentStatus, RoleName } from "@prisma/client";
import {
  getAuthenticatedUser,
  handleUnauthorized,
  handleForbidden,
} from "@/features/admissions/lib/auth-guard"; // Adjust import path if needed

interface RouteParams {
  params: Promise<{ id: string }>;
}

/**
 * PATCH /api/admissions/[id]
 * Toggle or explicitly update enrollment status (e.g. ACTIVE <-> LEFT)
 */
export async function PATCH(request: NextRequest, { params }: RouteParams) {
  try {
    const user = await getAuthenticatedUser();
    if (!user) return handleUnauthorized();

    if (user.role !== RoleName.ADMIN) {
      return handleForbidden("Only Admins can change admission statuses.");
    }

    const { id } = await params;
    const body = await request.json().catch(() => ({}));

    // Find current enrollment record
    const existing = await prisma.studentEnrollment.findUnique({
      where: { id },
      select: { id: true, status: true },
    });

    if (!existing) {
      return NextResponse.json(
        { success: false, error: "Enrollment record not found." },
        { status: 404 }
      );
    }

    // Target status: provided in body, or automatically toggle between ACTIVE and LEFT
    const targetStatus: EnrollmentStatus =
      body.status || (existing.status === EnrollmentStatus.ACTIVE ? EnrollmentStatus.LEFT : EnrollmentStatus.ACTIVE);

    const updated = await prisma.studentEnrollment.update({
      where: { id },
      data: {
        status: targetStatus,
      },
    });

    return NextResponse.json({
      success: true,
      message: `Enrollment status updated to ${updated.status}.`,
      data: updated,
    });
  } catch (error) {
    console.error("[API_ADMISSIONS_ID_PATCH]", error);
    return NextResponse.json(
      { success: false, error: "Failed to update enrollment status." },
      { status: 500 }
    );
  }
}

/**
 * DELETE /api/admissions/[id]
 * Deactivates an enrollment (marks status as LEFT without deleting record)
 */
export async function DELETE(request: NextRequest, { params }: RouteParams) {
  try {
    const user = await getAuthenticatedUser();
    if (!user) return handleUnauthorized();

    if (user.role !== RoleName.ADMIN) {
      return handleForbidden("Only Admins can deactivate admissions.");
    }

    const { id } = await params;

    const updated = await prisma.studentEnrollment.update({
      where: { id },
      data: {
        status: EnrollmentStatus.LEFT, // Safely uses Prisma enum value
      },
    });

    return NextResponse.json({
      success: true,
      message: "Enrollment record deactivated successfully.",
      data: updated,
    });
  } catch (error) {
    console.error("[API_ADMISSIONS_ID_DELETE]", error);
    return NextResponse.json(
      { success: false, error: "Failed to deactivate enrollment record." },
      { status: 500 }
    );
  }
}