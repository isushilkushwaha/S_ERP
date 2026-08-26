import { NextRequest, NextResponse } from 'next/server';
import { DiscountService } from '@/features/settings/fees/discount/service/discount.service';
import { createDiscountTypeSchema } from '@/features/settings/fees/discount/validator/discount.validator';
import { Status } from '@prisma/client';

const service = new DiscountService();
const tenantId = 'default_tenant';

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const statusParam = searchParams.get('status');
    const status = statusParam ? (statusParam as Status) : undefined;

    const discounts = await service.getDiscounts(tenantId, status);
    return NextResponse.json({ success: true, data: discounts }, { status: 200 });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const validation = createDiscountTypeSchema.safeParse(body);

    if (!validation.success) {
      return NextResponse.json({ success: false, error: validation.error.format() }, { status: 400 });
    }

    const mockUserId = 'system_admin_user_id';
    const discount = await service.createDiscount(validation.data, mockUserId);

    return NextResponse.json({ success: true, message: 'Discount type created successfully.', data: discount }, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}