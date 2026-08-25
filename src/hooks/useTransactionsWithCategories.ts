import type { Category } from '@models/category.types';
import type { Transaction } from '@models/transaction.types';
import { getCategoryMeta } from '@utils/getCategoryMeta';
import { useTransactions } from './useTransactions';

export interface TransactionWithCategory extends Transaction {
  categoryLabel: string;
  categoryColorToken: string;
  categoryInitials: string;
}

export type UseTransactionsWithCategoriesResult =
  | { isReady: true; data: TransactionWithCategory[]; isError: false }
  | { isReady: false; data: undefined; isError: boolean };

export function useTransactionsWithCategories(
  categories: Category[] | undefined,
): UseTransactionsWithCategoriesResult {
  const transactionsQuery = useTransactions();

  if (transactionsQuery.status !== 'success' || categories === undefined) {
    return { isReady: false, data: undefined, isError: transactionsQuery.status === 'error' };
  }

  const data = transactionsQuery.data.transactions.map(transaction => {
    const meta = getCategoryMeta(transaction.categoryId, categories);
    return {
      ...transaction,
      categoryLabel: meta.label,
      categoryColorToken: meta.colorToken,
      categoryInitials: meta.initials,
    };
  });

  return { isReady: true, data, isError: false };
}
