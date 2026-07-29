import { NextRequest } from "next/server";

import { apiSuccess } from "@/lib/api/api-response";
import { handleApiError } from "@/lib/api/handle-api-error";

import {
  createSchoolProfileSchema,
  updateSchoolProfileSchema,
} from "@/features/settings/school-profile/schemas/school-profile.schema";

import { schoolProfileService } from "@/features/settings/school-profile/services/school-profile.service";

export async function GET() {
  try {
    const profile = await schoolProfileService.get();

    return apiSuccess(
      profile,
      "School profile retrieved successfully."
    );
  } catch (error) {
    return handleApiError(error);
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    const data = createSchoolProfileSchema.parse(body);

    const profile = await schoolProfileService.create(data);

    return apiSuccess(
      profile,
      "School profile created successfully.",
      201
    );
  } catch (error) {
    return handleApiError(error);
  }
}

export async function PATCH(request: NextRequest) {
  try {
    const body = await request.json();

    const data = updateSchoolProfileSchema.parse(body);

    const profile = await schoolProfileService.update(data);

    return apiSuccess(
      profile,
      "School profile updated successfully."
    );
  } catch (error) {
    return handleApiError(error);
  }
}