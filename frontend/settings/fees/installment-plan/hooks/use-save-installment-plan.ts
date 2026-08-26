'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useQueryClient } from '@tanstack/react-query'; // <-- 1. Import query client

export function useSaveInstallmentPlan(feeStructureId: string) {
  const router = useRouter();
  const queryClient = useQueryClient(); // <-- 2. Initialize query client
  const [isSaving, setIsSaving] = useState(false);

  const saveConfiguration = async (payload: any) => {
    try {
      setIsSaving(true);
      const res = await fetch(`/api/settings/fee-structures/${feeStructureId}/installment-plan/configure`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      let json;
      try {
        json = await res.json();
      } catch {
        throw new Error(`Server returned status ${res.status} without a valid JSON response.`);
      }

      if (!res.ok || !json.success) {
        throw new Error(json.error || 'Failed to save configuration');
      }

      // <-- 3. Invalidate query cache so the list view fetches fresh data with the new installmentPlanId
      await queryClient.invalidateQueries({ queryKey: ['settings', 'fee-structures'] });

      router.push('/settings/fees/installment-plans');
      router.refresh();
    } catch (err: any) {
      console.error('Save configuration error:', err);
      alert(err.message || 'An unexpected error occurred while saving.');
    } finally {
      setIsSaving(false);
    }
  };

  return { saveConfiguration, isSaving };
}