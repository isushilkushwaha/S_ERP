'use client';

import React, { useMemo, useEffect } from 'react';
import {
  Calendar,
  Layers,
  CheckCircle2,
  IndianRupee,
  ListChecks,
  Clock3,
} from 'lucide-react';

import { Badge } from '@/components/ui/badge';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';

interface FeeComponent {
  id: string;
  name?: string;
  code?: string;
  amount?: number | string;
}

interface InstallmentPlanItemComponent {
  id?: string;
  feeComponentId: string;
  feeComponent?: FeeComponent;
}

interface InstallmentPlanItem {
  id: string;
  name?: string;
  dueDate?: string | null;
  calculationType?: string;
  value?: number | string;
  displayOrder?: number;
  components?: InstallmentPlanItemComponent[];
}

interface InstallmentPlanDetailData {
  id: string;
  name?: string;
  code?: string;
  planType?: string;
  status?: string;
  effectiveFrom?: string | null;
  effectiveTo?: string | null;
  academicYear?: {
    id?: string;
    name?: string;
    code?: string;
  };
  class?: {
    id?: string;
    name?: string;
    code?: string;
  };
  items?: InstallmentPlanItem[];
}

interface InstallmentPlanDetailProps {
  plan: InstallmentPlanDetailData;
}

/**
 * ---------------------------------------------------------
 * HELPERS
 * ---------------------------------------------------------
 */

