import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { ClassService } from "@/features/settings/classes/services/class.service";
import { getRequestContext, handleApiError } from "@/lib/api-context";

const prisma = new PrismaClient();
const classService = new ClassService(prisma);

export async function GET(req: Request) {
  try {
    const { tenantId } = getRequestContext(req);
    const nextOrder = await classService.getNextDisplayOrder(tenantId);
    return NextResponse.json({ success: true, data: nextOrder }, { status: 200 });
  } catch (error) {
    return handleApiError(error);
  }
}