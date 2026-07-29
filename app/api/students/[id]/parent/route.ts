import { NextRequest, NextResponse } from "next/server";
import { ZodError } from "zod";

import { parentService } from "@/features/students/services/update/parent.service";
import { parentSchema } from "@/frontend/students/schemas/update/parent-schema";

interface RouteParams {
  params: Promise<{
    id: string;
  }>;
}

export async function PATCH(
  request: NextRequest,
  { params }: RouteParams,
) {
  try {
    const { id } = await params;

    const body = await request.json();

    const data = parentSchema.parse(body);

    const student = await parentService.update(id, {
      fatherName: data.fatherName || undefined,
      fatherOccupation: data.fatherOccupation || undefined,
      fatherMobile: data.fatherMobile || undefined,
      fatherEmail: data.fatherEmail || undefined,

      motherName: data.motherName || undefined,
      motherOccupation: data.motherOccupation || undefined,
      motherMobile: data.motherMobile || undefined,
      motherEmail: data.motherEmail || undefined,

      guardianName: data.guardianName || undefined,
      guardianRelation: data.guardianRelation || undefined,
      guardianMobile: data.guardianMobile || undefined,
      guardianEmail: data.guardianEmail || undefined,
    });

    return NextResponse.json({
      success: true,
      message: "Parent information updated successfully.",
      data: student,
    });
  } catch (error) {
    if (error instanceof ZodError) {
      return NextResponse.json(
        {
          success: false,
          message: "Validation failed.",
          errors: error.flatten(),
        },
        {
          status: 400,
        },
      );
    }

    console.error(error);

    return NextResponse.json(
      {
        success: false,
        message: "Internal Server Error.",
      },
      {
        status: 500,
      },
    );
  }
}