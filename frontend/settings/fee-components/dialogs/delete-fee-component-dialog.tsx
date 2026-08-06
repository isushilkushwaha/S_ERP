// frontend/settings/fee-components/dialogs/delete-fee-component-dialog.tsx

'use client';

import React from 'react';
import { toast } from 'sonner';
import { useDeleteFeeComponentMutation } from '../api/fee-component.mutation';
import { FeeComponentDTO } from '@/features/settings/fee-components/types/fee-component.types';

interface Props {
  tenantId: string;
  component: FeeComponentDTO | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function DeleteFeeComponentDialog({ tenantId, component, open, onOpenChange }: Props) {
  const deleteMutation = useDeleteFeeComponentMutation(tenantId);

  if (!open || !component) return null;

  const handleDelete = async () => {
    const toastId = toast.loading('Deleting fee component...');

    try {
      await deleteMutation.mutateAsync(component.id);
      toast.success(`Fee Component "${component.name}" deleted successfully!`, { id: toastId });
      onOpenChange(false);
    } catch (err: unknown) {
      const errObj = err as Error;
      toast.error(errObj?.message || 'Failed to delete fee component. It might be attached to an existing fee structure.', { id: toastId });
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="w-full max-w-md rounded-xl bg-white p-6 shadow-xl dark:bg-zinc-900">
        <h2 className="text-lg font-bold text-red-600 dark:text-red-400">
          Delete Fee Component
        </h2>
        <p className="mt-2 text-sm text-zinc-600 dark:text-zinc-400">
          Are you sure you want to delete <strong className="text-zinc-900 dark:text-zinc-100">{component.name}</strong> (<code className="text-xs">{component.code}</code>)?
        </p>
        <p className="mt-1 text-xs text-zinc-500">
          This action will soft-delete the component. If this component is currently assigned to an active Fee Structure, deletion will be blocked.
        </p>

        <div className="mt-6 flex justify-end space-x-3">
          <button
            type="button"
            onClick={() => onOpenChange(false)}
            disabled={deleteMutation.isPending}
            className="rounded-md border border-zinc-300 px-4 py-2 text-sm font-medium text-zinc-700 hover:bg-zinc-50 dark:border-zinc-700 dark:text-zinc-300 dark:hover:bg-zinc-800 disabled:opacity-50"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleDelete}
            disabled={deleteMutation.isPending}
            className="rounded-md bg-red-600 px-4 py-2 text-sm font-medium text-white hover:bg-red-700 disabled:opacity-50"
          >
            {deleteMutation.isPending ? 'Deleting...' : 'Delete Component'}
          </button>
        </div>
      </div>
    </div>
  );
}