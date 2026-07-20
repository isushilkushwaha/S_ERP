import { NextRequest, NextResponse } from "next/server";
import { DocumentType } from "@prisma/client";

import { studentDocumentService } from "@/features/student-documents/services/student-document.service";
import { createDocumentSchema } from "@/features/student-documents/schemas/create-document.schema";

import { handleApiError } from "@/lib/api/handle-api-error";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);

    const search =
      searchParams.get("search") ?? undefined;

    const studentId =
      searchParams.get("studentId") ?? undefined;

    const documentType =
      (searchParams.get("documentType") as DocumentType | null) ??
      undefined;

    const verified =
      searchParams.get("verified") === null
        ? undefined
        : searchParams.get("verified") === "true";

    const page = Number(
      searchParams.get("page") ?? "1"
    );

    const limit = Number(
      searchParams.get("limit") ?? "10"
    );

    const result =
      await studentDocumentService.getDocuments({
        search,
        studentId,
        documentType,
        verified,
        page,
        limit,
      });

    return NextResponse.json(result);
  } catch (error) {
    return handleApiError(error);
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    const data =
      createDocumentSchema.parse(body);

    const document =
      await studentDocumentService.createDocument(
        data
      );

    return NextResponse.json(document, {
      enrollmentenrollmentStatus: 201,
    });
  } catch (error) {
    return handleApiError(error);
  }
}