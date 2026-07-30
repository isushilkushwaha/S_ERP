import { NextRequest, NextResponse } from "next/server";

import { prisma } from "@/lib/prisma";

import {
  AcademicYearService,
  PrismaAcademicYearRepository,
  createAcademicYearSchema,
  academicYearQuerySchema,
} from "@/features/settings/academic-years";

const repository = new PrismaAcademicYearRepository(prisma);
const service = new AcademicYearService(repository);

/* -------------------------------------------------------------------------- */
/*                                    GET                                     */
/* -------------------------------------------------------------------------- */

export async function GET(request: NextRequest) {
  try {
    const searchParams = Object.fromEntries(
      request.nextUrl.searchParams.entries()
    );

    const query = academicYearQuerySchema.parse(searchParams);

    const result = await service.getAll(query);

    return NextResponse.json(result, {
      status: 200,
    });
  } catch (error) {
    console.error("GET Academic Years:", error);

    return NextResponse.json(
      {
        success: false,
        message:
          error instanceof Error
            ? error.message
            : "Failed to fetch academic years.",
      },
      {
        status: 500,
      }
    );
  }
}

/* -------------------------------------------------------------------------- */
/*                                    POST                                    */
/* -------------------------------------------------------------------------- */

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    const data = createAcademicYearSchema.parse(body);

    const result = await service.create(data);

    return NextResponse.json(
      {
        success: true,
        message: "Academic year created successfully.",
        data: result,
      },
      {
        status: 201,
      }
    );
  } catch (error) {
    console.error("Create Academic Year:", error);

    return NextResponse.json(
      {
        success: false,
        message:
          error instanceof Error
            ? error.message
            : "Failed to create academic year.",
      },
      {
        status: 400,
      }
    );
  }
}