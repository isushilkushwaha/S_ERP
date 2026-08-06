import {
  CreateFeeStructureDTO,
  FeeStructureDTO,
  FeeStructureQueryParams,
  PaginatedFeeStructures,
  UpdateFeeStructureDTO,
} from '@/features/settings/fee-structures/types/fee-structure.types';

export const feeStructureApi = {
  async fetchList(params: FeeStructureQueryParams): Promise<PaginatedFeeStructures> {
    const query = new URLSearchParams();
    query.set('tenantId', params.tenantId);
    if (params.page) query.set('page', params.page.toString());
    if (params.limit) query.set('limit', params.limit.toString());
    if (params.academicYearId) query.set('academicYearId', params.academicYearId);
    if (params.classId) query.set('classId', params.classId);
    if (params.status) query.set('status', params.status);

    const res = await fetch(`/api/settings/fee-structures?${query.toString()}`, {
      headers: { 'x-tenant-id': params.tenantId },
    });
    const json = await res.json();
    if (!res.ok) throw new Error(json.error || 'Failed to fetch fee structures');
    return json;
  },

  async create(tenantId: string, data: Omit<CreateFeeStructureDTO, 'tenantId'>): Promise<FeeStructureDTO> {
    const res = await fetch(`/api/settings/fee-structures?tenantId=${tenantId}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-tenant-id': tenantId,
      },
      body: JSON.stringify(data),
    });
    const json = await res.json();
    if (!res.ok) throw new Error(json.error || 'Failed to create fee structure');
    return json.data;
  },

  async update(tenantId: string, id: string, data: UpdateFeeStructureDTO): Promise<FeeStructureDTO> {
    const res = await fetch(`/api/settings/fee-structures/${id}?tenantId=${tenantId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'x-tenant-id': tenantId,
      },
      body: JSON.stringify(data),
    });
    const json = await res.json();
    if (!res.ok) throw new Error(json.error || 'Failed to update fee structure');
    return json.data;
  },

  async delete(tenantId: string, id: string): Promise<void> {
    const res = await fetch(`/api/settings/fee-structures/${id}?tenantId=${tenantId}`, {
      method: 'DELETE',
      headers: { 'x-tenant-id': tenantId },
    });
    const json = await res.json();
    if (!res.ok) throw new Error(json.error || 'Failed to delete fee structure');
  },
};