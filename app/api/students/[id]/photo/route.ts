import { NextRequest, NextResponse } from "next/server";

import { studentPhotoService } from "@/features/students/services/student-photo.service";

interface RouteContext {
  params: Promise<{
    id: string;
  }>;
}

export async function PATCH(
  request: NextRequest,
  { params }: RouteContext
) {
  try {
    const { id } = await params;

    const formData = await request.formData();

    const file = formData.get("photo");

    if (!(file instanceof File)) {
      return NextResponse.json(
        {
          success: false,
          message: "Photo is required.",
        },
        {
          status: 400,
        }
      );
    }

    const buffer = Buffer.from(await file.arrayBuffer());

    const student = await studentPhotoService.uploadPhoto(
      id,
      buffer,
      file.type
    );

    return NextResponse.json({
      success: true,
      data: student,
    });
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      {
        success: false,
        message: "Failed to upload photo.",
      },
      {
        status: 500,
      }
    );
  }
}