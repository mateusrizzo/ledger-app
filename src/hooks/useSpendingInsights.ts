import { useQuery } from '@tanstack/react-query';
import { getSpendingInsights } from '@services/spendingInsights';

export function useSpendingInsights() {
  return useQuery({
    queryKey: ['spendingInsights'],
    queryFn: getSpendingInsights,
  });
}
