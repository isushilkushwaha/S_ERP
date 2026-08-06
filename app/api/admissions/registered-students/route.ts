import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { AdmissionService } from "@/features/admissions/services/admission.service";
import { getAuthenticatedUser, handleUnauthorized } from "@/features/admissions/lib/auth-guard";

const prisma = new PrismaClient();
const admissionService = new AdmissionService(prisma);

export async function GET(request: NextRequest) {
  try {
    const user = await getAuthenticatedUser();
    if (!user) return handleUnauthorized();

    const { searchParams } = new URL(request.url);
    const query = searchParams.get("query") || undefined;

    const students = await admissionService.searchRegisteredStudents(
      user.tenantId,
      query
    );

    return NextResponse.json({
      success: true,
      data: students,
    });
  } catch (error) {
    console.error("[API_REGISTERED_STUDENTS_GET]", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch registered students." },
      { status: 500 }
    );
  }
}