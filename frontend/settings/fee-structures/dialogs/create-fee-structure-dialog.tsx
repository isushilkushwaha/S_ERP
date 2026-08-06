'use client';

import React from 'react';
import { toast } from 'sonner';
import { FeeStructureForm } from '../forms/fee-structure-form';
import { useCreateFeeStructureMutation } from '../api/fee-structure.mutation';
import { CreateFeeStructureSchema } from '@/features/settings/fee-structures/schemas/create-fee-structure.schema';
import { FeeComponentDTO } from '@/features/settings/fee-components/types/fee-component.types';

interface Props {
  tenantId: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  activeComponents: FeeComponentDTO[];
}

export function CreateFeeStructureDialog({
  tenantId,
  open,
  onOpenChange,
  activeComponents,
}: Props) {
  const createMutation = useCreateFeeStructureMutation(tenantId);

  if (!open) return null;

  const handleSubmit = async (data: CreateFeeStructureSchema) => {
    const toastId = toast.loading('Creating Fee Structure...');
    try {
      await createMutation.mutateAsync(data);
      toast.success('Fee Structure created successfully!', { id: toastId });
      onOpenChange(false);
    } catch (error: unknown) {
  const err = error as Error;
  toast.error(err.message || "Failed to create fee structure.");
}
  };

  return (
    <div
      onClick={() => onOpenChange(false)}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 animate-in fade-in-0"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="max-h-[90vh] w-full max-w-xl overflow-y-auto rounded-xl bg-white p-6 shadow-xl dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800"
      >
        <div className="mb-4">
          <h2 className="text-lg font-bold text-zinc-900 dark:text-zinc-100">
            Create Fee Structure
          </h2>
          <p className="text-xs text-zinc-500 dark:text-zinc-400">
            Set up a master fee breakdown in Indian Rupees (₹) for an Academic Year and Class.
          </p>
        </div>

        <FeeStructureForm
          tenantId={tenantId}
          initialData={null}
          activeComponents={activeComponents}
          onSubmit={handleSubmit}
          onCancel={() => onOpenChange(false)}
          isSubmitting={createMutation.isPending}
        />
      </div>
    </div>
  );
}