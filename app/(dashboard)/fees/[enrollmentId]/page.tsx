'use client';

import React, { useMemo, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';

import { useStudentFeeProfile } from '@/frontend/fees/hooks/use-fees';

import type {
  StudentFeeProfileData,
  StudentFeeInstallment,
} from '@/frontend/fees/types/fee-payment.types';

import { StudentProfile } from '@/frontend/fees/components/student/student-profile';
import { LedgerTable } from '@/frontend/fees/components/student/ledger-table';
import { InstallmentTable } from '@/frontend/fees/components/student/installment-table';
import { PaymentHistory } from '@/frontend/fees/components/student/payment-history';
import { DiscountCard } from '@/frontend/fees/components/student/discount-card';

import { CollectFeeDialog } from '@/frontend/fees/payment/collect-fee-dialog';
import { ReceiptPreviewDialog } from '@/frontend/fees/receipt/receipt-preview-dialog';

import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '@/components/ui/tabs';

import {
  Loader2,
  ArrowLeft,
  CreditCard,
  BadgePercent,
  CheckCircle2,
  AlertCircle,
  CalendarClock,
  LockKeyhole,
} from 'lucide-react';

/* =========================================================
   HELPERS
========================================================= */

function formatCurrency(value: number): string {
  return Number(value || 0).toLocaleString('en-IN');
}

function formatDate(
  value: string | null | undefined,
): string {
  if (!value) {
    return 'No due date';
  }

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return 'Invalid date';
  }

  return date.toLocaleDateString('en-IN');
}

/* =========================================================
   INSTALLMENT STATUS
========================================================= */

type InstallmentStatus =
  | 'UPCOMING'
  | 'DUE'
  | 'PARTIAL'
  | 'PAID'
  | 'OVERDUE';

function getInstallmentStatus(
  installment: StudentFeeInstallment,
): InstallmentStatus {
  const assigned = Number(
    installment.assignedAmount ?? 0,
  );

  const paid = Number(
    installment.paidAmount ?? 0,
  );

  const balance = Math.max(
    0,
    assigned - paid,
  );

  if (balance <= 0) {
    return 'PAID';
  }

  if (paid > 0) {
    return 'PARTIAL';
  }

  if (!installment.dueDate) {
    return 'UPCOMING';
  }

  const today = new Date();

  const dueDate = new Date(
    installment.dueDate,
  );

  today.setHours(0, 0, 0, 0);
  dueDate.setHours(0, 0, 0, 0);

  if (dueDate < today) {
    return 'OVERDUE';
  }

  if (
    dueDate.getTime() ===
    today.getTime()
  ) {
    return 'DUE';
  }

  return 'UPCOMING';
}

function getInstallmentStatusLabel(
  status: InstallmentStatus,
): string {
  switch (status) {
    case 'PAID':
      return 'Paid';

    case 'PARTIAL':
      return 'Partial';

    case 'OVERDUE':
      return 'Overdue';

    case 'DUE':
      return 'Due';

    case 'UPCOMING':
      return 'Upcoming';

    default:
      return status;
  }
}

/* =========================================================
   PAGE
========================================================= */

