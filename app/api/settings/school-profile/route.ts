import { NextRequest } from "next/server";

import { apiSuccess } from "@/lib/api/api-response";
import { handleApiError } from "@/lib/api/handle-api-error";

import {
  createSchoolProfileSchema,
  updateSchoolProfileSchema,
} from "@/features/settings/school-profile/schemas/school-profile.schema";

import { schoolProfileService } from "@/features/settings/school-profile/services/school-profile.service";

/**
 * GET /api/settings/school-profile
 * Fetches the active school profile including admissionPrefix.
 */
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

/**
 * POST /api/settings/school-profile
 * Creates the initial school profile with admissionPrefix support.
 */
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

/**
 * PATCH /api/settings/school-profile
 * Updates the active school profile including admissionPrefix.
 */
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