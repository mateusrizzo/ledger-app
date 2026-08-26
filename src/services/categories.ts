import type { Category } from '@models/category.types';

const MOCK_CATEGORIES: Category[] = [
  { id: 'food-dining', label: 'Food & Dining', colorToken: 'category.foodDining', kind: 'expense' },
  { id: 'transport', label: 'Transport', colorToken: 'category.transport', kind: 'expense' },
  { id: 'housing', label: 'Housing', colorToken: 'category.housing', kind: 'expense' },
  { id: 'shopping', label: 'Shopping', colorToken: 'category.shopping', kind: 'expense' },
  { id: 'entertainment', label: 'Entertainment', colorToken: 'category.entertainment', kind: 'expense' },
  { id: 'health', label: 'Health', colorToken: 'category.health', kind: 'expense' },
  { id: 'utilities', label: 'Utilities', colorToken: 'category.utilities', kind: 'expense' },
  { id: 'subscriptions', label: 'Subscriptions', colorToken: 'category.subscriptions', kind: 'expense' },
  { id: 'other', label: 'Other', colorToken: 'category.other', kind: 'expense' },
  { id: 'salary', label: 'Salary', colorToken: 'category.salary', kind: 'income' },
];

const MOCK_DELAY_MS = 400;

export function getCategories(): Promise<Category[]> {
  return new Promise(resolve => {
    setTimeout(() => resolve(MOCK_CATEGORIES), MOCK_DELAY_MS);
  });
}
