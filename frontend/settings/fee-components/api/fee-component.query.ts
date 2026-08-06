import { useQuery } from '@tanstack/react-query';
import { feeComponentApi } from './fee-component.api';
import { FeeComponentQueryParams } from '@/features/settings/fee-components/types/fee-component.types';

export const FEE_COMPONENTS_KEY = 'fee-components';

export function useFeeComponentsQuery(params: FeeComponentQueryParams) {
  return useQuery({
    queryKey: [FEE_COMPONENTS_KEY, params],
    queryFn: () => feeComponentApi.fetchList(params),
    enabled: Boolean(params.tenantId),
  });
}