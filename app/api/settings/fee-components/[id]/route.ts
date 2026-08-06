// app/api/settings/fee-components/[id]/route.ts

import { NextRequest, NextResponse } from 'next/server';
import { feeComponentService } from '@/features/settings/fee-components/services/fee-component.service';
import { updateFeeComponentSchema } from '@/features/settings/fee-components/schemas/update-fee-component.schema';

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const { searchParams } = new URL(req.url);
    const tenantId = req.headers.get('x-tenant-id') || searchParams.get('tenantId') || '';

    const data = await feeComponentService.getById(tenantId, id);
    return NextResponse.json({ success: true, data });
  } catch (error: unknown) {
    const err = error as Error;
    return NextResponse.json({ success: false, error: err.message }, { status: 404 });
  }
}

export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const { searchParams } = new URL(req.url);
    const tenantId = req.headers.get('x-tenant-id') || searchParams.get('tenantId') || '';

    const body = await req.json();
    const validated = updateFeeComponentSchema.parse(body);

    const data = await feeComponentService.update(tenantId, id, validated);
    return NextResponse.json({ success: true, data });
  } catch (error: unknown) {
    const err = error as Error;
    return NextResponse.json({ success: false, error: err.message }, { status: 400 });
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const { searchParams } = new URL(req.url);
    const tenantId = req.headers.get('x-tenant-id') || searchParams.get('tenantId') || '';

    await feeComponentService.delete(tenantId, id);
    return NextResponse.json({ success: true, message: 'Fee Component deleted' });
  } catch (error: unknown) {
    const err = error as Error;
    return NextResponse.json({ success: false, error: err.message }, { status: 400 });
  }
}