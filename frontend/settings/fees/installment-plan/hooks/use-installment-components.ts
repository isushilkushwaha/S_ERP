import { useMemo } from 'react';
import { FeeComponentSummary } from '../types/installment-plan.types';

export function useInstallmentComponents(feeStructure: any) {
  const feeComponentsList: FeeComponentSummary[] = useMemo(() => {
    if (!feeStructure?.items) {
      return [];
    }

    return feeStructure.items.map((item: any) => ({
      id: item.feeComponentId,
      name: item.feeComponent?.name || 'Fee Component',
      code: item.feeComponent?.code || '',
      amount: Number(item.amount || 0),
    }));
  }, [feeStructure]);

  const totalFee = useMemo(() => {
    return feeComponentsList.reduce(
      (total, component) => total + component.amount,
      0
    );
  }, [feeComponentsList]);

  return {
    feeComponentsList,
    totalFee,
  };
}