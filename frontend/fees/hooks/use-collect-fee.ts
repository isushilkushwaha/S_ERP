"use client";

import {
  useEffect,
  useMemo,
  useState,
} from "react";

import { useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

import {
  PaymentFormValues,
  PaymentMethodType,
  StudentFeeInstallment,
  StudentFeeProfileData,
} from "../types/fee-payment.types";

import {
  getWaterfallAllocations,
} from "../utils/auto-allocate";

import {
  buildPaymentPayload,
} from "../utils/build-payment-payload";

interface UseCollectFeeOptions {
  studentProfile: StudentFeeProfileData;

  /**
   * Kept optional for compatibility
   * with the existing collect dialog.
   *
   * Payment allocation itself is calculated
   * across ALL pending installments.
   */
  installment?: StudentFeeInstallment;

  onSuccess?: (
    data: unknown,
  ) => void;
}

export function useCollectFee({
  studentProfile,
  onSuccess,
}: UseCollectFeeOptions) {
  const queryClient =
    useQueryClient();

  // ============================================================
  // PENDING INSTALLMENTS
  // ============================================================
  //
  // Only installments with an outstanding
  // balance are eligible for payment.
  //
  // Oldest sequence is processed first.
  // ============================================================

  const pendingInstallments =
    useMemo(() => {
      return [
        ...studentProfile.installments,
      ]
        .filter(
          (item) =>
            Number(
              item.balanceAmount ?? 0,
            ) > 0,
        )
        .sort(
          (a, b) =>
            a.sequence -
            b.sequence,
        );
    }, [
      studentProfile.installments,
    ]);

  // ============================================================
  // TOTAL OUTSTANDING
  // ============================================================

  const totalOutstanding =
    useMemo(() => {
      return pendingInstallments.reduce(
        (
          total,
          installment,
        ) =>
          total +
          Number(
            installment.balanceAmount ??
              0,
          ),
        0,
      );
    }, [
      pendingInstallments,
    ]);

  // ============================================================
  // PAYMENT STATE
  // ============================================================

  const [
    amountPaid,
    setAmountPaidState,
  ] = useState<number>(
    totalOutstanding,
  );

  const [
    fine,
    setFine,
  ] = useState<number>(0);

  const [
    discount,
    setDiscount,
  ] = useState<number>(0);

  const [
    paymentMethod,
    setPaymentMethod,
  ] =
    useState<PaymentMethodType>(
      "CASH",
    );

  const [
    transactionId,
    setTransactionId,
  ] = useState("");

  const [
    chequeNumber,
    setChequeNumber,
  ] = useState("");

  const [
    bankName,
    setBankName,
  ] = useState("");

  const [
    chequeDate,
    setChequeDate,
  ] = useState("");

  const [
    cardType,
    setCardType,
  ] = useState("");

  const [
    remarks,
    setRemarks,
  ] = useState("");

  const [
    isSubmitting,
    setIsSubmitting,
  ] = useState(false);

  // ============================================================
  // NET PAYABLE
  // ============================================================
  //
  // Discount and fine remain disabled
  // in the current collection workflow.
  // ============================================================

  const netPayable =
    Math.max(
      0,
      totalOutstanding +
        fine -
        discount,
    );

  // ============================================================
  // AUTOMATIC WATERFALL ALLOCATION
  // ============================================================
  //
  // Example:
  //
  // M1 = ₹540
  // M2 = ₹500
  // M3 = ₹9,000
  // M4 = ₹800
  //
  // Amount = ₹6,000
  //
  // M1 = ₹540
  // M2 = ₹500
  // M3 = ₹4,960
  // M4 = ₹0
  //
  // The allocation engine is responsible
  // for component-level allocation.
  // ============================================================

  const waterfallAllocations =
    useMemo(() => {
      if (
        amountPaid <= 0 ||
        pendingInstallments.length ===
          0
      ) {
        return [];
      }

      return getWaterfallAllocations(
        pendingInstallments,
        amountPaid,
      );
    }, [
      pendingInstallments,
      amountPaid,
    ]);

  // ============================================================
  // ALLOCATION MAP
  // ============================================================
  //
  // Converts:
  //
  // [
  //   {
  //     ledgerId,
  //     installmentId,
  //     allocatedAmount
  //   }
  // ]
  //
  // into:
  //
  // {
  //   ledgerId: allocatedAmount
  // }
  // ============================================================

  const allocations =
    useMemo<
      Record<string, number>
    >(() => {
      const result: Record<
        string,
        number
      > = {};

      for (const allocation of
        waterfallAllocations) {
        if (
          Number(
            allocation.allocatedAmount,
          ) <= 0
        ) {
          continue;
        }

        result[
          allocation.ledgerId
        ] =
          Number(
            allocation.allocatedAmount,
          );
      }

      return result;
    }, [
      waterfallAllocations,
    ]);

  // ============================================================
  // TOTAL ALLOCATED
  // ============================================================

  const allocatedAmount =
    useMemo(() => {
      return waterfallAllocations.reduce(
        (
          total,
          allocation,
        ) =>
          total +
          Number(
            allocation.allocatedAmount ??
              0,
          ),
        0,
      );
    }, [
      waterfallAllocations,
    ]);

  // ============================================================
  // VISIBLE INSTALLMENTS
  // ============================================================
  //
  // IMPORTANT:
  //
  // We DO NOT show every pending milestone
  // inside the collect window.
  //
  // We show ONLY milestones which actually
  // receive money according to the entered
  // amount.
  //
  // Example:
  //
  // Total:
  //
  // M1 ₹540
  // M2 ₹500
  // M3 ₹9000
  // M4 ₹800
  //
  // Enter ₹6000:
  //
  // visibleInstallments =
  //
  // M1
  // M2
  // M3
  //
  // M4 is hidden because it receives ₹0.
  // ============================================================

  const visibleInstallments =
    useMemo(() => {
      const allocatedInstallmentIds =
        new Set<string>();

      for (const allocation of
        waterfallAllocations) {
        if (
          Number(
            allocation.allocatedAmount ??
              0,
          ) > 0
        ) {
          allocatedInstallmentIds.add(
            allocation.installmentId,
          );
        }
      }

      return pendingInstallments.filter(
        (installment) =>
          allocatedInstallmentIds.has(
            installment.installmentId,
          ),
      );
    }, [
      pendingInstallments,
      waterfallAllocations,
    ]);

  // ============================================================
  // REMAINING BALANCE
  // ============================================================

  const remaining =
    Math.max(
      0,
      netPayable -
        amountPaid,
    );

  // ============================================================
  // ALLOCATION DIFFERENCE
  // ============================================================

  const allocationDifference =
    Math.abs(
      amountPaid -
        allocatedAmount,
    );

  // ============================================================
  // CAN SUBMIT
  // ============================================================

  const canSubmit =
    amountPaid > 0 &&
    amountPaid <=
      netPayable + 0.01 &&
    allocatedAmount > 0 &&
    allocationDifference <=
      0.01 &&
    !isSubmitting;

  // ============================================================
  // RESET WHEN STUDENT / BALANCE CHANGES
  // ============================================================

  useEffect(() => {
    setAmountPaidState(
      totalOutstanding,
    );

    setFine(0);
    setDiscount(0);

    setPaymentMethod(
      "CASH",
    );

    setTransactionId("");
    setChequeNumber("");
    setBankName("");
    setChequeDate("");
    setCardType("");
    setRemarks("");
  }, [
    studentProfile.student
      .enrollmentId,
    totalOutstanding,
  ]);

  // ============================================================
  // SET PAYMENT AMOUNT
  // ============================================================
  //
  // User can enter:
  //
  // ₹1
  // ₹500
  // ₹5,000
  // ₹10,840
  //
  // but never more than total outstanding.
  // ============================================================

  function setAmountPaid(
    value: number,
  ) {
    const numericValue =
      Number(value);

    if (
      !Number.isFinite(
        numericValue,
      )
    ) {
      setAmountPaidState(0);
      return;
    }

    const safeValue =
      Math.max(
        0,
        numericValue,
      );

    setAmountPaidState(
      Math.min(
        safeValue,
        netPayable,
      ),
    );
  }

  // ============================================================
  // VALIDATE PAYMENT
  // ============================================================

  function validatePayment():
    | string
    | null {
    if (amountPaid <= 0) {
      return "Enter the amount received.";
    }

    if (
      amountPaid >
      netPayable + 0.01
    ) {
      return `Payment cannot exceed the total outstanding amount of ₹${netPayable.toLocaleString(
        "en-IN",
      )}.`;
    }

    if (
      allocatedAmount <= 0
    ) {
      return "No fee amount has been allocated.";
    }

    if (
      allocationDifference >
      0.01
    ) {
      return "Payment allocation does not match the amount received.";
    }

    // ----------------------------------------------------------
    // UPI
    // ----------------------------------------------------------

    if (
      paymentMethod ===
      "UPI"
    ) {
      if (
        !transactionId.trim()
      ) {
        return "Transaction ID / UTR is required.";
      }
    }

    // ----------------------------------------------------------
    // BANK TRANSFER
    // ----------------------------------------------------------

    if (
      paymentMethod ===
      "BANK_TRANSFER"
    ) {
      if (
        !transactionId.trim()
      ) {
        return "Transaction ID / UTR is required.";
      }

      if (!bankName.trim()) {
        return "Bank name is required.";
      }
    }

    // ----------------------------------------------------------
    // CHEQUE
    // ----------------------------------------------------------

    if (
      paymentMethod ===
      "CHEQUE"
    ) {
      if (
        !chequeNumber.trim()
      ) {
        return "Cheque number is required.";
      }

      if (!bankName.trim()) {
        return "Bank name is required.";
      }

      if (!chequeDate.trim()) {
        return "Cheque date is required.";
      }
    }

    // ----------------------------------------------------------
    // CARD
    // ----------------------------------------------------------

    if (
      paymentMethod ===
      "CARD"
    ) {
      if (
        !transactionId.trim()
      ) {
        return "Authorization code is required.";
      }

      if (!cardType.trim()) {
        return "Card type is required.";
      }
    }

    return null;
  }

  // ============================================================
  // SUBMIT PAYMENT
  // ============================================================

  async function submit() {
    const validationError =
      validatePayment();

    if (
      validationError
    ) {
      toast.error(
        validationError,
      );

      return;
    }

    const form: PaymentFormValues =
      {
        paymentMethod,

        amountPaid,

        discount,
        fine,

        transactionId,

        chequeNumber,

        bankName,

        chequeDate,

        cardType,

        remarks,
      };

    // ==========================================================
    // BUILD PAYMENT PAYLOAD
    // ==========================================================
    //
    // IMPORTANT:
    //
    // Send ALL pending installments.
    //
    // The payment may cross:
    //
    // M1 → M2 → M3 → M4
    //
    // depending on amount received.
    // ==========================================================

    const payload =
      buildPaymentPayload({
        enrollmentId:
          studentProfile
            .student
            .enrollmentId,

        installments:
          pendingInstallments,

        values: form,

        allocations,
      });

    try {
      setIsSubmitting(
        true,
      );

      const response =
        await fetch(
          "/api/fees/collect",
          {
            method: "POST",

            headers: {
              "Content-Type":
                "application/json",
            },

            body:
              JSON.stringify(
                payload,
              ),
          },
        );

      const json =
        await response.json();

      if (
        !response.ok ||
        !json.success
      ) {
        if (
          Array.isArray(
            json.details,
          )
        ) {
          const details =
            json.details
              .map(
                (
                  item: {
                    path?: string;
                    message?: string;
                  },
                ) =>
                  item.path
                    ? `${item.path}: ${item.message}`
                    : item.message,
              )
              .filter(Boolean)
              .join(
                "\n",
              );

          throw new Error(
            details ||
              json.error ||
              "Fee collection failed.",
          );
        }

        throw new Error(
          typeof json.error ===
            "string"
            ? json.error
            : "Fee collection failed.",
        );
      }

      toast.success(
        "Fee collected successfully.",
      );

      // ========================================================
      // REFRESH STUDENT FEE PROFILE
      // ========================================================

      await queryClient.invalidateQueries(
        {
          queryKey: [
            "student-fee-profile",
            studentProfile
              .student
              .enrollmentId,
          ],
        },
      );

      // ========================================================
      // REFRESH FEE DASHBOARD
      // ========================================================

      await queryClient.invalidateQueries(
        {
          queryKey: [
            "fee-dashboard",
          ],
        },
      );

      onSuccess?.(
        json.data,
      );
    } catch (error) {
      toast.error(
        error instanceof Error
          ? error.message
          : "Fee collection failed.",
      );
    } finally {
      setIsSubmitting(
        false,
      );
    }
  }

  // ============================================================
  // RETURN
  // ============================================================

  return {
    // ----------------------------------------------------------
    // Amount
    // ----------------------------------------------------------

    amountPaid,
    setAmountPaid,

    // ----------------------------------------------------------
    // Financial values
    // ----------------------------------------------------------

    fine,
    setFine,

    discount,
    setDiscount,

    totalOutstanding,

    maxAmount:
      totalOutstanding,

    netPayable,

    remaining,

    // ----------------------------------------------------------
    // Payment method
    // ----------------------------------------------------------

    paymentMethod,
    setPaymentMethod,

    transactionId,
    setTransactionId,

    chequeNumber,
    setChequeNumber,

    bankName,
    setBankName,

    chequeDate,
    setChequeDate,

    cardType,
    setCardType,

    remarks,
    setRemarks,

    // ----------------------------------------------------------
    // Installments
    // ----------------------------------------------------------

    pendingInstallments,

    /*
     * ONLY milestones receiving money
     * are displayed by the collect dialog.
     */
    visibleInstallments,

    // ----------------------------------------------------------
    // Allocation
    // ----------------------------------------------------------

    waterfallAllocations,

    allocations,

    allocatedAmount,

    allocationDifference,

    // ----------------------------------------------------------
    // Submission
    // ----------------------------------------------------------

    isSubmitting,

    canSubmit,

    submit,
  };
}