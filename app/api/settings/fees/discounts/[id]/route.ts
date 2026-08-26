import { NextRequest, NextResponse } from 'next/server';
import { DiscountService } from '@/features/settings/fees/discount/service/discount.service';
import { updateDiscountTypeSchema } from '@/features/settings/fees/discount/validator/discount.validator';

const service = new DiscountService();

export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const discount = await service.getDiscountById(params.id);
    return NextResponse.json({ success: true, data: discount }, { status: 200 });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 404 });
  }
}

export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const body = await req.json();
    const validation = updateDiscountTypeSchema.safeParse(body);

    if (!validation.success) {
      return NextResponse.json({ success: false, error: validation.error.format() }, { status: 400 });
    }

    const mockUserId = 'system_admin_user_id';
    const discount = await service.updateDiscount(params.id, validation.data, mockUserId);

    return NextResponse.json({ success: true, message: 'Discount type updated successfully.', data: discount }, { status: 200 });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const mockUserId = 'system_admin_user_id';
    await service.deleteDiscount(params.id, mockUserId);
    return NextResponse.json({ success: true, message: 'Discount type deleted successfully.' }, { status: 200 });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}