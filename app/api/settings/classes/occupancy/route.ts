// app/api/settings/classes/occupancy/route.ts

import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { OccupancyService } from "@/features/settings/classes/services/occupancy.service";
import { handleApiError } from "@/lib/api-context";

const prisma = new PrismaClient();
const occupancyService = new OccupancyService(prisma);

/**
 * GET /api/settings/classes/occupancy?classId=...&academicYearId=...
 */
export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const classId = searchParams.get("classId");
    const academicYearId = searchParams.get("academicYearId"); // ✅ Extract session filter

    if (!classId) {
      return NextResponse.json(
        { success: false, error: "Query parameter 'classId' is required." },
        { status: 400 }
      );
    }

    // ✅ Pass academicYearId to the service method
    const report = await occupancyService.getClassOccupancy(classId, academicYearId || undefined);
    return NextResponse.json({ success: true, data: report }, { status: 200 });
  } catch (error) {
    return handleApiError(error);
  }
}