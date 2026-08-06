'use client';

import React from 'react';
import { toast } from 'sonner';
import { FeeStructureForm } from '../forms/fee-structure-form';
import { useUpdateFeeStructureMutation } from '../api/fee-structure.mutation';
import { FeeStructureDTO } from '@/features/settings/fee-structures/types/fee-structure.types';
import { CreateFeeStructureSchema } from '@/features/settings/fee-structures/schemas/create-fee-structure.schema';
import { FeeComponentDTO } from '@/features/settings/fee-components/types/fee-component.types';

interface Props {
  tenantId: string;
  structure: FeeStructureDTO | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  activeComponents: FeeComponentDTO[];
}

export function EditFeeStructureDialog({
  tenantId,
  structure,
  open,
  onOpenChange,
  activeComponents,
}: Props) {
  const updateMutation = useUpdateFeeStructureMutation(tenantId);

  if (!open || !structure) return null;

  const handleSubmit = async (data: CreateFeeStructureSchema) => {
    const toastId = toast.loading('Updating Fee Structure...');
    try {
      await updateMutation.mutateAsync({
        id: structure.id,
        data: {
          effectiveFrom: data.effectiveFrom,
          status: data.status,
          notes: data.notes,
          items: data.items,
        },
      });
      toast.success('Fee Structure updated successfully!', { id: toastId });
      onOpenChange(false);
    } catch (error: unknown) {
  const err = error as Error;
  toast.error(err.message || "Failed to update fee structure.");
}
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="max-h-[90vh] w-full max-w-xl overflow-y-auto rounded-xl bg-white p-6 shadow-xl dark:bg-zinc-900">
        <h2 className="text-lg font-bold text-zinc-900 dark:text-zinc-100">Edit Fee Structure</h2>
        <p className="mb-4 text-xs text-zinc-500">Modify fee allocation amounts or status.</p>
        <FeeStructureForm
                  initialData={structure}
                  activeComponents={activeComponents}
                  onSubmit={handleSubmit}
                  onCancel={() => onOpenChange(false)}
                  isSubmitting={updateMutation.isPending} tenantId={''}        />
      </div>
    </div>
  );
}