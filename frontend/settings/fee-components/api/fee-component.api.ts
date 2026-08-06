import {
  CreateFeeComponentDTO,
  FeeComponentDTO,
  FeeComponentQueryParams,
  PaginatedFeeComponents,
  UpdateFeeComponentDTO,
} from '@/features/settings/fee-components/types/fee-component.types';

export const feeComponentApi = {
  async fetchList(params: FeeComponentQueryParams): Promise<PaginatedFeeComponents> {
    const query = new URLSearchParams();
    query.set('tenantId', params.tenantId);
    if (params.page) query.set('page', params.page.toString());
    if (params.limit) query.set('limit', params.limit.toString());
    if (params.search) query.set('search', params.search);
    if (params.status) query.set('status', params.status);
    if (params.sortBy) query.set('sortBy', params.sortBy);
    if (params.sortOrder) query.set('sortOrder', params.sortOrder);

    const res = await fetch(`/api/settings/fee-components?${query.toString()}`, {
      headers: { 'x-tenant-id': params.tenantId },
    });
    const json = await res.json();
    if (!res.ok) throw new Error(json.error || 'Failed to fetch components');
    return json;
  },

  async create(tenantId: string, data: Omit<CreateFeeComponentDTO, 'tenantId'>): Promise<FeeComponentDTO> {
    const res = await fetch('/api/settings/fee-components', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-tenant-id': tenantId,
      },
      body: JSON.stringify(data),
    });
    const json = await res.json();
    if (!res.ok) throw new Error(json.error || 'Failed to create component');
    return json.data;
  },

  async update(tenantId: string, id: string, data: UpdateFeeComponentDTO): Promise<FeeComponentDTO> {
    const res = await fetch(`/api/settings/fee-components/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'x-tenant-id': tenantId,
      },
      body: JSON.stringify(data),
    });
    const json = await res.json();
    if (!res.ok) throw new Error(json.error || 'Failed to update component');
    return json.data;
  },

  async delete(tenantId: string, id: string): Promise<void> {
  const res = await fetch(`/api/settings/fee-components/${id}?tenantId=${tenantId}`, {
    method: 'DELETE',
    headers: { 'x-tenant-id': tenantId },
  });
  const json = await res.json();
  if (!res.ok) throw new Error(json.error || 'Failed to delete component');
}
};