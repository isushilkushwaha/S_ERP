import React from 'react';
import { UseFormRegister } from 'react-hook-form';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Calendar } from 'lucide-react';
import { InstallmentPlanFormValues } from '../../schemas/installment-plan.schema';

interface InstallmentPlanDetailsProps {
  register: UseFormRegister<InstallmentPlanFormValues>;
}

export function InstallmentPlanDetails({
  register,
}: InstallmentPlanDetailsProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-base">
          <Calendar className="h-4 w-4 text-primary" />
          Section 2 — Default Installment Plan Details
        </CardTitle>
      </CardHeader>
      <CardContent className="grid grid-cols-1 gap-4 md:grid-cols-3">
        <div>
          <label className="mb-1 block text-xs font-medium text-muted-foreground">
            Plan Name
          </label>
          <Input
            {...register('name')}
            placeholder="e.g. Class 4 Payment Schedule"
          />
        </div>

        <div>
          <label className="mb-1 block text-xs font-medium text-muted-foreground">
            Plan Code
          </label>
          <Input
            {...register('code')}
            placeholder="e.g. CLS4-2728"
          />
        </div>

        <div className="grid grid-cols-2 gap-2">
          <div>
            <label className="mb-1 block text-xs font-medium text-muted-foreground">
              Effective From
            </label>
            <Input type="date" {...register('effectiveFrom')} />
          </div>

          <div>
            <label className="mb-1 block text-xs font-medium text-muted-foreground">
              Effective Until
            </label>
            <Input type="date" {...register('effectiveTo')} />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}