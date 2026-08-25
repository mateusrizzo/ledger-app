import type { SpendByCategoryResponse } from '@models/spendByCategory.types';

const MOCK_SPEND_BY_CATEGORY: SpendByCategoryResponse = {
  totalCents: 244000,
  categories: [
    { id: 'spend-housing', categoryId: 'housing', amountCents: 90000, percentage: 37 },
    { id: 'spend-food-dining', categoryId: 'food-dining', amountCents: 68000, percentage: 28 },
    { id: 'spend-transport', categoryId: 'transport', amountCents: 31000, percentage: 13 },
    { id: 'spend-shopping', categoryId: 'shopping', amountCents: 25000, percentage: 10 },
    { id: 'spend-entertainment', categoryId: 'entertainment', amountCents: 18000, percentage: 7 },
    { id: 'spend-other', categoryId: 'other', amountCents: 12000, percentage: 5 },
  ],
};

const MOCK_DELAY_MS = 600;

export function getSpendByCategory(): Promise<SpendByCategoryResponse> {
  return new Promise(resolve => {
    setTimeout(() => resolve(MOCK_SPEND_BY_CATEGORY), MOCK_DELAY_MS);
  });
}
