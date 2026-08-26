// app/api/admissions/route.ts

import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { createAdmissionSchema } from "@/features/admissions/validators/admission.validator";
import { AdmissionService } from "@/features/admissions/services/admission.service";
import { AdmissionDomainError } from "@/features/admissions/errors/admission.errors";
import { CreateAdmissionPayloadDTO } from "@/features/admissions/dto/admission.dto";
import { Prisma } from "@prisma/client";
import { ZodError } from "zod";

const DEFAULT_TENANT_ID = "00000000-0000-0000-0000-000000000000";
const admissionService = new AdmissionService(prisma);

/**
 * GET /api/admissions
 * Fetches paginated admissions list with search and filtering
 */
export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);

    const academicYearId = searchParams.get("academicYearId") || undefined;
    const statusParam = searchParams.get("status") || undefined;
    const classId = searchParams.get("classId") || undefined;
    const sectionId = searchParams.get("sectionId") || undefined;
    const query = searchParams.get("query") || searchParams.get("search") || undefined;

    const page = Math.max(1, Number(searchParams.get("page")) || 1);
    const limit = Math.max(1, Number(searchParams.get("limit")) || 10);
    const skip = (page - 1) * limit;

    const where: Prisma.StudentEnrollmentWhereInput = {
      ...(academicYearId && academicYearId !== "ALL" && { academicYearId }),
      ...(statusParam && statusParam !== "ALL" && { status: statusParam as Prisma.StudentEnrollmentWhereInput['status'] }),
      ...(classId && { classId }),
      ...(sectionId && { sectionId }),
      ...(query && {
        OR: [
          { admissionNumber: { contains: query, mode: "insensitive" } },
          { student: { firstName: { contains: query, mode: "insensitive" } } },
          { student: { lastName: { contains: query, mode: "insensitive" } } },
          { student: { studentCode: { contains: query, mode: "insensitive" } } },
        ],
      }),
    };

    const [enrollments, total] = await Promise.all([
      prisma.studentEnrollment.findMany({
        where,
        skip,
        take: limit,
        orderBy: { createdAt: "desc" },
        include: {
          student: {
            select: {
              id: true,
              studentCode: true,
              firstName: true,
              lastName: true,
              fatherName: true,
              fatherMobile: true,
              gender: true,
              photo: true,
            },
          },
          academicYear: { select: { id: true, name: true, code: true, status: true } },
          class: { select: { id: true, name: true, code: true } },
          section: { select: { id: true, name: true } },
        },
      }),
      prisma.studentEnrollment.count({ where }),
    ]);

    return NextResponse.json({
      success: true,
      data: enrollments,
      meta: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    });
  } catch (error: unknown) {
    const err = error as Error;
    console.error("[API_ADMISSIONS_GET]", err);
    return NextResponse.json(
      { success: false, error: err.message || "Failed to fetch admissions list." },
      { status: 500 }
    );
  }
}

/**
 * POST /api/admissions
 * Creates new admission record with backend counter-generated admission and roll numbers
 */
export async function POST(req: NextRequest) {
  try {
    const tenantId = req.headers.get("x-tenant-id") || DEFAULT_TENANT_ID;
    const body = await req.json();

    // Safely transform concession description: handle null/empty values to satisfy AdmissionConcessionDTO
    const rawConcession = body.concession;
    const concession = rawConcession
      ? {
          discountType: String(rawConcession.discountType),
          discountAmount: Number(rawConcession.discountAmount || 0),
          description:
            rawConcession.description != null ? String(rawConcession.description) : undefined,
        }
      : undefined;

    // 1. Validate request payload using Zod
    const validated = createAdmissionSchema.parse({
      ...body,
      tenantId,
      admissionDate: new Date(body.admissionDate),
      concession,
    });

    // 2. Map validated object to CreateAdmissionPayloadDTO cleanly
    const payload: CreateAdmissionPayloadDTO = {
      ...validated,
      sectionId: validated.sectionId || "",
      concession:
        validated.concession == null
          ? validated.concession
          : {
              ...validated.concession,
              description: validated.concession.description ?? undefined,
            },
    };

    // 3. Delegate full transactional processing to AdmissionService
    const result = await admissionService.processAdmission(payload);

    return NextResponse.json(
      {
        success: true,
        message: "Admission processed successfully",
        data: result,
      },
      { status: 201 }
    );
  } catch (error: unknown) {
    const err = error as Error & { code?: string; meta?: { target?: string[] } };
    console.error("[API_ADMISSIONS_POST]", err);

    // Zod validation error handling using typed issues array
    if (err instanceof ZodError) {
      return NextResponse.json(
        {
          success: false,
          error: "Validation failed",
          details: err.issues.map((issue) => ({
            field: issue.path.join("."),
            message: issue.message,
          })),
        },
        { status: 422 }
      );
    }

    // Domain business error handling
    if (err instanceof AdmissionDomainError) {
      return NextResponse.json(
        {
          success: false,
          error: err.message,
        },
        { status: 400 }
      );
    }

    // Prisma Unique Constraint Conflict handling
    if (err.code === "P2002") {
      const target = err.meta?.target?.[0] || "field";
      return NextResponse.json(
        {
          success: false,
          error: `Duplicate entry conflict on ${target}.`,
        },
        { status: 409 }
      );
    }

    return NextResponse.json(
      {
        success: false,
        error: err.message || "An unexpected error occurred during admission processing.",
      },
      { status: 500 }
    );
  }
}