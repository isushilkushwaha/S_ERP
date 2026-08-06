// frontend/settings/fee-components/dialogs/create-fee-component-dialog.tsx

'use client';

import React from 'react';
import { FeeComponentForm } from '../forms/fee-component-form';
import { useCreateFeeComponentMutation } from '../api/fee-component.mutation';
import { CreateFeeComponentSchema } from '@/features/settings/fee-components/schemas/create-fee-component.schema';

interface Props {
  tenantId: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function CreateFeeComponentDialog({ tenantId, open, onOpenChange }: Props) {
  const createMutation = useCreateFeeComponentMutation(tenantId);

  if (!open) return null;

  const handleSubmit = async (data: CreateFeeComponentSchema) => {
    try {
      await createMutation.mutateAsync(data);
      onOpenChange(false);
    } catch {
      // toast.error is already handled inside mutation hook
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="w-full max-w-lg rounded-xl bg-white p-6 shadow-xl dark:bg-zinc-900">
        <h2 className="text-lg font-bold text-zinc-900 dark:text-zinc-100">Add Fee Component</h2>
        <p className="mb-4 text-xs text-zinc-500">
          Create a fee master entry that can be attached to school fee structures.
        </p>
        <FeeComponentForm
          tenantId={tenantId}
          onSubmit={handleSubmit}
          onCancel={() => onOpenChange(false)}
          isSubmitting={createMutation.isPending}
        />
      </div>
    </div>
  );
}