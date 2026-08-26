import { prisma } from '@/lib/prisma';
import { Status, InstallmentPlanType, InstallmentCalcType, InstallmentDueRule } from '@prisma/client';
import { Decimal } from '@prisma/client/runtime/library';

export class InstallmentPlanRepository {
  async findAll(tenantId: string, academicYearId?: string, classId?: string) {
    return prisma.installmentPlan.findMany({
      where: {
        tenantId,
        deletedAt: null,
        ...(academicYearId && { academicYearId }),
        ...(classId && { classId }),
      },
      include: {
        academicYear: { select: { id: true, name: true, code: true } },
        class: { select: { id: true, name: true, code: true } },
        items: { orderBy: { displayOrder: 'asc' } },
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  async findById(id: string) {
    return prisma.installmentPlan.findUnique({
      where: { id },
      include: {
        academicYear: true,
        class: true,
        items: {
          include: { feeComponent: true },
          orderBy: { displayOrder: 'asc' },
        },
      },
    });
  }

  async create(data: {
    tenantId: string;
    academicYearId: string;
    classId: string;
    name: string;
    code: string;
    planType: InstallmentPlanType;
    description?: string | null;
    status: Status;
    effectiveFrom?: Date | null;
    effectiveTo?: Date | null;
    userId: string;
    items: Array<{
      feeComponentId?: string | null;
      name: string;
      dueDate?: string | Date | null; // 👇 FIXED: Added dueDate to type
      dueRule: InstallmentDueRule;
      dueDay?: number | null;
      dueMonth?: number | null;
      dueOffsetDays?: number | null;
      calculationType: InstallmentCalcType;
      value: number;
      displayOrder: number;
    }>;
  }) {
    return prisma.$transaction(async (tx) => {
      const plan = await tx.installmentPlan.create({
        data: {
          tenantId: data.tenantId,
          academicYearId: data.academicYearId,
          classId: data.classId,
          name: data.name,
          code: data.code,
          planType: data.planType,
          description: data.description,
          status: data.status,
          effectiveFrom: data.effectiveFrom,
          effectiveTo: data.effectiveTo,
          createdBy: data.userId,
          updatedBy: data.userId,
          items: {
            create: data.items.map((item) => ({
              feeComponentId: item.feeComponentId || null,
              name: item.name,
              dueDate: item.dueDate ? new Date(item.dueDate) : null, // 👇 FIXED: Added dueDate mapping
              dueRule: item.dueRule,
              dueDay: item.dueDay ?? null,
              dueMonth: item.dueMonth ?? null,
              dueOffsetDays: item.dueOffsetDays ?? null,
              calculationType: item.calculationType,
              value: new Decimal(item.value),
              displayOrder: item.displayOrder,
            })),
          },
        },
        include: { items: true },
      });
      return plan;
    });
  }

  async update(id: string, data: any, userId: string) {
    return prisma.$transaction(async (tx) => {
      if (data.items) {
        await tx.installmentPlanItem.deleteMany({
          where: { installmentPlanId: id },
        });
      }

      const { items, ...planData } = data;

      return tx.installmentPlan.update({
        where: { id },
        data: {
          ...planData,
          updatedBy: userId,
          ...(items && {
            items: {
              create: items.map((item: any) => ({
                feeComponentId: item.feeComponentId || null,
                name: item.name,
                dueDate: item.dueDate ? new Date(item.dueDate) : null, // 👇 FIXED: Added dueDate mapping
                dueRule: item.dueRule,
                dueDay: item.dueDay ?? null,
                dueMonth: item.dueMonth ?? null,
                dueOffsetDays: item.dueOffsetDays ?? null,
                calculationType: item.calculationType,
                value: new Decimal(item.value),
                displayOrder: item.displayOrder,
              })),
            },
          }),
        },
        include: { items: true },
      });
    });
  }

  async softDelete(id: string, userId: string) {
    return prisma.installmentPlan.update({
      where: { id },
      data: {
        deletedAt: new Date(),
        updatedBy: userId,
        status: Status.INACTIVE,
      },
    });
  }
}