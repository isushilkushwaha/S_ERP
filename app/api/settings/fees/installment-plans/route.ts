import { NextRequest, NextResponse } from 'next/server';
import { InstallmentPlanService } from '@/features/settings/fees/installment-plan/service/installment-plan.service';
import { createInstallmentPlanSchema } from '@/features/settings/fees/installment-plan/validator/installment-plan.validator';

const service = new InstallmentPlanService();
const tenantId = 'default_tenant';

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const academicYearId = searchParams.get('academicYearId') || undefined;
    const classId = searchParams.get('classId') || undefined;

    const plans = await service.getPlans(tenantId, academicYearId, classId);
    return NextResponse.json({ success: true, data: plans }, { status: 200 });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const validation = createInstallmentPlanSchema.safeParse(body);

    if (!validation.success) {
      return NextResponse.json({ success: false, error: validation.error.format() }, { status: 400 });
    }

    const mockUserId = 'system_admin_user_id';
    const plan = await service.createPlan(validation.data, mockUserId);

    return NextResponse.json({ success: true, message: 'Installment plan created successfully.', data: plan }, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}