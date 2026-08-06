import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { ConfigurationService } from "@/features/settings/classes/services/configuration.service";
import { classConfigurationSchema } from "@/features/settings/classes/schema/class-configuration.schema";
import { handleApiError } from "@/lib/api-context";

const prisma = new PrismaClient();
const configService = new ConfigurationService(prisma);

/**
 * GET /api/settings/classes/configuration?classId=...
 */
export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const classId = searchParams.get("classId");

    if (!classId) {
      return NextResponse.json(
        { success: false, error: "Query parameter 'classId' is required." },
        { status: 400 }
      );
    }

    const config = await configService.getConfigurationByClassId(classId);
    return NextResponse.json({ success: true, data: config }, { status: 200 });
  } catch (error) {
    return handleApiError(error);
  }
}

/**
 * PATCH /api/settings/classes/configuration
 */
export async function PATCH(req: Request) {
  try {
    const body = await req.json();
    const validatedData = classConfigurationSchema.parse(body);

    const updatedConfig = await configService.updateConfiguration(validatedData);
    return NextResponse.json({ success: true, data: updatedConfig }, { status: 200 });
  } catch (error) {
    return handleApiError(error);
  }
}