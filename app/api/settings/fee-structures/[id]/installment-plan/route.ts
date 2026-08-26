import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

interface RouteContext {
  params: Promise<{ id: string }>;
}

export async function PUT(req: NextRequest, { params }: RouteContext) {
  try {
    const { id: feeStructureId } = await params;
    const body = await req.json();
    const { installmentPlanId } = body;

    if (!installmentPlanId) {
      return NextResponse.json({ success: false, error: 'installmentPlanId is required' }, { status: 400 });
    }

    // Upsert mapping in fee_structure_installment_plans table
    const mapping = await prisma.feeStructureInstallmentPlan.upsert({
      where: {
        unique_fee_structure_installment_plan: {
          feeStructureId,
          installmentPlanId,
        },
      },
      update: { isDefault: true },
      create: {
        feeStructureId,
        installmentPlanId,
        isDefault: true,
      },
    });

    // Also update direct foreign key relation on fee_structures table if column exists
    await prisma.feeStructure.update({
      where: { id: feeStructureId },
      data: { installmentPlanId },
    }).catch(() => {
      // Gracefully bypass if optional column schema variant differs
    });

    return NextResponse.json({ success: true, message: 'Default installment plan configured successfully.', data: mapping }, { status: 200 });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

// Add this in the same file as your PUT request

export async function GET(req: NextRequest, { params }: RouteContext) {
  try {
    const { id: feeStructureId } = await params;

    if (!feeStructureId) {
      return NextResponse.json({ success: false, error: 'feeStructureId is required' }, { status: 400 });
    }

    const feeStructure = await prisma.feeStructure.findUnique({
      where: { id: feeStructureId },
      include: {
        academicYear: { select: { id: true, name: true, code: true } },
        class: { select: { id: true, name: true, code: true } },
        items: {
          include: {
            feeComponent: { select: { id: true, name: true, code: true, isRequired: true } },
          },
        },
        // 👇 DEEP FETCH: DIRECT RELATION (Saved by your PUT) 👇
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
          }
        },
        // 👇 DEEP FETCH: JUNCTION TABLE (Saved by your PUT) 👇
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
              }
            }
          }
        }
      },
    });

    if (!feeStructure) {
      return NextResponse.json({ success: false, error: 'Fee structure not found' }, { status: 404 });
    }

    return NextResponse.json({ success: true, data: feeStructure }, { status: 200 });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}