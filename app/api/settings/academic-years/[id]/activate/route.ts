import { NextRequest, NextResponse } from "next/server";

import { prisma } from "@/lib/prisma";

import {
  AcademicYearService,
  PrismaAcademicYearRepository,
  academicYearIdSchema,
} from "@/features/settings/academic-years";

const repository = new PrismaAcademicYearRepository(prisma);
const service = new AcademicYearService(repository);

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = academicYearIdSchema.parse(await params);

    const academicYear = await service.activate(id);

    return NextResponse.json(
      {
        success: true,
        message: "Academic year activated successfully.",
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
            : "Failed to activate academic year.",
      },
      {
        status: 400,
      }
    );
  }
}