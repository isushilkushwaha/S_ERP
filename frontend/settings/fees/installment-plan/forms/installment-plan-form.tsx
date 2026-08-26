'use client';

import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { InstallmentPlanFormValues, installmentPlanSchema } from '../schemas/installment-plan.schema';
import { InstallmentItemsBuilder } from '../components/installment-items-builder';

interface InstallmentPlanFormProps {
  initialData?: Partial<InstallmentPlanFormValues>;
  onSubmit: (values: InstallmentPlanFormValues) => void;
  isLoading?: boolean;
  academicYears?: Array<{ id: string; name: string }>;
  classes?: Array<{ id: string; name: string }>;
}

export function InstallmentPlanForm({
  initialData,
  onSubmit,
  isLoading,
  academicYears = [],
  classes = [],
}: InstallmentPlanFormProps) {
  const form = useForm<InstallmentPlanFormValues>({
    resolver: zodResolver(installmentPlanSchema) as any,
    defaultValues: {
      academicYearId: initialData?.academicYearId || '',
      classId: initialData?.classId || '',
      name: initialData?.name || '',
      code: initialData?.code || '',
      planType: initialData?.planType || 'MONTHLY',
      description: initialData?.description || '',
      status: initialData?.status || 'ACTIVE',
      items: initialData?.items || [
        {
          name: 'Milestone 1',
          dueRule: 'FIXED_DATE',
          calculationType: 'PERCENTAGE',
          value: 100,
          displayOrder: 1,
          dueDay: 10,
          dueMonth: 4,
        },
      ],
    },
  });

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit as any)} className="space-y-6">
        <div className="grid grid-cols-2 gap-4">
          <FormField
            control={form.control as any}
            name="academicYearId"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Academic Year</FormLabel>
                <Select onValueChange={field.onChange} value={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select academic year" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {academicYears.map((ay) => (
                      <SelectItem key={ay.id} value={ay.id}>{ay.name}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control as any}
            name="classId"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Class</FormLabel>
                <Select onValueChange={field.onChange} value={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select class" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {classes.map((cls) => (
                      <SelectItem key={cls.id} value={cls.id}>{cls.name}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="grid grid-cols-3 gap-4">
          <FormField
            control={form.control as any}
            name="name"
            render={({ field }) => (
              <FormItem className="col-span-2">
                <FormLabel>Plan Name</FormLabel>
                <FormControl><Input placeholder="e.g., Monthly Tuition Plan" {...field} /></FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control as any}
            name="code"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Code</FormLabel>
                <FormControl><Input placeholder="MON-2026" {...field} /></FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <FormField
            control={form.control as any}
            name="planType"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Plan Type</FormLabel>
                <Select onValueChange={field.onChange} value={field.value}>
                  <FormControl><SelectTrigger><SelectValue /></SelectTrigger></FormControl>
                  <SelectContent>
                    <SelectItem value="MONTHLY">Monthly</SelectItem>
                    <SelectItem value="QUARTERLY">Quarterly</SelectItem>
                    <SelectItem value="HALF_YEARLY">Half-Yearly</SelectItem>
                    <SelectItem value="ANNUAL">Annual</SelectItem>
                    <SelectItem value="CUSTOM">Custom</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control as any}
            name="status"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Status</FormLabel>
                <Select onValueChange={field.onChange} value={field.value}>
                  <FormControl><SelectTrigger><SelectValue /></SelectTrigger></FormControl>
                  <SelectContent>
                    <SelectItem value="ACTIVE">Active</SelectItem>
                    <SelectItem value="INACTIVE">Inactive</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        {/* Dynamic Items Builder */}
        <InstallmentItemsBuilder control={form.control as any} register={form.register} watch={form.watch} />

        <div className="flex justify-end gap-3 pt-4 border-t">
          <Button type="submit" disabled={isLoading}>
            {isLoading ? 'Saving...' : 'Save Installment Plan'}
          </Button>
        </div>
      </form>
    </Form>
  );
}