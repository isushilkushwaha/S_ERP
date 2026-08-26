import React from 'react';
import { Badge } from '@/components/ui/badge';
import { XCircle } from 'lucide-react';
import { FeeComponentSummary } from '../../types/installment-plan.types';

interface SelectedComponentsProps {
  selectedComponentsList: FeeComponentSummary[];
  onRemoveComponent: (componentId: string) => void;
}

export function SelectedComponents({
  selectedComponentsList,
  onRemoveComponent,
}: SelectedComponentsProps) {
  return (
    <div className="space-y-2 md:col-span-7">
      <div className="flex items-center justify-between">
        <label className="block text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
          Assigned to This Milestone
        </label>
        {selectedComponentsList.length > 0 && (
          <span className="text-[10px] font-medium text-primary">
            {selectedComponentsList.length} selected
          </span>
        )}
      </div>

      <div className="min-h-[52px] rounded-md border bg-card p-2">
        {selectedComponentsList.length > 0 ? (
          <div className="flex flex-wrap gap-2">
            {selectedComponentsList.map((component) => (
              <Badge
                key={component.id}
                variant="secondary"
                className="gap-2 py-1.5 text-[11px]"
              >
                <span>{component.name}</span>
                <span className="font-mono font-semibold text-primary">
                  ₹{component.amount.toLocaleString('en-IN')}
                </span>
                <button
                  type="button"
                  className="ml-1 rounded-full hover:bg-muted"
                  onClick={() => onRemoveComponent(component.id)}
                  aria-label={`Remove ${component.name}`}
                >
                  <XCircle className="h-3 w-3" />
                </button>
              </Badge>
            ))}
          </div>
        ) : (
          <div className="flex min-h-[36px] items-center text-xs italic text-muted-foreground">
            No fee components assigned yet.
          </div>
        )}
      </div>
    </div>
  );
}