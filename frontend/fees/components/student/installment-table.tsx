'use client';

import React from 'react';

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';

import { Badge } from '@/components/ui/badge';

import type {
  StudentFeeInstallment,
  InstallmentComponent,
} from '@/frontend/fees/types/fee-payment.types';

/* =========================================================
   HELPERS
========================================================= */

function formatCurrency(amount: number) {
  return `₹${Number(amount || 0).toLocaleString('en-IN', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;
}

function formatDate(date: string | null) {
  if (!date) {
    return 'No due date';
  }

  return new Date(date).toLocaleDateString('en-IN', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  });
}

function getStatusLabel(
  status: InstallmentComponent['status'],
) {
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

function getStatusClass(
  status: InstallmentComponent['status'],
) {
  switch (status) {
    case 'PAID':
      return 'border-emerald-500/20 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400';

    case 'PARTIAL':
      return 'border-blue-500/20 bg-blue-500/10 text-blue-600 dark:text-blue-400';

    case 'OVERDUE':
      return 'border-rose-500/20 bg-rose-500/10 text-rose-600 dark:text-rose-400';

    case 'DUE':
      return 'border-amber-500/20 bg-amber-500/10 text-amber-600 dark:text-amber-400';

    case 'UPCOMING':
      return 'border-slate-500/20 bg-slate-500/10 text-slate-600 dark:text-slate-400';

    default:
      return '';
  }
}

/* =========================================================
   COMPONENT
========================================================= */

interface InstallmentTableProps {
  installments: StudentFeeInstallment[];
}

export function InstallmentTable({
  installments,
}: InstallmentTableProps) {
  if (!installments?.length) {
    return (
      <div className="rounded-2xl border border-border bg-card p-8 text-center">
        <p className="text-sm font-medium">
          No fee installments configured.
        </p>

        <p className="mt-1 text-xs text-muted-foreground">
          Installment milestones assigned during admission
          will appear here.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {installments.map(
        (installment, index) => {
          const assigned = Number(
            installment.assignedAmount ?? 0,
          );

          const paid = Number(
            installment.paidAmount ?? 0,
          );

          const balance = Number(
            installment.balanceAmount ?? 0,
          );

          const isPaid =
            balance <= 0 ||
            installment.status === 'PAID';

          return (
            <div
              key={
                installment.installmentId
              }
              className="
                overflow-hidden
                rounded-2xl
                border
                border-border
                bg-card
                shadow-sm
              "
            >
              {/* =================================================
                  MILESTONE HEADER
              ================================================== */}

              <div
                className="
                  flex
                  flex-col
                  gap-4
                  border-b
                  bg-muted/20
                  p-4
                  md:flex-row
                  md:items-center
                  md:justify-between
                "
              >
                <div className="flex items-start gap-3">
                  <Badge
                    variant="outline"
                    className="mt-0.5 shrink-0 font-mono"
                  >
                    M{installment.sequence ??
                      index + 1}
                  </Badge>

                  <div>
                    <h3 className="font-semibold">
                      {installment.name ||
                        `Milestone ${
                          installment.sequence ??
                          index + 1
                        }`}
                    </h3>

                    <p className="mt-1 text-xs text-muted-foreground">
                      Due:{' '}
                      {formatDate(
                        installment.dueDate,
                      )}
                    </p>
                  </div>
                </div>

                <Badge
                  variant="outline"
                  className={getStatusClass(
                    installment.status,
                  )}
                >
                  {getStatusLabel(
                    installment.status,
                  )}
                </Badge>
              </div>

              {/* =================================================
                  FINANCIAL SUMMARY
              ================================================== */}

              <div className="grid grid-cols-2 border-b md:grid-cols-3">
                <div className="border-r p-4">
                  <p className="text-xs text-muted-foreground">
                    Assigned
                  </p>

                  <p className="mt-1 font-semibold">
                    {formatCurrency(
                      assigned,
                    )}
                  </p>
                </div>

                <div className="border-r p-4">
                  <p className="text-xs text-muted-foreground">
                    Paid
                  </p>

                  <p className="mt-1 font-semibold text-emerald-600">
                    {formatCurrency(
                      paid,
                    )}
                  </p>
                </div>

                <div className="col-span-2 p-4 md:col-span-1">
                  <p className="text-xs text-muted-foreground">
                    Balance
                  </p>

                  <p
                    className={`mt-1 font-semibold ${
                      balance > 0
                        ? 'text-rose-600'
                        : 'text-emerald-600'
                    }`}
                  >
                    {formatCurrency(
                      balance,
                    )}
                  </p>
                </div>
              </div>

              {/* =================================================
                  FEE COMPONENTS
              ================================================== */}

              <div className="p-4">
                <div className="mb-3 flex items-center justify-between">
                  <h4 className="text-sm font-semibold">
                    Fee Components
                  </h4>

                  <span className="text-xs text-muted-foreground">
                    {installment.components
                      ?.length ?? 0}{' '}
                    component
                    {(installment.components
                      ?.length ?? 0) !== 1
                      ? 's'
                      : ''}
                  </span>
                </div>

                {!installment.components
                  ?.length ? (
                  <div className="rounded-lg border border-dashed p-5 text-center">
                    <p className="text-xs text-muted-foreground">
                      No fee components are
                      attached to this milestone.
                    </p>
                  </div>
                ) : (
                  <div className="overflow-x-auto rounded-xl border">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>
                            Fee
                          </TableHead>

                          <TableHead className="text-right">
                            Assigned
                          </TableHead>

                          <TableHead className="text-right">
                            Paid
                          </TableHead>

                          <TableHead className="text-right">
                            Balance
                          </TableHead>

                          <TableHead className="text-center">
                            Status
                          </TableHead>
                        </TableRow>
                      </TableHeader>

                      <TableBody>
                        {installment.components.map(
                          (
                            component,
                          ) => {
                            const componentBalance =
                              Number(
                                component.balanceAmount ??
                                  0,
                              );

                            const componentPaid =
                              Number(
                                component.paidAmount ??
                                  0,
                              );

                            const componentAssigned =
                              Number(
                                component.assignedAmount ??
                                  0,
                              );

                            return (
                              <TableRow
                                key={
                                  component.installmentComponentId
                                }
                              >
                                <TableCell>
                                  <div className="font-medium">
                                    {
                                      component.componentName
                                    }
                                  </div>

                                  <div className="text-xs text-muted-foreground">
                                    {
                                      component.componentCode
                                    }
                                  </div>
                                </TableCell>

                                <TableCell className="text-right">
                                  {formatCurrency(
                                    componentAssigned,
                                  )}
                                </TableCell>

                                <TableCell className="text-right text-emerald-600">
                                  {formatCurrency(
                                    componentPaid,
                                  )}
                                </TableCell>

                                <TableCell
                                  className={`text-right font-semibold ${
                                    componentBalance >
                                    0
                                      ? 'text-rose-600'
                                      : 'text-emerald-600'
                                  }`}
                                >
                                  {formatCurrency(
                                    componentBalance,
                                  )}
                                </TableCell>

                                <TableCell className="text-center">
                                  <Badge
                                    variant="outline"
                                    className={getStatusClass(
                                      component.status,
                                    )}
                                  >
                                    {getStatusLabel(
                                      component.status,
                                    )}
                                  </Badge>
                                </TableCell>
                              </TableRow>
                            );
                          },
                        )}
                      </TableBody>
                    </Table>
                  </div>
                )}
              </div>

              {/* =================================================
                  MILESTONE STATE MESSAGE
              ================================================== */}

              {isPaid && (
                <div className="border-t bg-emerald-500/5 px-4 py-3">
                  <p className="text-xs font-medium text-emerald-600">
                    This milestone has been fully paid.
                  </p>
                </div>
              )}

              {!isPaid &&
                installment.status ===
                  'PARTIAL' && (
                  <div className="border-t bg-blue-500/5 px-4 py-3">
                    <p className="text-xs font-medium text-blue-600">
                      This milestone is partially
                      paid. The remaining balance must
                      be cleared before the next
                      milestone becomes payable.
                    </p>
                  </div>
                )}

              {!isPaid &&
                installment.status ===
                  'OVERDUE' && (
                  <div className="border-t bg-rose-500/5 px-4 py-3">
                    <p className="text-xs font-medium text-rose-600">
                      This milestone is overdue and
                      still has an outstanding balance.
                    </p>
                  </div>
                )}
            </div>
          );
        },
      )}
    </div>
  );
}