import React from 'react';
import { prisma } from '@/lib/prisma';

import { InstallmentPlanDetail } from '@/frontend/settings/fees/installment-plan/components/installment-plan-detail';

interface PageProps {
  params: Promise<{
    id: string;
  }>;
}

function serializeDate(
  value: Date | null | undefined
): string | null {
  return value instanceof Date
    ? value.toISOString()
    : null;
}

export default async function ViewInstallmentPlanPage({
  params,
}: PageProps) {
  const { id } = await params;

  if (!id) {
    return (
      <div className="flex min-h-[80vh] items-center justify-center">
        <p className="text-sm text-muted-foreground">
          Invalid or missing Installment Plan ID.
        </p>
      </div>
    );
  }

  /**
   * ========================================================
   * FETCH INSTALLMENT PLAN
   * ========================================================
   */
  const rawPlan =
    await prisma.installmentPlan.findUnique({
      where: {
        id,
      },

      include: {
        academicYear: {
          select: {
            id: true,
            name: true,
            code: true,
          },
        },

        class: {
          select: {
            id: true,
            name: true,
            code: true,
          },
        },

        items: {
          orderBy: {
            displayOrder: 'asc',
          },

          include: {
            components: {
              include: {
                feeComponent: {
                  select: {
                    id: true,
                    name: true,
                    code: true,
                  },
                },
              },
            },
          },
        },
      },
    });

  if (!rawPlan) {
    return (
      <div className="flex min-h-[80vh] items-center justify-center">
        <div className="text-center">
          <p className="text-sm font-medium text-destructive">
            Installment Plan not found.
          </p>

          <p className="mt-1 text-xs text-muted-foreground">
            The requested installment plan does not exist.
          </p>
        </div>
      </div>
    );
  }

  /**
   * ========================================================
   * SERIALIZE DATA FOR CLIENT COMPONENT
   * ========================================================
   */

  const plan = {
    id: rawPlan.id,

    tenantId: rawPlan.tenantId,

    academicYearId: rawPlan.academicYearId,

    classId: rawPlan.classId,

    name: rawPlan.name,

    code: rawPlan.code,

    planType: rawPlan.planType,

    description: rawPlan.description ?? undefined,

    status: rawPlan.status,

    effectiveFrom: serializeDate(
      rawPlan.effectiveFrom
    ),

    effectiveTo: serializeDate(
      rawPlan.effectiveTo
    ),

    version: rawPlan.version,

    academicYear: rawPlan.academicYear
      ? {
          id: rawPlan.academicYear.id,
          name: rawPlan.academicYear.name,
          code: rawPlan.academicYear.code,
        }
      : undefined,

    class: rawPlan.class
      ? {
          id: rawPlan.class.id,
          name: rawPlan.class.name,
          code: rawPlan.class.code,
        }
      : undefined,

    items: rawPlan.items.map((item) => ({
      id: item.id,

      installmentPlanId:
        item.installmentPlanId,

      name: item.name,

      dueRule: item.dueRule,

      // Fallback or handle day/month serialization if dueDate isn't in schema yet
      dueDate: serializeDate(
        (item as any).dueDate ?? null
      ),

      dueDay: item.dueDay ?? undefined,

      dueMonth: item.dueMonth ?? undefined,

      dueOffsetDays:
        item.dueOffsetDays ?? undefined,

      calculationType:
        item.calculationType,

      value: Number(item.value),

      displayOrder:
        item.displayOrder,

      components:
        item.components.map(
          (mapping) => ({
            id: mapping.id,

            feeComponentId:
              mapping.feeComponentId,

            feeComponent:
              mapping.feeComponent
                ? {
                    id: mapping.feeComponent.id,
                    name: mapping.feeComponent.name ?? undefined,
                    code: mapping.feeComponent.code ?? undefined,
                  }
                : undefined,
          })
        ),

      createdAt: serializeDate(
        item.createdAt
      ),

      updatedAt: serializeDate(
        item.updatedAt
      ),
    })),

    createdAt: serializeDate(
      rawPlan.createdAt
    ),

    updatedAt: serializeDate(
      rawPlan.updatedAt
    ),

    deletedAt: serializeDate(
      rawPlan.deletedAt
    ),
  };

  return (
    <InstallmentPlanDetail
      plan={plan}
    />
  );
}