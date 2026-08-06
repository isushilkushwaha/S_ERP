import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { feeComponentApi } from './fee-component.api';
import { FEE_COMPONENTS_KEY } from './fee-component.query';
import { CreateFeeComponentDTO, UpdateFeeComponentDTO } from '@/features/settings/fee-components/types/fee-component.types';

export function useCreateFeeComponentMutation(tenantId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: Omit<CreateFeeComponentDTO, 'tenantId'>) =>
      feeComponentApi.create(tenantId, data),
    onSuccess: (data) => {
      toast.success(`Fee Component "${data.name}" created successfully!`);
      queryClient.invalidateQueries({ queryKey: [FEE_COMPONENTS_KEY] });
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Failed to create Fee Component');
    },
  });
}

export function useUpdateFeeComponentMutation(tenantId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateFeeComponentDTO }) =>
      feeComponentApi.update(tenantId, id, data),
    onSuccess: (data) => {
      toast.success(`Fee Component "${data.name}" updated successfully!`);
      queryClient.invalidateQueries({ queryKey: [FEE_COMPONENTS_KEY] });
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Failed to update Fee Component');
    },
  });
}

export function useDeleteFeeComponentMutation(tenantId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => feeComponentApi.delete(tenantId, id),
    onSuccess: () => {
      toast.success('Fee Component deleted successfully');
      queryClient.invalidateQueries({ queryKey: [FEE_COMPONENTS_KEY] });
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Failed to delete Fee Component');
    },
  });
}