import type { Category } from '@models/category.types';
import type { CategorySpend } from '@models/spendByCategory.types';
import { getCategoryMeta } from '@utils/getCategoryMeta';
import { useSpendByCategory } from './useSpendByCategory';

export interface CategorySpendWithCategory extends CategorySpend {
  categoryLabel: string;
  categoryColorToken: string;
}

export interface SpendByCategoryWithCategoriesData {
  totalCents: number;
  categories: CategorySpendWithCategory[];
}

export type UseSpendByCategoryWithCategoriesResult =
  | { isReady: true; data: SpendByCategoryWithCategoriesData; isError: false }
  | { isReady: false; data: undefined; isError: boolean };

export function useSpendByCategoryWithCategories(
  categories: Category[] | undefined,
): UseSpendByCategoryWithCategoriesResult {
  const spendQuery = useSpendByCategory();

  if (spendQuery.status !== 'success' || categories === undefined) {
    return { isReady: false, data: undefined, isError: spendQuery.status === 'error' };
  }

  const spendCategories = spendQuery.data.categories.map(spend => {
    const meta = getCategoryMeta(spend.categoryId, categories);
    return {
      ...spend,
      categoryLabel: meta.label,
      categoryColorToken: meta.colorToken,
    };
  });

  return {
    isReady: true,
    data: { totalCents: spendQuery.data.totalCents, categories: spendCategories },
    isError: false,
  };
}
