import { NextRequest, NextResponse } from "next/server";

import { studentDocumentService } from "@/features/student-documents/services/student-document.service";
import { updateDocumentSchema } from "@/features/student-documents/schemas/update-document.schema";

import { handleApiError } from "@/lib/api/handle-api-error";

interface RouteContext {
  params: Promise<{
    id: string;
  }>;
}

export async function GET(
  _request: NextRequest,
  { params }: RouteContext
) {
  try {
    const { id } = await params;

    const document =
      await studentDocumentService.getDocument(id);

    return NextResponse.json(document);
  } catch (error) {
    return handleApiError(error);
  }
}

export async function PATCH(
  request: NextRequest,
  { params }: RouteContext
) {
  try {
    const { id } = await params;

    const body = await request.json();

    const data =
      updateDocumentSchema.parse(body);

    const document =
      await studentDocumentService.updateDocument(
        id,
        data
      );

    return NextResponse.json(document);
  } catch (error) {
    return handleApiError(error);
  }
}

export async function DELETE(
  _request: NextRequest,
  { params }: RouteContext
) {
  try {
    const { id } = await params;

    await studentDocumentService.deleteDocument(id);

    return NextResponse.json({
      success: true,
      message:
        "Student document deleted successfully.",
    });
  } catch (error) {
    return handleApiError(error);
  }
}