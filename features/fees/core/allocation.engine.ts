import {
  Decimal,
} from '@prisma/client/runtime/library';

type InstallmentComponentContext = {
  id: string;

  installmentId: string;

  ledgerId: string;

  enrollmentId: string;

  assignedAmount: Decimal;

  paidAmount: Decimal;
};

type AllocationInput = {
  installmentComponentId: string;

  installmentId: string;

  ledgerId: string;

  allocatedAmount: number;

  discountApplied?: number;

  fineApplied?: number;
};

export class PaymentAllocationEngine {
  static validateInstallmentAllocations(
    allocations: AllocationInput[],
    components: InstallmentComponentContext[],
    totalPaid: number,
    targetEnrollmentId: string,
    targetInstallmentId: string,
  ): void {
    if (!allocations.length) {
      throw new Error(
        'At least one payment allocation is required.',
      );
    }

    let calculatedTotal =
      new Decimal(0);

    const seenComponents =
      new Set<string>();

    for (const allocation of allocations) {
      if (
        seenComponents.has(
          allocation.installmentComponentId,
        )
      ) {
        throw new Error(
          `Duplicate installment component allocation: ${allocation.installmentComponentId}`,
        );
      }

      seenComponents.add(
        allocation.installmentComponentId,
      );

      if (
        allocation.installmentId !==
        targetInstallmentId
      ) {
        throw new Error(
          'Security Violation: Payment allocation targets a different installment.',
        );
      }

      const component =
        components.find(
          (item) =>
            item.id ===
            allocation.installmentComponentId,
        );

      if (!component) {
        throw new Error(
          `Security Violation: Installment component ${allocation.installmentComponentId} was not found.`,
        );
      }

      if (
        component.enrollmentId !==
        targetEnrollmentId
      ) {
        throw new Error(
          'Security Violation: Installment component does not belong to the selected enrollment.',
        );
      }

      if (
        component.installmentId !==
        targetInstallmentId
      ) {
        throw new Error(
          'Security Violation: Installment component does not belong to the selected installment.',
        );
      }

      if (
        component.ledgerId !==
        allocation.ledgerId
      ) {
        throw new Error(
          'Security Violation: Ledger does not belong to the selected installment component.',
        );
      }

      const allocated =
        new Decimal(
          allocation.allocatedAmount,
        );

      const discount =
        new Decimal(
          allocation.discountApplied ?? 0,
        );

      const fine =
        new Decimal(
          allocation.fineApplied ?? 0,
        );

      if (
        allocated.isNegative() ||
        discount.isNegative() ||
        fine.isNegative()
      ) {
        throw new Error(
          'Financial allocations cannot be negative.',
        );
      }

      if (allocated.isZero()) {
        throw new Error(
          'Payment allocation must be greater than zero.',
        );
      }

      const assigned =
        new Decimal(
          component.assignedAmount,
        );

      const paid =
        new Decimal(
          component.paidAmount,
        );

      const balance =
        assigned
          .add(fine)
          .sub(discount)
          .sub(paid);

      if (balance.isNegative()) {
        throw new Error(
          'Invalid fee component balance detected.',
        );
      }

      if (allocated.gt(balance)) {
        throw new Error(
          `Allocation of ₹${allocated.toString()} exceeds the available balance of ₹${balance.toString()}.`,
        );
      }

      calculatedTotal =
        calculatedTotal.add(
          allocated,
        );
    }

    const expectedTotal =
      new Decimal(totalPaid);

    if (
      !calculatedTotal.equals(
        expectedTotal,
      )
    ) {
      throw new Error(
        `Sum of allocations (₹${calculatedTotal.toString()}) must exactly match payment amount (₹${expectedTotal.toString()}).`,
      );
    }
  }
}