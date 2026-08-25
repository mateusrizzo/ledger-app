import type { BudgetProgress } from '@models/budget.types';
import type { Category } from '@models/category.types';
import { getCategoryMeta } from '@utils/getCategoryMeta';
import { useBudgets } from './useBudgets';

export interface BudgetProgressWithCategory extends BudgetProgress {
  categoryLabel: string;
  categoryColorToken: string;
}

export type UseBudgetsWithCategoriesResult =
  | { isReady: true; data: BudgetProgressWithCategory[]; isError: false }
  | { isReady: false; data: undefined; isError: boolean };

export function useBudgetsWithCategories(
  categories: Category[] | undefined,
): UseBudgetsWithCategoriesResult {
  const budgetsQuery = useBudgets();

  if (budgetsQuery.status !== 'success' || categories === undefined) {
    return { isReady: false, data: undefined, isError: budgetsQuery.status === 'error' };
  }

  const data = budgetsQuery.data.map(budget => {
    const meta = getCategoryMeta(budget.categoryId, categories);
    return {
      ...budget,
      categoryLabel: meta.label,
      categoryColorToken: meta.colorToken,
    };
  });

  return { isReady: true, data, isError: false };
}
