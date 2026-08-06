// frontend/settings/fee-components/forms/fee-component-form.tsx

'use client';

import React, { useEffect, useMemo } from 'react';
import { useForm, SubmitHandler } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  createFeeComponentSchema,
  CreateFeeComponentInput,
  CreateFeeComponentSchema,
} from '@/features/settings/fee-components/schemas/create-fee-component.schema';
import { FeeComponentDTO } from '@/features/settings/fee-components/types/fee-component.types';
import { useFeeComponentsQuery } from '../api/fee-component.query';

interface Props {
  tenantId: string; // Ensure tenantId is required
  initialData?: FeeComponentDTO | null;
  onSubmit: (data: CreateFeeComponentSchema) => Promise<void>;
  onCancel: () => void;
  isSubmitting: boolean;
}

export function FeeComponentForm({ tenantId, initialData, onSubmit, onCancel, isSubmitting }: Props) {
  // Fetch existing components to compute next sequential display order
  const { data: componentsData } = useFeeComponentsQuery({
    tenantId,
    limit: 100,
  });

  const existingComponents: FeeComponentDTO[] = useMemo(() => {
    return Array.isArray(componentsData)
      ? componentsData
      : (componentsData as { items?: FeeComponentDTO[]; data?: FeeComponentDTO[] })?.items ||
        (componentsData as { items?: FeeComponentDTO[]; data?: FeeComponentDTO[] })?.data ||
        [];
  }, [componentsData]);

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<CreateFeeComponentInput, undefined, CreateFeeComponentSchema>({
    resolver: zodResolver(createFeeComponentSchema),
    defaultValues: {
      name: initialData?.name ?? '',
      code: initialData?.code ?? '',
      description: initialData?.description ?? '',
      isRequired: initialData?.isRequired ?? true,
      displayOrder: initialData?.displayOrder ?? 1,
      status: initialData?.status ?? 'ACTIVE',
    },
  });

  // Dynamically set displayOrder once existing components load
  useEffect(() => {
    if (!initialData) {
      const maxOrder = existingComponents.reduce(
        (max, item) => Math.max(max, Number(item.displayOrder) || 0),
        0
      );
      setValue('displayOrder', maxOrder + 1);
    }
  }, [existingComponents, initialData, setValue]);

  const handleFormSubmit: SubmitHandler<CreateFeeComponentSchema> = async (data) => {
    await onSubmit(data);
  };

  return (
    <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-4">
      <div>
        <label className="block text-xs font-semibold uppercase tracking-wider text-zinc-700 dark:text-zinc-300">
          Name
        </label>
        <input
          {...register('name')}
          placeholder="e.g. Tuition Fee"
          className="mt-1 w-full rounded-md border border-zinc-300 px-3 py-2 text-sm text-zinc-900 focus:border-blue-500 focus:outline-none dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-100"
        />
        {errors.name && <p className="mt-1 text-xs text-red-500">{errors.name.message}</p>}
      </div>

      <div>
        <label className="block text-xs font-semibold uppercase tracking-wider text-zinc-700 dark:text-zinc-300">
          Code
        </label>
        <input
          {...register('code')}
          placeholder="e.g. TUITION_FEE"
          className="mt-1 w-full rounded-md border border-zinc-300 px-3 py-2 text-sm uppercase text-zinc-900 focus:border-blue-500 focus:outline-none dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-100"
        />
        {errors.code && <p className="mt-1 text-xs text-red-500">{errors.code.message}</p>}
      </div>

      <div>
        <label className="block text-xs font-semibold uppercase tracking-wider text-zinc-700 dark:text-zinc-300">
          Description
        </label>
        <textarea
          {...register('description')}
          rows={3}
          placeholder="Brief details about this fee category..."
          className="mt-1 w-full rounded-md border border-zinc-300 px-3 py-2 text-sm text-zinc-900 focus:border-blue-500 focus:outline-none dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-100"
        />
        {errors.description && <p className="mt-1 text-xs text-red-500">{errors.description.message}</p>}
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <div className="flex items-center justify-between">
            <label className="block text-xs font-semibold uppercase tracking-wider text-zinc-700 dark:text-zinc-300">
              Display Order
            </label>
            {!initialData && (
              <span className="text-[10px] font-medium text-blue-600 dark:text-blue-400">
                Auto-assigned
              </span>
            )}
          </div>
          <input
            type="number"
            min="1"
            {...register('displayOrder', { valueAsNumber: true })}
            className="mt-1 w-full rounded-md border border-zinc-300 px-3 py-2 text-sm font-mono text-zinc-900 focus:border-blue-500 focus:outline-none dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-100"
          />
          {errors.displayOrder && <p className="mt-1 text-xs text-red-500">{errors.displayOrder.message}</p>}
        </div>

        <div>
          <label className="block text-xs font-semibold uppercase tracking-wider text-zinc-700 dark:text-zinc-300">
            Status
          </label>
          <select
            {...register('status')}
            className="mt-1 w-full rounded-md border border-zinc-300 px-3 py-2 text-sm text-zinc-900 focus:border-blue-500 focus:outline-none dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-100"
          >
            <option value="ACTIVE">Active</option>
            <option value="INACTIVE">Inactive</option>
          </select>
          {errors.status && <p className="mt-1 text-xs text-red-500">{errors.status.message}</p>}
        </div>
      </div>

      <div className="flex items-center space-x-2 pt-2">
        <input
          type="checkbox"
          id="isRequired"
          {...register('isRequired')}
          className="h-4 w-4 rounded border-zinc-300 text-blue-600 focus:ring-blue-500 cursor-pointer"
        />
        <label htmlFor="isRequired" className="text-sm font-medium text-zinc-700 dark:text-zinc-300 cursor-pointer">
          Is Mandatory Component
        </label>
      </div>

      <div className="mt-6 flex justify-end space-x-3 border-t border-zinc-200 pt-4 dark:border-zinc-800">
        <button
          type="button"
          onClick={onCancel}
          className="rounded-md border border-zinc-300 px-4 py-2 text-sm font-medium text-zinc-700 hover:bg-zinc-50 dark:border-zinc-700 dark:text-zinc-300 dark:hover:bg-zinc-800"
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={isSubmitting}
          className="rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 disabled:opacity-50"
        >
          {isSubmitting ? 'Saving...' : initialData ? 'Update Component' : 'Create Component'}
        </button>
      </div>
    </form>
  );
}