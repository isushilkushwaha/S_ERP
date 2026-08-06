import { NextRequest, NextResponse } from 'next/server';
import { feeComponentService } from '@/features/settings/fee-components/services/fee-component.service';
import { searchFeeComponentSchema } from '@/features/settings/fee-components/schemas/search-fee-component.schema';
import { createFeeComponentSchema } from '@/features/settings/fee-components/schemas/create-fee-component.schema';

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const tenantId = req.headers.get('x-tenant-id') || searchParams.get('tenantId') || '';

    const query = searchFeeComponentSchema.parse({
      tenantId,
      page: searchParams.get('page') || undefined,
      limit: searchParams.get('limit') || undefined,
      search: searchParams.get('search') || undefined,
      status: searchParams.get('status') || undefined,
      sortBy: searchParams.get('sortBy') || undefined,
      sortOrder: searchParams.get('sortOrder') || undefined,
    });

    const result = await feeComponentService.list(query);
    return NextResponse.json({ success: true, ...result });
  } catch (error: unknown) {
    const err = error as Error;
    return NextResponse.json({ success: false, error: err.message }, { status: 400 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const tenantId = req.headers.get('x-tenant-id') || '';
    if (!tenantId) return NextResponse.json({ success: false, error: 'Tenant context required' }, { status: 400 });

    const body = await req.json();
    const validated = createFeeComponentSchema.parse(body);

    const data = await feeComponentService.create({ ...validated, tenantId });
    return NextResponse.json({ success: true, data }, { status: 201 });
  } catch (error: unknown) {
    const err = error as Error;
    return NextResponse.json({ success: false, error: err.message }, { status: 400 });
  }
}