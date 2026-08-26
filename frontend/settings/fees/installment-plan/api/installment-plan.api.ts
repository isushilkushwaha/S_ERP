import { InstallmentPlanDto, InstallmentPlanFilterParams } from '../types/installment-plan.types';

const BASE_URL = '/api/settings/fees/installment-plans';

export const installmentPlanApi = {
  async getPlans(filters?: InstallmentPlanFilterParams): Promise<InstallmentPlanDto[]> {
    const params = new URLSearchParams();
    if (filters?.academicYearId) params.append('academicYearId', filters.academicYearId);
    if (filters?.classId) params.append('classId', filters.classId);
    if (filters?.status) params.append('status', filters.status);

    const res = await fetch(`${BASE_URL}?${params.toString()}`);
    const json = await res.json();
    if (!json.success) throw new Error(json.error || 'Failed to fetch installment plans');
    return json.data;
  },

  async getPlanById(id: string): Promise<InstallmentPlanDto> {
    const res = await fetch(`${BASE_URL}/${id}`);
    const json = await res.json();
    if (!json.success) throw new Error(json.error || 'Failed to fetch installment plan');
    return json.data;
  },

  async createPlan(data: Partial<InstallmentPlanDto>): Promise<InstallmentPlanDto> {
    const res = await fetch(BASE_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    const json = await res.json();
    if (!json.success) throw new Error(json.error || 'Failed to create installment plan');
    return json.data;
  },

  async updatePlan(id: string, data: Partial<InstallmentPlanDto>): Promise<InstallmentPlanDto> {
    const res = await fetch(`${BASE_URL}/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    const json = await res.json();
    if (!json.success) throw new Error(json.error || 'Failed to update installment plan');
    return json.data;
  },

  async deletePlan(id: string): Promise<void> {
    const res = await fetch(`${BASE_URL}/${id}`, { method: 'DELETE' });
    const json = await res.json();
    if (!json.success) throw new Error(json.error || 'Failed to delete installment plan');
  },
};