import { NextResponse } from "next/server";

import { studentCodeService } from "@/features/students/services/student-code.service";

export async function GET() {
  try {
    const studentCode =
      await studentCodeService.getNextStudentCode();

    return NextResponse.json({
      studentCode,
    });
  } catch (error) {
    console.error("Generate student code error:", error);

    return NextResponse.json(
      {
        message:
          "Failed to generate student registration number.",
      },
      {
        status: 500,
      }
    );
  }
}