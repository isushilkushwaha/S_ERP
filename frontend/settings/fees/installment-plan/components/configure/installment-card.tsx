import React from 'react';
import { UseFormRegister } from 'react-hook-form';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Trash2 } from 'lucide-react';
import { FeeComponentSummary } from '../../types/installment-plan.types';
import { InstallmentPlanFormValues } from '../../schemas/installment-plan.schema';
import { FeeComponentSelector } from './fee-component-selector';
import { SelectedComponents } from './selected-components';
import { cn } from '@/lib/utils';

interface InstallmentCardProps {
  index: number;
  fieldId: string;
  register: UseFormRegister<InstallmentPlanFormValues>;
  fieldsLength: number;
  currentSelectedIds: string[];
  feeComponentsList: FeeComponentSummary[];
  componentAssignmentMap: Map<string, number>;
  isPopoverOpen: boolean;
  onPopoverChange: (open: boolean) => void;
  milestoneAmount: number;
  onRemove: (index: number) => void;
  onToggleComponent: (milestoneIndex: number, componentId: string) => void;
}

export function InstallmentCard({
  index,
  register,
  fieldsLength,
  currentSelectedIds,
  feeComponentsList,
  componentAssignmentMap,
  isPopoverOpen,
  onPopoverChange,
  milestoneAmount,
  onRemove,
  onToggleComponent,
}: InstallmentCardProps) {
  const selectedHereSet = new Set(currentSelectedIds);
  const milestoneHasComponents = currentSelectedIds.length > 0;

  const selectedComponentsList = feeComponentsList.filter((component) =>
    selectedHereSet.has(component.id)
  );

  return (
    <div className="space-y-4 rounded-xl border bg-muted/20 p-4">
      {/* HEADER */}
      <div className="flex items-center justify-between border-b pb-3">
        <div className="flex items-center gap-2">
          <Badge variant="secondary">#{index + 1}</Badge>
          <span className="text-sm font-semibold">Payment Milestone</span>
        </div>

        {milestoneHasComponents && (
          <Badge variant="outline" className="font-mono">
            ₹
            {milestoneAmount.toLocaleString('en-IN', {
              minimumFractionDigits: 2,
            })}
          </Badge>
        )}
      </div>

      {/* BASIC INFO */}
      <div className="grid grid-cols-1 gap-3 md:grid-cols-12">
        <div className="md:col-span-4">
          <label className="mb-1 block text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
            Milestone Name
          </label>
          <Input
            placeholder="e.g. Admission Fee"
            {...register(`items.${index}.name`)}
          />
        </div>

        <div className="md:col-span-3">
          <label className="mb-1 block text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
            Payment Due Date
          </label>
          <Input type="date" {...register(`items.${index}.dueDate`)} />
        </div>

        <div className="md:col-span-2">
          <label className="mb-1 block text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
            Calculation Type
          </label>
          <Input
            value="Fixed Amount"
            readOnly
            className="bg-muted font-medium"
          />
        </div>

        <div className="md:col-span-2">
          <label className="mb-1 block text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
            Calculated Amount
          </label>
          <Input
            value={`₹${milestoneAmount.toLocaleString('en-IN', {
              minimumFractionDigits: 2,
            })}`}
            readOnly
            className={cn(
              'bg-muted font-mono font-bold',
              milestoneHasComponents ? 'text-primary' : 'text-muted-foreground'
            )}
          />
        </div>

        <div className="flex items-end justify-center md:col-span-1">
          <Button
            type="button"
            variant="ghost"
            size="icon"
            className="h-9 w-9 text-destructive hover:bg-destructive/10"
            onClick={() => onRemove(index)}
            disabled={fieldsLength <= 1}
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* COMPONENT SELECTOR & ASSIGNED BADGES */}
      <div className="grid grid-cols-1 gap-4 border-t pt-4 md:grid-cols-12">
        <FeeComponentSelector
          index={index}
          isPopoverOpen={isPopoverOpen}
          onPopoverChange={(open) => onPopoverChange(open)}
          currentSelectedIds={currentSelectedIds}
          feeComponentsList={feeComponentsList}
          componentAssignmentMap={componentAssignmentMap}
          onToggleComponent={onToggleComponent}
        />

        <SelectedComponents
          selectedComponentsList={selectedComponentsList}
          onRemoveComponent={(componentId) =>
            onToggleComponent(index, componentId)
          }
        />
      </div>
    </div>
  );
}