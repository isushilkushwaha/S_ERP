import { NextRequest, NextResponse } from "next/server";
import { ZodError } from "zod";

import { personalService } from "@/features/students/services/update/personal.service";
import { personalSchema } from "@/frontend/students/schemas/update/personal-schema";

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

    const data = personalSchema.parse(body);

    const student = await personalService.update(id, {
      dateOfBirth: data.dateOfBirth
        ? new Date(data.dateOfBirth)
        : undefined,

      gender: data.gender as any || undefined,

      bloodGroup: data.bloodGroup || undefined,

      religion: data.religion || undefined,

      category: data.category || undefined,

      caste: data.caste || undefined,

      nationality: data.nationality || undefined,

      aadhaarNumber: data.aadhaarNumber || undefined,

      birthCertificateNo:
        data.birthCertificateNo || undefined,

      previousSchool:
        data.previousSchool || undefined,

      remarks: data.remarks || undefined,
    });

    return NextResponse.json({
      success: true,
      message: "Personal information updated successfully.",
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