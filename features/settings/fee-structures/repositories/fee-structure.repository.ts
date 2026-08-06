import { prisma } from '@/lib/prisma';
import { Prisma } from '@prisma/client';
import {
  CreateFeeStructureDTO,
  FeeStructureQueryParams,
  UpdateFeeStructureDTO,
} from '../types/fee-structure.types';

export class FeeStructureRepository {
  async findMany(params: FeeStructureQueryParams) {
    const { tenantId, page = 1, limit = 10, academicYearId, classId, status, sortBy = 'createdAt', sortOrder = 'desc' } = params;

    const where: Prisma.FeeStructureWhereInput = {
      tenantId,
      deletedAt: null,
      ...(academicYearId && { academicYearId }),
      ...(classId && { classId }),
      ...(status && { status }),
    };

    const [rawItems, total] = await Promise.all([
      prisma.feeStructure.findMany({
        where,
        skip: (page - 1) * limit,
        take: limit,
        orderBy: { [sortBy]: sortOrder },
        include: {
          academicYear: { select: { id: true, name: true } },
          class: { select: { id: true, name: true } },
          items: {
            include: {
              feeComponent: { select: { id: true, name: true, code: true, isRequired: true } },
            },
          },
        },
      }),
      prisma.feeStructure.count({ where }),
    ]);

    const items = rawItems.map((item) => {
      const totalAmount = item.items.reduce((sum, line) => sum + Number(line.amount), 0);
      return {
        ...item,
        effectiveFrom: item.effectiveFrom.toISOString(),
        createdAt: item.createdAt.toISOString(),
        updatedAt: item.updatedAt.toISOString(),
        deletedAt: item.deletedAt ? item.deletedAt.toISOString() : null,
        items: item.items.map((i) => ({
          ...i,
          amount: Number(i.amount),
          createdAt: i.createdAt.toISOString(),
          updatedAt: i.updatedAt.toISOString(),
        })),
        totalAmount,
      };
    });

    return {
      items,
      meta: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  async findById(tenantId: string, id: string) {
    const item = await prisma.feeStructure.findFirst({
      where: { id, tenantId, deletedAt: null },
      include: {
        academicYear: { select: { id: true, name: true } },
        class: { select: { id: true, name: true } },
        items: {
          include: {
            feeComponent: { select: { id: true, name: true, code: true, isRequired: true } },
          },
        },
      },
    });

    if (!item) return null;

    const totalAmount = item.items.reduce((sum, line) => sum + Number(line.amount), 0);
    return {
      ...item,
      effectiveFrom: item.effectiveFrom.toISOString(),
      createdAt: item.createdAt.toISOString(),
      updatedAt: item.updatedAt.toISOString(),
      deletedAt: item.deletedAt ? item.deletedAt.toISOString() : null,
      items: item.items.map((i) => ({
        ...i,
        amount: Number(i.amount),
        createdAt: i.createdAt.toISOString(),
        updatedAt: i.updatedAt.toISOString(),
      })),
      totalAmount,
    };
  }

  async findByYearAndClass(tenantId: string, academicYearId: string, classId: string) {
    return prisma.feeStructure.findFirst({
      where: {
        tenantId,
        academicYearId,
        classId,
        deletedAt: null,
      },
    });
  }

  async create(data: CreateFeeStructureDTO) {
    return prisma.$transaction(async (tx) => {
      const created = await tx.feeStructure.create({
        data: {
          tenantId: data.tenantId,
          academicYearId: data.academicYearId,
          classId: data.classId,
          effectiveFrom: data.effectiveFrom,
          status: data.status ?? 'ACTIVE',
          notes: data.notes,
          createdBy: data.createdBy,
          items: {
            createMany: {
              data: data.items.map((item) => ({
                feeComponentId: item.feeComponentId,
                amount: item.amount,
              })),
            },
          },
        },
        include: { items: true },
      });
      return created;
    });
  }

  async update(tenantId: string, id: string, data: UpdateFeeStructureDTO) {
    return prisma.$transaction(async (tx) => {
      if (data.items) {
        await tx.feeStructureItem.deleteMany({
          where: { feeStructureId: id },
        });

        await tx.feeStructureItem.createMany({
          data: data.items.map((item) => ({
            feeStructureId: id,
            feeComponentId: item.feeComponentId,
            amount: item.amount,
          })),
        });
      }

      const updated = await tx.feeStructure.update({
        where: { id },
        data: {
          ...(data.effectiveFrom && { effectiveFrom: data.effectiveFrom }),
          ...(data.status && { status: data.status }),
          ...(data.notes !== undefined && { notes: data.notes }),
          ...(data.updatedBy && { updatedBy: data.updatedBy }),
          version: { increment: 1 },
        },
        include: { items: true },
      });

      return updated;
    });
  }

  async softDelete(tenantId: string, id: string) {
    return prisma.feeStructure.update({
      where: { id },
      data: {
        deletedAt: new Date(),
        status: 'ARCHIVED',
      },
    });
  }
}

export const feeStructureRepository = new FeeStructureRepository();