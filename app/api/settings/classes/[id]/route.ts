import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { ClassService } from "@/features/settings/classes/services/class.service";
import { updateClassSchema } from "@/features/settings/classes/schema/update-class.schema";
import { getRequestContext, handleApiError } from "@/lib/api-context";

const prisma = new PrismaClient();
const classService = new ClassService(prisma);

interface RouteParams {
  params: Promise<{ id: string }>;
}

/**
 * GET /api/settings/classes/[id]
 */
export async function GET(req: Request, { params }: RouteParams) {
  try {
    const { tenantId } = getRequestContext(req);
    const { id } = await params;

    const classRecord = await classService.getClassById(tenantId, id);
    return NextResponse.json({ success: true, data: classRecord }, { status: 200 });
  } catch (error) {
    return handleApiError(error);
  }
}

/**
 * PATCH /api/settings/classes/[id]
 */
export async function PATCH(req: Request, { params }: RouteParams) {
  try {
    const { tenantId, userId } = getRequestContext(req);
    const { id } = await params;
    const body = await req.json();

    const validatedData = updateClassSchema.parse(body);

    const updatedClass = await classService.updateClass(tenantId, id, {
      ...validatedData,
      updatedBy: userId,
    });

    return NextResponse.json({ success: true, data: updatedClass }, { status: 200 });
  } catch (error) {
    return handleApiError(error);
  }
}

/**
 * DELETE /api/settings/classes/[id]
 */
export async function DELETE(req: Request, { params }: RouteParams) {
  try {
    const { tenantId, userId } = getRequestContext(req);
    const { id } = await params;

    const deletedClass = await classService.deleteClass(tenantId, id);
    return NextResponse.json(
      { success: true, message: "Class deleted successfully.", data: deletedClass },
      { status: 200 }
    );
  } catch (error) {
    return handleApiError(error);
  }
}