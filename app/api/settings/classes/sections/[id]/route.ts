import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { SectionService } from "@/features/settings/classes/services/section.service";
import { updateSectionSchema } from "@/features/settings/classes/schema/update-section.schema";
import { getRequestContext, handleApiError } from "@/lib/api-context";

const prisma = new PrismaClient();
const sectionService = new SectionService(prisma);

interface RouteParams {
  params: Promise<{ id: string }>;
}

/**
 * PATCH /api/settings/classes/sections/[id]
 */
export async function PATCH(req: Request, { params }: RouteParams) {
  try {
    const { userId } = getRequestContext(req);
    const { id } = await params;
    const body = await req.json();

    const validatedData = updateSectionSchema.parse(body);

    const updatedSection = await sectionService.updateSection(id, {
      ...validatedData,
      updatedBy: userId,
    });

    return NextResponse.json({ success: true, data: updatedSection }, { status: 200 });
  } catch (error) {
    return handleApiError(error);
  }
}

/**
 * DELETE /api/settings/classes/sections/[id]
 */
export async function DELETE(req: Request, { params }: RouteParams) {
  try {
    const { userId } = getRequestContext(req);
    const { id } = await params;

    const deletedSection = await sectionService.deleteSection(id);
    return NextResponse.json(
      { success: true, message: "Section deleted successfully.", data: deletedSection },
      { status: 200 }
    );
  } catch (error) {
    return handleApiError(error);
  }
}