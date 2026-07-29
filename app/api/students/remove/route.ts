import { NextRequest, NextResponse } from "next/server";

import { studentService } from "@/features/students/services/student.service";

import { removeStudentSchema } from "@/features/students/schemas/remove-student.schema";

export async function POST(
    request: NextRequest
) {
    try {
        const body = await request.json();

        const data =
            removeStudentSchema.parse(body);

        const response =
            await studentService.removeStudent(
                data
            );

        return NextResponse.json(response);
    } catch (error) {
        if (error instanceof Error) {
            return NextResponse.json(
                {
                    message: error.message,
                },
                {
                    status: 400,
                }
            );
        }

        return NextResponse.json(
            {
                message:
                    "Internal server error.",
            },
            {
                status: 500,
            }
        );
    }
}