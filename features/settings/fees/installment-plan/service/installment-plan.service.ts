import { InstallmentPlanRepository } from '../repository/installment-plan.repository';
import { Status } from '@prisma/client';

export class InstallmentPlanService {
  private repository = new InstallmentPlanRepository();

  async getPlans(tenantId: string, academicYearId?: string, classId?: string) {
    return this.repository.findAll(tenantId, academicYearId, classId);
  }

  async getPlanById(id: string) {
    const plan = await this.repository.findById(id);
    if (!plan) throw new Error('Installment plan not found.');
    return plan;
  }

  async createPlan(data: any, userId: string) {
    return this.repository.create({
      ...data,
      effectiveFrom: data.effectiveFrom ? new Date(data.effectiveFrom) : null,
      effectiveTo: data.effectiveTo ? new Date(data.effectiveTo) : null,
      userId,
    });
  }

  async updatePlan(id: string, data: any, userId: string) {
    return this.repository.update(
      id,
      {
        ...data,
        effectiveFrom: data.effectiveFrom ? new Date(data.effectiveFrom) : null,
        effectiveTo: data.effectiveTo ? new Date(data.effectiveTo) : null,
      },
      userId
    );
  }

  async deletePlan(id: string, userId: string) {
    return this.repository.softDelete(id, userId);
  }
}