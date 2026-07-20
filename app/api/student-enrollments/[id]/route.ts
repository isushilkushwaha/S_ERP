import { NextRequest, NextResponse } from "next/server";

import { updateEnrollmentSchema } from "@/features/student-enrollments/schemas/update-enrollment.schema";
import { studentEnrollmentService } from "@/features/student-enrollments/services/student-enrollment.service";

import { handleApiError } from "@/lib/api/handle-api-error";

interface RouteContext {
  params: Promise<{
    id: string;
  }>;
}

export async function GET(
  _request: NextRequest,
  { params }: RouteContext
) {
  try {
    const { id } = await params;

    const enrollment =
      await studentEnrollmentService.getEnrollmentById(
        id
      );

    return NextResponse.json(enrollment);
  } catch (error) {
    return handleApiError(error);
  }
}

export async function PATCH(
  request: NextRequest,
  { params }: RouteContext
) {
  try {
    const { id } = await params;

    const body = await request.json();

    const data =
      updateEnrollmentSchema.parse(body);

    const enrollment =
      await studentEnrollmentService.updateEnrollment(
        id,
        data
      );

    return NextResponse.json(enrollment);
  } catch (error) {
    return handleApiError(error);
  }
}

export async function DELETE(
  _request: NextRequest,
  { params }: RouteContext
) {
  try {
    const { id } = await params;

    await studentEnrollmentService.deleteEnrollment(
      id
    );

    return NextResponse.json({
      success: true,
      message:
        "Student enrollment deleted successfully.",
    });
  } catch (error) {
    return handleApiError(error);
  }
}