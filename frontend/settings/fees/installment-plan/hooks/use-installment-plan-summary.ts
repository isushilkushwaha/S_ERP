// frontend/settings/fees/installment-plans/hooks/use-installment-plan-summary.ts
import { useMemo } from 'react';
import { FeeStructure } from '../types/installment-plan.types';
import { getDefaultPlan } from '../utils/installment-plan.utils';

export function useInstallmentPlanSummary(feeStructures: FeeStructure[]) {
  return useMemo(() => {
    const configured = feeStructures.filter((structure) =>
      Boolean(getDefaultPlan(structure))
    ).length;

    const notConfigured = feeStructures.length - configured;

    const totalFee = feeStructures.reduce((sum, structure) => {
      const structureTotal =
        structure.items?.reduce(
          (componentSum, item) =>
            componentSum + Number(item.amount || 0),
          0
        ) || 0;

      return sum + structureTotal;
    }, 0);

    return {
      total: feeStructures.length,
      configured,
      notConfigured,
      totalFee,
    };
  }, [feeStructures]);
}