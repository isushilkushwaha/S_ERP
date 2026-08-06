import { useQuery } from '@tanstack/react-query';
import { feeStructureApi } from './fee-structure.api';
import { FeeStructureQueryParams } from '@/features/settings/fee-structures/types/fee-structure.types';

export const FEE_STRUCTURES_KEY = 'fee-structures';

export function useFeeStructuresQuery(params: FeeStructureQueryParams) {
  return useQuery({
    queryKey: [FEE_STRUCTURES_KEY, params],
    queryFn: () => feeStructureApi.fetchList(params),
    enabled: Boolean(params.tenantId),
  });
}