function formatCurrency(amount: number | string | undefined | null): string {
  const numericAmount = Number(amount || 0);
  return `₹${numericAmount.toLocaleString('en-IN', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;
}

function formatDate(value?: string | null): string {
  if (!value) {
    return '—';
  }

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return '—';
  }

  return date.toLocaleDateString('en-IN', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  });
}

function formatPlanType(planType?: string): string {
  if (!planType) return 'Custom';
  return planType
    .replace(/_/g, ' ')
    .toLowerCase()
    .replace(/\b\w/g, (letter) => letter.toUpperCase());
}

/**
 * ---------------------------------------------------------
 * COMPONENT
 * ---------------------------------------------------------
 */

export function InstallmentPlanDetail({ plan }: InstallmentPlanDetailProps) {
  
  // Invisible Debugger: Checks if the database is sending the date!
  useEffect(() => {
    if (plan?.items) {
      console.log("View Page Data Check - Items:", plan.items);
    }
  }, [plan]);

  if (!plan) {
    return null;
  }

  /**
   * Sort milestones by display order.
   */
  const items = useMemo(() => {
    return [...(plan.items || [])].sort(
      (a, b) => Number(a.displayOrder || 0) - Number(b.displayOrder || 0)
    );
  }, [plan.items]);

  /**
   * Total configured installment amount.
   */
  const totalInstallmentAmount = useMemo(() => {
    return items.reduce((sum, item) => sum + Number(item.value || 0), 0);
  }, [items]);

  /**
   * Number of unique fee components assigned across all milestones.
   */
  const assignedComponentCount = useMemo(() => {
    const ids = new Set<string>();
    items.forEach((item) => {
      item.components?.forEach((component) => {
        ids.add(component.feeComponentId);
      });
    });
    return ids.size;
  }, [items]);

  return (
    <div className="mx-auto w-full max-w-7xl space-y-5 p-4 md:p-6">
      {/* =====================================================
          HEADER
      ===================================================== */}
      <div className="flex flex-col gap-4 border-b pb-5 sm:flex-row sm:items-start sm:justify-between">
        <div className="min-w-0">
          <div className="flex items-center gap-2">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary/10">
              <ListChecks className="h-5 w-5 text-primary" />
            </div>
            <div className="min-w-0">
              <h1 className="truncate text-xl font-bold tracking-tight md:text-2xl">
                {plan.name || 'Installment Plan'}
              </h1>
              {plan.code && (
                <p className="mt-0.5 font-mono text-xs text-muted-foreground">
                  {plan.code}
                </p>
              )}
            </div>
          </div>
          <p className="mt-2 text-xs text-muted-foreground">
            Default installment schedule for the selected class and academic year.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Badge variant="outline" className="text-xs">
            {formatPlanType(plan.planType)}
          </Badge>
          <Badge
            variant={plan.status === 'ACTIVE' ? 'default' : 'secondary'}
            className={plan.status === 'ACTIVE' ? 'bg-emerald-600 hover:bg-emerald-600' : ''}
          >
            {plan.status || 'ACTIVE'}
          </Badge>
        </div>
      </div>

      {/* =====================================================
          SUMMARY
      ===================================================== */}
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
        {/* Academic Year */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-xs font-medium text-muted-foreground">
              Academic Year
            </CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <p className="text-base font-bold">{plan.academicYear?.name || 'N/A'}</p>
            {plan.academicYear?.code && (
              <p className="mt-0.5 font-mono text-[10px] text-muted-foreground">
                {plan.academicYear.code}
              </p>
            )}
          </CardContent>
        </Card>

        {/* Class */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-xs font-medium text-muted-foreground">
              Assigned Class
            </CardTitle>
            <Layers className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <p className="text-base font-bold">{plan.class?.name || 'N/A'}</p>
            {plan.class?.code && (
              <p className="mt-0.5 font-mono text-[10px] text-muted-foreground">
                {plan.class.code}
              </p>
            )}
          </CardContent>
        </Card>

        {/* Milestones */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-xs font-medium text-muted-foreground">
              Milestones
            </CardTitle>
            <Clock3 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <p className="text-base font-bold">{items.length}</p>
            <p className="mt-0.5 text-[10px] text-muted-foreground">Payment milestones</p>
          </CardContent>
        </Card>

        {/* Total */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-xs font-medium text-muted-foreground">
              Scheduled Amount
            </CardTitle>
            <IndianRupee className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <p className="text-base font-bold">{formatCurrency(totalInstallmentAmount)}</p>
            <p className="mt-0.5 text-[10px] text-muted-foreground">
              {assignedComponentCount} fee component{assignedComponentCount !== 1 ? 's' : ''} assigned
            </p>
          </CardContent>
        </Card>
      </div>

      {/* =====================================================
          PLAN INFORMATION
      ===================================================== */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-sm">Plan Information</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
            <div>
              <p className="text-[10px] uppercase tracking-wide text-muted-foreground">Plan Type</p>
              <p className="mt-1 text-sm font-medium">{formatPlanType(plan.planType)}</p>
            </div>
            <div>
              <p className="text-[10px] uppercase tracking-wide text-muted-foreground">Effective From</p>
              <p className="mt-1 text-sm font-medium">{formatDate(plan.effectiveFrom)}</p>
            </div>
            <div>
              <p className="text-[10px] uppercase tracking-wide text-muted-foreground">Effective Until</p>
              <p className="mt-1 text-sm font-medium">{formatDate(plan.effectiveTo)}</p>
            </div>
            <div>
              <p className="text-[10px] uppercase tracking-wide text-muted-foreground">Status</p>
              <div className="mt-1">
                <Badge
                  variant={plan.status === 'ACTIVE' ? 'default' : 'secondary'}
                  className={plan.status === 'ACTIVE' ? 'bg-emerald-600 hover:bg-emerald-600' : ''}
                >
                  {plan.status || 'ACTIVE'}
                </Badge>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* =====================================================
          INSTALLMENT TIMELINE
      ===================================================== */}
      <Card>
        <CardHeader className="border-b pb-3">
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-sm">Installment Milestones</CardTitle>
              <p className="mt-1 text-xs text-muted-foreground">Payment schedule and assigned fee components.</p>
            </div>
            <Badge variant="outline" className="text-[10px]">
              {items.length} Milestone{items.length !== 1 ? 's' : ''}
            </Badge>
          </div>
        </CardHeader>

        <CardContent className="p-4">
          {items.length === 0 ? (
            <div className="flex min-h-[180px] flex-col items-center justify-center text-center">
              <ListChecks className="h-8 w-8 text-muted-foreground" />
              <p className="mt-3 text-sm font-medium">No milestones configured</p>
              <p className="mt-1 text-xs text-muted-foreground">This installment plan does not contain any payment milestones.</p>
            </div>
          ) : (
            <div className="space-y-3">
              {items.map((item, index) => {
                const components = item.components || [];

                return (
                  <div key={item.id || `milestone-${index}`} className="rounded-lg border bg-muted/10 p-4">
                    {/* Milestone Header */}
                    <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                      <div className="flex items-center gap-3">
                        <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary/10 text-xs font-bold text-primary">
                          {index + 1}
                        </div>
                        <div>
                          <p className="text-sm font-semibold">{item.name || `Milestone ${index + 1}`}</p>
                          <div className="mt-1 flex flex-wrap items-center gap-2">
                            <span className="flex items-center gap-1 text-xs text-muted-foreground">
                              <Calendar className="h-3.5 w-3.5" />
                              Due:{' '}
                              <span className="font-medium text-foreground">
                                {formatDate(item.dueDate)}
                              </span>
                            </span>
                            <Badge variant="outline" className="text-[9px]">Fixed Amount</Badge>
                          </div>
                        </div>
                      </div>

                      {/* Amount */}
                      <div className="sm:text-right">
                        <p className="font-mono text-lg font-bold text-primary">
                          {formatCurrency(item.value)}
                        </p>
                        <p className="text-[10px] text-muted-foreground">Payment Amount</p>
                      </div>
                    </div>

                    {/* Components */}
                    <div className="mt-4 border-t pt-3">
                      <div className="mb-2 flex items-center justify-between">
                        <p className="text-[10px] font-semibold uppercase tracking-wide text-muted-foreground">Fee Components</p>
                        <span className="text-[10px] text-muted-foreground">
                          {components.length} component{components.length !== 1 ? 's' : ''}
                        </span>
                      </div>

                      {components.length === 0 ? (
                        <div className="rounded-md border border-dashed p-3">
                          <p className="text-xs text-muted-foreground">No fee components assigned.</p>
                        </div>
                      ) : (
                        <div className="grid grid-cols-1 gap-2 sm:grid-cols-2 lg:grid-cols-3">
                          {components.map((component, componentIndex) => (
                            <div key={component.id || component.feeComponentId || componentIndex} className="flex items-center justify-between rounded-md border bg-background px-3 py-2">
                              <div className="flex min-w-0 items-center gap-2">
                                <CheckCircle2 className="h-3.5 w-3.5 shrink-0 text-emerald-600" />
                                <div className="min-w-0">
                                  <p className="truncate text-xs font-medium">
                                    {component.feeComponent?.name || 'Fee Component'}
                                  </p>
                                  {component.feeComponent?.code && (
                                    <p className="font-mono text-[9px] text-muted-foreground">
                                      {component.feeComponent.code}
                                    </p>
                                  )}
                                </div>
                              </div>
                              {component.feeComponent?.amount !== undefined && (
                                <span className="ml-2 shrink-0 font-mono text-[10px] font-medium">
                                  {formatCurrency(component.feeComponent.amount)}
                                </span>
                              )}
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </CardContent>
      </Card>

      {/* =====================================================
          FOOTER VALIDATION
      ===================================================== */}
      <div className="flex items-start gap-3 rounded-lg border bg-emerald-500/5 p-4">
        <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-emerald-600" />
        <div>
          <p className="text-xs font-semibold">Default Plan Configuration</p>
          <p className="mt-1 text-xs leading-relaxed text-muted-foreground">
            This installment plan is the default payment template for{' '}
            <span className="font-medium text-foreground">{plan.class?.name || 'this class'}</span>{' '}
            for academic year{' '}
            <span className="font-medium text-foreground">{plan.academicYear?.name || 'this academic year'}</span>
            . The schedule can be copied and customized for individual students during admission.
          </p>
        </div>
      </div>
    </div>
  );
}