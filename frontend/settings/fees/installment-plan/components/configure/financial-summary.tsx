import React from 'react';
import { Badge } from '@/components/ui/badge';
import { CheckCircle, AlertCircle } from 'lucide-react';
import { FeeComponentSummary } from '../../types/installment-plan.types';
import { ComponentAllocationStatus } from './component-allocation-status';
import { cn } from '@/lib/utils';

interface FinancialSummaryProps {
  totalFee: number;
  usedComponentIds: Set<string>;
  feeComponentsList: FeeComponentSummary[];
  totalAllocated: number;
  remainingAmount: number;
  isAllComponentsCovered: boolean;
  hasDuplicateComponents: boolean;
  isBalanced: boolean;
  componentAssignmentMap: Map<string, number>;
}

export function FinancialSummary({
  totalFee,
  usedComponentIds,
  feeComponentsList,
  totalAllocated,
  remainingAmount,
  isAllComponentsCovered,
  hasDuplicateComponents,
  isBalanced,
  componentAssignmentMap,
}: FinancialSummaryProps) {
  return (
    <div className="mt-6 space-y-4 rounded-xl border bg-card p-5 shadow-xs">
      <div className="flex flex-col gap-3 border-b pb-4 md:flex-row md:items-center md:justify-between">
        <div className="flex items-start gap-3">
          {isBalanced ? (
            <CheckCircle className="mt-0.5 h-6 w-6 shrink-0 text-emerald-600" />
          ) : (
            <AlertCircle className="mt-0.5 h-6 w-6 shrink-0 text-amber-600" />
          )}

          <div>
            <p className="text-sm font-semibold">
              Financial Summary & Component Verification
            </p>
            <p className="mt-1 text-xs text-muted-foreground">
              {hasDuplicateComponents
                ? 'A fee component is assigned to more than one milestone.'
                : !isAllComponentsCovered
                ? 'Assign every fee component exactly once.'
                : !isBalanced
                ? 'The milestone amounts do not match the total fee.'
                : 'All fee components are assigned exactly once and the plan is balanced.'}
            </p>
          </div>
        </div>

        <Badge
          variant="secondary"
          className={cn(
            'w-fit',
            isBalanced ? 'bg-emerald-600 text-white' : 'bg-amber-600 text-white'
          )}
        >
          {isBalanced ? 'Ready to Save' : 'Action Required'}
        </Badge>
      </div>

      {/* SUMMARY CARDS */}
      <div className="grid grid-cols-1 gap-4 md:grid-cols-4">
        <div className="rounded-lg border bg-muted/30 p-3">
          <p className="text-xs text-muted-foreground">Total Fee</p>
          <p className="mt-1 font-mono text-lg font-bold">
            ₹
            {totalFee.toLocaleString('en-IN', {
              minimumFractionDigits: 2,
            })}
          </p>
        </div>

        <div className="rounded-lg border bg-muted/30 p-3">
          <p className="text-xs text-muted-foreground">Components Assigned</p>
          <p className="mt-1 font-mono text-lg font-bold">
            {usedComponentIds.size} / {feeComponentsList.length}
          </p>
        </div>

        <div className="rounded-lg border bg-muted/30 p-3">
          <p className="text-xs text-muted-foreground">Total Allocated</p>
          <p className="mt-1 font-mono text-lg font-bold">
            ₹
            {totalAllocated.toLocaleString('en-IN', {
              minimumFractionDigits: 2,
            })}
          </p>
        </div>

        <div className="rounded-lg border bg-muted/30 p-3">
          <p className="text-xs text-muted-foreground">Remaining Balance</p>
          <p
            className={cn(
              'mt-1 font-mono text-lg font-bold',
              Math.abs(remainingAmount) < 0.01
                ? 'text-emerald-600'
                : 'text-destructive'
            )}
          >
            ₹
            {remainingAmount.toLocaleString('en-IN', {
              minimumFractionDigits: 2,
            })}
          </p>
        </div>
      </div>

      <ComponentAllocationStatus
        feeComponentsList={feeComponentsList}
        componentAssignmentMap={componentAssignmentMap}
      />
    </div>
  );
}