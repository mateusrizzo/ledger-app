import { useQuery } from '@tanstack/react-query';
import { getTransactions } from '@services/transactions';

export function useTransactions() {
  return useQuery({
    queryKey: ['transactions'],
    queryFn: getTransactions,
  });
}
