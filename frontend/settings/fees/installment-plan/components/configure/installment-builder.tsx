import React from 'react';
import { UseFormRegister } from 'react-hook-form';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Plus } from 'lucide-react';
import { FeeComponentSummary } from '../../types/installment-plan.types';
import { InstallmentPlanFormValues } from '../../schemas/installment-plan.schema';
import { InstallmentCard } from './installment-card';

interface InstallmentBuilderProps {
  fields: any[];
  register: UseFormRegister<InstallmentPlanFormValues>;
  items: any[];
  feeComponentsList: FeeComponentSummary[];
  componentAssignmentMap: Map<string, number>;
  openPopovers: Record<number, boolean>;
  onPopoverChange: (index: number, open: boolean) => void;
  milestoneAmounts: number[];
  canAddMilestone: boolean;
  onAddMilestone: () => void;
  onRemoveMilestone: (index: number) => void;
  onToggleComponent: (milestoneIndex: number, componentId: string) => void;
}

export function InstallmentBuilder({
  fields,
  register,
  items,
  feeComponentsList,
  componentAssignmentMap,
  openPopovers,
  onPopoverChange,
  milestoneAmounts,
  canAddMilestone,
  onAddMilestone,
  onRemoveMilestone,
  onToggleComponent,
}: InstallmentBuilderProps) {
  return (
    <Card>
      <CardHeader className="flex flex-col gap-3 pb-3 md:flex-row md:items-center md:justify-between">
        <div>
          <CardTitle className="text-base">
            Section 3 — Installment Builder & Component Mapping
          </CardTitle>
          <p className="mt-1 text-xs text-muted-foreground">
            Assign each fee component to exactly one payment milestone.
          </p>
        </div>

        <Button
          type="button"
          size="sm"
          onClick={onAddMilestone}
          disabled={!canAddMilestone}
        >
          <Plus className="mr-1 h-4 w-4" />
          Add Milestone
        </Button>
      </CardHeader>

      <CardContent className="space-y-4">
        {fields.map((field, index) => (
          <InstallmentCard
            key={field.id}
            index={index}
            fieldId={field.id}
            register={register}
            fieldsLength={fields.length}
            currentSelectedIds={
              (items[index]?.feeComponentIds || []) as string[]
            }
            feeComponentsList={feeComponentsList}
            componentAssignmentMap={componentAssignmentMap}
            isPopoverOpen={openPopovers[index] || false}
            onPopoverChange={(open) => onPopoverChange(index, open)}
            milestoneAmount={milestoneAmounts[index] || 0}
            onRemove={onRemoveMilestone}
            onToggleComponent={onToggleComponent}
          />
        ))}

        {fields.length === 0 && (
          <div className="rounded-lg border border-dashed p-8 text-center">
            <p className="font-medium">No milestones configured</p>
            <p className="mt-1 text-xs text-muted-foreground">
              Create a milestone and assign fee components to it.
            </p>
            <Button
              type="button"
              className="mt-4"
              onClick={onAddMilestone}
              disabled={!canAddMilestone}
            >
              <Plus className="mr-2 h-4 w-4" />
              Add Milestone
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
}