import { NextRequest, NextResponse } from 'next/server';
import { feeStructureService } from '@/features/settings/fee-structures/services/fee-structure.service';
import { updateFeeStructureSchema } from '@/features/settings/fee-structures/schemas/update-fee-structure.schema';

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const { searchParams } = new URL(req.url);
    const tenantId = req.headers.get('x-tenant-id') || searchParams.get('tenantId') || '';

    const data = await feeStructureService.getById(tenantId, id);
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
    const validated = updateFeeStructureSchema.parse(body);

    const data = await feeStructureService.update(tenantId, id, validated);
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

    await feeStructureService.delete(tenantId, id);
    return NextResponse.json({ success: true, message: 'Fee Structure deleted' });
  } catch (error: unknown) {
    const err = error as Error;
    return NextResponse.json({ success: false, error: err.message }, { status: 400 });
  }
}