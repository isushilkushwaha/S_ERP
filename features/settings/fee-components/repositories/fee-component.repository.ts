import { prisma } from '@/lib/prisma';
import { Prisma } from '@prisma/client';
import {
  CreateFeeComponentDTO,
  FeeComponentQueryParams,
  UpdateFeeComponentDTO,
} from '../types/fee-component.types';

export class FeeComponentRepository {
  async findMany(params: FeeComponentQueryParams) {
    const { tenantId, page = 1, limit = 10, search, status, sortBy = 'createdAt', sortOrder = 'desc' } = params;

    const where: Prisma.FeeComponentWhereInput = {
      tenantId,
      deletedAt: null,
      ...(status && { status }),
      ...(search && {
        OR: [
          { name: { contains: search, mode: 'insensitive' } },
          { code: { contains: search, mode: 'insensitive' } },
        ],
      }),
    };

    const [items, total] = await Promise.all([
      prisma.feeComponent.findMany({
        where,
        skip: (page - 1) * limit,
        take: limit,
        orderBy: { [sortBy]: sortOrder },
      }),
      prisma.feeComponent.count({ where }),
    ]);

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
    return prisma.feeComponent.findFirst({
      where: { id, tenantId, deletedAt: null },
    });
  }

  async findByCode(tenantId: string, code: string) {
    return prisma.feeComponent.findFirst({
      where: { tenantId, code, deletedAt: null },
    });
  }

  async findByName(tenantId: string, name: string) {
    return prisma.feeComponent.findFirst({
      where: { tenantId, name, deletedAt: null },
    });
  }

  async create(data: CreateFeeComponentDTO) {
    return prisma.feeComponent.create({
      data: {
        tenantId: data.tenantId,
        name: data.name,
        code: data.code,
        description: data.description,
        isRequired: data.isRequired ?? true,
        displayOrder: data.displayOrder ?? 0,
        status: data.status ?? 'ACTIVE',
        createdBy: data.createdBy,
      },
    });
  }

  async update(tenantId: string, id: string, data: UpdateFeeComponentDTO) {
    return prisma.feeComponent.update({
      where: { id },
      data: {
        ...data,
        version: { increment: 1 },
      },
    });
  }

  async softDelete(tenantId: string, id: string) {
    return prisma.feeComponent.update({
      where: { id },
      data: {
        deletedAt: new Date(),
        status: 'INACTIVE',
      },
    });
  }

  async countUsage(id: string): Promise<number> {
    return prisma.feeStructureItem.count({
      where: { feeComponentId: id },
    });
  }
}

export const feeComponentRepository = new FeeComponentRepository();