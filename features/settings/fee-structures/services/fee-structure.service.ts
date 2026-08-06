import { prisma } from '@/lib/prisma'; // Use your project's singleton Prisma client instance
import { feeStructureRepository, FeeStructureRepository } from '../repositories/fee-structure.repository';
import {
  CreateFeeStructureDTO,
  FeeStructureQueryParams,
  UpdateFeeStructureDTO,
} from '../types/fee-structure.types';

export class FeeStructureService {
  constructor(private repo: FeeStructureRepository) {}

  async list(params: FeeStructureQueryParams) {
    return this.repo.findMany(params);
  }

  async getById(tenantId: string, id: string) {
    const structure = await this.repo.findById(tenantId, id);
    if (!structure) throw new Error('Fee Structure not found');
    return structure;
  }

  async create(dto: CreateFeeStructureDTO) {
    const existing = await this.repo.findByYearAndClass(
      dto.tenantId,
      dto.academicYearId,
      dto.classId
    );

    if (existing) {
      throw new Error('Fee Structure already exists for the selected Academic Year and Class.');
    }

    return this.repo.create(dto);
  }

  async update(tenantId: string, id: string, dto: UpdateFeeStructureDTO) {
    await this.getById(tenantId, id);
    return this.repo.update(tenantId, id, dto);
  }

  /**
   * Hard-deletes a Fee Structure permanently ONLY IF no student fee assignments/collections reference it.
   */
  async delete(tenantId: string, id: string) {
    await this.getById(tenantId, id);

    // 1. Safe Dependency Guard Check using double-cast through unknown
    const dbClient = prisma as unknown as Record<string, unknown>;
    let assignedStudentsCount = 0;

    if (dbClient.studentFeeAssignment && typeof dbClient.studentFeeAssignment === 'object' && dbClient.studentFeeAssignment !== null) {
      const assignmentModel = dbClient.studentFeeAssignment as { count: (args: { where: { feeStructureId: string; tenantId: string } }) => Promise<number> };
      assignedStudentsCount = await assignmentModel.count({
        where: { feeStructureId: id, tenantId },
      });
    } else if (dbClient.studentFee && typeof dbClient.studentFee === 'object' && dbClient.studentFee !== null) {
      const studentFeeModel = dbClient.studentFee as { count: (args: { where: { feeStructureId: string; tenantId: string } }) => Promise<number> };
      assignedStudentsCount = await studentFeeModel.count({
        where: { feeStructureId: id, tenantId },
      });
    }

    // 2. Block Hard Delete if assigned to students
    if (assignedStudentsCount > 0) {
      throw new Error(
        `Cannot permanently delete this Fee Structure. It is currently assigned to ${assignedStudentsCount} student(s). Please remove student fee assignments first.`
      );
    }

    // 3. Transactional Hard Delete (Cleans child items first, then parent structure)
    return prisma.$transaction(async (tx) => {
      // Delete child fee structure items first
      await tx.feeStructureItem.deleteMany({
        where: { feeStructureId: id },
      });

      // Delete parent fee structure record permanently from PostgreSQL
      return tx.feeStructure.delete({
        where: { id },
      });
    });
  }
}

export const feeStructureService = new FeeStructureService(feeStructureRepository);