export default function StudentFeeProfilePage() {
  const router = useRouter();

  const params = useParams();

  const enrollmentId =
    typeof params?.enrollmentId === 'string'
      ? params.enrollmentId
      : null;

  /* =======================================================
     QUERY
  ======================================================= */

  const {
    data: rawData,
    isLoading,
    isError,
    error,
    refetch,
  } = useStudentFeeProfile(
    enrollmentId,
  );

  /*
   * IMPORTANT:
   *
   * `data` is the actual StudentFeeProfileData.
   *
   * Do NOT pass StudentProfile here.
   * StudentProfile is a React component.
   */
  const data =
    rawData as StudentFeeProfileData | null;

  /* =======================================================
     UI STATE
  ======================================================= */

  const [
    isCollectFeeOpen,
    setIsCollectFeeOpen,
  ] = useState(false);

  const [
    completedReceiptData,
    setCompletedReceiptData,
  ] = useState<any>(null);

  /* =======================================================
     NORMALIZED INSTALLMENTS
  ======================================================= */

  const installments =
    data?.installments ?? [];

  /*
   * Always calculate the frontend status from
   * the latest amount/date information.
   */
  const normalizedInstallments =
    useMemo(
      () =>
        installments.map(
          (installment) => ({
            ...installment,
            status:
              getInstallmentStatus(
                installment,
              ),
          }),
        ),
      [installments],
    );

  /* =======================================================
     CURRENT MILESTONE
  ======================================================= */

  /*
   * IMPORTANT BUSINESS RULE:
   *
   * The first unpaid milestone is the current
   * payable milestone.
   *
   * Example:
   *
   * Milestone 1 = ₹5,000
   * Paid = ₹3,000
   * Balance = ₹2,000
   *
   * Current milestone remains Milestone 1.
   *
   * Only after it becomes fully paid does
   * Milestone 2 become current.
   */
  const currentInstallment =
    normalizedInstallments.find(
      (installment) =>
        Number(
          installment.balanceAmount ?? 0,
        ) > 0,
    ) ?? null;

  /* =======================================================
     CURRENT MILESTONE STATUS
  ======================================================= */

  const currentInstallmentStatus =
    currentInstallment
      ? getInstallmentStatus(
          currentInstallment,
        )
      : null;

  /* =======================================================
     CURRENT BALANCE
  ======================================================= */

  const currentInstallmentDue =
    currentInstallment
      ? Math.max(
          0,
          Number(
            currentInstallment.balanceAmount ??
              0,
          ),
        )
      : 0;

  /* =======================================================
     CAN COLLECT
  ======================================================= */

  const canCollectCurrentInstallment =
    Boolean(
      currentInstallment &&
        currentInstallmentDue > 0 &&
        (
          currentInstallmentStatus ===
            'DUE' ||
          currentInstallmentStatus ===
            'PARTIAL' ||
          currentInstallmentStatus ===
            'OVERDUE'
        ),
    );

  /* =======================================================
     ALL PAID
  ======================================================= */

  const allInstallmentsPaid =
    installments.length > 0 &&
    installments.every(
      (installment) =>
        Number(
          installment.balanceAmount ?? 0,
        ) <= 0,
    );

  /* =======================================================
     PAYMENT SUCCESS
  ======================================================= */

  const handlePaymentSuccess = async (
    receiptResult: any,
  ) => {
    /*
     * IMPORTANT:
     *
     * The payment API has already updated:
     *
     * feePayment
     * feePaymentItem
     * studentFeeLedger
     * feeInstallment
     * feeReceipt
     *
     * Now reload the profile from PostgreSQL.
     *
     * This is what makes:
     *
     * Payment History
     * Ledger
     * Milestone
     * Component Paid
     * Component Balance
     *
     * update on screen.
     */
    await refetch();

    setIsCollectFeeOpen(false);

    /*
     * Open receipt preview when the transaction
     * returned payment + receipt data.
     */
    if (
      !receiptResult?.receipt ||
      !receiptResult?.payment
    ) {
      return;
    }

    setCompletedReceiptData({
      school: {
        name:
          'School Management System',

        address:
          'Main Campus, City',

        phone:
          '+91 9876543210',

        email:
          'support@school.edu',
      },

      receipt: {
        receiptNumber:
          receiptResult.receipt
            .receiptNumber,

        paymentDate:
          receiptResult.payment
            .paymentDate,

        paymentMethod:
          receiptResult.payment
            .paymentMethod,

        transactionId:
          receiptResult.payment
            .transactionId,

        amountPaid: Number(
          receiptResult.payment
            .amountPaid ?? 0,
        ),

        discount: Number(
          receiptResult.payment
            .discount ?? 0,
        ),

        fine: Number(
          receiptResult.payment
            .fine ?? 0,
        ),

        remarks:
          receiptResult.payment
            .remarks ?? null,

        receivedBy:
          receiptResult.payment
            .receivedBy ??
          'Cashier',
      },

      student: data?.student,

      items:
        receiptResult.payment
          .items ?? [],
    });
  };

  /* =======================================================
     INVALID ENROLLMENT
  ======================================================= */

  if (!enrollmentId) {
    return (
      <div className="flex h-[80vh] flex-col items-center justify-center gap-4 px-6 text-center">
        <p className="text-muted-foreground">
          Invalid Student Enrollment ID.
        </p>

        <Button
          variant="outline"
          onClick={() =>
            router.push(
              '/dashboard/fees',
            )
          }
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Fees Dashboard
        </Button>
      </div>
    );
  }

  /* =======================================================
     LOADING
  ======================================================= */

  if (isLoading) {
    return (
      <div className="flex h-[80vh] items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  /* =======================================================
     ERROR
  ======================================================= */

  if (isError || !data) {
    return (
      <div className="flex h-[80vh] flex-col items-center justify-center gap-4 px-6 text-center">
        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-destructive/10">
          <AlertCircle className="h-6 w-6 text-destructive" />
        </div>

        <div>
          <p className="font-semibold">
            Failed to load student fee profile.
          </p>

          <p className="mt-1 text-sm text-muted-foreground">
            {error?.message ||
              'Please try again.'}
          </p>
        </div>

        <div className="flex gap-2">
          <Button
            variant="outline"
            onClick={() =>
              router.push(
                '/dashboard/fees',
              )
            }
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Fees Dashboard
          </Button>

          <Button
            onClick={() => {
              void refetch();
            }}
          >
            Retry
          </Button>
        </div>
      </div>
    );
  }

  /* =======================================================
     FINANCIAL SUMMARY
  ======================================================= */

  const totalAssigned = Number(
    data.summary?.totalAssigned ?? 0,
  );

  const totalPaid = Number(
    data.summary?.totalPaid ?? 0,
  );

  const totalDiscount = Number(
    data.summary?.totalDiscount ?? 0,
  );

  const totalFine = Number(
    data.summary?.totalFine ?? 0,
  );

  const totalDue = Number(
    data.summary?.totalDue ?? 0,
  );

  /* =======================================================
     DISCOUNT
  ======================================================= */

  const hasDiscount =
    Boolean(data.discount);

  /* =======================================================
     RENDER
  ======================================================= */

  return (
    <div className="mx-auto flex w-full max-w-7xl flex-col gap-6 p-6">

      {/* ===================================================
          HEADER
      ==================================================== */}

      <div className="flex flex-col items-start justify-between gap-4 border-b pb-4 sm:flex-row sm:items-center">

        <div className="flex items-center gap-3">

          <Button
            variant="outline"
            size="icon"
            onClick={() =>
              router.push(
                '/dashboard/fees',
              )
            }
          >
            <ArrowLeft className="h-4 w-4" />
          </Button>

          <div>
            <h1 className="text-2xl font-bold tracking-tight">
              Student Fee Profile
            </h1>

            <p className="text-xs text-muted-foreground">
              Detailed fee ledger,
              installments, discounts,
              and payment history.
            </p>
          </div>

        </div>

        {/* =================================================
            COLLECT BUTTON
        ================================================== */}

        <div className="flex items-center gap-3">

          {allInstallmentsPaid ? (

            <Badge
              variant="outline"
              className="border-emerald-500/30 px-3 py-2 text-emerald-600"
            >
              <CheckCircle2 className="mr-2 h-4 w-4" />
              All Fees Paid
            </Badge>

          ) : canCollectCurrentInstallment ? (

            <Button
              onClick={() =>
                setIsCollectFeeOpen(true)
              }
            >
              <CreditCard className="mr-2 h-4 w-4" />
              Collect Fee
            </Button>

          ) : currentInstallment ? (

            <Badge
              variant="outline"
              className="border-amber-500/30 px-3 py-2 text-amber-600"
            >
              <LockKeyhole className="mr-2 h-4 w-4" />
              Milestone Not Due
            </Badge>

          ) : (

            <Badge
              variant="outline"
              className="border-amber-500/30 px-3 py-2 text-amber-600"
            >
              <AlertCircle className="mr-2 h-4 w-4" />
              No Payable Installment
            </Badge>

          )}

        </div>
      </div>

      {/* ===================================================
          CURRENT MILESTONE
      ==================================================== */}

      {currentInstallment && (
        <div className="rounded-xl border bg-card p-5 shadow-sm">

          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">

            <div>

              <div className="mb-2 flex flex-wrap items-center gap-2">

                <Badge variant="secondary">
                  Current Milestone
                </Badge>

                <Badge variant="outline">
                  {getInstallmentStatusLabel(
                    currentInstallmentStatus ??
                      'UPCOMING',
                  )}
                </Badge>

              </div>

              <h2 className="text-lg font-bold">
                {currentInstallment.name}
              </h2>

              <p className="mt-1 text-xs text-muted-foreground">
                Milestone #
                {Number(
                  currentInstallment.sequence ??
                    0,
                ) || '—'}
              </p>

              <div className="mt-2 flex items-center gap-2 text-sm text-muted-foreground">
                <CalendarClock className="h-4 w-4" />

                <span>
                  Due:{' '}
                  {formatDate(
                    currentInstallment.dueDate,
                  )}
                </span>
              </div>

            </div>

            <div className="text-left md:text-right">

              <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                Current Balance
              </p>

              <p className="text-3xl font-black text-rose-600">
                ₹
                {formatCurrency(
                  currentInstallmentDue,
                )}
              </p>

            </div>

          </div>

          {/* =================================================
              CURRENT COMPONENTS
          ================================================== */}

          {currentInstallment.components &&
            currentInstallment.components
              .length > 0 && (

            <div className="mt-5 border-t pt-4">

              <div className="mb-3 flex items-center justify-between">

                <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                  Included Fee Components
                </p>

                <p className="text-xs text-muted-foreground">
                  {
                    currentInstallment
                      .components.length
                  }{' '}
                  component
                  {currentInstallment
                    .components.length !==
                  1
                    ? 's'
                    : ''}
                </p>

              </div>

              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">

                {currentInstallment.components.map(
                  (component) => {

                    const assigned =
                      Number(
                        component.assignedAmount ??
                          0,
                      );

                    const paid =
                      Number(
                        component.paidAmount ??
                          0,
                      );

                    const balance =
                      Math.max(
                        0,
                        Number(
                          component.balanceAmount ??
                            0,
                        ),
                      );

                    return (
                      <div
                        key={
                          component.installmentComponentId
                        }
                        className="rounded-lg border bg-muted/20 p-3"
                      >

                        <div className="flex items-start justify-between gap-2">

                          <div>
                            <p className="font-medium">
                              {
                                component.componentName
                              }
                            </p>

                            {component.componentCode && (
                              <p className="text-xs text-muted-foreground">
                                {
                                  component.componentCode
                                }
                              </p>
                            )}
                          </div>

                          <Badge
                            variant="outline"
                            className={
                              balance <= 0
                                ? 'border-emerald-500/30 text-emerald-600'
                                : 'border-rose-500/30 text-rose-600'
                            }
                          >
                            {balance <=
                            0
                              ? 'Paid'
                              : 'Due'}
                          </Badge>

                        </div>

                        <div className="mt-3 grid grid-cols-3 gap-2 text-xs">

                          <div>
                            <p className="text-muted-foreground">
                              Assigned
                            </p>

                            <p className="font-semibold">
                              ₹
                              {formatCurrency(
                                assigned,
                              )}
                            </p>
                          </div>

                          <div>
                            <p className="text-muted-foreground">
                              Paid
                            </p>

                            <p className="font-semibold text-emerald-600">
                              ₹
                              {formatCurrency(
                                paid,
                              )}
                            </p>
                          </div>

                          <div>
                            <p className="text-muted-foreground">
                              Balance
                            </p>

                            <p className="font-semibold text-rose-600">
                              ₹
                              {formatCurrency(
                                balance,
                              )}
                            </p>
                          </div>

                        </div>

                      </div>
                    );
                  },
                )}

              </div>
            </div>
          )}

          {(!currentInstallment.components ||
            currentInstallment.components
              .length === 0) && (

            <div className="mt-4 rounded-lg border border-dashed p-4 text-center text-sm text-muted-foreground">
              No fee components are attached
              to this milestone.
            </div>

          )}

        </div>
      )}

      {/* ===================================================
          UPCOMING MESSAGE
      ==================================================== */}

      {currentInstallment &&
        currentInstallmentStatus ===
          'UPCOMING' && (

        <div className="rounded-xl border border-blue-500/20 bg-blue-500/5 p-4">

          <div className="flex items-start gap-3">

            <CalendarClock className="mt-0.5 h-5 w-5 shrink-0 text-blue-600" />

            <div>

              <p className="font-semibold">
                This milestone is not due yet.
              </p>

              <p className="mt-1 text-sm text-muted-foreground">
                Fee collection will become
                available when this milestone
                becomes due.
              </p>

            </div>

          </div>

        </div>
      )}

      {/* ===================================================
          STUDENT PROFILE
      ==================================================== */}

      <StudentProfile
        student={data.student}
      />

      {/* ===================================================
          SUMMARY
      ==================================================== */}

      <div className="grid grid-cols-2 gap-4 rounded-lg border bg-card p-4 shadow-sm md:grid-cols-4">

        <div>
          <span className="block text-xs text-muted-foreground">
            Assigned Fee
          </span>

          <span className="text-lg font-bold">
            ₹
            {formatCurrency(
              totalAssigned,
            )}
          </span>
        </div>

        <div>
          <span className="block text-xs text-muted-foreground">
            Total Paid
          </span>

          <span className="text-lg font-bold text-emerald-600">
            ₹
            {formatCurrency(totalPaid)}
          </span>
        </div>

        <div>
          <span className="block text-xs text-muted-foreground">
            Discount / Fine
          </span>

          <span className="text-lg font-bold text-blue-600">
            -₹
            {formatCurrency(
              totalDiscount,
            )}{' '}
            / +₹
            {formatCurrency(totalFine)}
          </span>
        </div>

        <div>
          <span className="block text-xs text-muted-foreground">
            Balance Due
          </span>

          <span className="text-lg font-bold text-rose-600">
            ₹
            {formatCurrency(totalDue)}
          </span>
        </div>

      </div>

      {/* ===================================================
          DISCOUNT
      ==================================================== */}

      {hasDiscount &&
        data.discount && (

        <div className="flex items-center justify-between gap-4 rounded-lg border bg-card p-4 shadow-sm">

          <div className="flex items-center gap-3">

            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
              <BadgePercent className="h-5 w-5 text-primary" />
            </div>

            <div>

              <p className="text-sm font-semibold">
                {data.discount.name}
              </p>

              <p className="text-xs text-muted-foreground">
                Admission discount
                applied
              </p>

            </div>

          </div>

          <div className="text-right">

            <p className="text-xs text-muted-foreground">
              Discount
            </p>

            <p className="font-semibold text-emerald-600">
              -₹
              {formatCurrency(
                Number(
                  data.discount
                    .appliedAmount ??
                    0,
                ),
              )}
            </p>

          </div>

        </div>
      )}

      {/* ===================================================
          TABS
      ==================================================== */}

      <Tabs
        defaultValue="ledger"
        className="w-full"
      >

        <TabsList
          className={`grid w-full max-w-3xl ${
            hasDiscount
              ? 'grid-cols-4'
              : 'grid-cols-3'
          }`}
        >

          <TabsTrigger value="ledger">
            Fee
          </TabsTrigger>

          {hasDiscount && (
            <TabsTrigger value="discount">
              Discount
            </TabsTrigger>
          )}

          <TabsTrigger value="installments">
            Installments
          </TabsTrigger>

          <TabsTrigger value="history">
            Payment History
          </TabsTrigger>

        </TabsList>

        <TabsContent
          value="ledger"
          className="mt-4"
        >
          <LedgerTable
            ledgers={data.ledgers ?? []}
          />
        </TabsContent>

        {hasDiscount &&
          data.discount && (

          <TabsContent
            value="discount"
            className="mt-4"
          >
            <DiscountCard
              discount={data.discount}
            />
          </TabsContent>

        )}

        <TabsContent
          value="installments"
          className="mt-4"
        >
          <InstallmentTable
            installments={
              data.installments ?? []
            }
          />
        </TabsContent>

        <TabsContent
          value="history"
          className="mt-4"
        >
          <PaymentHistory
            payments={
              data.paymentHistory ?? []
            }
          />
        </TabsContent>

      </Tabs>

      {/* ===================================================
          COLLECT FEE DIALOG
      ==================================================== */}

      {isCollectFeeOpen && (
  <CollectFeeDialog
    isOpen={isCollectFeeOpen}
    onClose={() =>
      setIsCollectFeeOpen(false)
    }
    studentProfile={data}
    onSuccess={handlePaymentSuccess}
  />
)}

      {/* ===================================================
          RECEIPT
      ==================================================== */}

      {completedReceiptData && (

        <ReceiptPreviewDialog

          isOpen={
            Boolean(
              completedReceiptData,
            )
          }

          onClose={() =>
            setCompletedReceiptData(
              null,
            )
          }

          receiptData={
            completedReceiptData
          }

        />

      )}

    </div>
  );
}