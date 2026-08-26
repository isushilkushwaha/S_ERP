import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { Decimal } from '@prisma/client/runtime/library';

interface RouteContext {
  params: Promise<{ id: string }>;
}

export async function POST(req: NextRequest, { params }: RouteContext) {
  try {
    const resolvedParams = await params;
    const feeStructureId = resolvedParams?.id;
    const body = await req.json();

    const { name, code, planType, effectiveFrom, effectiveTo, items, academicYearId, classId } = body;

    if (!feeStructureId) {
      return NextResponse.json({ success: false, error: 'Fee Structure ID is required' }, { status: 400 });
    }

    if (!name || !code || !planType || !items || !Array.isArray(items) || items.length === 0) {
      return NextResponse.json({ success: false, error: 'Invalid payload structure or missing required configuration fields.' }, { status: 400 });
    }

    // 1. Fetch fee structure, associated items/components, and historical admission usage check
    const feeStructure = await prisma.feeStructure.findUnique({
      where: { id: feeStructureId },
      include: {
        items: {
          include: { feeComponent: true },
        },
        installmentPlan: {
          include: {
            items: {
              include: { components: true },
            },
            enrollments: {
              select: { id: true },
              take: 1, // Check if the plan is already tied to student admissions
            },
          },
        },
      },
    });

    if (!feeStructure) {
      return NextResponse.json({ success: false, error: 'Fee structure not found' }, { status: 404 });
    }

    const tenantId = feeStructure.tenantId || '00000000-0000-0000-0000-000000000000';
    const validComponentMap = new Map<string, number>();
    feeStructure.items.forEach((item) => {
      validComponentMap.set(item.feeComponentId, Number(item.amount));
    });

    // 2. Strict Server-Side Component Verification & 100% Financial Validation
    const componentAllocations: Record<string, number> = {};
    validComponentMap.forEach((_, id) => {
      componentAllocations[id] = 0;
    });

    for (const item of items) {
      if (!item.feeComponentIds || !Array.isArray(item.feeComponentIds) || item.feeComponentIds.length === 0) {
        return NextResponse.json({ success: false, error: `Milestone "${item.name}" must map to at least one valid fee component.` }, { status: 400 });
      }

      let milestoneBaseAmount = 0;
      for (const compId of item.feeComponentIds) {
        if (!validComponentMap.has(compId)) {
          return NextResponse.json({ success: false, error: `Security Violation: Component ID ${compId} does not belong to this fee structure.` }, { status: 403 });
        }
        milestoneBaseAmount += validComponentMap.get(compId)!;
      }

      if (item.calculationType === 'PERCENTAGE') {
        const val = Number(item.value);
        if (isNaN(val) || val < 0 || val > 100) {
          return NextResponse.json({ success: false, error: `Invalid percentage value for milestone "${item.name}". Must be between 0 and 100%.` }, { status: 400 });
        }
        const milestoneTotal = (milestoneBaseAmount * val) / 100;
        
        item.feeComponentIds.forEach((compId: string) => {
          const compAmount = validComponentMap.get(compId)!;
          const shareRatio = compAmount / milestoneBaseAmount;
          componentAllocations[compId] += milestoneTotal * shareRatio;
        });
      } else if (item.calculationType === 'FIXED_AMOUNT') {
        const val = Number(item.value);
        if (isNaN(val) || val < 0) {
          return NextResponse.json({ success: false, error: `Invalid fixed amount value for milestone "${item.name}".` }, { status: 400 });
        }
        item.feeComponentIds.forEach((compId: string) => {
          const compAmount = validComponentMap.get(compId)!;
          const shareRatio = compAmount / milestoneBaseAmount;
          componentAllocations[compId] += val * shareRatio;
        });
      } else {
        return NextResponse.json({ success: false, error: `Unsupported calculation type for milestone "${item.name}".` }, { status: 400 });
      }
    }

    // Verify 100% component allocation coverage with strict boundary checks
    for (const [compId, targetOriginalAmount] of validComponentMap.entries()) {
      const allocated = componentAllocations[compId] || 0;
      if (Math.abs(allocated - targetOriginalAmount) > 1.0) {
        return NextResponse.json({ 
          success: false, 
          error: `Financial validation failed: Every fee component must be exactly 100% allocated. (Allocated: ₹${allocated.toFixed(2)}, Required: ₹${targetOriginalAmount.toFixed(2)}).` 
        }, { status: 400 });
      }
    }

    // 3. Atomic Transaction: Versioning vs Direct Update based on historical usage
    const result = await prisma.$transaction(async (tx) => {
      const existingPlan = feeStructure.installmentPlan;
      const hasBeenUsedInAdmissions = Boolean(existingPlan && existingPlan.enrollments && existingPlan.enrollments.length > 0);

      let targetPlanId: string;

      if (!existingPlan || hasBeenUsedInAdmissions) {
        // Create new version if plan is already bound to historical admissions to maintain immutable audit trails
        const nextVersion = existingPlan ? existingPlan.version + 1 : 1;
        const newPlan = await tx.installmentPlan.create({
          data: {
            tenantId,
            academicYearId: academicYearId || feeStructure.academicYearId,
            classId: classId || feeStructure.classId,
            name: `${name} (v${nextVersion})`,
            code: `${code}-V${nextVersion}`,
            planType: planType || 'MONTHLY',
            version: nextVersion,
            effectiveFrom: effectiveFrom ? new Date(effectiveFrom) : null,
            effectiveTo: effectiveTo ? new Date(effectiveTo) : null,
            items: {
              create: items.map((item: any, idx: number) => ({
                name: item.name || `Installment ${idx + 1}`,
                
                // 👇 FIX 1: ADDED DUE DATE SAVING LOGIC 👇
                dueDate: item.dueDate ? new Date(item.dueDate) : null,
                
                dueRule: item.dueRule || 'FIXED_DATE',
                dueDay: item.dueDay !== undefined && item.dueDay !== null ? Number(item.dueDay) : null,
                dueMonth: item.dueMonth !== undefined && item.dueMonth !== null ? Number(item.dueMonth) : null,
                dueOffsetDays: item.dueOffsetDays !== undefined && item.dueOffsetDays !== null ? Number(item.dueOffsetDays) : null,
                calculationType: item.calculationType || 'PERCENTAGE',
                value: new Decimal(item.value || 0),
                displayOrder: item.displayOrder || idx + 1,
                components: {
                  create: item.feeComponentIds.map((feeComponentId: string) => ({
                    feeComponent: { connect: { id: feeComponentId } },
                  })),
                },
              })),
            },
          },
        });

        targetPlanId = newPlan.id;

        // Bind new version to fee structure
        await tx.feeStructure.update({
          where: { id: feeStructureId },
          data: { installmentPlanId: targetPlanId },
        });

        await tx.feeStructureInstallmentPlan.create({
          data: {
            feeStructureId,
            installmentPlanId: targetPlanId,
            isDefault: true,
          },
        });
      } else {
        // Safe to update directly since no admissions depend on this baseline yet
        targetPlanId = existingPlan.id;

        await tx.installmentPlan.update({
          where: { id: targetPlanId },
          data: {
            name: name || 'Default Plan',
            code: code || `DEF-${feeStructureId.slice(0, 6)}`,
            planType: planType || 'MONTHLY',
            effectiveFrom: effectiveFrom ? new Date(effectiveFrom) : null,
            effectiveTo: effectiveTo ? new Date(effectiveTo) : null,
            items: {
              deleteMany: {}, // Cascade deletes old milestones and related pivot component mappings atomically
              create: items.map((item: any, idx: number) => ({
                name: item.name || `Installment ${idx + 1}`,
                
                // 👇 FIX 2: ADDED DUE DATE SAVING LOGIC 👇
                dueDate: item.dueDate ? new Date(item.dueDate) : null,

                dueRule: item.dueRule || 'FIXED_DATE',
                dueDay: item.dueDay !== undefined && item.dueDay !== null ? Number(item.dueDay) : null,
                dueMonth: item.dueMonth !== undefined && item.dueMonth !== null ? Number(item.dueMonth) : null,
                dueOffsetDays: item.dueOffsetDays !== undefined && item.dueOffsetDays !== null ? Number(item.dueOffsetDays) : null,
                calculationType: item.calculationType || 'PERCENTAGE',
                value: new Decimal(item.value || 0),
                displayOrder: item.displayOrder || idx + 1,
                components: {
                  create: item.feeComponentIds.map((feeComponentId: string) => ({
                    feeComponent: { connect: { id: feeComponentId } },
                  })),
                },
              })),
            },
          },
        });

        await tx.feeStructureInstallmentPlan.upsert({
          where: {
            unique_fee_structure_installment_plan: {
              feeStructureId,
              installmentPlanId: targetPlanId,
            },
          },
          update: { isDefault: true },
          create: {
            feeStructureId,
            installmentPlanId: targetPlanId,
            isDefault: true,
          },
        }).catch(() => {});

        await tx.feeStructure.update({
          where: { id: feeStructureId },
          data: { installmentPlanId: targetPlanId },
        });
      }

      return { planId: targetPlanId };
    });

    return NextResponse.json({ 
      success: true, 
      message: 'Default installment plan configured, component-validated, and saved successfully.', 
      data: result 
    }, { status: 200 });

  } catch (error: any) {
    console.error('Failed to configure installment plan:', error);
    return NextResponse.json({ success: false, error: error.message || 'Internal server error during plan configuration' }, { status: 500 });
  }
}

// GET function (No changes needed, it is already perfect!)
export async function GET(req: NextRequest, { params }: RouteContext) {
  try {
    const resolvedParams = await params;
    const feeStructureId = resolvedParams?.id;

    if (!feeStructureId) {
      return NextResponse.json({ success: false, error: 'Fee Structure ID is required' }, { status: 400 });
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
    console.error('Failed to fetch fee structure:', error);
    return NextResponse.json({ success: false, error: error.message || 'Internal server error' }, { status: 500 });
  }
}