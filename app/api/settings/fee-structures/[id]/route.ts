


import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { feeStructureService } from '@/features/settings/fee-structures/services/fee-structure.service';
import { updateFeeStructureSchema } from '@/features/settings/fee-structures/schemas/update-fee-structure.schema';

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    // DIRECT PRISMA QUERY: Removed 'amount: true' from feeComponent!
    const data = await prisma.feeStructure.findUnique({
      where: { id },
      include: {
        academicYear: { select: { id: true, name: true, code: true } },
        class: { select: { id: true, name: true, code: true } },
        items: {
          include: {
            feeComponent: { select: { id: true, name: true, code: true, isRequired: true } },
          },
        },
        // 👇 CRITICAL FIX 1: Deep fetch for direct relation 👇
        installmentPlan: {
          include: { 
            items: { 
              orderBy: { displayOrder: 'asc' },
              include: {
                components: {
                  include: {
                    feeComponent: { select: { id: true, name: true, code: true } }
                  }
                }
              }
            } 
          },
        },
        // 👇 CRITICAL FIX 2: Deep fetch for junction table 👇
        feeStructureInstallmentPlans: {
          where: { isDefault: true },
          include: {
            installmentPlan: {
              include: { 
                items: { 
                  orderBy: { displayOrder: 'asc' },
                  include: {
                    components: {
                      include: {
                        feeComponent: { select: { id: true, name: true, code: true } }
                      }
                    }
                  }
                } 
              },
            },
          },
        },
      },
    });

    if (!data) {
      return NextResponse.json({ success: false, error: 'Fee Structure not found' }, { status: 404 });
    }

    return NextResponse.json({ success: true, data });
  } catch (error: unknown) {
    const err = error as Error;
    return NextResponse.json({ success: false, error: err.message }, { status: 400 });
  }
}

export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const { searchParams } = new URL(req.url);
    const tenantId = req.headers.get('x-tenant-id') || searchParams.get('tenantId') || 'default_tenant';

    const body = await req.json();

    if (body.installmentPlanId) {
      const mapping = await prisma.feeStructureInstallmentPlan.upsert({
        where: {
          unique_fee_structure_installment_plan: {
            feeStructureId: id,
            installmentPlanId: body.installmentPlanId,
          },
        },
        update: { isDefault: true },
        create: {
          feeStructureId: id,
          installmentPlanId: body.installmentPlanId,
          isDefault: true,
        },
      });

      await prisma.feeStructure.update({
        where: { id },
        data: { installmentPlanId: body.installmentPlanId },
      }).catch(() => {});

      return NextResponse.json({ success: true, message: 'Default installment plan linked successfully.', data: mapping });
    }

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
    const tenantId = req.headers.get('x-tenant-id') || searchParams.get('tenantId') || 'default_tenant';

    await feeStructureService.delete(tenantId, id);
    return NextResponse.json({ success: true, message: 'Fee Structure deleted' });
  } catch (error: unknown) {
    const err = error as Error;
    return NextResponse.json({ success: false, error: err.message }, { status: 400 });
  }
}