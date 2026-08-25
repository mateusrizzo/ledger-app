import type { Category } from '@models/category.types';

const MOCK_CATEGORIES: Category[] = [
  { id: 'housing', label: 'Housing', colorToken: 'category.housing' },
  { id: 'food-dining', label: 'Food & Dining', colorToken: 'category.foodDining' },
  { id: 'transport', label: 'Transport', colorToken: 'category.transport' },
  { id: 'shopping', label: 'Shopping', colorToken: 'category.shopping' },
  { id: 'entertainment', label: 'Entertainment', colorToken: 'category.entertainment' },
  { id: 'other', label: 'Other', colorToken: 'category.other' },
];

const MOCK_DELAY_MS = 400;

export function getCategories(): Promise<Category[]> {
  return new Promise(resolve => {
    setTimeout(() => resolve(MOCK_CATEGORIES), MOCK_DELAY_MS);
  });
}
