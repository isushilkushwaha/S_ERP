// frontend/settings/fee-components/dialogs/edit-fee-component-dialog.tsx

'use client';

import React from 'react';
import { toast } from 'sonner';
import { FeeComponentForm } from '../forms/fee-component-form';
import { useUpdateFeeComponentMutation } from '../api/fee-component.mutation';
import { FeeComponentDTO } from '@/features/settings/fee-components/types/fee-component.types';
import { CreateFeeComponentSchema } from '@/features/settings/fee-components/schemas/create-fee-component.schema';

interface Props {
  tenantId: string;
  component: FeeComponentDTO | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function EditFeeComponentDialog({ tenantId, component, open, onOpenChange }: Props) {
  const updateMutation = useUpdateFeeComponentMutation(tenantId);

  if (!open || !component) return null;

  const handleSubmit = async (data: CreateFeeComponentSchema) => {
    const toastId = toast.loading('Updating fee component...');

    try {
      await updateMutation.mutateAsync({ id: component.id, data });
      toast.success(`Fee Component "${data.name}" updated successfully!`, { id: toastId });
      onOpenChange(false);
    } catch (err: unknown) {
      const errObj = err as Error;
      toast.error(errObj?.message || 'Failed to update fee component.', { id: toastId });
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="w-full max-w-lg rounded-xl bg-white p-6 shadow-xl dark:bg-zinc-900">
        <h2 className="text-lg font-bold text-zinc-900 dark:text-zinc-100">Edit Fee Component</h2>
        <p className="mb-4 text-xs text-zinc-500">Update configuration parameters for this component.</p>
        <FeeComponentForm
          initialData={component}
          onSubmit={handleSubmit}
          onCancel={() => onOpenChange(false)}
          isSubmitting={updateMutation.isPending}
          tenantId={tenantId}
        />
      </div>
    </div>
  );
}