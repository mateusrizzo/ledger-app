import { useQuery } from '@tanstack/react-query';
import { getSpendingTrends } from '@services/spendingTrends';

export function useSpendingTrends() {
  return useQuery({
    queryKey: ['spendingTrends'],
    queryFn: getSpendingTrends,
  });
}
