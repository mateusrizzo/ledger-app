import type { SpendByCategoryResponse } from '@models/spendByCategory.types';

const MOCK_SPEND_BY_CATEGORY: SpendByCategoryResponse = {
  totalCents: 244000,
  categories: [
    { id: 'housing', label: 'Housing', amountCents: 90000, percentage: 37, colorToken: 'category.housing' },
    { id: 'food-dining', label: 'Food & Dining', amountCents: 68000, percentage: 28, colorToken: 'category.foodDining' },
    { id: 'transport', label: 'Transport', amountCents: 31000, percentage: 13, colorToken: 'category.transport' },
    { id: 'shopping', label: 'Shopping', amountCents: 25000, percentage: 10, colorToken: 'category.shopping' },
    { id: 'entertainment', label: 'Entertainment', amountCents: 18000, percentage: 7, colorToken: 'category.entertainment' },
    { id: 'other', label: 'Other', amountCents: 12000, percentage: 5, colorToken: 'category.other' },
  ],
};

const MOCK_DELAY_MS = 600;

export function getSpendByCategory(): Promise<SpendByCategoryResponse> {
  return new Promise(resolve => {
    setTimeout(() => resolve(MOCK_SPEND_BY_CATEGORY), MOCK_DELAY_MS);
  });
}
