import { FeeStructure, InstallmentPlan } from '../types/installment-plan.types';

export function getDefaultPlan(
  structure: FeeStructure
): InstallmentPlan | undefined | null {
  if (structure.installmentPlan) {
    return structure.installmentPlan;
  }

  const defaultMapping =
    structure.feeStructureInstallmentPlans?.find(
      (mapping) => mapping.isDefault
    );

  if (defaultMapping?.installmentPlan) {
    return defaultMapping.installmentPlan;
  }

  return structure.feeStructureInstallmentPlans?.[0]
    ?.installmentPlan;
}