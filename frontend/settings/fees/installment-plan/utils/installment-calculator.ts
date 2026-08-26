export interface FeeComponentSummary {
  id: string;
  name: string;
  amount: number;
}

export interface InstallmentItemInput {
  name: string;
  dueRule: 'FIXED_DATE' | 'ADMISSION_DATE' | 'OFFSET_DAYS';
  dueDay?: number | null;
  dueMonth?: number | null;
  dueOffsetDays?: number | null;
  calculationType: 'PERCENTAGE' | 'FIXED_AMOUNT';
  value: number;
  displayOrder: number;
  feeComponentId?: string | null;
}

export interface InstallmentCalculationResult {
  totalFee: number;
  allocatedAmount: number;
  remainingAmount: number;
  allocationPercentage: number;
  isBalanced: boolean;
  isOverAllocated: boolean;
  isAllComponentsCovered: boolean;
  componentAllocations: Record<string, number>;
  installmentAmounts: number[];
  errors: string[];
}

function toPaise(rupees: number): number {
  return Math.round(Number(rupees || 0) * 100);
}

function toRupees(paise: number): number {
  return paise / 100;
}

export function calculateInstallmentSummary(
  totalFee: number,
  feeComponents: FeeComponentSummary[],
  installmentItems: InstallmentItemInput[]
): InstallmentCalculationResult {
  const errors: string[] = [];
  const totalFeePaise = toPaise(totalFee);

  const componentPoolsPaise: Record<string, number> = {};
  feeComponents.forEach((comp) => {
    componentPoolsPaise[comp.id] = toPaise(comp.amount);
  });

  const componentAllocatedPaise: Record<string, number> = {};
  feeComponents.forEach((comp) => {
    componentAllocatedPaise[comp.id] = 0;
  });

  const installmentAmountsPaise: number[] = new Array(installmentItems.length).fill(0);

  let totalAllocatedPaise = 0;
  let fixedTotalPaise = 0;

  installmentItems.forEach((item, index) => {
    if (item.calculationType === 'FIXED_AMOUNT') {
      const fixedPaise = toPaise(item.value);
      installmentAmountsPaise[index] = fixedPaise;
      fixedTotalPaise += fixedPaise;
      totalAllocatedPaise += fixedPaise;

      if (item.feeComponentId && componentAllocatedPaise[item.feeComponentId] !== undefined) {
        componentAllocatedPaise[item.feeComponentId] += fixedPaise;
      }
    }
  });

  const remainingFeeForPercentagePaise = Math.max(0, totalFeePaise - fixedTotalPaise);

  let totalPercentage = 0;
  installmentItems.forEach((item, index) => {
    if (item.calculationType === 'PERCENTAGE') {
      const pct = Number(item.value || 0);
      totalPercentage += pct;

      let basePaise = remainingFeeForPercentagePaise;
      if (item.feeComponentId && componentPoolsPaise[item.feeComponentId] !== undefined) {
        basePaise = componentPoolsPaise[item.feeComponentId];
      }

      const allocatedPaise = Math.round((basePaise * pct) / 100);
      installmentAmountsPaise[index] = allocatedPaise;
      totalAllocatedPaise += allocatedPaise;

      if (item.feeComponentId && componentAllocatedPaise[item.feeComponentId] !== undefined) {
        componentAllocatedPaise[item.feeComponentId] += allocatedPaise;
      }
    }
  });

  const differencePaise = totalFeePaise - totalAllocatedPaise;
  if (installmentItems.length > 0 && differencePaise !== 0) {
    const lastIdx = installmentItems.length - 1;
    installmentAmountsPaise[lastIdx] += differencePaise;
    totalAllocatedPaise += differencePaise;
  }

  const remainingPaise = totalFeePaise - totalAllocatedPaise;
  const allocationPercentage = totalFeePaise > 0 ? Number(((totalAllocatedPaise / totalFeePaise) * 100).toFixed(2)) : 0;

  // Component coverage check
  const coveredComponents = new Set(installmentItems.map((i) => i.feeComponentId).filter(Boolean));
  const allComponentIds = feeComponents.map((c) => c.id);
  const isAllComponentsCovered = allComponentIds.every((id) => coveredComponents.has(id)) || allComponentIds.length === 0;

  const isBalanced = remainingPaise === 0 && errors.length === 0 && isAllComponentsCovered;
  const isOverAllocated = totalAllocatedPaise > totalFeePaise;

  const finalInstallmentAmounts = installmentAmountsPaise.map(toRupees);
  const finalComponentAllocations: Record<string, number> = {};
  Object.keys(componentAllocatedPaise).forEach((compId) => {
    finalComponentAllocations[compId] = toRupees(componentAllocatedPaise[compId]);
  });

  return {
    totalFee,
    allocatedAmount: toRupees(totalAllocatedPaise),
    remainingAmount: toRupees(remainingPaise),
    allocationPercentage,
    isBalanced,
    isOverAllocated,
    isAllComponentsCovered,
    componentAllocations: finalComponentAllocations,
    installmentAmounts: finalInstallmentAmounts,
    errors,
  };
}