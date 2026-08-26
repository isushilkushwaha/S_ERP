// frontend/fees/utils/auto-allocate.ts

import type {
  StudentFeeInstallment,
} from "../types/fee-payment.types";

export interface FeeAllocation {
  ledgerId: string;
  installmentId: string;
  installmentComponentId: string;
  allocatedAmount: number;
}

/**
 * Automatically allocates a payment from:
 *
 * oldest installment
 *      ↓
 * oldest unpaid component
 *      ↓
 * next component
 *      ↓
 * next installment
 *
 * until the entered amount is fully allocated.
 */
export function getWaterfallAllocations(
  installments: StudentFeeInstallment[],
  amountPaid: number,
): FeeAllocation[] {
  let remaining =
    Math.max(
      0,
      Number(amountPaid) || 0,
    );

  if (remaining <= 0) {
    return [];
  }

  const allocations: FeeAllocation[] = [];

  const sortedInstallments =
    [...installments]
      .filter(
        (installment) =>
          Number(
            installment.balanceAmount,
          ) > 0,
      )
      .sort(
        (a, b) =>
          a.sequence -
          b.sequence,
      );

  for (const installment of sortedInstallments) {
    if (remaining <= 0) {
      break;
    }

    const components =
      [...installment.components]
        .filter(
          (component) =>
            Number(
              component.balanceAmount,
            ) > 0,
        );

    for (const component of components) {
      if (remaining <= 0) {
        break;
      }

      const componentBalance =
        Number(
          component.balanceAmount,
        ) || 0;

      if (componentBalance <= 0) {
        continue;
      }

      const allocatedAmount =
        Math.min(
          remaining,
          componentBalance,
        );

      allocations.push({
        ledgerId:
          component.ledgerId,

        installmentId:
          installment.installmentId,

        installmentComponentId:
          component.installmentComponentId,

        allocatedAmount,
      });

      remaining -=
        allocatedAmount;
    }
  }

  return allocations;
}