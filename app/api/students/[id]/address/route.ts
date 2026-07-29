import { NextRequest, NextResponse } from "next/server";

import { updateAddressSchema } from "@/features/students/schemas/update/update-address-schema";
import { addressService } from "@/features/students/services/update/address.service";
import { handleApiError } from "@/lib/api/handle-api-error";

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

    const payload = updateAddressSchema.parse(body);

    const student = await addressService.updateAddress(id, payload);

    return NextResponse.json(
      {
        success: true,
        message: "Address updated successfully.",
        data: student,
      },
      { status: 200 }
    );
  } catch (error) {
    return handleApiError(error);
  }
}