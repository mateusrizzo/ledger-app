import type { Insight } from '@models/spendingInsights.types';
import { getCategoryMeta } from '@utils/getCategoryMeta';
import { useCategories } from './useCategories';
import { useSpendingInsights } from './useSpendingInsights';

export interface InsightWithCategory extends Insight {
  categoryLabel: string | null;
  categoryColorToken: string | null;
}

export type UseInsightsWithCategoriesResult =
  | { isReady: true; data: InsightWithCategory[]; basedOnMonths: number; isError: false }
  | { isReady: false; data: undefined; basedOnMonths: undefined; isError: boolean };

export function useInsightsWithCategories(): UseInsightsWithCategoriesResult {
  const insightsQuery = useSpendingInsights();
  const categoriesQuery = useCategories();

  if (insightsQuery.status !== 'success' || categoriesQuery.status !== 'success') {
    return {
      isReady: false,
      data: undefined,
      basedOnMonths: undefined,
      isError: insightsQuery.status === 'error' || categoriesQuery.status === 'error',
    };
  }

  const data = insightsQuery.data.insights.map(insight => {
    if (insight.categoryId === null) {
      return { ...insight, categoryLabel: null, categoryColorToken: null };
    }

    const meta = getCategoryMeta(insight.categoryId, categoriesQuery.data);
    return { ...insight, categoryLabel: meta.label, categoryColorToken: meta.colorToken };
  });

  return { isReady: true, data, basedOnMonths: insightsQuery.data.basedOnMonths, isError: false };
}
