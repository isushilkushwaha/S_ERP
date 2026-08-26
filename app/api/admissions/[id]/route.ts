// app/api/admissions/[id]/route.ts

import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { EnrollmentStatus, RoleName } from "@prisma/client";
import {
  getAuthenticatedUser,
  handleUnauthorized,
  handleForbidden,
} from "@/features/admissions/lib/auth-guard";

interface RouteParams {
  params: Promise<{ id: string }>;
}

/**
 * GET /api/admissions/[id]
 * Fetches a single student enrollment record including student info, fee ledgers, installments, and discounts.
 */
export async function GET(request: NextRequest, { params }: RouteParams) {
  try {
    const user = await getAuthenticatedUser();
    if (!user) return handleUnauthorized();

    const { id } = await params;

    const enrollment = await prisma.studentEnrollment.findUnique({
      where: { id },
      include: {
        student: true,
        academicYear: true,
        class: true,
        section: { select: { id: true, name: true } },
        feeStructure: { select: { id: true, notes: true } },
        installmentPlan: {
          include: {
            items: true,
          },
        },
        feeLedgers: {
          include: {
            feeComponent: { select: { name: true, code: true } },
            installments: true,
          },
        },
        enrollmentDiscounts: {
          include: {
            discountType: { select: { name: true, code: true } },
          },
        },
      },
    });

    if (!enrollment) {
      return NextResponse.json(
        { success: false, error: "Admission enrollment record not found." },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: enrollment,
    });
  } catch (error) {
    console.error("[API_ADMISSIONS_ID_GET]", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch admission detail record." },
      { status: 500 }
    );
  }
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
        status: EnrollmentStatus.LEFT,
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