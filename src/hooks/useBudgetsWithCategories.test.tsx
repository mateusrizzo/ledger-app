import React from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { renderHook, waitFor } from '@testing-library/react-native';
import { getBudgets } from '@services/budgets';
import type { Category } from '@models/category.types';
import { useBudgetsWithCategories } from './useBudgetsWithCategories';

jest.mock('@services/budgets');

const mockGetBudgets = getBudgets as jest.MockedFunction<typeof getBudgets>;

const CATEGORIES: Category[] = [
  { id: 'food-dining', label: 'Food & Dining', colorToken: 'category.foodDining' },
];

const BUDGETS = [
  {
    id: 'budget-food-dining',
    categoryId: 'food-dining',
    spentCents: 68000,
    limitCents: 70000,
    status: 'warning' as const,
  },
];

function renderWithClient<T>(hook: () => T) {
  const queryClient = new QueryClient({
    defaultOptions: { queries: { retry: false, gcTime: 0 } },
  });
  const wrapper = ({ children }: { children: React.ReactNode }) => (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );

  return renderHook(hook, { wrapper });
}

describe('useBudgetsWithCategories', () => {
  afterEach(() => {
    jest.resetAllMocks();
  });

  it('is not ready while the budgets query is pending', async () => {
    mockGetBudgets.mockReturnValue(new Promise(() => {}));

    const { result } = await renderWithClient(() => useBudgetsWithCategories(CATEGORIES));

    expect(result.current.isReady).toBe(false);
    expect(result.current.data).toBeUndefined();
  });

  it('is not ready while categories are still undefined, even if budgets resolved', async () => {
    let budgetsResolved = false;
    mockGetBudgets.mockImplementation(() =>
      Promise.resolve(BUDGETS).then(value => {
        budgetsResolved = true;
        return value;
      }),
    );

    const { result } = await renderWithClient(() => useBudgetsWithCategories(undefined));

    await waitFor(() => expect(budgetsResolved).toBe(true));
    expect(result.current.isReady).toBe(false);
    expect(result.current.data).toBeUndefined();
  });

  it('joins each budget with its category label and color once both resolve', async () => {
    mockGetBudgets.mockResolvedValue(BUDGETS);

    const { result } = await renderWithClient(() => useBudgetsWithCategories(CATEGORIES));

    await waitFor(() => expect(result.current.isReady).toBe(true));
    expect(result.current.data).toEqual([
      {
        ...BUDGETS[0],
        categoryLabel: 'Food & Dining',
        categoryColorToken: 'category.foodDining',
      },
    ]);
  });

  it('falls back to Other for a budget whose category is missing from the reference list', async () => {
    mockGetBudgets.mockResolvedValue(BUDGETS);

    const { result } = await renderWithClient(() => useBudgetsWithCategories([]));

    await waitFor(() => expect(result.current.isReady).toBe(true));
    expect(result.current.data?.[0].categoryLabel).toBe('Other');
  });
});
