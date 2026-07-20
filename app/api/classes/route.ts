import { NextRequest, NextResponse } from "next/server";

import { classService } from "@/features/classes/services/class.service";
import { handleApiError } from "@/lib/api/handle-api-error";

export async function GET(
  request: NextRequest
) {
  try {
    const { searchParams } = new URL(request.url);

    const search =
      searchParams.get("search") ?? undefined;

    const page = Number(
      searchParams.get("page") ?? "1"
    );

    const limit = Number(
      searchParams.get("limit") ?? "100"
    );

    const result =
      await classService.getClasses({
        search,
        page,
        limit,
      });

    return NextResponse.json(result);
  } catch (error) {
    return handleApiError(error);
  }
}