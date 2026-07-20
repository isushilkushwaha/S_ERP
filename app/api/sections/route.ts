import { NextRequest, NextResponse } from "next/server";

import { sectionService } from "@/features/sections/services/section.service";
import { handleApiError } from "@/lib/api/handle-api-error";

export async function GET(
  request: NextRequest
) {
  try {
    const { searchParams } = new URL(request.url);

    const search =
      searchParams.get("search") ?? undefined;

    const classId =
      searchParams.get("classId") ?? undefined;

    const page = Number(
      searchParams.get("page") ?? "1"
    );

    const limit = Number(
      searchParams.get("limit") ?? "100"
    );

    const result =
      await sectionService.getSections({
        search,
        classId,
        page,
        limit,
      });

    return NextResponse.json(result);
  } catch (error) {
    return handleApiError(error);
  }
}