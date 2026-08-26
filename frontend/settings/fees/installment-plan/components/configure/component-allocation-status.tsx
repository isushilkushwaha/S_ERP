import React from 'react';
import { Badge } from '@/components/ui/badge';
import { FeeComponentSummary } from '../../types/installment-plan.types';
import { cn } from '@/lib/utils';

interface ComponentAllocationStatusProps {
  feeComponentsList: FeeComponentSummary[];
  componentAssignmentMap: Map<string, number>;
}

export function ComponentAllocationStatus({
  feeComponentsList,
  componentAssignmentMap,
}: ComponentAllocationStatusProps) {
  return (
    <div className="border-t pt-4">
      <div className="mb-3 flex items-center justify-between">
        <p className="text-xs font-semibold">Component Allocation Status</p>
        <span className="text-[10px] text-muted-foreground">
          Each component must be assigned once
        </span>
      </div>

      <div className="grid grid-cols-1 gap-2 sm:grid-cols-2 lg:grid-cols-3">
        {feeComponentsList.map((component) => {
          const assignedMilestone = componentAssignmentMap.get(component.id);
          const isAssigned = assignedMilestone !== undefined;

          return (
            <div
              key={component.id}
              className={cn(
                'flex items-center justify-between rounded-lg border p-3',
                isAssigned ? 'bg-emerald-500/5' : 'bg-amber-500/5'
              )}
            >
              <div className="min-w-0">
                <p className="truncate text-xs font-medium">
                  {component.name}
                </p>
                <p className="mt-0.5 font-mono text-[10px] text-muted-foreground">
                  ₹{component.amount.toLocaleString('en-IN')}
                </p>
              </div>

              {isAssigned ? (
                <Badge
                  variant="outline"
                  className="shrink-0 border-emerald-500/30 text-[10px] text-emerald-600"
                >
                  Milestone {assignedMilestone! + 1}
                </Badge>
              ) : (
                <Badge
                  variant="outline"
                  className="shrink-0 border-amber-500/30 text-[10px] text-amber-600"
                >
                  Unassigned
                </Badge>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}