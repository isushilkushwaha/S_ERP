import { NextRequest, NextResponse } from "next/server";
import { StudentStatus } from "@prisma/client";

import { createStudentSchema } from "@/features/students/schemas/create-student.schema";
import { studentService } from "@/features/students/services/student.service";
import { handleApiError } from "@/lib/api/handle-api-error";

// export async function GET(request: NextRequest) {
//   try {
//     const { searchParams } = new URL(request.url);

//     const search = searchParams.get("search") ?? undefined;

//     const status = searchParams.get("status") as StudentStatus | null;

//     const page = Number(searchParams.get("page") ?? "1");
//     const limit = Number(searchParams.get("limit") ?? "10");

//     const students = await studentService.getStudents({
//       search,
//       enrollmentStatus: status ?? undefined,
//       page,
//       limit,
//     });

//     return NextResponse.json(students);
//   } catch (error) {
//     return handleApiError(error);
//   }
// }

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);

    const search = searchParams.get("search") ?? undefined;

    const status =
      searchParams.get("status") as StudentStatus | null;

    const page = Number(searchParams.get("page") ?? "1");

    const limit = Number(searchParams.get("limit") ?? "10");

    const response = await studentService.getStudents({
      search,
      enrollmentStatus: status ?? undefined,
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

    const data = createStudentSchema.parse(body);

    const student = await studentService.createStudent(data);

    return NextResponse.json(student, {
      enrollmentStatus: 201,
    });
  } catch (error) {
    return handleApiError(error);
  }
}