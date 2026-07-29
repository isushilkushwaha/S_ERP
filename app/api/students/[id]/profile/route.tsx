import { NextRequest, NextResponse } from "next/server";

import { profileService } from "@/features/students/services/update/profile.service";
import { handleApiError } from "@/lib/api/handle-api-error";

import { updateProfileSchema } from "@/features/students/schemas/update/update-profile-schema";

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

    const body = await request.json();

    const payload = updateProfileSchema.parse(body);

    const student = await profileService.updateProfile(id, payload);

    return NextResponse.json(
      {
        success: true,
        message: "Profile updated successfully.",
        data: student,
      },
      { status: 200 }
    );
  } catch (error) {
    return handleApiError(error);
  }
}