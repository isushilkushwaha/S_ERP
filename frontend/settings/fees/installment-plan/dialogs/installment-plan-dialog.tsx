'use client';

import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { InstallmentPlanForm } from '../forms/installment-plan-form';
import { InstallmentPlanFormValues } from '../schemas/installment-plan.schema';

interface InstallmentPlanDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (values: InstallmentPlanFormValues) => void;
  isLoading?: boolean;
  initialData?: Partial<InstallmentPlanFormValues>;
  title?: string;
  academicYears?: Array<{ id: string; name: string }>;
  classes?: Array<{ id: string; name: string }>;
}

export function InstallmentPlanDialog({
  open,
  onOpenChange,
  onSubmit,
  isLoading,
  initialData,
  title = 'Create Installment Plan',
  academicYears = [],
  classes = [],
}: InstallmentPlanDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription>Configure structural payment milestones, due rules, and calculations.</DialogDescription>
        </DialogHeader>
        <InstallmentPlanForm
          initialData={initialData}
          onSubmit={onSubmit}
          isLoading={isLoading}
          academicYears={academicYears}
          classes={classes}
        />
      </DialogContent>
    </Dialog>
  );
}