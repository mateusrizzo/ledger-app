import { useQuery } from '@tanstack/react-query';
import { getBudgets } from '@services/budgets';

export function useBudgets() {
  return useQuery({
    queryKey: ['budgets'],
    queryFn: getBudgets,
  });
}
