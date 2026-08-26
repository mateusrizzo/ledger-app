import React from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { renderHook, waitFor } from '@testing-library/react-native';
import { getCategories } from '@services/categories';
import { getSpendingInsights } from '@services/spendingInsights';
import type { Category } from '@models/category.types';
import { useInsightsWithCategories } from './useInsightsWithCategories';

jest.mock('@services/categories');
jest.mock('@services/spendingInsights');

const mockGetCategories = getCategories as jest.MockedFunction<typeof getCategories>;
const mockGetSpendingInsights = getSpendingInsights as jest.MockedFunction<typeof getSpendingInsights>;

const CATEGORIES: Category[] = [
  { id: 'food-dining', label: 'Food & Dining', colorToken: 'category.foodDining', kind: 'expense' },
];

const INSIGHTS_RESPONSE = {
  insights: [
    {
      id: 'insight-food-dining-growth',
      title: 'Food & Dining is your fastest-growing category',
      body: 'You spent more than usual.',
      categoryId: 'food-dining',
      generatedAt: '2026-08-25T09:00:00.000Z',
    },
    {
      id: 'insight-fixed-costs-steady',
      title: 'Fixed costs stay steady',
      body: 'Housing and utilities held steady.',
      categoryId: null,
      generatedAt: '2026-08-25T09:00:00.000Z',
    },
  ],
  basedOnMonths: 6,
};

function renderWithClient<T>(hook: () => T) {
  const queryClient = new QueryClient({
    defaultOptions: { queries: { retry: false, gcTime: 0 } },
  });
  const wrapper = ({ children }: { children: React.ReactNode }) => (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );

  return renderHook(hook, { wrapper });
}

describe('useInsightsWithCategories', () => {
  afterEach(() => {
    jest.resetAllMocks();
  });

  it('is not ready while either query is pending', async () => {
    mockGetSpendingInsights.mockReturnValue(new Promise(() => {}));
    mockGetCategories.mockResolvedValue(CATEGORIES);

    const { result } = await renderWithClient(() => useInsightsWithCategories());

    expect(result.current.isReady).toBe(false);
    expect(result.current.data).toBeUndefined();
  });

  it('joins each insight with its category label and color once both resolve', async () => {
    mockGetSpendingInsights.mockResolvedValue(INSIGHTS_RESPONSE);
    mockGetCategories.mockResolvedValue(CATEGORIES);

    const { result } = await renderWithClient(() => useInsightsWithCategories());

    await waitFor(() => expect(result.current.isReady).toBe(true));
    expect(result.current.data?.[0]).toEqual({
      ...INSIGHTS_RESPONSE.insights[0],
      categoryLabel: 'Food & Dining',
      categoryColorToken: 'category.foodDining',
    });
    expect(result.current.basedOnMonths).toBe(6);
  });

  it('leaves category label and color as null for an insight not tied to one category', async () => {
    mockGetSpendingInsights.mockResolvedValue(INSIGHTS_RESPONSE);
    mockGetCategories.mockResolvedValue(CATEGORIES);

    const { result } = await renderWithClient(() => useInsightsWithCategories());

    await waitFor(() => expect(result.current.isReady).toBe(true));
    expect(result.current.data?.[1]).toEqual({
      ...INSIGHTS_RESPONSE.insights[1],
      categoryLabel: null,
      categoryColorToken: null,
    });
  });
});
