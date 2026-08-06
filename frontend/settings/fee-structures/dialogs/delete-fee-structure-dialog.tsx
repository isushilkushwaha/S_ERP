'use client';

import React from 'react';
import { toast } from 'sonner';
import { useDeleteFeeStructureMutation } from '../api/fee-structure.mutation';
import { FeeStructureDTO } from '@/features/settings/fee-structures/types/fee-structure.types';

interface Props {
  tenantId: string;
  structure: FeeStructureDTO | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function DeleteFeeStructureDialog({ tenantId, structure, open, onOpenChange }: Props) {
  const deleteMutation = useDeleteFeeStructureMutation(tenantId);

  if (!open || !structure) return null;

  const handleDelete = async () => {
    const toastId = toast.loading('Archiving Fee Structure...');
    try {
      await deleteMutation.mutateAsync(structure.id);
      toast.success('Fee Structure archived successfully!', { id: toastId });
      onOpenChange(false);
    } catch (error: unknown) {
  const err = error as Error;
  toast.error(err.message || "Failed to delete fee structure.");
}

  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="w-full max-w-md rounded-xl bg-white p-6 shadow-xl dark:bg-zinc-900">
        <h2 className="text-lg font-bold text-red-600 dark:text-red-400">Archive Fee Structure</h2>
        <p className="mt-2 text-sm text-zinc-600 dark:text-zinc-400">
          Are you sure you want to archive the structure for{' '}
          <strong className="text-zinc-900 dark:text-zinc-100">
            {structure.academicYear?.name} - {structure.class?.name}
          </strong>?
        </p>
        <div className="mt-6 flex justify-end space-x-3">
          <button
            type="button"
            onClick={() => onOpenChange(false)}
            className="rounded-md border border-zinc-300 px-4 py-2 text-sm font-medium text-zinc-700 hover:bg-zinc-50 dark:border-zinc-700 dark:text-zinc-300 dark:hover:bg-zinc-800"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleDelete}
            disabled={deleteMutation.isPending}
            className="rounded-md bg-red-600 px-4 py-2 text-sm font-medium text-white hover:bg-red-700 disabled:opacity-50"
          >
            {deleteMutation.isPending ? 'Archiving...' : 'Confirm Archive'}
          </button>
        </div>
      </div>
    </div>
  );
}