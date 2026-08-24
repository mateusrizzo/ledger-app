import { useQuery } from '@tanstack/react-query';
import { getBalance } from '@services/balance';

export function useBalance() {
  return useQuery({
    queryKey: ['balance'],
    queryFn: getBalance,
  });
}
