import { feeComponentRepository, FeeComponentRepository } from '../repositories/fee-component.repository';
import {
  CreateFeeComponentDTO,
  FeeComponentQueryParams,
  UpdateFeeComponentDTO,
} from '../types/fee-component.types';

export class FeeComponentService {
  constructor(private repo: FeeComponentRepository) {}

  async list(params: FeeComponentQueryParams) {
    return this.repo.findMany(params);
  }

  async getById(tenantId: string, id: string) {
    const component = await this.repo.findById(tenantId, id);
    if (!component) throw new Error('Fee Component not found');
    return component;
  }

  async create(dto: CreateFeeComponentDTO) {
    const existingCode = await this.repo.findByCode(dto.tenantId, dto.code);
    if (existingCode) {
      throw new Error(`Fee Component with code '${dto.code}' already exists`);
    }

    const existingName = await this.repo.findByName(dto.tenantId, dto.name);
    if (existingName) {
      throw new Error(`Fee Component with name '${dto.name}' already exists`);
    }

    return this.repo.create(dto);
  }

  async update(tenantId: string, id: string, dto: UpdateFeeComponentDTO) {
    await this.getById(tenantId, id);

    if (dto.code) {
      const existing = await this.repo.findByCode(tenantId, dto.code);
      if (existing && existing.id !== id) {
        throw new Error(`Fee Component with code '${dto.code}' already exists`);
      }
    }

    if (dto.name) {
      const existing = await this.repo.findByName(tenantId, dto.name);
      if (existing && existing.id !== id) {
        throw new Error(`Fee Component with name '${dto.name}' already exists`);
      }
    }

    return this.repo.update(tenantId, id, dto);
  }

  async delete(tenantId: string, id: string) {
    await this.getById(tenantId, id);
    const usageCount = await this.repo.countUsage(id);
    if (usageCount > 0) {
      throw new Error('Cannot delete Fee Component as it is tied to active Fee Structures');
    }
    return this.repo.softDelete(tenantId, id);
  }
}

export const feeComponentService = new FeeComponentService(feeComponentRepository);