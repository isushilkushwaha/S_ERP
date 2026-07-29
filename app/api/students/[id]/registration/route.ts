import { NextRequest, NextResponse } from "next/server";
import { ZodError } from "zod";

import { registrationService } from "@/features/students/services/update/registration.service";
import { updateRegistrationSchema } from "@/features/students/schemas/update/update-registration-schema";

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

    const payload = updateRegistrationSchema.parse(body);

    const student =
  await registrationService.update(
    id,
    payload,
  );

    return NextResponse.json(
      {
        success: true,
        message: "Registration details updated successfully.",
        data: student,
      },
      {
        status: 200,
      },
    );
  } catch (error) {
    if (error instanceof ZodError) {
      return NextResponse.json(
        {
          success: false,
          message: "Validation failed.",
          errors: error.flatten().fieldErrors,
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
        message: "Internal server error.",
      },
      {
        status: 500,
      },
    );
  }
}