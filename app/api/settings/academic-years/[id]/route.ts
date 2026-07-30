import { NextRequest, NextResponse } from "next/server";

import { prisma } from "@/lib/prisma";

import {
  AcademicYearService,
  PrismaAcademicYearRepository,
  academicYearIdSchema,
  updateAcademicYearSchema,
} from "@/features/settings/academic-years";

const repository = new PrismaAcademicYearRepository(prisma);
const service = new AcademicYearService(repository);

/* -------------------------------------------------------------------------- */
/*                                     GET                                    */
/* -------------------------------------------------------------------------- */

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = academicYearIdSchema.parse(await params);

    const academicYear = await service.getById(id);

    if (!academicYear) {
      return NextResponse.json(
        {
          success: false,
          message: "Academic year not found.",
        },
        {
          status: 404,
        }
      );
    }

    return NextResponse.json(
      {
        success: true,
        data: academicYear,
      },
      {
        status: 200,
      }
    );
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      {
        success: false,
        message:
          error instanceof Error
            ? error.message
            : "Failed to fetch academic year.",
      },
      {
        status: 400,
      }
    );
  }
}

/* -------------------------------------------------------------------------- */
/*                                    PATCH                                   */
/* -------------------------------------------------------------------------- */

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = academicYearIdSchema.parse(await params);

    const body = await request.json();

    const data = updateAcademicYearSchema.parse(body);

    const academicYear = await service.update(id, data);

    return NextResponse.json(
      {
        success: true,
        message: "Academic year updated successfully.",
        data: academicYear,
      },
      {
        status: 200,
      }
    );
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      {
        success: false,
        message:
          error instanceof Error
            ? error.message
            : "Failed to update academic year.",
      },
      {
        status: 400,
      }
    );
  }
}

/* -------------------------------------------------------------------------- */
/*                                   DELETE                                   */
/* -------------------------------------------------------------------------- */

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = academicYearIdSchema.parse(await params);

    await service.delete(id);

    return NextResponse.json(
      {
        success: true,
        message: "Academic year deleted successfully.",
      },
      {
        status: 200,
      }
    );
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      {
        success: false,
        message:
          error instanceof Error
            ? error.message
            : "Failed to delete academic year.",
      },
      {
        status: 400,
      }
    );
  }
}