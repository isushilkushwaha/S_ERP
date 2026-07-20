import { NextRequest, NextResponse } from "next/server";

import { academicYearService } from "@/features/academic-years/services/academic-year.service";
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

    const academicYear =
      await academicYearService.getAcademicYear(id);

    return NextResponse.json(academicYear);
  } catch (error) {
    return handleApiError(error);
  }
}