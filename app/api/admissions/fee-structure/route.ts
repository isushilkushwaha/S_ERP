import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { AdmissionService } from "@/features/admissions/services/admission.service";
import { getAuthenticatedUser, handleUnauthorized } from "@/features/admissions/lib/auth-guard";
import { MissingFeeStructureError } from "@/features/admissions/errors/admission.errors";

const prisma = new PrismaClient();
const admissionService = new AdmissionService(prisma);

export async function GET(request: NextRequest) {
  try {
    const user = await getAuthenticatedUser();
    if (!user) return handleUnauthorized();

    const { searchParams } = new URL(request.url);
    const academicYearId = searchParams.get("academicYearId");
    const classId = searchParams.get("classId");

    if (!academicYearId || !classId) {
      return NextResponse.json(
        { success: false, error: "Academic Year ID and Class ID are required parameters." },
        { status: 400 }
      );
    }

    const structure = await admissionService.getFeeStructureForClass(
      user.tenantId,
      academicYearId,
      classId
    );

    return NextResponse.json({
      success: true,
      data: structure,
    });
  } catch (error) {
    if (error instanceof MissingFeeStructureError) {
      return NextResponse.json(
        { success: false, error: error.message, code: error.code },
        { status: error.statusCode }
      );
    }

    console.error("[API_FEE_STRUCTURE_GET]", error);
    return NextResponse.json(
      { success: false, error: "An unexpected error occurred while fetching fee structure." },
      { status: 500 }
    );
  }
}