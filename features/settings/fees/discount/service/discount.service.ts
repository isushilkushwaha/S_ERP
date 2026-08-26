import { DiscountRepository } from '../repository/discount.repository';
import { Status } from '@prisma/client';

export class DiscountService {
  private repository = new DiscountRepository();

  async getDiscounts(tenantId: string, status?: Status) {
    return this.repository.findAll(tenantId, status);
  }

  async getDiscountById(id: string) {
    const discount = await this.repository.findById(id);
    if (!discount) throw new Error('Discount type not found.');
    return discount;
  }

  async createDiscount(data: any, userId: string) {
    return this.repository.create({
      ...data,
      validFrom: data.validFrom ? new Date(data.validFrom) : null,
      validUntil: data.validUntil ? new Date(data.validUntil) : null,
      userId,
    });
  }

  async updateDiscount(id: string, data: any, userId: string) {
    return this.repository.update(
      id,
      {
        ...data,
        validFrom: data.validFrom ? new Date(data.validFrom) : null,
        validUntil: data.validUntil ? new Date(data.validUntil) : null,
      },
      userId
    );
  }

  async deleteDiscount(id: string, userId: string) {
    return this.repository.softDelete(id, userId);
  }
}