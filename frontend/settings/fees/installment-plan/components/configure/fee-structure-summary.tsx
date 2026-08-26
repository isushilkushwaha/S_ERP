// frontend/settings/fees/installment-plan/components/configure/fee-structure-summary.tsx

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Layers } from 'lucide-react';
import { FeeComponentSummary } from '../../types/installment-plan.types';

interface FeeStructureSummaryProps {
  feeStructure: any;
  feeComponents: FeeComponentSummary[];
  totalFee: number;
}

export function FeeStructureSummary({
  feeStructure,
  feeComponents,
  totalFee,
}: FeeStructureSummaryProps) {
  return (
    <Card className="bg-muted/10">
      <CardHeader className="pb-3">
        <CardTitle className="flex flex-col gap-2 text-sm font-semibold sm:flex-row sm:items-center sm:justify-between">
          <span className="flex items-center gap-2">
            <Layers className="h-4 w-4 text-primary" />
            Section 1 — Fee Structure Information
          </span>
          <Badge variant="secondary" className="w-fit font-mono">
            Total Fee: ₹
            {totalFee.toLocaleString('en-IN', {
              minimumFractionDigits: 2,
            })}
          </Badge>
        </CardTitle>
      </CardHeader>

      {/* Main container: splits metadata cards on the left from components list on the right */}
      <CardContent className="grid grid-cols-1 gap-4 text-xs lg:grid-cols-12">
        
        {/* Left Side: Compact Highlighted Meta Cards (Spans 5 columns) */}
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-3 lg:col-span-5 auto-rows-max">
          <div className="rounded-lg border bg-card/80 p-3 shadow-2xs backdrop-blur-xs flex flex-col justify-between">
            <p className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">Class</p>
            <p className="mt-1 text-sm font-bold text-foreground truncate">
              {feeStructure?.class?.name || '—'}
            </p>
          </div>

          <div className="rounded-lg border bg-card/80 p-3 shadow-2xs backdrop-blur-xs flex flex-col justify-between">
            <p className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">Fee Structure</p>
            <p className="mt-1 text-sm font-bold text-foreground truncate" title={feeStructure?.name || 'Regular Structure'}>
              {feeStructure?.name || 'Regular Structure'}
            </p>
          </div>

          <div className="rounded-lg border bg-card/80 p-3 shadow-2xs backdrop-blur-xs flex flex-col justify-between">
            <p className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">Status</p>
            <div>
              <Badge className="mt-1 font-mono text-[10px]" variant="outline">
                {feeStructure?.status || 'ACTIVE'}
              </Badge>
            </div>
          </div>
        </div>

        {/* Right Side: Components Breakdown (Spans 7 columns with scrollable limit if list is long) */}
        <div className="rounded-lg border bg-card p-3 lg:col-span-7 flex flex-col">
          <p className="mb-2 text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
            Components Breakdown ({feeComponents.length})
          </p>
          <div className="space-y-1.5 max-h-[120px] overflow-y-auto pr-1">
            {feeComponents.map((component) => (
              <div
                key={component.id}
                className="flex items-center justify-between gap-2 text-xs py-0.5 border-b border-border/40 last:border-0"
              >
                <span className="truncate text-muted-foreground">{component.name}</span>
                <span className="shrink-0 font-mono font-medium text-foreground">
                  ₹{component.amount.toLocaleString('en-IN')}
                </span>
              </div>
            ))}
          </div>
        </div>

      </CardContent>
    </Card>
  );
}