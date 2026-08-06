import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { AutoSectionAllocationService } from "@/features/settings/classes/services/auto-section-allocation.service";
import { handleApiError } from "@/lib/api-context";

const prisma = new PrismaClient();
const allocationService = new AutoSectionAllocationService(prisma);

/**
 * POST /api/settings/classes/auto-allocation
 * Body: { classId: string }
 */
export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { classId } = body;

    if (!classId) {
      return NextResponse.json(
        { success: false, error: "Property 'classId' is required." },
        { status: 400 }
      );
    }

    const allocationResult = await allocationService.allocateSection(classId);

    if (!allocationResult.allocated) {
      return NextResponse.json(
        { success: false, error: allocationResult.message, result: allocationResult },
        { status: 422 }
      );
    }

    return NextResponse.json({ success: true, data: allocationResult }, { status: 200 });
  } catch (error) {
    return handleApiError(error);
  }
}