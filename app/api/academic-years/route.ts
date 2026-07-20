import { NextRequest, NextResponse } from "next/server";

import { AcademicYearStatus } from "@prisma/client";

import { academicYearService } from "@/features/academic-years/services/academic-year.service";

import { handleApiError } from "@/lib/api/handle-api-error";

export async function GET(
  request: NextRequest
) {
  try {
    const { searchParams } = new URL(request.url);

    const search =
      searchParams.get("search") ?? undefined;

    const status =
      (searchParams.get("status") as AcademicYearStatus | null) ??
      undefined;

    const page = Number(
      searchParams.get("page") ?? "1"
    );

    const limit = Number(
      searchParams.get("limit") ?? "100"
    );

    const result =
      await academicYearService.getAcademicYears({
        search,
        status,
        page,
        limit,
      });

    return NextResponse.json(result);
  } catch (error) {
    return handleApiError(error);
  }
}