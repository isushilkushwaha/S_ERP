import { useMutation, useQueryClient } from '@tanstack/react-query';
import { feeStructureApi } from './fee-structure.api';
import { FEE_STRUCTURES_KEY } from './fee-structure.query';
import { CreateFeeStructureDTO, UpdateFeeStructureDTO } from '@/features/settings/fee-structures/types/fee-structure.types';

export function useCreateFeeStructureMutation(tenantId: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: Omit<CreateFeeStructureDTO, 'tenantId'>) => feeStructureApi.create(tenantId, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [FEE_STRUCTURES_KEY] });
    },
  });
}

export function useUpdateFeeStructureMutation(tenantId: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateFeeStructureDTO }) =>
      feeStructureApi.update(tenantId, id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [FEE_STRUCTURES_KEY] });
    },
  });
}

export function useDeleteFeeStructureMutation(tenantId: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => feeStructureApi.delete(tenantId, id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [FEE_STRUCTURES_KEY] });
    },
  });
}