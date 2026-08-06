// app/api/admissions/preview-scope/route.ts

import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const academicYearId = searchParams.get("academicYearId");
    const classId = searchParams.get("classId");
    const sectionId = searchParams.get("sectionId");

    if (!academicYearId) {
      return NextResponse.json({ success: false, message: "Missing academicYearId" }, { status: 400 });
    }

    // 1. Get School Profile Prefix
    const schoolProfile = await prisma.schoolProfile.findFirst({ select: { admissionPrefix: true } });
    const prefix = schoolProfile?.admissionPrefix || "ADM";

    // 2. Get Academic Year Start Year
    const academicYear = await prisma.academicYear.findUnique({
      where: { id: academicYearId },
      select: { startDate: true },
    });
    const startYear = academicYear ? new Date(academicYear.startDate).getFullYear() : new Date().getFullYear();

    // 3. Fetch current admission counter value (or default to 0)
    const admCounter = await prisma.academicYearCounter.findUnique({
      where: { academicYearId },
    });
    const nextAdmSeq = (admCounter?.lastAdmissionSequence || 0) + 1;
    const admissionNumber = `${prefix}-${startYear}-${String(nextAdmSeq).padStart(4, "0")}`;

    // 4. Fetch current roll number counter using findFirst (safe for any compound schema setup)
    let nextRollNumber = 1;
    if (classId && sectionId) {
      const rollCounter = await prisma.rollNumberCounter.findFirst({
        where: {
          academicYearId,
          classId,
          sectionId,
        },
      });
      nextRollNumber = (rollCounter?.lastRollNumber || 0) + 1;
    }

    return NextResponse.json({
      success: true,
      data: {
        admissionNumber,
        rollNumber: nextRollNumber,
      },
    });
  } catch (error: unknown) {
    console.error("[PREVIEW_SCOPE_ERROR]", error);
    return NextResponse.json({ success: false, error: (error as Error).message }, { status: 500 });
  }
}