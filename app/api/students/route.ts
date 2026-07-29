import { NextRequest, NextResponse } from "next/server";
import { ZodError } from "zod";

import { createStudentSchema } from "@/features/students/schemas/create-student.schema";
import { studentService } from "@/features/students/services/student.service";
import { handleApiError } from "@/lib/api/handle-api-error";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);

    const search =
      searchParams.get("search") ?? undefined;

    const page = Number(
      searchParams.get("page") ?? "1"
    );

    const limit = Number(
      searchParams.get("limit") ?? "10"
    );

    const response =
      await studentService.getStudents({
        search,
        page,
        limit,
      });

    return NextResponse.json(response);
  } catch (error) {
    return handleApiError(error);
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    const data =
      createStudentSchema.parse(body);

    const response =
      await studentService.createStudent(data);

    return NextResponse.json(response, {
      status: 201,
    });
  } catch (error) {
    if (error instanceof ZodError) {
      return NextResponse.json(
        {
          success: false,
          message: "Validation failed",
          errors: error.flatten().fieldErrors,
        },
        {
          status: 400,
        }
      );
    }

    return handleApiError(error);
  }
}