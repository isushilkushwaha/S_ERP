import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

import { ConfigurationService } from "@/features/settings/classes/services/configuration.service";
import { classConfigurationSchema } from "@/features/settings/classes/schema/class-configuration.schema";
import {
  getRequestContext,
  handleApiError,
} from "@/lib/api-context";

const prisma = new PrismaClient();
const configService = new ConfigurationService(prisma);

/**
 * GET
 *
 * /api/settings/classes/configuration
 *
 * Query params:
 * ?academicYearId=...
 * &classId=...
 *
 * Returns configuration for the selected
 * class inside the selected academic year.
 */
export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);

    const academicYearId =
      searchParams.get("academicYearId");

    const classId =
      searchParams.get("classId");

    if (!academicYearId) {
      return NextResponse.json(
        {
          success: false,
          error:
            "Query parameter 'academicYearId' is required.",
        },
        {
          status: 400,
        }
      );
    }

    if (!classId) {
      return NextResponse.json(
        {
          success: false,
          error:
            "Query parameter 'classId' is required.",
        },
        {
          status: 400,
        }
      );
    }

    const config =
      await configService.getConfigurationByClassId(
        academicYearId,
        classId
      );

    return NextResponse.json(
      {
        success: true,
        data: config,
      },
      {
        status: 200,
      }
    );
  } catch (error) {
    return handleApiError(error);
  }
}

/**
 * PATCH
 *
 * /api/settings/classes/configuration
 *
 * Body:
 * {
 *   academicYearId: string,
 *   classId: string,
 *   sectionsEnabled: boolean,
 *   defaultSectionCapacity?: number | null,
 *   maxStudentsWithoutSection?: number | null,
 *   autoAllocationEnabled?: boolean
 * }
 */
export async function PATCH(req: Request) {
  try {
    const { tenantId } =
      getRequestContext(req);

    const body = await req.json();

    const validatedData =
      classConfigurationSchema.parse(body);

    const updatedConfig =
      await configService.updateConfiguration(
        tenantId,
        validatedData
      );

    return NextResponse.json(
      {
        success: true,
        data: updatedConfig,
      },
      {
        status: 200,
      }
    );
  } catch (error) {
    return handleApiError(error);
  }
}