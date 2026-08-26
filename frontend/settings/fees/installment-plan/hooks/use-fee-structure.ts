// frontend/settings/fees/installment-plans/hooks/use-fee-structure.ts

'use client';

import { useState, useEffect, useCallback } from 'react';
import { FeeStructure } from '../types/installment-plan.types';

// 1. Singular Hook (for Configure Workspace)
export function useFeeStructure(feeStructureId: string) {
  const [feeStructure, setFeeStructure] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function load() {
      try {
        setIsLoading(true);
        const res = await fetch(`/api/settings/fee-structures/${feeStructureId}`);
        const json = await res.json();
        if (!res.ok || !json.success) throw new Error(json.error || json.message);
        setFeeStructure(json.data || json);
      } catch (err: any) {
        setError(err.message || 'Unable to load fee structure.');
      } finally {
        setIsLoading(false);
      }
    }
    if (feeStructureId) load();
  }, [feeStructureId]);

  return { feeStructure, isLoading, error };
}

// 2. Plural Hook (for List View table)
export function useFeeStructures(selectedAcademicYearId?: string) {
  const [feeStructures, setFeeStructures] = useState<FeeStructure[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchStructures = useCallback(async (signal?: AbortSignal) => {
    try {
      setIsLoading(true);
      setError(null);

      const params = new URLSearchParams();
      if (selectedAcademicYearId) {
        params.append('academicYearId', selectedAcademicYearId);
      }
      // Explicitly request a high limit to prevent pagination truncation (showing all structures)
      params.append('limit', '100');

      const response = await fetch(`/api/settings/fee-structures?${params.toString()}`, {
        method: 'GET',
        cache: 'no-store',
        signal,
      });

      if (!response.ok) {
        throw new Error(`Failed to load fee structures (${response.status})`);
      }

      const json = await response.json();
      const data = Array.isArray(json)
        ? json
        : Array.isArray(json?.data)
        ? json.data
        : [];

      setFeeStructures(data);
    } catch (err: any) {
      if (err.name === 'AbortError') return;

      console.error('Failed to fetch fee structures:', err);
      setError(err instanceof Error ? err.message : 'Unable to load fee structures.');
      setFeeStructures([]);
    } finally {
      if (!signal?.aborted) {
        setIsLoading(false);
      }
    }
  }, [selectedAcademicYearId]);

  useEffect(() => {
    const controller = new AbortController();
    fetchStructures(controller.signal);

    return () => {
      controller.abort();
    };
  }, [fetchStructures]);

  const refresh = () => {
    fetchStructures();
  };

  return {
    feeStructures,
    isLoading,
    error,
    refresh,
  };
}