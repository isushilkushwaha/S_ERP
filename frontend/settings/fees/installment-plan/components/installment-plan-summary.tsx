import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Layers, CircleCheck, CircleAlert, IndianRupee } from 'lucide-react';
import { formatCurrency } from '../utils/formatters';

interface InstallmentPlanSummaryProps {
  summary: {
    total: number;
    configured: number;
    notConfigured: number;
    totalFee: number;
  };
}

export function InstallmentPlanSummary({
  summary,
}: InstallmentPlanSummaryProps) {
  return (
    <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
      {/* Total Structures */}
      <Card>
        <CardContent className="p-3">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-[11px] font-medium text-muted-foreground">
                Fee Structures
              </p>
              <p className="mt-0.5 text-xl font-bold">{summary.total}</p>
            </div>
            <div className="rounded-lg bg-primary/10 p-2">
              <Layers className="h-4 w-4 text-primary" />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Configured */}
      <Card>
        <CardContent className="p-3">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-[11px] font-medium text-muted-foreground">
                Configured Plans
              </p>
              <p className="mt-0.5 text-xl font-bold text-emerald-600">
                {summary.configured}
              </p>
            </div>
            <div className="rounded-lg bg-emerald-500/10 p-2">
              <CircleCheck className="h-4 w-4 text-emerald-600" />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Not Configured */}
      <Card>
        <CardContent className="p-3">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-[11px] font-medium text-muted-foreground">
                Needs Configuration
              </p>
              <p className="mt-0.5 text-xl font-bold text-amber-600">
                {summary.notConfigured}
              </p>
            </div>
            <div className="rounded-lg bg-amber-500/10 p-2">
              <CircleAlert className="h-4 w-4 text-amber-600" />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Total Fee */}
      <Card>
        <CardContent className="p-3">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-[11px] font-medium text-muted-foreground">
                Total Fee Value
              </p>
              <p className="mt-0.5 text-lg font-bold">
                {formatCurrency(summary.totalFee)}
              </p>
            </div>
            <div className="rounded-lg bg-primary/10 p-2">
              <IndianRupee className="h-4 w-4 text-primary" />
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}