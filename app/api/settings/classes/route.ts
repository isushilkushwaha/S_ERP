import { NextResponse } from "next/server";
import { PrismaClient, Status } from "@prisma/client";
import { ClassService } from "@/features/settings/classes/services/class.service";
import { createClassSchema } from "@/features/settings/classes/schema/create-class.schema";
import { getRequestContext, handleApiError } from "@/lib/api-context";

const prisma = new PrismaClient();
const classService = new ClassService(prisma);

/**
 * GET /api/settings/classes
 * Query Params: ?status=ACTIVE|INACTIVE
 */
export async function GET(req: Request) {
  try {
    const { tenantId } = getRequestContext(req);
    const { searchParams } = new URL(req.url);
    const statusParam = searchParams.get("status") as Status | null;

    const classes = await classService.getAllClasses(
      tenantId,
      statusParam && Object.values(Status).includes(statusParam) ? statusParam : undefined
    );

    return NextResponse.json({ success: true, data: classes }, { status: 200 });
  } catch (error) {
    return handleApiError(error);
  }
}

/**
 * POST /api/settings/classes
 */
export async function POST(req: Request) {
  try {
    const { tenantId, userId } = getRequestContext(req);
    const body = await req.json();

    const validatedData = createClassSchema.parse(body);

    const createdClass = await classService.createClass(tenantId, {
      ...validatedData,
      createdBy: userId,
    });

    return NextResponse.json({ success: true, data: createdClass }, { status: 201 });
  } catch (error) {
    return handleApiError(error);
  }
}