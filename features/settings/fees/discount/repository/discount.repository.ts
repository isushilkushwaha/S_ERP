import { prisma } from '@/lib/prisma';
import { Status } from '@prisma/client';
import { Decimal } from '@prisma/client/runtime/library';

export class DiscountRepository {
  async findAll(tenantId: string, status?: Status) {
    return prisma.discountType.findMany({
      where: {
        tenantId,
        deletedAt: null,
        ...(status && { status }),
      },
      include: {
        applicableComponents: {
          include: { feeComponent: { select: { id: true, name: true, code: true } } },
        },
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  async findById(id: string) {
    return prisma.discountType.findUnique({
      where: { id },
      include: {
        applicableComponents: {
          include: { feeComponent: true },
        },
      },
    });
  }

  async create(data: {
    tenantId: string;
    name: string;
    code: string;
    description?: string | null;
    percentage?: number | null;
    fixedAmount?: number | null;
    maxLimit?: number | null;
    validFrom?: Date | null;
    validUntil?: Date | null;
    status: Status;
    userId: string;
    applicableComponentIds: string[];
  }) {
    return prisma.$transaction(async (tx) => {
      const discountType = await tx.discountType.create({
        data: {
          tenantId: data.tenantId,
          name: data.name,
          code: data.code,
          description: data.description,
          percentage: data.percentage ? new Decimal(data.percentage) : null,
          fixedAmount: data.fixedAmount ? new Decimal(data.fixedAmount) : null,
          maxLimit: data.maxLimit ? new Decimal(data.maxLimit) : null,
          validFrom: data.validFrom,
          validUntil: data.validUntil,
          status: data.status,
          createdBy: data.userId,
          updatedBy: data.userId,
          applicableComponents: {
            create: data.applicableComponentIds.map((feeComponentId) => ({
              feeComponentId,
            })),
          },
        },
        include: { applicableComponents: true },
      });
      return discountType;
    });
  }

  async update(id: string, data: any, userId: string) {
    return prisma.$transaction(async (tx) => {
      if (data.applicableComponentIds) {
        await tx.discountTypeComponent.deleteMany({
          where: { discountTypeId: id },
        });
      }

      const { applicableComponentIds, ...updateData } = data;

      return tx.discountType.update({
        where: { id },
        data: {
          ...updateData,
          updatedBy: userId,
          ...(updateData.percentage !== undefined && { percentage: updateData.percentage ? new Decimal(updateData.percentage) : null }),
          ...(updateData.fixedAmount !== undefined && { fixedAmount: updateData.fixedAmount ? new Decimal(updateData.fixedAmount) : null }),
          ...(updateData.maxLimit !== undefined && { maxLimit: updateData.maxLimit ? new Decimal(updateData.maxLimit) : null }),
          ...(applicableComponentIds && {
            applicableComponents: {
              create: applicableComponentIds.map((feeComponentId: string) => ({
                feeComponentId,
              })),
            },
          }),
        },
        include: { applicableComponents: true },
      });
    });
  }

  async softDelete(id: string, userId: string) {
    return prisma.discountType.update({
      where: { id },
      data: {
        deletedAt: new Date(),
        updatedBy: userId,
        status: Status.INACTIVE,
      },
    });
  }
}