import { useQuery } from '@tanstack/react-query';
import { getSpendByCategory } from '@services/spendByCategory';

export function useSpendByCategory() {
  return useQuery({
    queryKey: ['spendByCategory'],
    queryFn: getSpendByCategory,
  });
}
