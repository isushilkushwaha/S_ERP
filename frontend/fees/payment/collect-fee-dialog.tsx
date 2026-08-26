// frontend/fees/payment/collect-fee-dialog.tsx

"use client";

import {
  useMemo,
  useState,
} from "react";

import { Receipt } from "lucide-react";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

import { useCollectFee } from "@/frontend/fees/hooks/use-collect-fee";

import type {
  StudentFeeInstallment,
  StudentFeeProfileData,
} from "../types/fee-payment.types";

import { FeePaymentHeader } from "./components/fee-payment-header";
import { PaymentAmountSection } from "./components/payment-amount-section";
import { PaymentSummary } from "./components/payment-summary";
import { PaymentFooter } from "./components/payment-footer";
import { PaymentAllocationTable } from "./payment-allocation-table";
import { PaymentMethodFields } from "./payment-method-fields";
import { PaymentConfirmDialog } from "./payment-confirm-dialog";

interface CollectFeeDialogProps {
  isOpen: boolean;
  onClose: () => void;
  studentProfile: StudentFeeProfileData;
  onSuccess?: (data: unknown) => void;
}

export function CollectFeeDialog({
  isOpen,
  onClose,
  studentProfile,
  onSuccess,
}: CollectFeeDialogProps) {
  const [confirmOpen, setConfirmOpen] =
    useState(false);

  /**
   * Get the oldest pending installment.
   *
   * This is kept only because the current dialog/hook
   * structure still accepts an installment prop.
   *
   * Actual payment allocation is handled by
   * useCollectFee across all pending installments.
   */
  const currentInstallment =
    useMemo<StudentFeeInstallment | null>(() => {
      const pending =
        studentProfile.installments
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

      return pending[0] ?? null;
    }, [
      studentProfile.installments,
    ]);

  /**
   * No outstanding fee.
   */
  if (!currentInstallment) {
    return (
      <Dialog
        open={isOpen}
        onOpenChange={(open) => {
          if (!open) {
            onClose();
          }
        }}
      >
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>
              Collect Fee
            </DialogTitle>

            <DialogDescription>
              This student has no outstanding fee.
            </DialogDescription>
          </DialogHeader>

          <div className="py-8 text-center">
            <p className="text-sm text-muted-foreground">
              All fee installments are
              currently paid.
            </p>
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <CollectFeeContent
      isOpen={isOpen}
      onClose={onClose}
      studentProfile={studentProfile}
      installment={currentInstallment}
      onSuccess={onSuccess}
      confirmOpen={confirmOpen}
      setConfirmOpen={setConfirmOpen}
    />
  );
}

interface CollectFeeContentProps {
  isOpen: boolean;
  onClose: () => void;
  studentProfile: StudentFeeProfileData;
  installment: StudentFeeInstallment;
  onSuccess?: (data: unknown) => void;
  confirmOpen: boolean;
  setConfirmOpen: (
    value: boolean,
  ) => void;
}

function CollectFeeContent({
  isOpen,
  onClose,
  studentProfile,
  installment,
  onSuccess,
  confirmOpen,
  setConfirmOpen,
}: CollectFeeContentProps) {
  /**
   * Fee collection state.
   *
   * The hook automatically calculates
   * the waterfall allocation across all
   * pending installments according to
   * the entered payment amount.
   */
  const fee = useCollectFee({
    studentProfile,
    installment,
    onSuccess: (data) => {
      setConfirmOpen(false);

      onClose();

      onSuccess?.(data);
    },
  });

  /**
   * Open confirmation dialog.
   */
  function handleProceed() {
    if (!fee.canSubmit) {
      return;
    }

    setConfirmOpen(true);
  }

  /**
   * Confirm and submit payment.
   */
  async function handleConfirm() {
    await fee.submit();
  }

  /**
   * Total outstanding.
   *
   * Prefer the value calculated by the
   * collection hook because it represents
   * the complete student outstanding balance.
   */
  const totalOutstanding =
    Number(
      fee.totalOutstanding ??
        fee.maxAmount ??
        0,
    );

  /**
   * Current oldest milestone balance.
   *
   * Used only for the existing summary
   * card. It does not control payment
   * allocation.
   */
  const currentDue =
    Number(
      fee.pendingInstallments?.[0]
        ?.balanceAmount ?? 0,
    );

  return (
    <Dialog
      open={isOpen}
      onOpenChange={(open) => {
        if (
          !open &&
          !fee.isSubmitting
        ) {
          onClose();
        }
      }}
    >
      <DialogContent
        className="
          flex
          flex-col
          p-0
          w-[96vw]
          sm:max-w-[1400px]
          h-[90vh]
          max-h-[900px]
          overflow-hidden
          bg-background
        "
      >
        {/* --------------------------------
            HEADER
        --------------------------------- */}

        <DialogHeader
          className="
            shrink-0
            border-b
            bg-white
            px-8
            py-5
            dark:bg-slate-950
          "
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
                <Receipt className="h-6 w-6 text-primary" />
              </div>

              <div>
                <DialogTitle className="text-xl font-bold tracking-tight">
                  Collect Fee
                </DialogTitle>

                <DialogDescription className="text-sm mt-1">
                  Record and allocate student fee
                  payment
                </DialogDescription>
              </div>
            </div>

            <div className="text-right hidden sm:block">
              <p className="text-sm font-medium text-muted-foreground">
                Student Payment
              </p>
            </div>
          </div>
        </DialogHeader>

        {/* --------------------------------
            WORKSPACE AREA
        --------------------------------- */}

        <div
          className="
            flex-1
            overflow-y-auto
            bg-slate-50/50
            px-6
            py-8
            lg:px-8
            dark:bg-slate-900/50
          "
        >
          <div className="mx-auto flex flex-col space-y-8 w-full">

            {/* =======================================
                FULL WIDTH: STUDENT INFORMATION
            ======================================= */}

            <section className="space-y-3">
              <h2 className="text-xs font-bold tracking-wider text-muted-foreground uppercase">
                Student Information
              </h2>

              <FeePaymentHeader
                student={
                  studentProfile.student
                }
              />
            </section>

            {/* =======================================
                TWO-COLUMN LAYOUT
            ======================================= */}

            <div className="grid grid-cols-1 items-start gap-10 lg:grid-cols-12">

              {/* ---------------------------------------
                  LEFT COLUMN
              ---------------------------------------- */}

              <div className="flex flex-col space-y-8 lg:col-span-7">

                {/* =====================================
                    OUTSTANDING SUMMARY
                ====================================== */}

                <div className="grid grid-cols-3 gap-4 rounded-xl border bg-white p-5 shadow-sm dark:bg-slate-950">

                  <div>
                    <p className="text-xs font-semibold text-muted-foreground uppercase">
                      Pending Milestones
                    </p>

                    <p className="mt-2 text-3xl font-bold tabular-nums text-foreground">
                      {
                        fee.pendingInstallments
                          ?.length ?? 0
                      }
                    </p>
                  </div>

                  <div>
                    <p className="text-xs font-semibold text-muted-foreground uppercase">
                      Current Due
                    </p>

                    <p className="mt-2 text-3xl font-bold tabular-nums text-foreground">
                      ₹
                      {currentDue.toLocaleString(
                        "en-IN",
                        {
                          minimumFractionDigits: 2,
                        },
                      )}
                    </p>
                  </div>

                  <div>
                    <p className="text-xs font-semibold text-muted-foreground uppercase">
                      Total Outstanding
                    </p>

                    <p className="mt-2 text-3xl font-bold tabular-nums text-destructive">
                      ₹
                      {totalOutstanding.toLocaleString(
                        "en-IN",
                        {
                          minimumFractionDigits: 2,
                        },
                      )}
                    </p>
                  </div>

                </div>

                {/* =====================================
                    AUTOMATIC PAYMENT ALLOCATION
                ====================================== */}

                <section className="space-y-3">

                  <h2 className="text-xs font-bold tracking-wider text-muted-foreground uppercase">
                    Automatic Payment Allocation
                  </h2>

                  <div className="bg-white dark:bg-slate-950 rounded-xl shadow-sm border p-5">

                    {fee.visibleInstallments?.length >
                    0 ? (
                      <PaymentAllocationTable
                        installments={
                          fee.visibleInstallments
                        }
                        allocations={
                          fee.allocations
                        }
                        onAllocationChange={() => {}}
                      />
                    ) : (
                      <div className="rounded-lg border border-dashed p-6 text-center">
                        <p className="text-sm text-muted-foreground">
                          Enter an amount to see
                          automatic payment
                          allocation.
                        </p>
                      </div>
                    )}

                  </div>

                </section>

              </div>

              {/* ---------------------------------------
                  RIGHT COLUMN
              ---------------------------------------- */}

              <div className="flex flex-col space-y-8 lg:col-span-5 lg:sticky lg:top-0 pb-8">

                <div className="flex items-center space-x-2 border-b pb-2">
                  <h2 className="text-sm font-bold tracking-wider text-primary uppercase">
                    Collect Payment
                  </h2>
                </div>

                {/* =====================================
                    PAYMENT AMOUNT
                ====================================== */}

                <section className="space-y-3">

                  <label className="text-xs font-semibold text-muted-foreground uppercase">
                    Amount Received
                  </label>

                  <div className="bg-white dark:bg-slate-950 rounded-xl shadow-md ring-2 ring-primary/20 p-2">

                    <PaymentAmountSection
                      amount={
                        fee.amountPaid
                      }
                      totalDue={
                        fee.totalOutstanding ??
                        fee.maxAmount
                      }
                      onAmountChange={
                        fee.setAmountPaid
                      }
                    />

                  </div>

                </section>

                {/* =====================================
                    PAYMENT METHOD
                ====================================== */}

                <section className="space-y-3">

                  <label className="text-xs font-semibold text-muted-foreground uppercase">
                    Payment Method & Details
                  </label>

                  <div className="bg-white dark:bg-slate-950 rounded-xl shadow-sm border p-6">

                    <PaymentMethodFields
                      paymentMethod={
                        fee.paymentMethod
                      }

                      transactionId={
                        fee.transactionId
                      }

                      chequeNumber={
                        fee.chequeNumber
                      }

                      bankName={
                        fee.bankName
                      }

                      chequeDate={
                        fee.chequeDate
                      }

                      cardType={
                        fee.cardType
                      }

                      remarks={
                        fee.remarks
                      }

                      onMethodChange={
                        fee.setPaymentMethod
                      }

                      onTransactionIdChange={
                        fee.setTransactionId
                      }

                      onChequeNumberChange={
                        fee.setChequeNumber
                      }

                      onBankNameChange={
                        fee.setBankName
                      }

                      onChequeDateChange={
                        fee.setChequeDate
                      }

                      onCardTypeChange={
                        fee.setCardType
                      }

                      onRemarksChange={
                        fee.setRemarks
                      }
                    />

                  </div>

                </section>

                {/* =====================================
                    SUMMARY
                ====================================== */}

                <section className="space-y-3">

                  <label className="text-xs font-semibold text-muted-foreground uppercase">
                    Payment Summary
                  </label>

                  <div className="bg-slate-100 dark:bg-slate-900/80 rounded-xl border p-2">

                    <PaymentSummary
                      amountPaid={
                        fee.amountPaid
                      }

                      totalAllocated={
                        fee.allocatedAmount
                      }

                      remaining={
                        fee.remaining
                      }
                    />

                  </div>

                </section>

              </div>
            </div>
          </div>
        </div>

        {/* --------------------------------
            STICKY FOOTER
        --------------------------------- */}

        <div className="shrink-0 border-t bg-white px-8 py-5 dark:bg-slate-950 shadow-[0_-4px_10px_rgba(0,0,0,0.02)] z-10">

          <PaymentFooter
            loading={
              fee.isSubmitting
            }

            disabled={
              !fee.canSubmit
            }

            onCancel={
              onClose
            }

            onSubmit={
              handleProceed
            }
          />

        </div>
      </DialogContent>

      {/* --------------------------------
          PAYMENT CONFIRMATION
      --------------------------------- */}

      <PaymentConfirmDialog
        isOpen={
          confirmOpen
        }

        onClose={() =>
          setConfirmOpen(false)
        }

        onConfirm={
          handleConfirm
        }

        isLoading={
          fee.isSubmitting
        }

        paymentDetails={{
          studentName:
            studentProfile
              .student
              .studentName,

          admissionNumber:
            studentProfile
              .student
              .admissionNumber,

          amountPaid:
            fee.amountPaid,

          paymentMethod:
            fee.paymentMethod,
        }}
      />
    </Dialog>
  );
}