import type { BudgetProgress } from '@models/budget.types';

const MOCK_BUDGETS: BudgetProgress[] = [
  { id: 'budget-food-dining', categoryId: 'food-dining', spentCents: 68000, limitCents: 70000, status: 'warning' },
  { id: 'budget-transport', categoryId: 'transport', spentCents: 31000, limitCents: 45000, status: 'under' },
  { id: 'budget-shopping', categoryId: 'shopping', spentCents: 25000, limitCents: 20000, status: 'over' },
];

const MOCK_DELAY_MS = 600;

export function getBudgets(): Promise<BudgetProgress[]> {
  return new Promise(resolve => {
    setTimeout(() => resolve(MOCK_BUDGETS), MOCK_DELAY_MS);
  });
}
