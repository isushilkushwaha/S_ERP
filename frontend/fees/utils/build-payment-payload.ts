// frontend/fees/utils/build-payment-payload.ts

import type {
  PaymentMethodType,
  StudentFeeInstallment,
} from "../types/fee-payment.types";

interface Values {
  paymentMethod: PaymentMethodType;

  amountPaid: number;

  transactionId?: string;

  chequeNumber?: string;

  bankName?: string;

  chequeDate?: string;

  cardType?: string;

  remarks?: string;
}

interface Params {
  values: Values;

  enrollmentId: string;

  installments: StudentFeeInstallment[];

  allocations: Record<
    string,
    number
  >;
}

export function buildPaymentPayload({
  values,
  enrollmentId,
  installments,
  allocations,
}: Params) {
  /*
   * Find the installment/component
   * information for each ledger.
   */
  const componentByLedger =
    new Map<
      string,
      {
        installmentId: string;
        installmentComponentId: string;
      }
    >();

  for (const installment of installments) {
    for (const component of installment.components) {
      componentByLedger.set(
        component.ledgerId,
        {
          installmentId:
            installment.installmentId,

          installmentComponentId:
            component.installmentComponentId,
        },
      );
    }
  }

  /*
   * Current collection is against
   * the first/current installment.
   *
   * The backend schema currently
   * requires a single top-level
   * installmentId.
   */
  const installmentId =
    installments[0]?.installmentId;

  if (!installmentId) {
    throw new Error(
      "No installment selected for fee collection.",
    );
  }

  return {
    /*
     * Enrollment
     */
    enrollmentId,

    /*
     * Required by collectFeeSchema.
     */
    installmentId,

    /*
     * Payment information
     */
    paymentMethod:

      values.paymentMethod,

    gateway:
      values.paymentMethod ===
      "RAZORPAY"
        ? "RAZORPAY"
        : "MANUAL",

    amountPaid:
      values.amountPaid,

    /*
     * Discount and fine are intentionally
     * disabled for the current version.
     */
    discount: 0,

    fine: 0,

    /*
     * Optional payment details.
     *
     * Empty strings are converted to
     * undefined so the backend schema
     * can handle them correctly.
     */
    transactionId:
      values.transactionId?.trim() ||
      undefined,

    chequeNumber:
      values.chequeNumber?.trim() ||
      undefined,

    bankName:
      values.bankName?.trim() ||
      undefined,

    chequeDate:
      values.chequeDate?.trim() ||
      undefined,

    cardType:
      values.cardType?.trim() ||
      undefined,

    remarks:
      values.remarks?.trim() ||
      undefined,

    /*
     * Payment allocation
     */
    allocations:
      Object.entries(
        allocations,
      )
        .filter(
          ([, amount]) =>
            amount > 0,
        )
        .map(
          ([
            ledgerId,
            allocatedAmount,
          ]) => {
            const component =
              componentByLedger.get(
                ledgerId,
              );

            if (!component) {
              throw new Error(
                `Fee component not found for ledger ${ledgerId}.`,
              );
            }

            return {
              ledgerId,

              installmentId:
                component.installmentId,

              installmentComponentId:
                component.installmentComponentId,

              allocatedAmount,

              /*
               * Disabled for now.
               */
              discountApplied: 0,

              fineApplied: 0,
            };
          },
        ),
  };
}