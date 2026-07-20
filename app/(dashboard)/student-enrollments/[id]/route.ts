import { NextRequest, NextResponse } from "next/server";

import { studentEnrollmentService } from "@/features/student-enrollments/services/student-enrollment.service";

import { updateEnrollmentSchema } from "@/features/student-enrollments/schemas/update-enrollment.schema";

// ======================================================
// GET /api/student-enrollments/:id
// ======================================================

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    const enrollment =
      await studentEnrollmentService.getEnrollmentById(id);

    return NextResponse.json({
      data: enrollment,
    });
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      {
        message:
          error instanceof Error
            ? error.message
            : "Failed to fetch enrollment.",
      },
      {
        status: 500,
      }
    );
  }
}

// ======================================================
// PATCH /api/student-enrollments/:id
// ======================================================

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    const body = await request.json();

    const validated =
      updateEnrollmentSchema.parse(body);

    const enrollment =
      await studentEnrollmentService.updateEnrollment(
        id,
        validated
      );

    return NextResponse.json({
      data: enrollment,
    });
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      {
        message:
          error instanceof Error
            ? error.message
            : "Failed to update enrollment.",
      },
      {
        status: 500,
      }
    );
  }
}

// ======================================================
// DELETE /api/student-enrollments/:id
// ======================================================

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    await studentEnrollmentService.deleteEnrollment(id);

    return NextResponse.json({
      success: true,
    });
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      {
        message:
          error instanceof Error
            ? error.message
            : "Failed to delete enrollment.",
      },
      {
        status: 500,
      }
    );
  }
}