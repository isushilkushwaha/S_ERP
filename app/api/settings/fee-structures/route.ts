import { NextRequest, NextResponse } from 'next/server';
import { feeStructureService } from '@/features/settings/fee-structures/services/fee-structure.service';
import { searchFeeStructureSchema } from '@/features/settings/fee-structures/schemas/search-fee-structure.schema';
import { createFeeStructureSchema } from '@/features/settings/fee-structures/schemas/create-fee-structure.schema';

// Default NIL UUID tenant identifier matching PostgreSQL default
const DEFAULT_TENANT_ID = '00000000-0000-0000-0000-000000000000';

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);

    // 1. Resolve tenantId with NIL UUID fallback
    const tenantId =
      req.headers.get('x-tenant-id') ||
      searchParams.get('tenantId') ||
      DEFAULT_TENANT_ID;

    // 2. Parse query parameters
    const query = searchFeeStructureSchema.parse({
      tenantId,
      page: searchParams.get('page') ? Number(searchParams.get('page')) : undefined,
      limit: searchParams.get('limit') ? Number(searchParams.get('limit')) : undefined,
      academicYearId: searchParams.get('academicYearId') || undefined,
      classId: searchParams.get('classId') || undefined,
      status: searchParams.get('status') || undefined,
      sortBy: searchParams.get('sortBy') || undefined,
      sortOrder: searchParams.get('sortOrder') || undefined,
    });

    const result = await feeStructureService.list(query);

    // 3. Return clean JSON matching frontend hook expectations
    return NextResponse.json({
      success: true,
      data: result.items,
      meta: result.meta,
    });
  } catch (error: unknown) {
    const err = error as Error;
    return NextResponse.json(
      { success: false, error: err.message || 'Failed to fetch fee structures' },
      { status: 400 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const tenantId =
      req.headers.get('x-tenant-id') ||
      searchParams.get('tenantId') ||
      DEFAULT_TENANT_ID;

    if (!tenantId) {
      return NextResponse.json(
        { success: false, error: 'Tenant context required' },
        { status: 400 }
      );
    }

    const body = await req.json();
    const validated = createFeeStructureSchema.parse(body);

    const data = await feeStructureService.create({ ...validated, tenantId });
    return NextResponse.json({ success: true, data }, { status: 201 });
  } catch (error: unknown) {
    const err = error as Error;
    return NextResponse.json(
      { success: false, error: err.message || 'Failed to create fee structure' },
      { status: 400 }
    );
  }
}