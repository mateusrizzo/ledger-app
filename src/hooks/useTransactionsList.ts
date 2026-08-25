import { useInfiniteQuery } from '@tanstack/react-query';
import { getTransactionsList } from '@services/transactions';

export interface TransactionsListFilters {
  accountId?: string;
  categoryId?: string;
  month?: string;
}

const PAGE_SIZE = 6;

export function useTransactionsList(filters: TransactionsListFilters) {
  return useInfiniteQuery({
    queryKey: ['transactions', 'list', filters],
    queryFn: ({ pageParam }) =>
      getTransactionsList({ page: pageParam, pageSize: PAGE_SIZE, ...filters }),
    initialPageParam: 0,
    getNextPageParam: lastPage => (lastPage.hasMore ? lastPage.page + 1 : undefined),
  });
}
