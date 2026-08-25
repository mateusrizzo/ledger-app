import React from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { renderHook, waitFor } from '@testing-library/react-native';
import { getSpendByCategory } from '@services/spendByCategory';
import type { Category } from '@models/category.types';
import { useSpendByCategoryWithCategories } from './useSpendByCategoryWithCategories';

jest.mock('@services/spendByCategory');

const mockGetSpendByCategory = getSpendByCategory as jest.MockedFunction<
  typeof getSpendByCategory
>;

const CATEGORIES: Category[] = [
  { id: 'housing', label: 'Housing', colorToken: 'category.housing' },
];

const SPEND_RESPONSE = {
  totalCents: 90000,
  categories: [{ id: 'spend-housing', categoryId: 'housing', amountCents: 90000, percentage: 100 }],
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

describe('useSpendByCategoryWithCategories', () => {
  afterEach(() => {
    jest.resetAllMocks();
  });

  it('is not ready while the spend query is pending', async () => {
    mockGetSpendByCategory.mockReturnValue(new Promise(() => {}));

    const { result } = await renderWithClient(() => useSpendByCategoryWithCategories(CATEGORIES));

    expect(result.current.isReady).toBe(false);
    expect(result.current.data).toBeUndefined();
  });

  it('is not ready while categories are still undefined, even if spend resolved', async () => {
    let spendResolved = false;
    mockGetSpendByCategory.mockImplementation(() =>
      Promise.resolve(SPEND_RESPONSE).then(value => {
        spendResolved = true;
        return value;
      }),
    );

    const { result } = await renderWithClient(() => useSpendByCategoryWithCategories(undefined));

    await waitFor(() => expect(spendResolved).toBe(true));
    expect(result.current.isReady).toBe(false);
    expect(result.current.data).toBeUndefined();
  });

  it('joins each spend entry with its category label and color once both resolve', async () => {
    mockGetSpendByCategory.mockResolvedValue(SPEND_RESPONSE);

    const { result } = await renderWithClient(() => useSpendByCategoryWithCategories(CATEGORIES));

    await waitFor(() => expect(result.current.isReady).toBe(true));
    expect(result.current.data).toEqual({
      totalCents: 90000,
      categories: [
        {
          ...SPEND_RESPONSE.categories[0],
          categoryLabel: 'Housing',
          categoryColorToken: 'category.housing',
        },
      ],
    });
  });

  it('falls back to Other for a spend entry whose category is missing from the reference list', async () => {
    mockGetSpendByCategory.mockResolvedValue(SPEND_RESPONSE);

    const { result } = await renderWithClient(() => useSpendByCategoryWithCategories([]));

    await waitFor(() => expect(result.current.isReady).toBe(true));
    expect(result.current.data?.categories[0].categoryLabel).toBe('Other');
  });
});
