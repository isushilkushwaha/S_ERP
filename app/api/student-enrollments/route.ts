import { NextRequest, NextResponse } from "next/server";
import { EnrollmentStatus } from "@prisma/client";

import { createEnrollmentSchema } from "@/features/student-enrollments/schemas/create-enrollment.schema";
import { studentEnrollmentService } from "@/features/student-enrollments/services/student-enrollment.service";

import { handleApiError } from "@/lib/api/handle-api-error";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);

    const search =
      searchParams.get("search") ?? undefined;

    const academicYearId =
      searchParams.get("academicYearId") ??
      undefined;

    const classId =
      searchParams.get("classId") ??
      undefined;

    const sectionId =
      searchParams.get("sectionId") ??
      undefined;

    const enrollmentStatus =
      (searchParams.get("status") as EnrollmentStatus | null) ??
      undefined;

    const page = Number(
      searchParams.get("page") ?? "1"
    );

    const limit = Number(
      searchParams.get("limit") ?? "10"
    );

    const result =
      await studentEnrollmentService.getEnrollments({
        search,
        academicYearId,
        classId,
        sectionId,
        enrollmentStatus,
        page,
        limit,
      });

    return NextResponse.json(result);
  } catch (error) {
    return handleApiError(error);
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    const data =
      createEnrollmentSchema.parse(body);

    const enrollment =
      await studentEnrollmentService.createEnrollment(
        data
      );

    return NextResponse.json(enrollment, {
      status: 201,
    });
  } catch (error) {
    return handleApiError(error);
  }
}