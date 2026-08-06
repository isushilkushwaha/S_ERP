import { NextResponse } from "next/server";
import { PrismaClient, Status } from "@prisma/client";
import { SectionService } from "@/features/settings/classes/services/section.service";
import { createSectionSchema } from "@/features/settings/classes/schema/create-section.schema";
import { getRequestContext, handleApiError } from "@/lib/api-context";

const prisma = new PrismaClient();
const sectionService = new SectionService(prisma);

/**
 * GET /api/settings/classes/sections?classId=...&status=ACTIVE|INACTIVE
 */
export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const classId = searchParams.get("classId");
    const statusParam = searchParams.get("status") as Status | null;

    if (!classId) {
      return NextResponse.json(
        { success: false, error: "Query parameter 'classId' is required." },
        { status: 400 }
      );
    }

    const sections = await sectionService.getSectionsByClassId(
      classId,
      statusParam && Object.values(Status).includes(statusParam) ? statusParam : undefined
    );

    return NextResponse.json({ success: true, data: sections }, { status: 200 });
  } catch (error) {
    return handleApiError(error);
  }
}

/**
 * POST /api/settings/classes/sections
 */
export async function POST(req: Request) {
  try {
    const { userId } = getRequestContext(req);
    const body = await req.json();

    const validatedData = createSectionSchema.parse(body);

    const createdSection = await sectionService.createSection({
      ...validatedData,
      createdBy: userId,
    });

    return NextResponse.json({ success: true, data: createdSection }, { status: 201 });
  } catch (error) {
    return handleApiError(error);
  }
}