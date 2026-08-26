import { useMemo } from 'react';
import { FeeComponentSummary, InstallmentItemInput } from '../types/installment-plan.types';

interface UseInstallmentCalculationsProps {
  items: InstallmentItemInput[];
  feeComponentsList: FeeComponentSummary[];
  totalFee: number;
}

export function useInstallmentCalculations({
  items,
  feeComponentsList,
  totalFee,
}: UseInstallmentCalculationsProps) {
  const componentAssignmentMap = useMemo(() => {
    const map = new Map<string, number>();

    items.forEach((item, milestoneIndex) => {
      const componentIds = item.feeComponentIds || [];
      componentIds.forEach((componentId) => {
        map.set(componentId, milestoneIndex);
      });
    });

    return map;
  }, [items]);

  const usedComponentIds = useMemo(() => {
    return new Set(componentAssignmentMap.keys());
  }, [componentAssignmentMap]);

  const duplicateComponentIds = useMemo(() => {
    const seen = new Set<string>();
    const duplicates = new Set<string>();

    items.forEach((item) => {
      (item.feeComponentIds || []).forEach((componentId) => {
        if (seen.has(componentId)) {
          duplicates.add(componentId);
        }
        seen.add(componentId);
      });
    });

    return duplicates;
  }, [items]);

  const milestoneAmounts = useMemo(() => {
    return items.map((item) => {
      return (item.feeComponentIds || []).reduce((sum, componentId) => {
        const component = feeComponentsList.find(
          (feeComponent) => feeComponent.id === componentId
        );
        return sum + Number(component?.amount || 0);
      }, 0);
    });
  }, [items, feeComponentsList]);

  const totalAllocated = useMemo(() => {
    return milestoneAmounts.reduce((sum, amount) => sum + amount, 0);
  }, [milestoneAmounts]);

  const remainingAmount = totalFee - totalAllocated;

  const isAllComponentsCovered =
    feeComponentsList.length > 0 &&
    usedComponentIds.size === feeComponentsList.length;

  const hasDuplicateComponents = duplicateComponentIds.size > 0;

  const isBalanced =
    isAllComponentsCovered &&
    !hasDuplicateComponents &&
    Math.abs(remainingAmount) < 0.01;

  const canAddMilestone =
    feeComponentsList.length > 0 &&
    usedComponentIds.size < feeComponentsList.length;

  return {
    componentAssignmentMap,
    usedComponentIds,
    duplicateComponentIds,
    milestoneAmounts,
    totalAllocated,
    remainingAmount,
    isAllComponentsCovered,
    hasDuplicateComponents,
    isBalanced,
    canAddMilestone,
  };
}